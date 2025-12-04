<?php

namespace App\Http\Controllers;

use App\Models\BvHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;

class BvHistoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = BvHistory::with('user');
            $histories = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'histories' => $histories
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'BV_HISTORY_FETCH_ERROR',
                'message' => 'Failed to fetch BV history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function show(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $perPage = $request->get('per_page', 20);
            
            $histories = BvHistory::with('user')
                ->where('user_id', $request->user_id)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $user = User::where('user_id', $request->user_id)->first();
            $totalBv = $user ? $user->bv : 0;

            return response()->json([
                'success' => true,
                'total_bv' => $totalBv,
                'histories' => $histories
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'BV_HISTORY_FETCH_ERROR',
                'message' => 'Failed to fetch BV history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showCredited(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);
            
            $perPage = $request->get('per_page', 20);
            
            $histories = BvHistory::with(['user', 'referenceUser' => function($query) {
                    $query->select('user_id', 'name');
                }])
                ->where('user_id', $request->user_id)
                ->where('bv_change', '>', 0)
                ->whereNotNull('reference_id')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $totalCreditedBv = BvHistory::where('user_id', $request->user_id)
                ->where('bv_change', '>', 0)
                ->whereNotNull('reference_id')
                ->sum('bv_change');

            return response()->json([
                'success' => true,
                'total_credited_bv' => $totalCreditedBv,
                'histories' => $histories
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'BV_HISTORY_FETCH_ERROR',
                'message' => 'Failed to fetch credited BV history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}