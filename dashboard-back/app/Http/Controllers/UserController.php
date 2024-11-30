<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
   
    public function getUser(Request $request)
    {
        return response()->json(Auth::user(), 200);
    }

  
    public function updateUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        $user = Auth::user();
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Informations mises à jour avec succès !', 'user' => $user], 200);
    }

  
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|confirmed',
        ]);

        $user = Auth::user();


        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 400);
        }


        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès !'], 200);
    }
}
