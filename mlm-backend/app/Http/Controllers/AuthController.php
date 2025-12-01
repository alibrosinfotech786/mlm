<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Mail\WelcomeEmail;
use App\Mail\WelcomeLetterEmail;
use App\Mail\IdCardEmail;
use Dompdf\Dompdf;
use Dompdf\Options;
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
                'phone' => 'required|string|max:15',
                'address' => 'required|string',
                'state_id' => 'required|exists:states,id',
                'district_id' => 'required|exists:districts,id',
                'nominee' => 'nullable|string|max:255',
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
                'address' => $request->address,
                'state_id' => $request->state_id,
                'district_id' => $request->district_id,
                'nominee' => $request->nominee,
                'password' => Hash::make($request->password),
                'role' => 'User',
            ];
            
            // Add sponsor details if provided
            if ($request->sponsor_id) {
                $userData['sponsor_id'] = $request->sponsor_id;
                $userData['sponsor_name'] = $request->sponsor_name;
            }
            
            // Auto-place in binary tree
            if ($request->position) {
                $placement = $this->findPositionOnSide($request->position);
            } else {
                $placement = $this->findNextAvailablePosition();
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
        
        // Use breadth-first search to find first available position on specified side
        $queue = [$rootUser];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            
            // Check the requested side first
            if ($side === 'left' && !$current->leftChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'left'
                ];
            }
            
            if ($side === 'right' && !$current->rightChild) {
                return [
                    'root_id' => $current->user_id,
                    'position' => 'right'
                ];
            }
            
            // Add children to queue for next level
            if ($current->leftChild) {
                $queue[] = $current->leftChild;
            }
            if ($current->rightChild) {
                $queue[] = $current->rightChild;
            }
        }
        
        // No position available on requested side
        return null;
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'AUTHENTICATION_ERROR',
                    'message' => 'Invalid credentials provided'
                ], 401);
            }

            $user = User::where('email', $request->email)->first();
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
            $request->validate([
                'transaction_password' => 'required|string|min:4',
            ]);

            $user = $request->user();
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

            // Render welcome letter HTML into PDF using Dompdf
            $html = view('emails.welcome-letter', ['user' => $user])->render();

            $options = new Options();
            $options->set('isRemoteEnabled', true);

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $pdfData = $dompdf->output();

            // Send welcome letter email with PDF attachment
            Mail::to($user->email)->send(new WelcomeLetterEmail($user, $pdfData));

            return response()->json([
                'success' => true,
                'message' => 'Welcome letter sent successfully to ' . $user->email
            ]);
        } catch (Exception $e) {
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

            // Render ID card view into PDF using Dompdf directly
            $html = view('emails.id-card-attachment', ['user' => $user])->render();

            $options = new Options();
            $options->set('isRemoteEnabled', true);

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $pdfData = $dompdf->output();

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