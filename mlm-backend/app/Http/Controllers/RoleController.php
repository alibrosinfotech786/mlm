<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::all();
            
            return response()->json([
                'success' => true,
                'roles' => $roles
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ROLES_FETCH_ERROR',
                'message' => 'Failed to fetch roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'permissions' => 'required|array',
            ]);

            $roleId = 'ROLE' . time() . rand(100, 999);

            $role = Role::create([
                'role_id' => $roleId,
                'name' => $request->name,
                'description' => $request->description,
                'permissions' => $request->permissions,
            ]);

            return response()->json([
                'success' => true,
                'role' => $role,
                'message' => 'Role created successfully'
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
                'error_type' => 'ROLE_CREATE_ERROR',
                'message' => 'Failed to create role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['role_id' => 'required|exists:roles,role_id']);
            $role = Role::where('role_id', $request->role_id)->firstOrFail();
            
            return response()->json([
                'success' => true,
                'role' => $role
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
                'error_type' => 'ROLE_NOT_FOUND',
                'message' => 'Role not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ROLE_FETCH_ERROR',
                'message' => 'Failed to fetch role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'role_id' => 'required|exists:roles,role_id',
                'name' => 'string|max:255',
                'description' => 'nullable|string',
                'permissions' => 'array',
            ]);

            $role = Role::where('role_id', $request->role_id)->firstOrFail();
            $data = $request->only(['name', 'description', 'permissions']);
            $role->update($data);

            return response()->json([
                'success' => true,
                'role' => $role,
                'message' => 'Role updated successfully'
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
                'error_type' => 'ROLE_NOT_FOUND',
                'message' => 'Role not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ROLE_UPDATE_ERROR',
                'message' => 'Failed to update role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['role_id' => 'required|exists:roles,role_id']);
            Role::where('role_id', $request->role_id)->firstOrFail()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully'
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
                'error_type' => 'ROLE_NOT_FOUND',
                'message' => 'Role not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ROLE_DELETE_ERROR',
                'message' => 'Failed to delete role',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}