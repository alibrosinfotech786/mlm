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

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes for testing
Route::get('/users/show', [UserController::class, 'showByUserId']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/trainings', [TrainingController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/show', [ProductController::class, 'show']);

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
    Route::get('/users/mlm-hierarchy-list', [UserController::class, 'getMlmHierarchyList']);
    Route::get('/users/sponsored-users', [UserController::class, 'getSponsoredUsers']);
    Route::get('/users/level-bonus', [UserController::class, 'calculateLevelBonus']);
    Route::post('/users/process-level-bonus', [UserController::class, 'processLevelBonus']);
    Route::get('/users/mlm-structure', [UserController::class, 'getMlmStructure']);
    Route::get('/users/available-positions', [UserController::class, 'getAvailablePosition']);

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
    Route::get('/trainings/show', [TrainingController::class, 'show']);
    Route::post('/trainings/update', [TrainingController::class, 'update']);
    Route::post('/trainings/delete', [TrainingController::class, 'destroy']);
    Route::post('/trainings/join', [TrainingController::class, 'joinTraining']);
    Route::post('/trainings/leave', [TrainingController::class, 'leaveTraining']);
    
    // Product routes
    Route::post('/products/store', [ProductController::class, 'store']);
    Route::post('/products/update', [ProductController::class, 'update']);
    Route::post('/products/delete', [ProductController::class, 'destroy']);
    
    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/store', [OrderController::class, 'store']);
    Route::get('/orders/show', [OrderController::class, 'show']);
    Route::post('/orders/status', [OrderController::class, 'updateStatus']);
    
    // Role routes
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles/store', [RoleController::class, 'store']);
    Route::get('/roles/show', [RoleController::class, 'show']);
    Route::post('/roles/update', [RoleController::class, 'update']);
    Route::post('/roles/delete', [RoleController::class, 'destroy']);
    
    // BV History routes
    Route::get('/bv-history', [BvHistoryController::class, 'index']);
    Route::get('/bv-history/show', [BvHistoryController::class, 'show']);
    
    // Wallet Transaction routes
    Route::get('/wallet-transactions', [WalletTransactionController::class, 'index']);
    Route::post('/wallet-transactions/store', [WalletTransactionController::class, 'store']);
    Route::post('/wallet-transactions/approve', [WalletTransactionController::class, 'approve']);
    Route::get('/wallet-history', [WalletTransactionController::class, 'walletHistory']);
    Route::post('/wallet-debit', [WalletTransactionController::class, 'debitWallet']);
});

