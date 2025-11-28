<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\BvHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $perPage = in_array($perPage, [5, 10, 15, 20, 25, 50]) ? $perPage : 10;
            
            $query = User::query();
            
            if ($request->has('role') && $request->role !== '') {
                $query->where('role', $request->role);
            }
            
            if ($request->has('isActive') && $request->isActive !== '') {
                $query->where('isActive', filter_var($request->isActive, FILTER_VALIDATE_BOOLEAN));
            }
            
            $users = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USERS_FETCH_ERROR',
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:users,id',
                'name' => 'string|max:255',
                'email' => 'string|email|max:255|unique:users,email,' . $request->id,
                'phone' => 'string|max:15',
                'address' => 'string',
                'sponsor_id' => 'nullable|exists:users,user_id',
                'sponsor_name' => 'nullable|string|max:255',
                'root_id' => 'nullable|exists:users,user_id',
                'position' => 'nullable|in:left,right',
                'nominee' => 'nullable|string|max:255',
                'role' => 'nullable|exists:roles,name',
                'isActive' => 'nullable|boolean',
                'current_password' => 'required_with:password,transaction_password|string',
                'password' => 'nullable|string|min:8',
                'transaction_password' => 'nullable|string|min:4',
                'profile_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            ]);

            $user = User::findOrFail($request->id);
            
            // Verify current password if changing passwords
            if ($request->password || $request->transaction_password) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'INVALID_CURRENT_PASSWORD',
                        'message' => 'Current password is incorrect'
                    ], 422);
                }
            }
            
            $data = $request->only(['name', 'email', 'phone', 'address', 'sponsor_id', 'sponsor_name', 'root_id', 'position', 'nominee', 'role', 'isActive']);
            
            if ($request->password) {
                $data['password'] = Hash::make($request->password);
            }
            
            if ($request->transaction_password) {
                $data['transaction_password'] = Hash::make($request->transaction_password);
            }
            
            if ($request->hasFile('profile_picture')) {
                $data['profile_picture'] = $this->uploadProfilePicture($request->file('profile_picture'));
            }

            $user->update($data);
            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'User updated successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USER_NOT_FOUND',
                'message' => 'User not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USER_UPDATE_ERROR',
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:users,id']);
            User::findOrFail($request->id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USER_NOT_FOUND',
                'message' => 'User not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'USER_DELETE_ERROR',
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getBinaryTree(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|string',
                'levels' => 'nullable|integer|min:1|max:10'
            ]);
            
            $user = User::where('user_id', $request->user_id)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            $levels = $request->levels ?? 5; // Default 5 levels
            $binaryTree = $this->buildBinaryTree($user, $levels);
            
            return response()->json([
                'success' => true,
                'binary_tree' => $binaryTree
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
                'error_type' => 'BINARY_TREE_FETCH_ERROR',
                'message' => 'Failed to fetch binary tree',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function buildBinaryTree($user, $levels)
    {
        if (!$user || $levels <= 0) {
            return null;
        }
        
        $userData = $user->makeHidden(['leftChild', 'rightChild'])->toArray();
        
        return [
            'user' => $userData,
            'left_child' => $this->buildBinaryTree($user->leftChild, $levels - 1),
            'right_child' => $this->buildBinaryTree($user->rightChild, $levels - 1)
        ];
    }
    
    public function getMlmHierarchy(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|string',
                'levels' => 'nullable|integer|min:1|max:15'
            ]);
            
            // If no user_id provided, start from root (first user)
            if ($request->user_id) {
                $rootUser = User::where('user_id', $request->user_id)->first();
            } else {
                $rootUser = User::whereNull('root_id')->first();
            }
            
            if (!$rootUser) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'Root user not found'
                ], 404);
            }
            
            $levels = $request->levels ?? 10;
            $hierarchy = $this->buildMlmHierarchy($rootUser, $levels, 0);
            
            return response()->json([
                'success' => true,
                'mlm_hierarchy' => $hierarchy
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
                'error_type' => 'MLM_HIERARCHY_ERROR',
                'message' => 'Failed to fetch MLM hierarchy',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function buildMlmHierarchy($user, $levels, $currentLevel)
    {
        if (!$user || $levels <= 0) {
            return null;
        }
        
        $userData = $user->makeHidden(['downlines'])->toArray();
        $downlines = $user->downlines;
        
        $children = [];
        foreach ($downlines as $downline) {
            $children[] = $this->buildMlmHierarchy($downline, $levels - 1, $currentLevel + 1);
        }
        
        return [
            'user' => $userData,
            'level' => $currentLevel,
            'total_downlines' => $downlines->count(),
            'children' => $children
        ];
    }
    
    public function getAvailablePosition(Request $request)
    {
        try {
            $request->validate(['sponsor_id' => 'required|exists:users,user_id']);
            
            $sponsor = User::where('user_id', $request->sponsor_id)->first();
            $leftChild = $sponsor->leftChild;
            $rightChild = $sponsor->rightChild;
            
            $availablePositions = [];
            if (!$leftChild) {
                $availablePositions[] = 'left';
            }
            if (!$rightChild) {
                $availablePositions[] = 'right';
            }
            
            return response()->json([
                'success' => true,
                'available_positions' => $availablePositions,
                'left_occupied' => $leftChild ? true : false,
                'right_occupied' => $rightChild ? true : false
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
                'error_type' => 'POSITION_CHECK_ERROR',
                'message' => 'Failed to check available positions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByUserId(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|string',
                'email' => 'nullable|email'
            ]);
            
            // Check if at least one parameter is provided
            if (!$request->has('user_id') && !$request->has('email')) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'VALIDATION_ERROR',
                    'message' => 'Either user_id or email is required'
                ], 422);
            }
            
            $query = User::with(['sponsor', 'downlines']);
            
            // Search by user_id if provided
            if ($request->has('user_id') && $request->user_id) {
                $query->where('user_id', $request->user_id);
            }
            
            // Search by email if provided
            if ($request->has('email') && $request->email) {
                $query->where('email', $request->email);
            }
            
            $user = $query->first();
            
            if (!$user) {
                $searchBy = $request->has('user_id') && $request->user_id ? 'user_id' : 'email';
                $searchValue = $request->has('user_id') && $request->user_id ? $request->user_id : $request->email;
                
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => "User not found with this {$searchBy}: {$searchValue}"
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'user' => $user
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
                'error_type' => 'USER_FETCH_ERROR',
                'message' => 'Failed to fetch user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfilePicture(Request $request)
    {
        try {
            $request->validate([
                'profile_picture' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            ]);

            $user = $request->user();
            $profilePicturePath = $this->uploadProfilePicture($request->file('profile_picture'));
            
            $user->update(['profile_picture' => $profilePicturePath]);

            return response()->json([
                'success' => true,
                'profile_picture' => $profilePicturePath,
                'message' => 'Profile picture updated successfully'
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
                'error_type' => 'PROFILE_PICTURE_ERROR',
                'message' => 'Failed to update profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function uploadProfilePicture($file)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/profiles/" . $fileName;
        $file->move(public_path("uploads/profiles"), $fileName);
        return $path;
    }
    
    public function getMlmHierarchyList(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'side' => 'nullable|in:left,right',
                'per_page' => 'nullable|integer|min:1|max:100',
                'search' => 'nullable|string'
            ]);
            
            $user = User::where('user_id', $request->user_id)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            if ($request->has('side') && $request->side !== '') {
                // Get specific side and all its descendants
                $sideChild = $request->side === 'left' ? $user->leftChild : $user->rightChild;
                if ($sideChild) {
                    $downlines = $this->getAllDescendants($sideChild);
                } else {
                    $downlines = collect();
                }
            } else {
                // Get all descendants
                $downlines = $this->getAllDescendants($user);
            }
            
            // Apply search filter
            if ($request->has('search') && $request->search !== '') {
                $searchTerm = $request->search;
                $downlines = $downlines->filter(function ($user) use ($searchTerm) {
                    return stripos($user->user_id, $searchTerm) !== false ||
                           stripos($user->name, $searchTerm) !== false ||
                           stripos($user->email, $searchTerm) !== false;
                });
            }
            
            // Apply pagination
            $perPage = $request->get('per_page', 10);
            $currentPage = $request->get('page', 1);
            $total = $downlines->count();
            
            $paginatedDownlines = $downlines->forPage($currentPage, $perPage)->values();
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? (($currentPage - 1) * $perPage) + 1 : null,
                'to' => $total > 0 ? min($currentPage * $perPage, $total) : null
            ];
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'downlines' => $paginatedDownlines,
                'pagination' => $pagination
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
                'error_type' => 'MLM_HIERARCHY_LIST_ERROR',
                'message' => 'Failed to fetch MLM hierarchy list',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function getAllDescendants($user)
    {
        $descendants = collect();
        
        if (!$user) {
            return $descendants;
        }
        
        // Get direct children
        $directChildren = User::where('root_id', $user->user_id)->get();
        
        foreach ($directChildren as $child) {
            $descendants->push($child);
            // Recursively get all descendants of this child
            $descendants = $descendants->merge($this->getAllDescendants($child));
        }
        
        return $descendants;
    }
    
    public function getSponsoredUsers(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100',
                'search' => 'nullable|string'
            ]);
            
            $query = User::where('sponsor_id', $request->user_id);
            
            // Apply search filter
            if ($request->has('search') && $request->search !== '') {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('user_id', 'like', '%' . $searchTerm . '%')
                      ->orWhere('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('email', 'like', '%' . $searchTerm . '%');
                });
            }
            
            $perPage = $request->get('per_page', 10);
            $sponsoredUsers = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'sponsored_users' => $sponsoredUsers
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
                'error_type' => 'SPONSORED_USERS_ERROR',
                'message' => 'Failed to fetch sponsored users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function calculateLevelBonus(Request $request)
    {
        try {
            $request->validate(['user_id' => 'required|exists:users,user_id']);
            
            $rootUser = User::where('user_id', $request->user_id)->first();
            
            if (!$rootUser) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            $levelBonuses = [];
            $totalBonus = 0;
            
            // Level percentages and expected counts
            $levelConfig = [
                1 => ['percentage' => 20, 'expected_count' => 2],
                2 => ['percentage' => 5, 'expected_count' => 4],
                3 => ['percentage' => 3, 'expected_count' => 8],
                4 => ['percentage' => 2, 'expected_count' => 16]
            ];
            
            for ($level = 1; $level <= 4; $level++) {
                $levelUsers = $this->getUsersByLevel($rootUser, $level);
                $config = $levelConfig[$level];
                
                if (count($levelUsers) >= $config['expected_count']) {
                    // Get BV values and find minimum
                    $bvValues = array_map(function($user) { return $user->bv; }, $levelUsers);
                    $minBv = min($bvValues);
                    
                    // Calculate bonus
                    $bonus = $minBv * ($config['percentage'] / 100);
                    $totalBonus += $bonus;
                    
                    $levelBonuses[] = [
                        'level' => $level,
                        'users_count' => count($levelUsers),
                        'expected_count' => $config['expected_count'],
                        'min_bv' => $minBv,
                        'percentage' => $config['percentage'],
                        'bonus' => $bonus
                    ];
                } else {
                    $levelBonuses[] = [
                        'level' => $level,
                        'users_count' => count($levelUsers),
                        'expected_count' => $config['expected_count'],
                        'min_bv' => 0,
                        'percentage' => $config['percentage'],
                        'bonus' => 0,
                        'message' => 'Insufficient users at this level'
                    ];
                }
            }
            
            return response()->json([
                'success' => true,
                'root_user' => $rootUser,
                'level_bonuses' => $levelBonuses,
                'total_bonus' => $totalBonus
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
                'error_type' => 'LEVEL_BONUS_ERROR',
                'message' => 'Failed to calculate level bonus',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function getUsersByLevel($rootUser, $targetLevel)
    {
        $users = [];
        $this->collectUsersByLevel($rootUser, 0, $targetLevel, $users);
        return $users;
    }
    
    private function collectUsersByLevel($user, $currentLevel, $targetLevel, &$users)
    {
        if (!$user || $currentLevel > $targetLevel) {
            return;
        }
        
        if ($currentLevel === $targetLevel) {
            $users[] = $user;
            return;
        }
        
        // Get direct children and recurse
        $children = User::where('root_id', $user->user_id)->get();
        foreach ($children as $child) {
            $this->collectUsersByLevel($child, $currentLevel + 1, $targetLevel, $users);
        }
    }
    
    public function processLevelBonus(Request $request)
    {
        try {
            $request->validate(['user_id' => 'required|exists:users,user_id']);
            
            $rootUser = User::where('user_id', $request->user_id)->first();
            
            if (!$rootUser) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            $levelBonuses = [];
            $totalBonus = 0;
            
            // Level percentages and expected counts
            $levelConfig = [
                1 => ['percentage' => 20, 'expected_count' => 2],
                2 => ['percentage' => 5, 'expected_count' => 4],
                3 => ['percentage' => 3, 'expected_count' => 8],
                4 => ['percentage' => 2, 'expected_count' => 16]
            ];
            
            for ($level = 1; $level <= 4; $level++) {
                $levelUsers = $this->getUsersByLevel($rootUser, $level);
                $config = $levelConfig[$level];
                
                if (count($levelUsers) >= $config['expected_count']) {
                    // Get BV values and find minimum
                    $bvValues = array_map(function($user) { return $user->bv; }, $levelUsers);
                    $minBv = min($bvValues);
                    
                    // Calculate bonus
                    $bonus = $minBv * ($config['percentage'] / 100);
                    
                    if ($bonus > 0) {
                        $oldBv = $rootUser->bv;
                        $rootUser->increment('bv', $bonus);
                        $rootUser->refresh();
                        
                        // Log BV history with level information
                        BvHistory::create([
                            'user_id' => $rootUser->user_id,
                            'previous_bv' => $oldBv,
                            'bv_change' => $bonus,
                            'new_bv' => $rootUser->bv,
                            'type' => 'credit',
                            'reason' => 'team_performance_bonus_level_' . $level,
                            'reference_id' => 'level_' . $level . '_bonus',
                        ]);
                        
                        $totalBonus += $bonus;
                        
                        $levelBonuses[] = [
                            'level' => $level,
                            'bonus' => $bonus,
                            'processed' => true
                        ];
                    }
                }
            }
            
            return response()->json([
                'success' => true,
                'root_user' => $rootUser->fresh(),
                'level_bonuses_processed' => $levelBonuses,
                'total_bonus_credited' => $totalBonus,
                'message' => 'Level bonuses processed successfully'
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
                'error_type' => 'PROCESS_LEVEL_BONUS_ERROR',
                'message' => 'Failed to process level bonus',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getMlmStructure(Request $request)
    {
        try {
            $rootUser = User::whereNull('root_id')->first();
            
            if (!$rootUser) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'ROOT_NOT_FOUND',
                    'message' => 'No root user found'
                ], 404);
            }
            
            $structure = $this->buildBinaryTreeStructure($rootUser);
            
            return response()->json([
                'success' => true,
                'mlm_structure' => $structure
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'MLM_STRUCTURE_ERROR',
                'message' => 'Failed to fetch MLM structure',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function buildBinaryTreeStructure($user)
    {
        if (!$user) {
            return null;
        }
        
        return [
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'position' => $user->position,
            'bv' => $user->bv,
            'isActive' => $user->isActive,
            'left_child' => $this->buildBinaryTreeStructure($user->leftChild),
            'right_child' => $this->buildBinaryTreeStructure($user->rightChild)
        ];
    }
}