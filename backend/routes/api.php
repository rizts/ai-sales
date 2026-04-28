<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/pages', [\App\Http\Controllers\SalesPageController::class, 'index']);
    Route::post('/pages', [\App\Http\Controllers\SalesPageController::class, 'store']);
    Route::get('/pages/{id}', [\App\Http\Controllers\SalesPageController::class, 'show']);
    Route::delete('/pages/{id}', [\App\Http\Controllers\SalesPageController::class, 'destroy']);
    Route::post('/pages/{id}/regenerate', [\App\Http\Controllers\SalesPageController::class, 'regenerate']);
});
