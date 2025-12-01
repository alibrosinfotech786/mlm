<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index(Request $request)
    {
        $query = State::with('districts')->where('status', true);
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%');
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $states = $query->paginate($perPage);
        
        return response()->json(['success' => true, 'data' => $states]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:states'
        ]);

        $state = State::create($request->all());
        return response()->json(['success' => true, 'data' => $state], 201);
    }

    public function show(Request $request)
    {
        $id = $request->input('id');
        $state = State::with('districts')->find($id);
        
        if (!$state) {
            return response()->json(['success' => false, 'message' => 'State not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $state]);
    }

    public function update(Request $request)
    {
        $id = $request->input('id');
        $state = State::find($id);

        if (!$state) {
            return response()->json(['success' => false, 'message' => 'State not found'], 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|max:10|unique:states,code,' . $id
        ]);

        $state->update($request->all());
        return response()->json(['success' => true, 'data' => $state]);
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $state = State::find($id);

        if (!$state) {
            return response()->json(['success' => false, 'message' => 'State not found'], 404);
        }

        $state->delete();
        return response()->json(['success' => true, 'message' => 'State deleted successfully']);
    }
}