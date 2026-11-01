<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Accept either "username" or "email" as the login identifier
        $request->validate([
            'login'    => ['required', 'string'], // can be username or email
            'password' => ['required', 'string'],
        ]);

        $login = $request->input('login');

        // Find the user by username (name) or email
        $user = User::with([
                'role.permissions',
                'employee.department',
                'employee.position',
                'employee.branch',
            ])
            ->where('name', $login)
            ->orWhere('email', $login)
            ->first();

        // Validate credentials and active status
        if (! $user || ! Hash::check($request->input('password'), $user->password) || $user->status !== 'active') {
            throw ValidationException::withMessages([
                'login' => 'Invalid username/email or password.',
            ]);
        }

        // Update last login timestamp
        $user->forceFill(['last_login_at' => now()])->save();

        // Return token and user data
        return response()->json([
            'token' => $user->createToken('attendance-api')->plainTextToken,
            'user'  => $user,
        ]);
    }

    public function me(Request $request)
    {
        return $request->user()->load(['role.permissions', 'employee.department', 'employee.position', 'employee.branch']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json(['status' => __($status)]);
    }
}
