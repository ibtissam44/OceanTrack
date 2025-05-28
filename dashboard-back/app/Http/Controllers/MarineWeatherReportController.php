<?php

namespace App\Http\Controllers;

use App\Models\MarineWeatherReport;
use Illuminate\Http\Request;

class MarineWeatherReportController extends Controller
{
    // ✅ عرض كل بيانات الطقس
    public function index()
    {
        return MarineWeatherReport::all();
    }

    // ✅ إضافة تقرير جديد
    public function store(Request $request)
    {
        $data = $request->validate([
            'region' => 'required|string',
            'date' => 'required|date',
            'temperature' => 'required|numeric',
            'wind_speed' => 'required|numeric',
            'wind_direction' => 'required|string',
            'rain_probability' => 'required|numeric',
            'wave_height' => 'required|numeric',
            'wave_danger' => 'required|string',
        ]);

        return MarineWeatherReport::create($data);
    }

    // ✅ تحديث تقرير
    public function update(Request $request, MarineWeatherReport $marineWeatherReport)
    {
        $data = $request->validate([
            'region' => 'sometimes|string',
            'date' => 'sometimes|date',
            'temperature' => 'sometimes|numeric',
            'wind_speed' => 'sometimes|numeric',
            'wind_direction' => 'sometimes|string',
            'rain_probability' => 'sometimes|numeric',
            'wave_height' => 'sometimes|numeric',
            'wave_danger' => 'sometimes|string',
        ]);

        $marineWeatherReport->update($data);
        return $marineWeatherReport;
    }

    // ✅ حذف تقرير
    public function destroy(MarineWeatherReport $marineWeatherReport)
    {
        $marineWeatherReport->delete();
        return response()->json(['message' => 'Supprimé avec succès']);
    }
}
