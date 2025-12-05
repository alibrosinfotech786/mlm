<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\BvHistory;
use App\Models\LevelBonusReport;
use App\Models\MatchingIncomeReport;
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
            
            $data = $request->only(['name', 'email', 'phone', 'sponsor_id', 'sponsor_name', 'root_id', 'position', 'nominee', 'role', 'isActive']);
            
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

    public function getMlmHierarchy4Levels(Request $request)
    {
        try {
            $request->validate(['user_id' => 'nullable|string']);
            
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
            
            $hierarchy = $this->buildMlmHierarchy($rootUser, 10, 0);
            
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
            
            $previousBv = $rootUser->bv;
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
                            'users_count' => count($levelUsers),
                            'expected_count' => $config['expected_count'],
                            'min_bv' => $minBv,
                            'percentage' => $config['percentage'],
                            'bonus' => $bonus,
                            'processed' => true,
                            'processed_at' => now()
                        ];
                    }
                } else {
                    $levelBonuses[] = [
                        'level' => $level,
                        'users_count' => count($levelUsers),
                        'expected_count' => $config['expected_count'],
                        'min_bv' => 0,
                        'percentage' => $config['percentage'],
                        'bonus' => 0,
                        'processed' => false,
                        'message' => 'Insufficient users at this level'
                    ];
                }
            }
            
            // Generate report
            $report = LevelBonusReport::create([
                'user_id' => $rootUser->user_id,
                'total_bonus_credited' => $totalBonus,
                'level_bonuses_data' => $levelBonuses,
                'previous_bv' => $previousBv,
                'new_bv' => $rootUser->bv,
                'status' => 'completed'
            ]);
            
            return response()->json([
                'success' => true,
                'root_user' => $rootUser->fresh(),
                'level_bonuses_processed' => $levelBonuses,
                'total_bonus_credited' => $totalBonus,
                'report_id' => $report->id,
                'message' => 'Level bonuses processed successfully and report generated'
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
    
    public function getBonusReceived(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 20);
            
            // Get all users sponsored by this user
            $sponsoredUsers = User::where('sponsor_id', $userId)->get();
            
            $bonusData = [];
            $totalBonusReceived = 0;
            
            foreach ($sponsoredUsers as $user) {
                // Get actual bonuses received from BV history
                $actualBonusReceived = \App\Models\BvHistory::where('user_id', $userId)
                    ->where('reason', 'referral_bonus')
                    ->where('reference_id', $user->user_id)
                    ->sum('bv_change');
                
                $totalBonusReceived += $actualBonusReceived;
                
                if ($actualBonusReceived > 0) {
                    // Get bonus history details
                    $bonusHistory = \App\Models\BvHistory::where('user_id', $userId)
                        ->where('reason', 'referral_bonus')
                        ->where('reference_id', $user->user_id)
                        ->orderBy('created_at', 'desc')
                        ->get(['bv_change', 'created_at']);
                    
                    $bonusData[] = [
                        'user_id' => $user->user_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'joined_date' => $user->created_at,
                        'is_active' => $user->isActive,
                        'position' => $user->position,
                        'bonus_received' => $actualBonusReceived,
                        'bonus_count' => $bonusHistory->count(),
                        'last_bonus_date' => $bonusHistory->first()?->created_at,
                        'bonus_history' => $bonusHistory->map(function($history) {
                            return [
                                'amount' => $history->bv_change,
                                'date' => $history->created_at
                            ];
                        })
                    ];
                }
            }
            
            // Apply pagination to bonus data
            $currentPage = $request->get('page', 1);
            $total = count($bonusData);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedBonusData = array_slice($bonusData, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            return response()->json([
                'success' => true,
                'bonus_received' => $paginatedBonusData,
                'pagination' => $pagination,
                'total_bonus_received' => $totalBonusReceived,
                'total_referrals' => $sponsoredUsers->count(),
                'referrals_with_bonus' => $total
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
                'error_type' => 'BONUS_RECEIVED_ERROR',
                'message' => 'Failed to fetch bonus received',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getTeamEarnings(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 20);
            
            // Get all BV history records where this user received bonuses
            $bonusRecords = \App\Models\BvHistory::where('user_id', $userId)
                ->where('type', 'credit')
                ->whereIn('reason', ['referral_bonus', 'team_performance_bonus_level_1', 'team_performance_bonus_level_2', 'team_performance_bonus_level_3', 'team_performance_bonus_level_4'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            $teamEarnings = [];
            $totalEarnings = 0;
            
            foreach ($bonusRecords as $record) {
                $totalEarnings += $record->bv_change;
                
                // Get user details if it's a referral bonus
                $fromUser = null;
                if ($record->reason === 'referral_bonus' && $record->reference_id) {
                    $fromUser = User::where('user_id', $record->reference_id)->first();
                }
                
                $teamEarnings[] = [
                    'bonus_type' => $record->reason,
                    'amount' => $record->bv_change,
                    'date' => $record->created_at,
                    'reference_id' => $record->reference_id,
                    'from_user' => $fromUser ? [
                        'user_id' => $fromUser->user_id,
                        'name' => $fromUser->name,
                        'email' => $fromUser->email,
                        'phone' => $fromUser->phone,
                        'position' => $fromUser->position,
                        'is_active' => $fromUser->isActive
                    ] : null
                ];
            }
            
            // Apply pagination
            $currentPage = $request->get('page', 1);
            $total = count($teamEarnings);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedEarnings = array_slice($teamEarnings, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            // Summary by bonus type
            $summary = [
                'referral_bonus' => $bonusRecords->where('reason', 'referral_bonus')->sum('bv_change'),
                'level_1_bonus' => $bonusRecords->where('reason', 'team_performance_bonus_level_1')->sum('bv_change'),
                'level_2_bonus' => $bonusRecords->where('reason', 'team_performance_bonus_level_2')->sum('bv_change'),
                'level_3_bonus' => $bonusRecords->where('reason', 'team_performance_bonus_level_3')->sum('bv_change'),
                'level_4_bonus' => $bonusRecords->where('reason', 'team_performance_bonus_level_4')->sum('bv_change')
            ];
            
            return response()->json([
                'success' => true,
                'team_earnings' => $paginatedEarnings,
                'pagination' => $pagination,
                'total_earnings' => $totalEarnings,
                'summary' => $summary,
                'total_transactions' => $total
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
                'error_type' => 'TEAM_EARNINGS_ERROR',
                'message' => 'Failed to fetch team earnings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getTeamPerformance(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 20);
            
            $user = User::where('user_id', $userId)->first();
            $allDownlines = $this->getAllDescendants($user);
            $directReferrals = User::where('sponsor_id', $userId)->pluck('user_id')->toArray();
            
            // Get non-referral team members with their levels
            $teamMembers = [];
            
            foreach ($allDownlines as $member) {
                // Skip direct referrals
                if (in_array($member->user_id, $directReferrals)) {
                    continue;
                }
                
                // Determine member's level
                $memberLevel = $this->getUserLevel($user, $member);
                
                $teamMembers[] = [
                    'user_id' => $member->user_id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'phone' => $member->phone,
                    'joined_date' => $member->created_at,
                    'is_active' => $member->isActive,
                    'position' => $member->position,
                    'level' => $memberLevel,
                    'bv_generated' => $member->bv,
                    'sponsor_id' => $member->sponsor_id
                ];
            }
            
            // Sort by level then by BV
            usort($teamMembers, function($a, $b) {
                if ($a['level'] == $b['level']) {
                    return $b['bv_generated'] <=> $a['bv_generated'];
                }
                return $a['level'] <=> $b['level'];
            });
            
            // Apply pagination
            $currentPage = $request->get('page', 1);
            $total = count($teamMembers);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedMembers = array_slice($teamMembers, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            // Level-wise summary
            $levelSummary = [];
            for ($level = 1; $level <= 4; $level++) {
                $levelMembers = array_filter($teamMembers, function($m) use ($level) {
                    return $m['level'] == $level;
                });
                
                $levelSummary[] = [
                    'level' => $level,
                    'member_count' => count($levelMembers),
                    'total_bv' => array_sum(array_column($levelMembers, 'bv_generated')),
                    'active_count' => count(array_filter($levelMembers, function($m) {
                        return $m['is_active'];
                    }))
                ];
            }
            
            return response()->json([
                'success' => true,
                'team_members' => $paginatedMembers,
                'pagination' => $pagination,
                'level_summary' => $levelSummary,
                'summary' => [
                    'total_non_referral_members' => $total,
                    'total_bv_generated' => array_sum(array_column($teamMembers, 'bv_generated')),
                    'total_active_members' => count(array_filter($teamMembers, function($m) {
                        return $m['is_active'];
                    }))
                ]
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
                'error_type' => 'TEAM_PERFORMANCE_ERROR',
                'message' => 'Failed to fetch team performance',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function getUserLevel($rootUser, $targetUser)
    {
        // Find the level of target user relative to root user
        $queue = [['user' => $rootUser, 'level' => 0]];
        $visited = [];
        
        while (!empty($queue)) {
            $current = array_shift($queue);
            $currentUser = $current['user'];
            $currentLevel = $current['level'];
            
            if (in_array($currentUser->user_id, $visited)) {
                continue;
            }
            $visited[] = $currentUser->user_id;
            
            if ($currentUser->user_id === $targetUser->user_id) {
                return $currentLevel;
            }
            
            // Add children to queue
            $children = User::where('root_id', $currentUser->user_id)->get();
            foreach ($children as $child) {
                $queue[] = ['user' => $child, 'level' => $currentLevel + 1];
            }
        }
        
        return 0; // Not found
    }
    
    public function getBinaryTeamBV(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $fromDate = $request->from_date ?? now()->subDays(30)->format('Y-m-d');
            $toDate = $request->to_date ?? now()->format('Y-m-d');
            
            $user = User::where('user_id', $userId)->first();
            
            // Get left and right team members
            $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
            $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
            
            // Add the direct left and right children to their respective teams
            if ($user->leftChild) {
                $leftTeam->prepend($user->leftChild);
            }
            if ($user->rightChild) {
                $rightTeam->prepend($user->rightChild);
            }
            
            // Get BV history for left team date-wise
            $leftBVHistory = \App\Models\BvHistory::whereIn('user_id', $leftTeam->pluck('user_id'))
                ->where('type', 'credit')
                ->whereBetween('created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
                ->selectRaw('DATE(created_at) as date, SUM(bv_change) as total_bv')
                ->groupBy('date')
                ->orderBy('date')
                ->get();
            
            // Get BV history for right team date-wise
            $rightBVHistory = \App\Models\BvHistory::whereIn('user_id', $rightTeam->pluck('user_id'))
                ->where('type', 'credit')
                ->whereBetween('created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
                ->selectRaw('DATE(created_at) as date, SUM(bv_change) as total_bv')
                ->groupBy('date')
                ->orderBy('date')
                ->get();
            
            // Combine data by date
            $dateWiseData = [];
            $allDates = $leftBVHistory->pluck('date')->merge($rightBVHistory->pluck('date'))->unique()->sort()->values();
            
            foreach ($allDates as $date) {
                $leftBV = $leftBVHistory->where('date', $date)->first()?->total_bv ?? 0;
                $rightBV = $rightBVHistory->where('date', $date)->first()?->total_bv ?? 0;
                
                $dateWiseData[] = [
                    'date' => $date,
                    'left_team_bv' => $leftBV,
                    'right_team_bv' => $rightBV,
                    'total_bv' => $leftBV + $rightBV
                ];
            }
            
            // Apply pagination
            $perPage = $request->get('per_page', 15);
            $currentPage = $request->get('page', 1);
            $total = count($dateWiseData);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedData = array_slice($dateWiseData, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            return response()->json([
                'success' => true,
                'user_id' => $userId,
                'date_range' => [
                    'from' => $fromDate,
                    'to' => $toDate
                ],
                'date_wise_bv' => $paginatedData,
                'pagination' => $pagination,
                'summary' => [
                    'left_team_members' => $leftTeam->count(),
                    'right_team_members' => $rightTeam->count(),
                    'total_left_bv' => $leftBVHistory->sum('total_bv'),
                    'total_right_bv' => $rightBVHistory->sum('total_bv'),
                    'total_period_bv' => $leftBVHistory->sum('total_bv') + $rightBVHistory->sum('total_bv'),
                    'total_days' => $total
                ]
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
                'error_type' => 'BINARY_TEAM_BV_ERROR',
                'message' => 'Failed to fetch binary team BV',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getMatchingIncome(Request $request)
    {
        try {
            $request->validate(['user_id' => 'nullable|exists:users,user_id']);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $user = User::where('user_id', $userId)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            // Get left and right team totals
            $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
            $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
            
            if ($user->leftChild) {
                $leftTeam->prepend($user->leftChild);
            }
            if ($user->rightChild) {
                $rightTeam->prepend($user->rightChild);
            }
            
            $leftTotalBV = $leftTeam->sum('bv');
            $rightTotalBV = $rightTeam->sum('bv');
            
            // Calculate matching
            $matchingBV = min($leftTotalBV, $rightTotalBV);
            $leftCarryForward = max(0, $leftTotalBV - $matchingBV);
            $rightCarryForward = max(0, $rightTotalBV - $matchingBV);
            
            // Get matching bonuses received from BV history
            $matchingBonusReceived = \App\Models\BvHistory::where('user_id', $userId)
                ->where('reason', 'matching_bonus')
                ->sum('bv_change');
            
            return response()->json([
                'success' => true,
                'user' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'matching_income' => [
                    'left_team_bv' => $leftTotalBV,
                    'right_team_bv' => $rightTotalBV,
                    'matching_bv' => $matchingBV,
                    'left_carry_forward' => $leftCarryForward,
                    'right_carry_forward' => $rightCarryForward,
                    'left_team_count' => $leftTeam->count(),
                    'right_team_count' => $rightTeam->count(),
                    'total_matching_received' => $matchingBonusReceived
                ]
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
                'error_type' => 'MATCHING_INCOME_ERROR',
                'message' => 'Failed to fetch matching income',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getDailyMatchingIncome(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $fromDate = $request->from_date ?? now()->subDays(30)->format('Y-m-d');
            $toDate = $request->to_date ?? now()->format('Y-m-d');
            $perPage = $request->get('per_page', 20);
            
            $user = User::where('user_id', $userId)->first();
            
            // Get left and right team members
            $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
            $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
            
            if ($user->leftChild) {
                $leftTeam->prepend($user->leftChild);
            }
            if ($user->rightChild) {
                $rightTeam->prepend($user->rightChild);
            }
            
            $leftUserIds = $leftTeam->pluck('user_id')->toArray();
            $rightUserIds = $rightTeam->pluck('user_id')->toArray();
            
            // Generate date range
            $dates = [];
            $currentDate = \Carbon\Carbon::parse($fromDate);
            $endDate = \Carbon\Carbon::parse($toDate);
            
            while ($currentDate <= $endDate) {
                $dates[] = $currentDate->format('Y-m-d');
                $currentDate->addDay();
            }
            
            $dailyMatching = [];
            $leftCarryForward = 0;
            $rightCarryForward = 0;
            
            foreach ($dates as $date) {
                // Get daily BV for left and right teams
                $leftDailyBV = \App\Models\BvHistory::whereIn('user_id', $leftUserIds)
                    ->where('type', 'credit')
                    ->whereDate('created_at', $date)
                    ->sum('bv_change');
                
                $rightDailyBV = \App\Models\BvHistory::whereIn('user_id', $rightUserIds)
                    ->where('type', 'credit')
                    ->whereDate('created_at', $date)
                    ->sum('bv_change');
                
                // Calculate totals with carry forward
                $leftTotal = $leftCarryForward + $leftDailyBV;
                $rightTotal = $rightCarryForward + $rightDailyBV;
                
                // Calculate matching
                $matchingBV = min($leftTotal, $rightTotal);
                $flush = abs($leftTotal - $rightTotal);
                
                // Update carry forward
                $leftCarryForward = max(0, $leftTotal - $matchingBV);
                $rightCarryForward = max(0, $rightTotal - $matchingBV);
                
                $dailyMatching[] = [
                    'date' => $date,
                    'left_daily_bv' => $leftDailyBV,
                    'right_daily_bv' => $rightDailyBV,
                    'left_carry_forward' => $leftCarryForward,
                    'right_carry_forward' => $rightCarryForward,
                    'left_total' => $leftTotal,
                    'right_total' => $rightTotal,
                    'matching_bv' => $matchingBV,
                    'flush' => $flush
                ];
            }
            
            // Sort by date descending (latest first)
            usort($dailyMatching, function($a, $b) {
                return strtotime($b['date']) - strtotime($a['date']);
            });
            
            // Apply pagination
            $currentPage = $request->get('page', 1);
            $total = count($dailyMatching);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedData = array_slice($dailyMatching, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            return response()->json([
                'success' => true,
                'user' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'date_range' => [
                    'from' => $fromDate,
                    'to' => $toDate
                ],
                'daily_matching' => $paginatedData,
                'pagination' => $pagination,
                'summary' => [
                    'total_matching_bv' => array_sum(array_column($dailyMatching, 'matching_bv')),
                    'left_team_count' => $leftTeam->count(),
                    'right_team_count' => $rightTeam->count()
                ]
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
                'error_type' => 'DAILY_MATCHING_ERROR',
                'message' => 'Failed to fetch daily matching income',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
    private function getUserMatchingLevel($user)
    {
        // Determine user level based on team structure (similar to level bonus logic)
        $levelUsers = [];
        for ($level = 1; $level <= 4; $level++) {
            $levelUsers[$level] = $this->getUsersByLevel($user, $level);
        }
        
        // Level requirements for matching income
        $levelRequirements = [
            1 => 2,  // Need 2 users at level 1
            2 => 4,  // Need 4 users at level 2
            3 => 8,  // Need 8 users at level 3
            4 => 16  // Need 16 users at level 4
        ];
        
        // Find highest qualifying level
        for ($level = 4; $level >= 1; $level--) {
            if (count($levelUsers[$level]) >= $levelRequirements[$level]) {
                return $level;
            }
        }
        
        return 0; // Not qualified
    }
    
    public function getReferralBusiness(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 20);
            
            // Get all users sponsored by this user
            $sponsoredUsers = User::where('sponsor_id', $userId)->get();
            
            if ($sponsoredUsers->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'referral_business' => [],
                    'total_business' => 0,
                    'total_users' => 0,
                    'message' => 'No referrals found'
                ]);
            }
            
            $businessData = [];
            $totalBusiness = 0;
            
            foreach ($sponsoredUsers as $user) {
                // Get all orders by this referred user using correct user id
                $orders = \App\Models\Order::where('user_id', $user->id)->get();
                $completedOrders = $orders->whereIn('status', ['completed', 'delivered'])->count();
                
                $userBusiness = $orders->sum('total_amount');
                $totalBusiness += $userBusiness;
                
                $businessData[] = [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'joined_date' => $user->created_at,
                    'total_orders' => $completedOrders,
                    'all_orders' => $orders->count(),
                    'total_business' => $userBusiness,
                    'current_bv' => $user->bv,
                    'is_active' => $user->isActive
                ];
            }
            
            // Sort by current BV descending
            usort($businessData, function($a, $b) {
                return $b['current_bv'] <=> $a['current_bv'];
            });
            
            // Apply pagination manually
            $currentPage = $request->get('page', 1);
            $total = count($businessData);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedData = array_slice($businessData, $offset, $perPage);
            
            $pagination = [
                'current_page' => (int) $currentPage,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
                'from' => $total > 0 ? $offset + 1 : null,
                'to' => $total > 0 ? min($offset + $perPage, $total) : null
            ];
            
            return response()->json([
                'success' => true,
                'referral_business' => $paginatedData,
                'pagination' => $pagination,
                'summary' => [
                    'total_referrals' => $sponsoredUsers->count(),
                    'active_referrals' => $sponsoredUsers->where('isActive', true)->count(),
                    'total_business_generated' => $totalBusiness,
                    'total_current_bv' => $sponsoredUsers->sum('bv')
                ]
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
                'error_type' => 'REFERRAL_BUSINESS_ERROR',
                'message' => 'Failed to fetch referral business',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getLevelBonusReports(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 10);
            
            $query = LevelBonusReport::where('user_id', $userId)
                ->with('user:user_id,name,email')
                ->orderBy('created_at', 'desc');
            
            if ($request->from_date) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->to_date) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
            
            $reports = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'reports' => $reports
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
                'error_type' => 'REPORTS_FETCH_ERROR',
                'message' => 'Failed to fetch level bonus reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getLevelBonusReport(Request $request)
    {
        try {
            $request->validate(['report_id' => 'required|exists:level_bonus_reports,id']);
            
            $report = LevelBonusReport::with('user:user_id,name,email')
                ->findOrFail($request->report_id);
            
            return response()->json([
                'success' => true,
                'report' => $report
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
                'error_type' => 'REPORT_FETCH_ERROR',
                'message' => 'Failed to fetch level bonus report',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getUserLevelBonusReports($userId, Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'nullable|integer|min:1|max:100',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date'
            ]);
            
            $user = User::where('user_id', $userId)->first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            $perPage = $request->get('per_page', 10);
            
            $query = LevelBonusReport::where('user_id', $userId)
                ->with('user:user_id,name,email')
                ->orderBy('created_at', 'desc');
            
            if ($request->from_date) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->to_date) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
            
            $reports = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'reports' => $reports
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
                'error_type' => 'USER_REPORTS_FETCH_ERROR',
                'message' => 'Failed to fetch user level bonus reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getMatchingIncomeReports(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date'
            ]);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $perPage = $request->get('per_page', 10);
            
            $query = MatchingIncomeReport::where('user_id', $userId)
                ->with('user:user_id,name,email')
                ->orderBy('created_at', 'desc');
            
            if ($request->from_date) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->to_date) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
            
            $reports = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'reports' => $reports
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
                'error_type' => 'REPORTS_FETCH_ERROR',
                'message' => 'Failed to fetch matching income reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getUserMatchingIncomeReports($userId, Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'nullable|integer|min:1|max:100',
                'from_date' => 'nullable|date',
                'to_date' => 'nullable|date|after_or_equal:from_date'
            ]);
            
            $user = User::where('user_id', $userId)->first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'USER_NOT_FOUND',
                    'message' => 'User not found'
                ], 404);
            }
            
            $perPage = $request->get('per_page', 10);
            
            $query = MatchingIncomeReport::where('user_id', $userId)
                ->with('user:user_id,name,email')
                ->orderBy('created_at', 'desc');
            
            if ($request->from_date) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->to_date) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
            
            $reports = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'reports' => $reports
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
                'error_type' => 'USER_REPORTS_FETCH_ERROR',
                'message' => 'Failed to fetch user matching income reports',
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