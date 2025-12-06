<?php

namespace App\Http\Controllers;

use App\Models\BvTopupRequest;
use App\Models\User;
use App\Models\BvHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class BvTopupRequestController extends Controller
{
    public function index(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'nullable|exists:users,user_id',
                'status' => 'nullable|in:pending,approved,rejected',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);

            $perPage = $request->get('per_page', 10);
            $query = BvTopupRequest::with(['user:user_id,name,email', 'approver:user_id,name'])
                ->orderBy('created_at', 'desc');

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->status) {
                $query->where('status', $request->status);
            }

            $requests = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'bv_topup_requests' => $requests
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
                'error_type' => 'BV_TOPUP_REQUESTS_FETCH_ERROR',
                'message' => 'Failed to fetch BV topup requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'bv_amount' => 'required|numeric|min:1',
                'payment_amount' => 'required|numeric|min:1',
                'payment_method' => 'nullable|string|max:255',
                'payment_reference' => 'nullable|string|max:255',
                'remark' => 'nullable|string',
                'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
            ]);

            $user = $request->user();
            $transactionId = 'BVT_' . $user->user_id . '_' . now()->format('YmdHis');

            $data = [
                'user_id' => $user->user_id,
                'bv_amount' => $request->bv_amount,
                'payment_amount' => $request->payment_amount,
                'payment_method' => $request->payment_method,
                'transaction_id' => $transactionId,
                'payment_reference' => $request->payment_reference,
                'remark' => $request->remark,
                'status' => 'pending'
            ];

            if ($request->hasFile('attachment')) {
                $data['attachment'] = $this->uploadAttachment($request->file('attachment'));
            }

            $bvTopupRequest = BvTopupRequest::create($data);

            return response()->json([
                'success' => true,
                'bv_topup_request' => $bvTopupRequest,
                'message' => 'BV topup request submitted successfully'
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
                'error_type' => 'BV_TOPUP_REQUEST_CREATE_ERROR',
                'message' => 'Failed to create BV topup request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approve(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:bv_topup_requests,id',
                'status' => 'required|in:approved,rejected',
                'rejection_reason' => 'nullable|string'
            ]);

            $bvTopupRequest = BvTopupRequest::findOrFail($request->id);

            if ($bvTopupRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'error_type' => 'INVALID_STATUS',
                    'message' => 'This request has already been processed'
                ], 400);
            }

            $user = User::where('user_id', $bvTopupRequest->user_id)->first();
            $approver = $request->user();

            if ($request->status === 'approved') {
                $previousBv = $user->bv;
                $user->increment('bv', $bvTopupRequest->bv_amount);
                $user->refresh();

                // Create BV history
                BvHistory::create([
                    'user_id' => $user->user_id,
                    'previous_bv' => $previousBv,
                    'bv_change' => $bvTopupRequest->bv_amount,
                    'new_bv' => $user->bv,
                    'type' => 'credit',
                    'reason' => 'bv_topup',
                    'reference_id' => $bvTopupRequest->transaction_id
                ]);

                $bvTopupRequest->update([
                    'status' => 'approved',
                    'approved_by' => $approver->user_id,
                    'approved_at' => now()
                ]);

                return response()->json([
                    'success' => true,
                    'bv_topup_request' => $bvTopupRequest->fresh(['user', 'approver']),
                    'message' => 'BV topup request approved and BV credited successfully'
                ]);
            } else {
                $bvTopupRequest->update([
                    'status' => 'rejected',
                    'approved_by' => $approver->user_id,
                    'approved_at' => now(),
                    'rejection_reason' => $request->rejection_reason ?? null
                ]);

                return response()->json([
                    'success' => true,
                    'bv_topup_request' => $bvTopupRequest->fresh(['user', 'approver']),
                    'message' => 'BV topup request rejected'
                ]);
            }
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
                'error_type' => 'BV_TOPUP_APPROVE_ERROR',
                'message' => 'Failed to process BV topup request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function uploadAttachment($file)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/bv_attachments/" . $fileName;
        $file->move(public_path("uploads/bv_attachments"), $fileName);
        return $path;
    }
}
