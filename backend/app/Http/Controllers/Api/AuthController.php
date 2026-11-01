<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Support 'username' (primary frontend payload), 'login', or 'email'
        if (! $request->has('username')) {
            $identifier = $request->input('login') ?? $request->input('email');
            if ($identifier !== null) {
                $request->merge(['username' => $identifier]);
            }
        }

        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'username.required' => 'The username or email field is required.',
            'password.required' => 'The password field is required.',
        ]);

        $username = trim((string) $request->input('username'));

        $user = User::with([
                'role.permissions',
                'employee.department',
                'employee.position',
                'employee.branch',
            ])
            ->where('name', $username)
            ->orWhere('email', $username)
            ->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            UserActivityService::log(
                action: 'failed_login',
                module: 'auth',
                description: "Failed login attempt for username: {$username}",
                userId: $user?->id,
                recordType: 'users',
                recordId: $user?->id,
                newValues: ['username' => $username, 'reason' => 'invalid_credentials'],
                status: 'failed',
                request: $request
            );

            throw ValidationException::withMessages([
                'username' => 'Invalid username or password.',
            ]);
        }

        if ($user->status !== 'active') {
            UserActivityService::log(
                action: 'failed_login',
                module: 'auth',
                description: "Login blocked for inactive account: {$username}",
                userId: $user->id,
                recordType: 'users',
                recordId: $user->id,
                newValues: ['username' => $username, 'reason' => 'account_inactive'],
                status: 'warning',
                request: $request
            );

            throw ValidationException::withMessages([
                'username' => 'Your account is inactive. Please contact your administrator.',
            ]);
        }

        $user->forceFill(['last_login_at' => now()])->save();

        UserActivityService::log(
            action: 'login',
            module: 'auth',
            description: "User {$user->name} logged in successfully",
            userId: $user->id,
            recordType: 'users',
            recordId: $user->id,
            status: 'success',
            request: $request
        );

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
        $user = $request->user();
        if ($user) {
            UserActivityService::log(
                action: 'logout',
                module: 'auth',
                description: "User {$user->name} logged out",
                userId: $user->id,
                recordType: 'users',
                recordId: $user->id,
                status: 'success',
                request: $request
            );
        }

        $user?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json(['status' => __($status)]);
    }
}
