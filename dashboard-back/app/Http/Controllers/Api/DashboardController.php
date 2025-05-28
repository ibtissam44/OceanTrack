<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zone;
use App\Models\Alert;
use App\Models\WeatherData;
use App\Models\ActivityLog;

class DashboardController extends Controller
{
    public function zones()
{
    $zones = Zone::with('species')->get();  

    return response()->json($zones);
}
    public function stats()
    {
        return response()->json([
            'allowedZones' => Zone::where('status', 'allowed')->count(),
            'forbiddenZones' => Zone::where('status', 'forbidden')->count(),
            'activeAlerts' => Alert::where('is_active', true)->count(),
        ]);
    }

    public function chartData()
    {
        $data = ActivityLog::orderBy('date')->get(['date', 'value']);
        return response()->json($data);
    }

    public function weatherSummary()
    {
        $latest = WeatherData::latest()->first();

        return response()->json([
            'summary' => $latest ? $latest->summary : 'Aucune donnée météo disponible pour le moment.',
        ]);
    }
}
