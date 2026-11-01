<?php

namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class UserActivityService
{
    /**
     * Keys whose values must be masked in audit logs.
     */
    protected static array $sensitiveKeys = [
        'password',
        'password_confirmation',
        'token',
        'api_token',
        'plainTextToken',
        'secret',
        'r2_secret_access_key',
        'r2_access_key_id',
        'pin',
        'payroll_lock_pin',
        'payroll_lock_pin_hash',
        'remember_token',
        'cookie',
        'bot_token',
        'telegram_bot_token',
    ];

    /**
     * Record a user activity event.
     */
    public static function log(
        string $action,
        string $module,
        string $description,
        ?int $userId = null,
        ?string $recordType = null,
        mixed $recordId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        string $status = 'success',
        ?Request $request = null
    ): ?UserActivity {
        try {
            $req = $request ?? (app()->bound('request') ? request() : null);

            $actorId = $userId ?? Auth::id();
            $ipAddress = $req ? $req->ip() : null;
            $userAgent = $req ? substr((string) $req->userAgent(), 0, 500) : null;

            return UserActivity::create([
                'user_id'     => $actorId,
                'action'      => $action,
                'module'      => $module,
                'description' => $description,
                'record_type' => $recordType,
                'record_id'   => $recordId !== null ? (string) $recordId : null,
                'old_values'  => $oldValues ? self::maskSensitiveData($oldValues) : null,
                'new_values'  => $newValues ? self::maskSensitiveData($newValues) : null,
                'ip_address'  => $ipAddress,
                'user_agent'  => $userAgent,
                'status'      => in_array($status, ['success', 'failed', 'warning'], true) ? $status : 'success',
                'created_at'  => now(),
            ]);
        } catch (Throwable $e) {
            // Never break main business logic if logging encounters an issue
            report($e);
            return null;
        }
    }

    /**
     * Recursively mask sensitive keys in arrays/objects.
     */
    public static function maskSensitiveData(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            $lowerKey = strtolower((string) $key);
            $isSensitive = false;

            foreach (self::$sensitiveKeys as $sensitive) {
                if (str_contains($lowerKey, $sensitive)) {
                    $isSensitive = true;
                    break;
                }
            }

            if ($isSensitive) {
                $sanitized[$key] = '********';
            } elseif (is_array($value)) {
                $sanitized[$key] = self::maskSensitiveData($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
