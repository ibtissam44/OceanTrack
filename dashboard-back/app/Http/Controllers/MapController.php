<?php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Zone;
use App\Models\Path;

class MapController extends Controller
{
    // ✅ جلب جميع المناطق مع معلوماتها
    public function getZones()
    {
        return response()->json(Zone::with('species')->get());
    }

    // ✅ جلب المسارات الآمنة فقط بين منطقتين
    public function getSafePath(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $path = Path::where('start_zone_id', $from)
                    ->where('end_zone_id', $to)
                    ->where('is_safe', true)
                    ->first();

        if (!$path) {
            return response()->json(['message' => 'No safe path found'], 404);
        }

        return response()->json($path);
    }

    // ✅ جلب جميع المسارات الآمنة
    public function getAllSafePaths()
    {
        return response()->json(Path::where('is_safe', true)->with(['startZone', 'endZone'])->get());
    }


public function getNearestAllowedZone(Request $request)
{
    $userLat = $request->query('lat');
    $userLng = $request->query('lng');

    if (!$userLat || !$userLng) {
        return response()->json(['error' => 'Latitude and Longitude are required'], 400);
    }

    $zones = \App\Models\Zone::where('status', 'allowed')->get();

    $nearestZone = null;
    $shortestDistance = INF;

    foreach ($zones as $zone) {
        $distance = $this->haversineDistance($userLat, $userLng, $zone->latitude, $zone->longitude);

        if ($distance < $shortestDistance) {
            $shortestDistance = $distance;
            $nearestZone = $zone;
        }
    }

    return response()->json([
        'zone' => $nearestZone,
        'distance_km' => round($shortestDistance, 2)
    ]);
}




// ✅ دالة لحساب المسافة بين إحداثيين جغرافيين (Haversine Formula)
private function haversineDistance($lat1, $lon1, $lat2, $lon2)
{
    $earthRadius = 6371; // كلم

    $lat1 = deg2rad($lat1);
    $lon1 = deg2rad($lon1);
    $lat2 = deg2rad($lat2);
    $lon2 = deg2rad($lon2);

    $deltaLat = $lat2 - $lat1;
    $deltaLon = $lon2 - $lon1;

    $a = sin($deltaLat / 2) ** 2 +
        cos($lat1) * cos($lat2) *
        sin($deltaLon / 2) ** 2;

    $c = 2 * asin(sqrt($a));

    return $earthRadius * $c;
}

}

