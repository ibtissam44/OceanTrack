<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\SpeciesController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\MarineWeatherReportController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\MapController;




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



Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
Route::get('/chart-data', [DashboardController::class, 'chartData']);
Route::get('/weather-summary', [DashboardController::class, 'weatherSummary']);

Route::group(['prefix' => 'species'], function () {
    Route::get('/', [SpeciesController::class, 'index']);
    Route::post('/', [SpeciesController::class, 'store']);
     Route::get('/statistics', [SpeciesController::class, 'statistics']);
    Route::get('/{id}', [SpeciesController::class, 'show']);
    Route::put('/{id}', [SpeciesController::class, 'update']);
    Route::delete('/{id}', [SpeciesController::class, 'destroy']);
});



Route::get('/alerts', [AlertController::class, 'index']);
Route::post('/alerts', [AlertController::class, 'store']);
Route::delete('/alerts/{id}', [AlertController::class, 'destroy']);


Route::get('/marine-weather-reports', [MarineWeatherReportController::class, 'index']);
Route::get('/zones', [DashboardController::class, 'zones']);




Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
Route::get('/reports/{report}', [ReportController::class, 'show']);
Route::put('/reports/{report}', [ReportController::class, 'update']);
Route::delete('/reports/{report}', [ReportController::class, 'destroy']);


Route::get('/zones', [MapController::class, 'getZones']);
Route::get('/paths/safe', [MapController::class, 'getAllSafePaths']);
Route::get('/paths/find-safe', [MapController::class, 'getSafePath']);

Route::get('/zones/nearest-allowed', [MapController::class, 'getNearestAllowedZone']);

Route::get('/test', function() {
    return response()->json(['message' => 'API Works!']);
});