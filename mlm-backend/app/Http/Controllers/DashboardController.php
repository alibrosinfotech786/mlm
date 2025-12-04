<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Grievance;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
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

    public function getAdminDashboardData()
    {
        try {
            $today = Carbon::today();
            $weekStart = Carbon::now()->startOfWeek();

            // Total Users
            $totalUsers = User::count();

            // Active Users (users with isActive = 1)
            $activeUsers = User::where('isActive', 1)->count();

            // Today's Joins
            $todaysJoins = User::whereDate('created_at', $today)->count();

            // Total Orders
            $totalOrders = Order::count();

            // Total Sales (sum of total_mrp from all orders)
            $totalSales = Order::sum('total_mrp') ?? 0;

            // New Registrations This Week
            $newRegistrationsThisWeek = User::where('created_at', '>=', $weekStart)->count();

            // Pending Orders
            $pendingOrders = Order::where('status', 'pending')->count();

            // Pending Grievances
            $pendingGrievances = Grievance::where('status', 'pending')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'todays_joins' => $todaysJoins,
                    'total_orders' => $totalOrders,
                    'total_sales' => number_format($totalSales, 2),
                    'new_registrations_this_week' => $newRegistrationsThisWeek,
                    'pending_orders' => $pendingOrders,
                    'pending_grievances' => $pendingGrievances,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMonthlySalesOverview()
    {
        try {
            $monthlySales = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total_mrp) as sales')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create($item->year, $item->month)->format('M Y'),
                    'sales' => (float) $item->sales
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $monthlySales
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch monthly sales data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserGrowthTrend()
    {
        try {
            $userGrowth = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as new_users')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'users' => (int) $item->new_users
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $userGrowth
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user growth data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserDistribution()
    {
        try {
            $activeUsers = User::where('isActive', 1)->count();
            $inactiveUsers = User::where('isActive', 0)->count();

            $data = [
                ['name' => 'Active Users', 'value' => $activeUsers],
                ['name' => 'Inactive Users', 'value' => $inactiveUsers]
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user distribution data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrdersSalesTrend()
    {
        try {
            $trend = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total_mrp) as sales')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'orders' => (int) $item->orders,
                    'sales' => (float) $item->sales
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $trend
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders and sales trend data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRecentJoins()
    {
        try {
            $recentJoins = User::with(['state', 'district'])
                ->select('user_id', 'name', 'email', 'phone', 'state_id', 'district_id', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'user_id' => $user->user_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'location' => ($user->state ? $user->state->name : '') . ', ' . ($user->district ? $user->district->name : ''),
                        'joined_at' => $user->created_at->format('M d, Y H:i')
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentJoins
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent joins',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRecentOrders()
    {
        try {
            $recentOrders = Order::with('user')
                ->select('id', 'user_id', 'order_number', 'status', 'total_mrp', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'user_name' => $order->user ? $order->user->name : 'N/A',
                        'user_id' => $order->user_id,
                        'amount' => number_format($order->total_mrp, 2),
                        'status' => ucfirst($order->status),
                        'ordered_at' => $order->created_at->format('M d, Y H:i')
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentOrders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getComprehensiveUserDashboard(Request $request)
    {
        try {
            $request->validate(['user_id' => 'nullable|exists:users,user_id']);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            $user = User::where('user_id', $userId)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // 1. Personal Sales & Orders
            $personalOrders = Order::where('user_id', $user->id)->get();
            $totalPersonalSales = $personalOrders->sum('total_mrp');
            $totalPersonalBV = $personalOrders->sum('total_bv');
            $completedOrders = $personalOrders->whereIn('status', ['completed', 'delivered'])->count();
            
            // 2. Direct Referral Bonus (10% of qualified referrals' BV)
            $directReferrals = User::where('sponsor_id', $userId)->get();
            $qualifiedReferrals = $directReferrals->where('bv', '>=', 1000);
            $referralBonusReceived = \App\Models\BvHistory::where('user_id', $userId)
                ->where('reason', 'referral_bonus')
                ->sum('bv_change');
            
            // 3. Team Performance Bonus (Level bonuses)
            $levelBonuses = \App\Models\BvHistory::where('user_id', $userId)
                ->where('reason', 'like', 'team_performance_bonus_level_%')
                ->get()
                ->groupBy('reason')
                ->map(function($group) {
                    return $group->sum('bv_change');
                });
            
            $totalLevelBonus = $levelBonuses->sum();
            
            // 4. Binary Team BV Analysis
            $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
            $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
            
            if ($user->leftChild) $leftTeam->prepend($user->leftChild);
            if ($user->rightChild) $rightTeam->prepend($user->rightChild);
            
            $leftTeamBV = $leftTeam->sum('bv');
            $rightTeamBV = $rightTeam->sum('bv');
            $matchingBV = min($leftTeamBV, $rightTeamBV);
            
            // 5. All BV Income Sources
            $allBVIncome = \App\Models\BvHistory::where('user_id', $userId)
                ->where('type', 'credit')
                ->get()
                ->groupBy('reason')
                ->map(function($group, $reason) {
                    return [
                        'reason' => $reason,
                        'total_amount' => $group->sum('bv_change'),
                        'transaction_count' => $group->count(),
                        'last_received' => $group->max('created_at')
                    ];
                })
                ->values();
            
            // 6. Team Statistics
            $allTeamMembers = $this->getAllDescendants($user);
            $teamStats = [
                'total_team_size' => $allTeamMembers->count(),
                'active_team_members' => $allTeamMembers->where('isActive', 1)->count(),
                'left_team_size' => $leftTeam->count(),
                'right_team_size' => $rightTeam->count(),
                'total_team_bv' => $allTeamMembers->sum('bv'),
                'direct_referrals' => $directReferrals->count(),
                'qualified_referrals' => $qualifiedReferrals->count()
            ];
            
            // 7. Monthly Performance
            $currentMonth = Carbon::now()->startOfMonth();
            $monthlyBVIncome = \App\Models\BvHistory::where('user_id', $userId)
                ->where('type', 'credit')
                ->where('created_at', '>=', $currentMonth)
                ->sum('bv_change');
            
            $monthlyOrders = Order::where('user_id', $user->id)
                ->where('created_at', '>=', $currentMonth)
                ->count();
            
            // 8. Package & Rank Information
            $packageInfo = [
                'current_package' => $user->package ?? 'starter',
                'current_bv' => $user->bv,
                'next_package_threshold' => $this->getNextPackageThreshold($user->bv)
            ];
            
            // 9. Recent Activities (Last 10 BV transactions)
            $recentActivities = \App\Models\BvHistory::where('user_id', $userId)
                ->with('referenceUser')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($activity) {
                    return [
                        'date' => $activity->created_at->format('M d, Y H:i'),
                        'type' => $activity->reason,
                        'amount' => $activity->bv_change,
                        'from_user' => $activity->referenceUser ? $activity->referenceUser->name : null,
                        'description' => $this->getActivityDescription($activity)
                    ];
                });
            
            return response()->json([
                'success' => true,
                'user_info' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'joined_date' => $user->created_at->format('M d, Y'),
                    'is_active' => $user->isActive
                ],
                'financial_summary' => [
                    'current_bv' => $user->bv,
                    'total_personal_sales' => $totalPersonalSales,
                    'total_personal_bv' => $totalPersonalBV,
                    'total_referral_bonus' => $referralBonusReceived,
                    'total_level_bonus' => $totalLevelBonus,
                    'total_bv_income' => $allBVIncome->sum('total_amount'),
                    'monthly_bv_income' => $monthlyBVIncome
                ],
                'sales_performance' => [
                    'total_orders' => $personalOrders->count(),
                    'completed_orders' => $completedOrders,
                    'monthly_orders' => $monthlyOrders,
                    'total_sales_value' => $totalPersonalSales
                ],
                'team_performance' => $teamStats,
                'binary_team' => [
                    'left_team_bv' => $leftTeamBV,
                    'right_team_bv' => $rightTeamBV,
                    'matching_bv' => $matchingBV,
                    'carry_forward_left' => max(0, $leftTeamBV - $matchingBV),
                    'carry_forward_right' => max(0, $rightTeamBV - $matchingBV)
                ],
                'income_breakdown' => $allBVIncome,
                'level_bonuses' => $levelBonuses,
                'package_info' => $packageInfo,
                'recent_activities' => $recentActivities,
                'referral_details' => [
                    'total_referrals' => $directReferrals->count(),
                    'qualified_referrals' => $qualifiedReferrals->count(),
                    'referral_bonus_earned' => $referralBonusReceived
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch comprehensive dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function getNextPackageThreshold($currentBV)
    {
        $thresholds = [500 => 'starter', 1000 => 'builder', 2000 => 'performer', 4000 => 'leader', 10000 => 'legend'];
        
        foreach ($thresholds as $threshold => $package) {
            if ($currentBV < $threshold) {
                return ['threshold' => $threshold, 'package' => $package, 'remaining' => $threshold - $currentBV];
            }
        }
        
        return ['threshold' => 10000, 'package' => 'legend', 'remaining' => 0];
    }
    
    private function getActivityDescription($activity)
    {
        $descriptions = [
            'referral_bonus' => 'Referral bonus from team member',
            'team_performance_bonus_level_1' => 'Level 1 team performance bonus',
            'team_performance_bonus_level_2' => 'Level 2 team performance bonus',
            'team_performance_bonus_level_3' => 'Level 3 team performance bonus',
            'team_performance_bonus_level_4' => 'Level 4 team performance bonus',
            'direct_sales' => 'Direct sales commission',
            'matching_bonus' => 'Binary matching bonus'
        ];
        
        return $descriptions[$activity->reason] ?? ucfirst(str_replace('_', ' ', $activity->reason));
    }
    
    public function getUserMonthlyGrowth(Request $request)
    {
        try {
            $request->validate(['user_id' => 'nullable|exists:users,user_id']);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            
            $monthlyGrowth = \App\Models\BvHistory::where('user_id', $userId)
                ->where('type', 'credit')
                ->select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('SUM(bv_change) as total_bv')
                )
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => Carbon::create($item->year, $item->month)->format('M Y'),
                        'bv_earned' => (float) $item->total_bv
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $monthlyGrowth
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user monthly growth data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getUserBonusBreakdown(Request $request)
    {
        try {
            $request->validate(['user_id' => 'nullable|exists:users,user_id']);
            
            $userId = $request->user_id ?? $request->user()->user_id;
            
            $bonusBreakdown = \App\Models\BvHistory::where('user_id', $userId)
                ->where('type', 'credit')
                ->select('reason', DB::raw('SUM(bv_change) as total_amount'))
                ->groupBy('reason')
                ->get()
                ->map(function($item) {
                    $labels = [
                        'referral_bonus' => 'Referral Bonus',
                        'team_performance_bonus_level_1' => 'Level 1 Bonus',
                        'team_performance_bonus_level_2' => 'Level 2 Bonus', 
                        'team_performance_bonus_level_3' => 'Level 3 Bonus',
                        'team_performance_bonus_level_4' => 'Level 4 Bonus',
                        'direct_sales' => 'Direct Sales',
                        'matching_bonus' => 'Matching Bonus'
                    ];
                    
                    return [
                        'name' => $labels[$item->reason] ?? ucfirst(str_replace('_', ' ', $item->reason)),
                        'value' => (float) $item->total_amount
                    ];
                })
                ->filter(function($item) {
                    return $item['value'] > 0;
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $bonusBreakdown
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bonus breakdown data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}