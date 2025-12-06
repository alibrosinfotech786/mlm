<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Mail\WelcomeEmail;
use App\Mail\WelcomeLetterEmail;
use App\Mail\IdCardEmail;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Check if this is the first user (root of MLM tree)
            $isFirstUser = User::count() === 0;
            
            $validationRules = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'required|string|max:15|unique:users',
                'state_id' => 'required|integer',
                'district_id' => 'required|integer',
                'password' => 'required|string|min:8|confirmed',
                'sponsor_id' => 'nullable|exists:users,user_id',
                'sponsor_name' => 'nullable|string|max:255',
                'position' => 'nullable|in:left,right',
            ];
            
            $request->validate($validationRules);

            // Get state and district codes for user_id generation
            $state = \App\Models\State::find($request->state_id);
            $district = \App\Models\District::find($request->district_id);
            
            $userData = [
                'user_id' => \App\Models\User::generateUserId($state->code, $district->code),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => '',
                'state_id' => $request->state_id,
                'district_id' => $request->district_id,
                'nominee' => '',
                'password' => Hash::make($request->password),
                'role' => 'User',
            ];
            
            // Add sponsor details if provided
            if ($request->sponsor_id) {
                $userData['sponsor_id'] = $request->sponsor_id;
                $userData['sponsor_name'] = $request->sponsor_name;
            }
            
            // Auto-place in binary tree
            $placement = null;
            if ($request->sponsor_id) {
                // Case-insensitive lookup for sponsor
                $sponsor = User::whereRaw('LOWER(user_id) = ?', [strtolower($request->sponsor_id)])->first();
                if ($sponsor) {
                    // With position specified: place within sponsor's subtree on that side (BFS)
                    if ($request->position) {
                        $placement = $this->findPositionUnderSponsor($sponsor, $request->position);
                    } else {
                        // No position specified: prefer left, then right directly under sponsor; if both filled, BFS within sponsor subtree
                        $placement = $this->findFirstAvailableUnderSponsor($sponsor);
                    }
                }
            }
            
            // Fall back to global placement if sponsor placement not resolved
            if (!$placement) {
                if ($request->position) {
                    $placement = $this->findPositionOnSide($request->position);
                } else {
                    $placement = $this->findNextAvailablePosition();
                }
            }
            
            if ($placement && isset($placement['root_id'])) {
                $userData['root_id'] = $placement['root_id'];
                $userData['position'] = $placement['position'];
            }

            $user = User::create($userData);
            
            $token = $user->createToken('auth_token')->plainTextToken;

            // Send welcome email
            try {
                Mail::to($user->email)->send(new WelcomeEmail($user));
            } catch (Exception $mailException) {
                // Log email error but don't fail registration
                \Log::error('Welcome email failed to send: ' . $mailException->getMessage());
            }

            return response()->json([
                'success' => true,
                'user' => $user->fresh(),
                'token' => $token,
                'token_type' => 'Bearer',
                'placement_info' => $placement
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'REGISTRATION_ERROR',
                'message' => 'User registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
    private function findNextAvailablePosition()
    {
        // Find the root user (first user with null root_id)
        $rootUser = User::whereNull('root_id')->first();
        
        if (!$rootUser) {
            // If no root user exists, this will be the root
            return ['root_id' => null, 'position' => null];
        }
        
        // Use breadth-first search to find first available position
        $queue = [$rootUser];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            
            // Check left position first
            if (!$current->leftChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'left'
                ];
            }
            
            // Check right position
            if (!$current->rightChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'right'
                ];
            }
            
            // Both positions filled, add children to queue
            $queue[] = $current->leftChild;
            $queue[] = $current->rightChild;
        }
        
        // Fallback - should not reach here
        return ['root_id' => null, 'position' => null];
    }
    
    private function findPositionOnSide($side)
    {
        // Find the root user
        $rootUser = User::whereNull('root_id')->first();
        
        if (!$rootUser) {
            return ['root_id' => null, 'position' => null];
        }
        
        // Check if root has available position on requested side
        if ($side === 'left' && !$rootUser->leftChild) {
            return [
                'root_id' => $rootUser->user_id,
                'position' => 'left'
            ];
        }
        
        if ($side === 'right' && !$rootUser->rightChild) {
            return [
                'root_id' => $rootUser->user_id,
                'position' => 'right'
            ];
        }
        
        // Root's requested side is filled, start BFS from the root's child on that side
        // This ensures we only search within the correct subtree
        $startNode = $side === 'left' ? $rootUser->leftChild : $rootUser->rightChild;
        
        if (!$startNode) {
            // This shouldn't happen, but handle edge case
            return null;
        }
        
        // Use breadth-first search to find first available position within the specified subtree
        // STRICT POSITION PLACEMENT: Only check the requested side, never fallback to other side
        $queue = [$startNode];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            
            // Strictly check only the requested side position
            if ($side === 'left') {
                // Only check left position - never check right
                if (!$current->leftChild) {
                    return [
                        'root_id' => $current->user_id,
                        'position' => 'left'
                    ];
                }
                // Left is filled, continue BFS deeper - only follow left children
                if ($current->leftChild) {
                    $queue[] = $current->leftChild;
                }
            } else {
                // Only check right position - never check left
                if (!$current->rightChild) {
                    return [
                        'root_id' => $current->user_id,
                        'position' => 'right'
                    ];
                }
                // Right is filled, continue BFS deeper - only follow right children
                if ($current->rightChild) {
                    $queue[] = $current->rightChild;
                }
            }
        }
        
        // No position available on requested side - subtree is completely filled
        // Find deepest node to create a new level
        return $this->findDeepestNodeInSubtree($startNode, $side);
    }

    /**
     * Find the deepest node in a subtree to create a new level.
     * STRICT POSITION PLACEMENT: Only traverses nodes on the requested side.
     * Follows the path of the requested side to the deepest node and returns it.
     * For left side: only follows left children, returns left position
     * For right side: only follows right children, returns right position
     */
    private function findDeepestNodeInSubtree(User $rootNode, string $side)
    {
        // Follow the path on the requested side to find the deepest node
        $current = $rootNode;
        $deepestNode = $rootNode;
        
        // Keep going deeper following only the requested side path
        // Since BFS found no available position, all nodes on this path have children
        // We'll find the deepest node and add a new child to it
        while ($current) {
            $deepestNode = $current;
            
            // Only follow children on the requested side
            if ($side === 'left') {
                $current = $current->leftChild;
            } else {
                $current = $current->rightChild;
            }
        }
        
        // Return the deepest node with the requested position
        // This will create a new level in the tree
        return [
            'root_id' => $deepestNode->user_id,
            'position' => $side
        ];
    }

    /**
     * Find position within a specific sponsor's subtree on the requested side.
     * - If the sponsor's immediate requested side is empty, use it.
     * - Otherwise, BFS within that side's subtree (left or right) and return the first available spot,
     *   prioritizing the requested side first at each node.
     */
    private function findPositionUnderSponsor(User $sponsor, string $side)
    {
        // Immediate child check
        if ($side === 'left' && !$sponsor->leftChild) {
            return [
                'root_id' => $sponsor->user_id,
                'position' => 'left'
            ];
        }
        if ($side === 'right' && !$sponsor->rightChild) {
            return [
                'root_id' => $sponsor->user_id,
                'position' => 'right'
            ];
        }
        
        // Start BFS from the child on the requested side
        $startNode = $side === 'left' ? $sponsor->leftChild : $sponsor->rightChild;
        if (!$startNode) {
            return null;
        }
        
        $queue = [$startNode];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            
            // STRICT POSITION PLACEMENT: Only check the requested side, never fallback to other side
            if ($side === 'left') {
                // Only check left position - never check right
                if (!$current->leftChild) {
                    return [
                        'root_id' => $current->user_id,
                        'position' => 'left'
                    ];
                }
                // Left is filled, continue BFS deeper - only follow left children
                if ($current->leftChild) {
                    $queue[] = $current->leftChild;
                }
            } else { // right subtree
                // Only check right position - never check left
                if (!$current->rightChild) {
                    return [
                        'root_id' => $current->user_id,
                        'position' => 'right'
                    ];
                }
                // Right is filled, continue BFS deeper - only follow right children
                if ($current->rightChild) {
                    $queue[] = $current->rightChild;
                }
            }
        }
        
        // No position available - subtree is completely filled
        // Find deepest node to create a new level
        return $this->findDeepestNodeInSubtree($startNode, $side);
    }
    
    /**
     * Find first available position under a sponsor with no side preference.
     * Prefer immediate left, then immediate right; otherwise BFS within sponsor subtree (both sides).
     */
    private function findFirstAvailableUnderSponsor(User $sponsor)
    {
        if (!$sponsor->leftChild) {
            return [
                'root_id' => $sponsor->user_id,
                'position' => 'left'
            ];
        }
        
        if (!$sponsor->rightChild) {
            return [
                'root_id' => $sponsor->user_id,
                'position' => 'right'
            ];
        }
        
        $queue = [$sponsor->leftChild, $sponsor->rightChild];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            
            if (!$current->leftChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'left'
                ];
            }
            if (!$current->rightChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'right'
                ];
            }
            
            if ($current->leftChild) {
                $queue[] = $current->leftChild;
            }
            if ($current->rightChild) {
                $queue[] = $current->rightChild;
            }
        }
        
        return null;
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|string',
                'password' => 'required',
            ]);

            $user = User::where('user_id', $request->user_id)->first();
            
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'AUTHENTICATION_ERROR',
                    'message' => 'Invalid credentials provided'
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            
            $role = Role::where('name', $user->role)->first();
            $permissions = $role ? $role->permissions : [];

            return response()->json([
                'success' => true,
                'user' => $user,
                'permissions' => $permissions,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'LOGIN_ERROR',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'LOGOUT_ERROR',
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'user' => $request->user()
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USER_FETCH_ERROR',
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function setTransactionPassword(Request $request)
    {
        try {
            $user = $request->user();
            
            // If user already has transaction password, require current password
            if ($user->transaction_password) {
                $request->validate([
                    'current_transaction_password' => 'required|string',
                    'transaction_password' => 'required|string|min:4',
                ]);
                
                if (!Hash::check($request->current_transaction_password, $user->transaction_password)) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'INVALID_CURRENT_PASSWORD',
                        'message' => 'Current transaction password is incorrect'
                    ], 422);
                }
            } else {
                // First time setup - only require new password
                $request->validate([
                    'transaction_password' => 'required|string|min:4',
                ]);
            }
            
            $user->update([
                'transaction_password' => Hash::make($request->transaction_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction password set successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRANSACTION_PASSWORD_ERROR',
                'message' => 'Failed to set transaction password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendWelcomeLetter(Request $request)
    {
        try {
            $user = $request->user();

            // Use remote URLs for images - DomPDF can load them with isRemoteEnabled = true
            $backgroundImagePath = 'https://trust.alibrosinfotech.com/_next/static/media/welcomeletter.4e713bec.jpg';
            $logoPath = 'https://trust.alibrosinfotech.com/images/logo.png';

            // Generate PDF using PdfService
            $pdfService = new PdfService();
            $pdfData = $pdfService->generateFromView('emails.welcome-letter', [
                'user' => $user,
                'backgroundImagePath' => $backgroundImagePath,
                'logoPath' => $logoPath
            ], [
                'isRemoteEnabled' => true,
                'paper' => 'A4',
                'orientation' => 'portrait'
            ]);

            // Send welcome letter email with PDF attachment
            Mail::to($user->email)->send(new WelcomeLetterEmail($user, $pdfData));

            return response()->json([
                'success' => true,
                'message' => 'Welcome letter sent successfully to ' . $user->email
            ]);
        } catch (Exception $e) {
            \Log::error('sendWelcomeLetter error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'error_type' => 'EMAIL_SEND_ERROR',
                'message' => 'Failed to send welcome letter email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendIdCard(Request $request)
    {
        try {
            $user = $request->user();

            // Convert profile picture to base64 if it exists
            $profilePictureBase64 = null;
            if ($user->profile_picture) {
                $profilePath = public_path($user->profile_picture);
                if (file_exists($profilePath)) {
                    $imageData = file_get_contents($profilePath);
                    $imageInfo = getimagesize($profilePath);
                    $mimeType = $imageInfo['mime'] ?? 'image/jpeg';
                    $profilePictureBase64 = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
                }
            }

            // Generate PDF using PdfService
            $pdfService = new PdfService();
            $pdfData = $pdfService->generateFromView('emails.id-card-attachment', [
                'user' => $user,
                'profilePictureBase64' => $profilePictureBase64
            ], [
                'isRemoteEnabled' => true,
                'paper' => 'A4',
                'orientation' => 'portrait'
            ]);

            Mail::to($user->email)->send(new IdCardEmail($user, $pdfData));

            return response()->json([
                'success' => true,
                'message' => 'ID Card sent successfully to ' . $user->email,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ID_CARD_EMAIL_ERROR',
                'message' => 'Failed to send ID Card email',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}