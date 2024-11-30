<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Utilisateur crée avec succès!',
        ], 201);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'token' => $token,
            ]);
        }

        return response()->json([
            'message' => 'Email ou mot de passé incorrect.',
        ], 401);
    }


    public function logout(Request $request)
    {
 
        $request->user()->currentAccessToken()->delete();
    
        return response()->json(['message' => 'Déconnexion réussie'], 200);
    }
    
   
     public function sendResetLink(Request $request)
     {
         $request->validate(['email' => 'required|email']);
 
         $status = Password::sendResetLink($request->only('email'));
 
         return $status == Password::RESET_LINK_SENT
                     ? response()->json(['message' => 'Un email avec un lien de réinitialisation vous a été envoyé. Si vous ne le trouvez pas, veuillez vérifier votre dossier de spam.'])
                     : response()->json(['message' => 'Failed to send reset link'], 400);
     }
 

     public function resetPassword(Request $request)
     {
         $request->validate([
             'token' => 'required',
             'email' => 'required|email',
             'password' => 'required|string|confirmed',
         ]);
 
         $status = Password::reset(
             $request->only('email', 'password', 'password_confirmation', 'token'),
             function ($user, $password) {
                 $user->password = Hash::make($password);
                 $user->save();
             }
         );
 
         return $status == Password::PASSWORD_RESET
                     ? response()->json(['message' => 'Mot de passe modifié avec succès!'])
                     : response()->json(['message' => 'Failed to reset password'], 400);
     }
 }