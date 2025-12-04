<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use Illuminate\Http\Request;
use Exception;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png,gif|max:10240',
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000'
            ]);

            $file = $request->file('file');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $filePath = 'uploads/' . $fileName;
            
            // Get file info before moving
            $originalName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();
            $fileType = $file->getClientOriginalExtension();
            
            $file->move(public_path('uploads'), $fileName);

            $upload = Upload::create([
                'original_name' => $originalName,
                'name' => $request->name,
                'description' => $request->description,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $fileType,
                'file_size' => $fileSize,
                'mime_type' => $mimeType
            ]);

            return response()->json([
                'success' => true,
                'upload' => $upload,
                'url' => url($filePath)
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $uploads = Upload::orderBy('created_at', 'desc')->paginate(20);
            return response()->json([
                'success' => true,
                'uploads' => $uploads
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch uploads',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:uploads,id']);
            
            $upload = Upload::findOrFail($request->id);
            
            if (file_exists(public_path($upload->file_path))) {
                unlink(public_path($upload->file_path));
            }
            
            $upload->delete();

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete file',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}