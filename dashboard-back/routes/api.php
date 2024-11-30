<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('forgot-password', [AuthController::class, 'sendResetLink']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);



Route::put('user/update', [UserController::class, 'updateUser'])->middleware('auth:sanctum');
Route::post('user/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');

Route::apiResource('products', ProductController::class);