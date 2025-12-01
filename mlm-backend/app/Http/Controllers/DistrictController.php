<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    public function index(Request $request)
    {
        $query = District::with('state')->where('status', true);
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%')
                  ->orWhereHas('state', function($sq) use ($search) {
                      $sq->where('name', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $districts = $query->paginate($perPage);
        
        return response()->json(['success' => true, 'data' => $districts]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:districts,code,NULL,id,state_id,' . $request->state_id,
            'state_id' => 'required|exists:states,id'
        ]);

        $district = District::create($request->all());
        $district->load('state');
        return response()->json(['success' => true, 'data' => $district], 201);
    }

    public function show(Request $request)
    {
        $id = $request->input('id');
        $district = District::with('state')->find($id);
        
        if (!$district) {
            return response()->json(['success' => false, 'message' => 'District not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $district]);
    }

    public function update(Request $request)
    {
        $id = $request->input('id');
        $district = District::find($id);

        if (!$district) {
            return response()->json(['success' => false, 'message' => 'District not found'], 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|max:10|unique:districts,code,' . $id . ',id,state_id,' . ($request->state_id ?? $district->state_id),
            'state_id' => 'exists:states,id'
        ]);

        $district->update($request->all());
        $district->load('state');
        return response()->json(['success' => true, 'data' => $district]);
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $district = District::find($id);

        if (!$district) {
            return response()->json(['success' => false, 'message' => 'District not found'], 404);
        }

        $district->delete();
        return response()->json(['success' => true, 'message' => 'District deleted successfully']);
    }

    public function getByState(Request $request)
    {
        $stateId = $request->input('state_id');
        $query = District::where('state_id', $stateId)->where('status', true);
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%');
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $districts = $query->paginate($perPage);
        
        return response()->json(['success' => true, 'data' => $districts]);
    }
}