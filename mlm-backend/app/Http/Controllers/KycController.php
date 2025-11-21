<?php

namespace App\Http\Controllers;

use App\Models\KycDetail;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class KycController extends Controller
{
    public function index()
    {
        try {
            $kycDetails = KycDetail::with('user')->get();
            return response()->json([
                'success' => true,
                'kyc_details' => $kycDetails
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'KYC_FETCH_ERROR',
                'message' => 'Failed to fetch KYC details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id|unique:kyc_details,user_id',
                'full_name' => 'required|string|max:255',
                'dob' => 'required|date',
                'pan_number' => 'required|string|max:10',
                'aadhar_number' => 'required|string|max:12',
                'account_holder_name' => 'required|string|max:255',
                'bank_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:20',
                'ifsc_code' => 'required|string|max:11',
                'branch_name' => 'required|string|max:255',
                'aadhar_front' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'aadhar_back' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'pan_card' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'cancelled_cheque' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            $data = $request->except(['aadhar_front', 'aadhar_back', 'pan_card', 'cancelled_cheque']);

            // Handle file uploads
            if ($request->hasFile('aadhar_front')) {
                $data['aadhar_front_path'] = $this->uploadFile($request->file('aadhar_front'), 'aadhar');
            }
            if ($request->hasFile('aadhar_back')) {
                $data['aadhar_back_path'] = $this->uploadFile($request->file('aadhar_back'), 'aadhar');
            }
            if ($request->hasFile('pan_card')) {
                $data['pan_card_path'] = $this->uploadFile($request->file('pan_card'), 'pan');
            }
            if ($request->hasFile('cancelled_cheque')) {
                $data['cancelled_cheque_path'] = $this->uploadFile($request->file('cancelled_cheque'), 'cheque');
            }

            $kyc = KycDetail::create($data);

            return response()->json([
                'success' => true,
                'kyc_detail' => $kyc,
                'message' => 'KYC detail created successfully'
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
                'error_type' => 'KYC_CREATE_ERROR',
                'message' => 'Failed to create KYC detail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:kyc_details,id',
                'full_name' => 'string|max:255',
                'dob' => 'date',
                'pan_number' => 'string|max:10',
                'aadhar_number' => 'string|max:12',
                'account_holder_name' => 'string|max:255',
                'bank_name' => 'string|max:255',
                'account_num    ber' => 'string|max:20',
                'ifsc_code' => 'string|max:11',
                'branch_name' => 'string|max:255',
                // 'aadhar_front' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                // 'aadhar_back' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                // 'pan_card' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                // 'cancelled_cheque' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
                'status' => 'in:pending,approved,rejected',
            ]);

            $kyc = KycDetail::findOrFail($request->id);
            $data = $request->except(['id', 'aadhar_front', 'aadhar_back', 'pan_card', 'cancelled_cheque']);

            // Handle file uploads
            if ($request->hasFile('aadhar_front')) {
                $data['aadhar_front_path'] = $this->uploadFile($request->file('aadhar_front'), 'aadhar');
            }
            if ($request->hasFile('aadhar_back')) {
                $data['aadhar_back_path'] = $this->uploadFile($request->file('aadhar_back'), 'aadhar');
            }
            if ($request->hasFile('pan_card')) {
                $data['pan_card_path'] = $this->uploadFile($request->file('pan_card'), 'pan');
            }
            if ($request->hasFile('cancelled_cheque')) {
                $data['cancelled_cheque_path'] = $this->uploadFile($request->file('cancelled_cheque'), 'cheque');
            }

            $kyc->update($data);
            return response()->json([
                'success' => true,
                'kyc_detail' => $kyc,
                'message' => 'KYC detail updated successfully'
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
                'error_type' => 'KYC_NOT_FOUND',
                'message' => 'KYC detail not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'KYC_UPDATE_ERROR',
                'message' => 'Failed to update KYC detail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:kyc_details,id']);
            KycDetail::findOrFail($request->id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'KYC detail deleted successfully'
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
                'error_type' => 'KYC_NOT_FOUND',
                'message' => 'KYC detail not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'KYC_DELETE_ERROR',
                'message' => 'Failed to delete KYC detail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:kyc_details,id',
                'status' => 'required|in:pending,approved,rejected',
            ]);

            $kyc = KycDetail::findOrFail($request->id);
            $kyc->update(['status' => $request->status]);
            return response()->json([
                'success' => true,
                'kyc_detail' => $kyc,
                'message' => 'KYC status updated successfully'
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
                'error_type' => 'KYC_NOT_FOUND',
                'message' => 'KYC detail not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'KYC_STATUS_UPDATE_ERROR',
                'message' => 'Failed to update KYC status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:kyc_details,id']);
            $kyc = KycDetail::with('user')->findOrFail($request->id);
            return response()->json([
                'success' => true,
                'kyc_detail' => $kyc
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
                'error_type' => 'KYC_NOT_FOUND',
                'message' => 'KYC detail not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'KYC_FETCH_ERROR',
                'message' => 'Failed to fetch KYC detail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByUser(Request $request)
    {
        try {
            $request->validate(['user_id' => 'required|exists:users,id']);
            $kyc = KycDetail::where('user_id', $request->user_id)->first();
            
            if (!$kyc) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'KYC_NOT_FOUND',
                    'message' => 'KYC detail not found for this user'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'kyc_detail' => $kyc
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
                'error_type' => 'KYC_FETCH_ERROR',
                'message' => 'Failed to fetch KYC detail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function uploadFile($file, $folder)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/kyc/{$folder}/" . $fileName;
        $file->move(public_path("uploads/kyc/{$folder}"), $fileName);
        return $path;
    }
}