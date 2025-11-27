<?php

namespace App\Http\Controllers;

use App\Models\Grievance;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class GrievanceController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Grievance::with('user');
            
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('user_id') && $request->user_id !== '') {
                $query->where('user_id', $request->user_id);
            }
            
            $perPage = $request->get('per_page', 20);
            $grievances = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'grievances' => $grievances
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'GRIEVANCES_FETCH_ERROR',
                'message' => 'Failed to fetch grievances',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'subject' => 'required|string|max:255',
                'description' => 'required|string',
                'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            $data = [
                'grievance_id' => $this->generateGrievanceId(),
                'user_id' => $request->user()->user_id,
                'subject' => $request->subject,
                'description' => $request->description,
            ];

            if ($request->hasFile('attachment')) {
                $data['attachment'] = $this->uploadAttachment($request->file('attachment'));
            }

            $grievance = Grievance::create($data);

            return response()->json([
                'success' => true,
                'grievance' => $grievance,
                'message' => 'Grievance submitted successfully'
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
                'error_type' => 'GRIEVANCE_CREATE_ERROR',
                'message' => 'Failed to create grievance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:grievances,id']);
            
            $grievance = Grievance::with('user')->findOrFail($request->id);

            return response()->json([
                'success' => true,
                'grievance' => $grievance
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
                'error_type' => 'GRIEVANCE_FETCH_ERROR',
                'message' => 'Failed to fetch grievance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:grievances,id',
                'subject' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            $grievance = Grievance::findOrFail($request->id);
            
            $data = $request->only(['subject', 'description']);
            
            if ($request->hasFile('attachment')) {
                $data['attachment'] = $this->uploadAttachment($request->file('attachment'));
            }

            $grievance->update($data);

            return response()->json([
                'success' => true,
                'grievance' => $grievance,
                'message' => 'Grievance updated successfully'
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
                'error_type' => 'GRIEVANCE_UPDATE_ERROR',
                'message' => 'Failed to update grievance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:grievances,id',
                'status' => 'required|in:pending,in_progress,resolved,rejected'
            ]);

            $grievance = Grievance::findOrFail($request->id);
            $grievance->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'grievance' => $grievance,
                'message' => 'Grievance status updated successfully'
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
                'error_type' => 'GRIEVANCE_STATUS_UPDATE_ERROR',
                'message' => 'Failed to update grievance status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:grievances,id']);
            
            Grievance::findOrFail($request->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Grievance deleted successfully'
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
                'error_type' => 'GRIEVANCE_DELETE_ERROR',
                'message' => 'Failed to delete grievance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateGrievanceId()
    {
        $prefix = 'GRV';
        $timestamp = date('YmdHis');
        $random = strtoupper(substr(uniqid(), -4));
        return $prefix . $timestamp . $random;
    }

    private function uploadAttachment($file)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/grievances/" . $fileName;
        $file->move(public_path("uploads/grievances"), $fileName);
        return $path;
    }
}