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

    public function getUserDashboardData(Request $request)
    {
        try {
            $userId = $request->query('user_id');
            
            if ($userId) {
                $user = User::where('user_id', $userId)->first();
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'User not found'
                    ], 404);
                }
            } else {
                $user = $request->user();
            }
            
            // Get team BV data
            $leftTeamBV = User::where('root_id', $user->user_id)
                ->where('position', 'left')
                ->sum('bv');
            
            $rightTeamBV = User::where('root_id', $user->user_id)
                ->where('position', 'right')
                ->sum('bv');
            
            $allTeamBV = User::where('sponsor_id', $user->user_id)->sum('bv');
            
            // Calculate referral bonus BV (10% from referrals with BV >= 1000)
            $referralBonusBV = User::where('sponsor_id', $user->user_id)
                ->where('bv', '>=', 1000)
                ->sum(DB::raw('bv * 0.10')) ?? 0;
            $performanceBonusBV = $user->bvHistories()->where('type', 'performance')->sum('bv_change') ?? 0;
            $sponsorRoyaltyBV = $user->bvHistories()->where('type', 'sponsor_royalty')->sum('bv_change') ?? 0;
            $rankBonusBV = $user->bvHistories()->where('type', 'rank')->sum('bv_change') ?? 0;
            $repurchaseIncomeBV = $user->bvHistories()->where('type', 'repurchase')->sum('bv_change') ?? 0;
            $fastTrackBonusBV = $user->bvHistories()->where('type', 'fast_track')->sum('bv_change') ?? 0;
            $starAchieverPoolBV = $user->bvHistories()->where('type', 'star_achiever')->sum('bv_change') ?? 0;
            $loyaltyBonusBV = $user->bvHistories()->where('type', 'loyalty')->sum('bv_change') ?? 0;
            $directIncomeBV = $user->bvHistories()->where('type', 'direct')->sum('bv_change') ?? 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'referral_bonus_bv' => (float) $referralBonusBV,
                    'performance_bonus_bv' => (float) $performanceBonusBV,
                    'sponsor_royalty_bv' => (float) $sponsorRoyaltyBV,
                    'rank_bonus_bv' => (float) $rankBonusBV,
                    'repurchase_income_bv' => (float) $repurchaseIncomeBV,
                    'fast_track_bonus_bv' => (float) $fastTrackBonusBV,
                    'star_achiever_pool_bv' => (float) $starAchieverPoolBV,
                    'loyalty_bonus_bv' => (float) $loyaltyBonusBV,
                    'direct_income_bv' => (float) $directIncomeBV,
                    'total_left_team_bv' => (float) $leftTeamBV,
                    'total_right_team_bv' => (float) $rightTeamBV,
                    'all_team_bv' => (float) $allTeamBV,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}