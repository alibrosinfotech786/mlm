<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::query();
            
            if ($request->has('stock') && $request->stock !== '') {
                if ($request->stock === 'true' || $request->stock === '1') {
                    $query->where('stock', true);
                } elseif ($request->stock === 'false' || $request->stock === '0') {
                    $query->where('stock', false);
                }
            }
            
            if ($request->has('category') && $request->category !== '') {
                $query->where('category', $request->category);
            }
            
            $products = $query->get();
            
            return response()->json([
                'success' => true,
                'products' => $products
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'PRODUCTS_FETCH_ERROR',
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'nullable|string|max:255',
                'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
                'mrp' => 'required|numeric|min:0',
                'bv' => 'required|numeric|min:0',
                'stock' => 'required|in:true,false,1,0',
                'description' => 'nullable|string',
                'ingredients' => 'nullable|string',
                'benefits' => 'nullable|string',
            ]);

            $data = $request->only(['name', 'category', 'mrp', 'bv', 'description', 'ingredients', 'benefits']);
            $data['stock'] = filter_var($request->stock, FILTER_VALIDATE_BOOLEAN);
            
            if ($request->hasFile('image')) {
                $data['image'] = $this->uploadProductImage($request->file('image'));
            }

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'product' => $product,
                'message' => 'Product created successfully'
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
                'error_type' => 'PRODUCT_CREATE_ERROR',
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:products,id']);
            $product = Product::findOrFail($request->id);
            
            return response()->json([
                'success' => true,
                'product' => $product
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
                'error_type' => 'PRODUCT_NOT_FOUND',
                'message' => 'Product not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'PRODUCT_FETCH_ERROR',
                'message' => 'Failed to fetch product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:products,id',
                'name' => 'string|max:255',
                'category' => 'nullable|string|max:255',
                'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
                'mrp' => 'numeric|min:0',
                'bv' => 'numeric|min:0',
                'stock' => 'boolean',
                'description' => 'nullable|string',
                'ingredients' => 'nullable|string',
                'benefits' => 'nullable|string',
            ]);

            $product = Product::findOrFail($request->id);
            $data = $request->only(['name', 'category', 'mrp', 'bv', 'stock', 'description', 'ingredients', 'benefits']);
            
            if ($request->hasFile('image')) {
                $data['image'] = $this->uploadProductImage($request->file('image'));
            }

            $product->update($data);

            return response()->json([
                'success' => true,
                'product' => $product,
                'message' => 'Product updated successfully'
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
                'error_type' => 'PRODUCT_NOT_FOUND',
                'message' => 'Product not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'PRODUCT_UPDATE_ERROR',
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:products,id']);
            Product::findOrFail($request->id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
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
                'error_type' => 'PRODUCT_NOT_FOUND',
                'message' => 'Product not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'PRODUCT_DELETE_ERROR',
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function uploadProductImage($file)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/products/" . $fileName;
        $file->move(public_path("uploads/products"), $fileName);
        return $path;
    }
}