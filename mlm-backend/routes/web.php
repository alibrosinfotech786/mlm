<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// File access route
Route::get('/uploads/{folder}/{subfolder}/{filename}', function ($folder, $subfolder, $filename) {
    $path = public_path("uploads/{$folder}/{$subfolder}/{$filename}");
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
})->where(['folder' => '[a-zA-Z0-9_-]+', 'subfolder' => '[a-zA-Z0-9_-]+', 'filename' => '[a-zA-Z0-9._-]+']);
