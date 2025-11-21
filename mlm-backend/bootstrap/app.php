<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'VALIDATION_ERROR',
                        'message' => 'Validation failed',
                        'errors' => $e->errors()
                    ], 422);
                }
                
                if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'RESOURCE_NOT_FOUND',
                        'message' => 'Resource not found'
                    ], 404);
                }
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'ROUTE_NOT_FOUND',
                        'message' => 'Route not found'
                    ], 404);
                }
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'METHOD_NOT_ALLOWED',
                        'message' => 'Method not allowed'
                    ], 405);
                }
                
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json([
                        'success' => false,
                        'error_type' => 'AUTHENTICATION_REQUIRED',
                        'message' => 'Authentication required'
                    ], 401);
                }
                
                return response()->json([
                    'success' => false,
                    'error_type' => 'SERVER_ERROR',
                    'message' => 'An error occurred',
                    'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
                ], $status >= 100 && $status < 600 ? $status : 500);
            }
        });
    })->create();
