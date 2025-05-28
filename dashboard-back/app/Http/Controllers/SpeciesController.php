<?php

namespace App\Http\Controllers;

use App\Models\Species;
use Illuminate\Http\Request;

class SpeciesController extends Controller
{
    // ✅ جلب كل الأنواع
    public function index()
    {
        return response()->json(Species::all(), 200);
    }

    // ✅ إنشاء نوع جديد


public function store(Request $request)
{
    $validated = $request->validate([
        'scientific_name' => 'required|string|max:255',
        'local_name' => 'nullable|string|max:255',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // تأكد من أن الملف صورة ولا يتجاوز 2MB
        'status' => 'required|in:available,fishing_banned,rare',
        'biological_rest_start' => 'required|date',
        'biological_rest_end' => 'required|date|after_or_equal:biological_rest_start',
        'notes' => 'nullable|string',
        'quantity' => 'required|integer|min:0',
        'found_location' => 'nullable|string',
        'latitude' => 'nullable|numeric|between:-90,90',
        'longitude' => 'nullable|numeric|between:-180,180',
    ]);

    // معالجة رفع الصورة إذا وُجِدت
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('species_images', 'public'); // سيتم الحفظ في storage/app/public/species_images
        $validated['image_path'] = $imagePath; // تخزين المسار في قاعدة البيانات
    }

    $species = Species::create($validated);

    return response()->json($species, 201);
}

    // ✅ عرض نوع واحد
    public function show($id)
    {
        $species = Species::find($id);

        if (!$species) {
            return response()->json(['message' => 'Species not found'], 404);
        }

        return response()->json($species);
    }

    // ✅ تحديث نوع
    public function update(Request $request, $id)
    {
        $species = Species::find($id);

        if (!$species) {
            return response()->json(['message' => 'Species not found'], 404);
        }

        $validated = $request->validate([
            'scientific_name' => 'sometimes|required|string|max:255',
            'local_name' => 'nullable|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:available,fishing_banned,rare',
            'biological_rest_start' => 'sometimes|required|date',
            'biological_rest_end' => 'sometimes|required|date|after_or_equal:biological_rest_start',
            'notes' => 'nullable|string',
            'quantity' => 'sometimes|required|integer|min:0',
            'found_location' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $species->update($validated);

        return response()->json($species);
    }

    // ✅ حذف نوع
    public function destroy($id)
    {
        $species = Species::find($id);

        if (!$species) {
            return response()->json(['message' => 'Species not found'], 404);
        }

        $species->delete();

        return response()->json(['message' => 'Species deleted successfully']);
    }

    public function statistics()
{
    $currentDate = now()->format('Y-m-d');
    
    $total = Species::count();
    $available = Species::where('status', 'available')->count();
    $fishingBanned = Species::where('status', 'fishing_banned')->count();
    $rare = Species::where('status', 'rare')->count();
    
    // حساب الأسماك في الراحة البيولوجية (حتى لو حالتها available)
    $inBiologicalRest = Species::whereDate('biological_rest_start', '<=', $currentDate)
                             ->whereDate('biological_rest_end', '>=', $currentDate)
                             ->count();

    $totalQuantity = Species::sum('quantity');

    $quantityByType = Species::select('scientific_name as name', 'local_name')
                           ->selectRaw('SUM(quantity) as quantity')
                           ->groupBy('scientific_name', 'local_name')
                           ->get()
                           ->map(function ($item) {
                               return [
                                   'name' => $item->local_name ?: $item->name,
                                   'quantity' => $item->quantity
                               ];
                           });

    $recentSpecies = Species::latest()
                          ->take(5)
                          ->get(['scientific_name', 'local_name', 'quantity', 'status', 'created_at'])
                          ->map(function ($item) {
                              return [
                                  'name' => $item->local_name ?: $item->scientific_name,
                                  'quantity' => $item->quantity,
                                  'status' => $item->status,
                                  'created_at' => $item->created_at
                              ];
                          });

    return response()->json([
        'total' => $total,
        'available' => $available,
        'fishing_banned' => $fishingBanned,
        'rare' => $rare,
        'in_biological_rest' => $inBiologicalRest,
        'totalQuantity' => $totalQuantity,
        'quantityByType' => $quantityByType,
        'recentSpecies' => $recentSpecies,
    ]);
}


}
