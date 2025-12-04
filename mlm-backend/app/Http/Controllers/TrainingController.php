<?php

namespace App\Http\Controllers;

use App\Models\Training;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class TrainingController extends Controller
{
    public function index()
    {
        try {
            $trainings = Training::with(['participants' => function($query) {
                $query->select('users.id', 'users.user_id', 'users.name', 'users.email', 'users.phone');
            }])->get();
            return response()->json([
                'success' => true,
                'trainings' => $trainings
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_FETCH_ERROR',
                'message' => 'Failed to fetch trainings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'date' => 'required|date',
                'time' => 'required|date_format:H:i',
                'topic' => 'required|string|max:255',
                'trainer' => 'required|string|max:255',
                'venue' => 'required|string|max:255',
                'duration' => 'required|string|max:255',
                'description' => 'required|string',
                'course_fee' => 'nullable|numeric|min:0',
                'syllabus' => 'nullable|array',
                'level' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $data = $request->except(['image']);
            
            if ($request->hasFile('image')) {
                $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path('uploads/trainings'), $fileName);
                $data['image'] = 'uploads/trainings/' . $fileName;
            }

            $training = Training::create($data);

            return response()->json([
                'success' => true,
                'training' => $training,
                'message' => 'Training created successfully'
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
                'error_type' => 'TRAINING_CREATE_ERROR',
                'message' => 'Failed to create training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:trainings,id']);
            $training = Training::with('participants')->findOrFail($request->id);
            return response()->json([
                'success' => true,
                'training' => $training
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
                'error_type' => 'TRAINING_NOT_FOUND',
                'message' => 'Training not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_FETCH_ERROR',
                'message' => 'Failed to fetch training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showById($id)
    {
        try {
            $training = Training::with('participants')->findOrFail($id);
            return response()->json([
                'success' => true,
                'training' => $training
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_NOT_FOUND',
                'message' => 'Training not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_FETCH_ERROR',
                'message' => 'Failed to fetch training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:trainings,id',
                'date' => 'date',
                'time' => 'date_format:H:i',
                'topic' => 'string|max:255',
                'trainer' => 'string|max:255',
                'venue' => 'string|max:255',
                'duration' => 'string|max:255',
                'description' => 'string',
                'course_fee' => 'nullable|numeric|min:0',
                'syllabus' => 'nullable|array',
                'level' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $training = Training::findOrFail($request->id);
            $data = $request->except(['id', 'image']);
            
            if ($request->hasFile('image')) {
                $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path('uploads/trainings'), $fileName);
                $data['image'] = 'uploads/trainings/' . $fileName;
            }
            
            $training->update($data);

            return response()->json([
                'success' => true,
                'training' => $training,
                'message' => 'Training updated successfully'
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
                'error_type' => 'TRAINING_NOT_FOUND',
                'message' => 'Training not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_UPDATE_ERROR',
                'message' => 'Failed to update training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:trainings,id']);
            
            Training::findOrFail($request->id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Training deleted successfully'
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
                'error_type' => 'TRAINING_NOT_FOUND',
                'message' => 'Training not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_DELETE_ERROR',
                'message' => 'Failed to delete training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function joinTraining(Request $request)
    {
        try {
            $request->validate(['training_id' => 'required|exists:trainings,id']);
            
            $training = Training::findOrFail($request->training_id);
            $user = $request->user();
            
            if ($training->participants()->where('training_participants.user_id', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'ALREADY_JOINED',
                    'message' => 'You have already joined this training'
                ], 422);
            }
            
            $training->participants()->attach($user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the training'
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
                'error_type' => 'TRAINING_NOT_FOUND',
                'message' => 'Training not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRAINING_JOIN_ERROR',
                'message' => 'Failed to join training',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function leaveTraining(Request $request)
    {
        try {
            $request->validate(['training_id' => 'required|exists:trainings,id']);
            
            $training = Training::findOrFail($request->training_id);
            $user = $request->user();
            
            $training->participants()->detach($user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully left the training'
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
                'error_type' => 'TRAINING_LEAVE_ERROR',
                'message' => 'Failed to leave training',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}