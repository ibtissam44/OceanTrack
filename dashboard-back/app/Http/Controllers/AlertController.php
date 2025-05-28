<?php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alert;

class AlertController extends Controller
{
    // 🟢 عرض كل التنبيهات
    public function index()
    {
        $alerts = Alert::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $alerts
        ]);
    }

    // 🟢 إنشاء تنبيه جديد
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $alert = Alert::create([
            'title' => $request->title,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alerte créée avec succès',
            'data' => $alert
        ]);
    }

    // 🔴 حذف تنبيه
    public function destroy($id)
    {
        $alert = Alert::findOrFail($id);
        $alert->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alerte supprimée'
        ]);
    }
}

