<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BvHistoryController;
use App\Http\Controllers\WalletTransactionController;
use App\Http\Controllers\GrievanceController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadController;

// test
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working perfectly!',
        'server_time' => now(),
        'ip' => request()->ip(),
        'app_url' => config('app.url')
    ]);
});

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes for testing
Route::get('/users/show', [UserController::class, 'showByUserId']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'showById']);
Route::get('/trainings', [TrainingController::class, 'index']);
Route::get('/trainings/{id}', [TrainingController::class, 'showById']);
Route::get('/trainings/show', [TrainingController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/show', [ProductController::class, 'show']);

// Contact routes
Route::post('/contact', [ContactController::class, 'store']);

// Public location routes
Route::get('/states', [StateController::class, 'index']);
Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/districts/by-state', [DistrictController::class, 'getByState']);

// Upload routes (public)
Route::post('/uploads', [UploadController::class, 'store']);
Route::get('/uploads', [UploadController::class, 'index']);
Route::delete('/uploads', [UploadController::class, 'destroy']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/set-transaction-password', [AuthController::class, 'setTransactionPassword']);
    Route::post('/send-welcome-letter', [AuthController::class, 'sendWelcomeLetter']);
    Route::post('/send-id-card', [AuthController::class, 'sendIdCard']);

    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/update', [UserController::class, 'update']);
    Route::post('/users/profile-picture', [UserController::class, 'updateProfilePicture']);
    Route::post('/users/delete', [UserController::class, 'destroy']);
    Route::get('/users/binary-tree', [UserController::class, 'getBinaryTree']);
    Route::get('/users/mlm-hierarchy', [UserController::class, 'getMlmHierarchy']);
    Route::get('/users/mlm-hierarchy-4-levels', [UserController::class, 'getMlmHierarchy4Levels']);
    Route::get('/users/mlm-hierarchy-list', [UserController::class, 'getMlmHierarchyList']);
    Route::get('/users/sponsored-users', [UserController::class, 'getSponsoredUsers']);
    Route::get('/users/level-bonus', [UserController::class, 'calculateLevelBonus']);
    Route::post('/users/process-level-bonus', [UserController::class, 'processLevelBonus']); #sponser royality income
    Route::get('/users/mlm-structure', [UserController::class, 'getMlmStructure']);
    Route::get('/users/available-positions', [UserController::class, 'getAvailablePosition']);
    Route::get('/users/bonus-received', [UserController::class, 'getBonusReceived']);
    // Route::get('/users/team-earnings', [UserController::class, 'getTeamEarnings']);
    Route::get('/users/team-performance', [UserController::class, 'getTeamPerformance']);
    Route::get('/users/binary-team-bv', [UserController::class, 'getBinaryTeamBV']);
    // Route::get('/users/matching-income', [UserController::class, 'getMatchingIncome']);
    // Route::get('/users/daily-matching-income', [UserController::class, 'getDailyMatchingIncome']);
    Route::get('/users/level-bonus-reports', [UserController::class, 'getLevelBonusReports']);
    Route::get('/users/level-bonus-report', [UserController::class, 'getLevelBonusReport']);
    Route::get('/users/{user_id}/level-bonus-reports', [UserController::class, 'getUserLevelBonusReports']);
    Route::get('/users/matching-income-reports', [UserController::class, 'getMatchingIncomeReports']);
    Route::get('/users/{user_id}/matching-income-reports', [UserController::class, 'getUserMatchingIncomeReports']);
    Route::get('/users/next-team-performance-bonus', [UserController::class, 'calculateTeamPerformanceBonus']);
    Route::post('/users/process-team-performance-bonus', [UserController::class, 'processTeamPerformanceBonus']);
    Route::get('/users/team-performance-bonuses', [UserController::class, 'getTeamPerformanceBonuses']);

    // KYC routes
    Route::get('/kyc', [KycController::class, 'index']);
    Route::get('/kyc/show', [KycController::class, 'show']);
    Route::get('/kyc/user', [KycController::class, 'showByUser']);
    Route::post('/kyc/store', [KycController::class, 'store']);
    Route::post('/kyc/update', [KycController::class, 'update']);
    Route::post('/kyc/delete', [KycController::class, 'destroy']);
    Route::post('/kyc/status', [KycController::class, 'updateStatus']);

    // Event routes
    Route::post('/events/store', [EventController::class, 'store']);
    Route::get('/events/show', [EventController::class, 'show']);
    Route::post('/events/update', [EventController::class, 'update']);
    Route::post('/events/delete', [EventController::class, 'destroy']);
    Route::post('/events/join', [EventController::class, 'joinEvent']);
    Route::post('/events/leave', [EventController::class, 'leaveEvent']);

    // Training routes
    Route::post('/trainings/store', [TrainingController::class, 'store']);

    Route::post('/trainings/update', [TrainingController::class, 'update']);
    Route::post('/trainings/delete', [TrainingController::class, 'destroy']);
    Route::post('/trainings/join', [TrainingController::class, 'joinTraining']);
    Route::post('/trainings/leave', [TrainingController::class, 'leaveTraining']);

    // Product routes
    Route::post('/products/store', [ProductController::class, 'store']);
    Route::post('/products/update', [ProductController::class, 'update']);
    Route::post('/products/delete', [ProductController::class, 'destroy']);

    // Order routes
    Route::get('/orders', action: [OrderController::class, 'index']);
    Route::post('/orders/store', [OrderController::class, 'store']);
    Route::get('/orders/show', [OrderController::class, 'show']);
    Route::post('/orders/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/refund', [OrderController::class, 'refund']);

    // Role routes
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles/store', [RoleController::class, 'store']);
    Route::get('/roles/show', [RoleController::class, 'show']);
    Route::post('/roles/update', [RoleController::class, 'update']);
    Route::post('/roles/delete', [RoleController::class, 'destroy']);

    // BV History routes
    Route::get('/bv-history', [BvHistoryController::class, 'index']);
    Route::get('/bv-history/show', [BvHistoryController::class, 'show']);
    Route::get('/bv-history/credited', [BvHistoryController::class, 'showCredited']);

    // Wallet Transaction routes
    Route::get('/wallet-transactions', [WalletTransactionController::class, 'index']);
    Route::post('/wallet-transactions/store', [WalletTransactionController::class, 'store']);
    Route::post('/wallet-transactions/approve', [WalletTransactionController::class, 'approve']);
    Route::get('/wallet-history', [WalletTransactionController::class, 'walletHistory']);
    Route::post('/wallet-debit', [WalletTransactionController::class, 'debitWallet']);

    // Grievance routes
    Route::get('/grievances', [GrievanceController::class, 'index']);
    Route::post('/grievances/store', [GrievanceController::class, 'store']);
    Route::get('/grievances/show', [GrievanceController::class, 'show']);
    Route::post('/grievances/update', [GrievanceController::class, 'update']);
    Route::post('/grievances/status', [GrievanceController::class, 'updateStatus']);
    Route::post('/grievances/delete', [GrievanceController::class, 'destroy']);

    // Contact routes (admin only)
    Route::get('/contacts', [ContactController::class, 'index']);

    // Dashboard routes
    Route::get('/admin/dashboard', [DashboardController::class, 'getAdminDashboardData']);
    Route::get('/admin/charts/monthly-sales', [DashboardController::class, 'getMonthlySalesOverview']);
    Route::get('/admin/charts/user-growth', [DashboardController::class, 'getUserGrowthTrend']);
    Route::get('/admin/charts/user-distribution', [DashboardController::class, 'getUserDistribution']);
    Route::get('/admin/charts/orders-sales-trend', [DashboardController::class, 'getOrdersSalesTrend']);
    Route::get('/admin/recent-joins', [DashboardController::class, 'getRecentJoins']);
    Route::get('/admin/recent-orders', [DashboardController::class, 'getRecentOrders']);
    Route::get('/user/comprehensive-dashboard', [DashboardController::class, 'getComprehensiveUserDashboard']);
    Route::get('/user/monthly-growth', [DashboardController::class, 'getUserMonthlyGrowth']);
    Route::get('/user/bonus-breakdown', [DashboardController::class, 'getUserBonusBreakdown']);

    // State routes
    Route::post('/states/store', [StateController::class, 'store']);
    Route::get('/states/show', [StateController::class, 'show']);
    Route::post('/states/update', [StateController::class, 'update']);
    Route::post('/states/delete', [StateController::class, 'destroy']);

    // District routes
    Route::post('/districts/store', [DistrictController::class, 'store']);
    Route::get('/districts/show', [DistrictController::class, 'show']);
    Route::post('/districts/update', [DistrictController::class, 'update']);
    Route::post('/districts/delete', [DistrictController::class, 'destroy']);
});

