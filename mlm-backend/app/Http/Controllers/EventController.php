<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class EventController extends Controller
{
    public function index()
    {
        try {
            $events = Event::with(['participants' => function($query) {
                $query->select('users.id', 'users.user_id', 'users.name', 'users.email', 'users.phone');
            }])->get();
            return response()->json([
                'success' => true,
                'events' => $events
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_FETCH_ERROR',
                'message' => 'Failed to fetch events',
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
                'venue' => 'required|string|max:255',
                'address' => 'required|string',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'leader' => 'required|string|max:255',
                'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $data = $request->except(['image1', 'image2']);
            
            if ($request->hasFile('image1')) {
                $fileName = time() . '_1_' . $request->file('image1')->getClientOriginalName();
                $request->file('image1')->move(public_path('uploads/events'), $fileName);
                $data['image1'] = 'uploads/events/' . $fileName;
            }
            
            if ($request->hasFile('image2')) {
                $fileName = time() . '_2_' . $request->file('image2')->getClientOriginalName();
                $request->file('image2')->move(public_path('uploads/events'), $fileName);
                $data['image2'] = 'uploads/events/' . $fileName;
            }

            $event = Event::create($data);

            return response()->json([
                'success' => true,
                'event' => $event,
                'message' => 'Event created successfully'
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
                'error_type' => 'EVENT_CREATE_ERROR',
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:events,id']);
            $event = Event::with('participants')->findOrFail($request->id);
            return response()->json([
                'success' => true,
                'event' => $event
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
                'error_type' => 'EVENT_NOT_FOUND',
                'message' => 'Event not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_FETCH_ERROR',
                'message' => 'Failed to fetch event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showById($id)
    {
        try {
            $event = Event::with('participants')->findOrFail($id);
            return response()->json([
                'success' => true,
                'event' => $event
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_NOT_FOUND',
                'message' => 'Event not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_FETCH_ERROR',
                'message' => 'Failed to fetch event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function joinEvent(Request $request)
    {
        try {
            $request->validate(['event_id' => 'required|exists:events,id']);
            
            $event = Event::findOrFail($request->event_id);
            $user = $request->user();
            
            if ($event->participants()->where('event_participants.user_id', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'ALREADY_JOINED',
                    'message' => 'You have already joined this event'
                ], 422);
            }
            
            $event->participants()->attach($user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the event'
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
                'error_type' => 'EVENT_NOT_FOUND',
                'message' => 'Event not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_JOIN_ERROR',
                'message' => 'Failed to join event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function leaveEvent(Request $request)
    {
        try {
            $request->validate(['event_id' => 'required|exists:events,id']);
            
            $event = Event::findOrFail($request->event_id);
            $user = $request->user();
            
            $event->participants()->detach($user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully left the event'
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
                'error_type' => 'EVENT_LEAVE_ERROR',
                'message' => 'Failed to leave event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:events,id',
                'date' => 'date',
                'time' => 'date_format:H:i',
                'venue' => 'string|max:255',
                'address' => 'string',
                'city' => 'string|max:255',
                'state' => 'string|max:255',
                'leader' => 'string|max:255',
                'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $event = Event::findOrFail($request->id);
            $data = $request->except(['id', 'image1', 'image2']);
            
            if ($request->hasFile('image1')) {
                $fileName = time() . '_1_' . $request->file('image1')->getClientOriginalName();
                $request->file('image1')->move(public_path('uploads/events'), $fileName);
                $data['image1'] = 'uploads/events/' . $fileName;
            }
            
            if ($request->hasFile('image2')) {
                $fileName = time() . '_2_' . $request->file('image2')->getClientOriginalName();
                $request->file('image2')->move(public_path('uploads/events'), $fileName);
                $data['image2'] = 'uploads/events/' . $fileName;
            }
            
            $event->update($data);

            return response()->json([
                'success' => true,
                'event' => $event,
                'message' => 'Event updated successfully'
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
                'error_type' => 'EVENT_NOT_FOUND',
                'message' => 'Event not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_UPDATE_ERROR',
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:events,id']);
            
            Event::findOrFail($request->id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
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
                'error_type' => 'EVENT_NOT_FOUND',
                'message' => 'Event not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'EVENT_DELETE_ERROR',
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}