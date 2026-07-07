<?php

namespace App\Services;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class PayrollSecurityService
{
    private const ENABLED_KEY = 'payroll_lock_enabled';
    private const PIN_HASH_KEY = 'payroll_lock_pin_hash';
    private const MINUTES_KEY = 'payroll_lock_minutes';

    public function status(Request $request): array
    {
        $settings = $this->settings();
        $enabled = $this->isEnabled($settings);
        $expiresAt = $enabled ? Cache::get($this->expiresCacheKey($request)) : null;

        return [
            'enabled' => $enabled,
            'unlocked' => ! $enabled || $this->isUnlocked($request),
            'unlock_minutes' => $this->unlockMinutes($settings),
            'unlock_expires_at' => $expiresAt,
            'has_pin' => filled($settings[self::PIN_HASH_KEY] ?? null),
        ];
    }

    public function unlock(Request $request, string $pin): array
    {
        $settings = $this->settings();

        if (! $this->isEnabled($settings)) {
            return $this->status($request);
        }

        $hash = $settings[self::PIN_HASH_KEY] ?? null;
        if (! $hash || ! Hash::check($pin, $hash)) {
            abort(422, 'Payroll PIN is incorrect.');
        }

        $minutes = $this->unlockMinutes($settings);
        $expiresAt = now()->addMinutes($minutes);
        Cache::put($this->unlockCacheKey($request), true, $expiresAt);
        Cache::put($this->expiresCacheKey($request), $expiresAt->toIso8601String(), $expiresAt);

        return $this->status($request);
    }

    public function updateSettings(Request $request, bool $enabled, int $minutes, ?string $pin = null): array
    {
        abort_unless($request->user()?->hasRole('super_admin'), 403, 'Only Super Admin can change payroll security.');

        $current = $this->settings();
        if ($enabled && ! $pin && blank($current[self::PIN_HASH_KEY] ?? null)) {
            abort(422, 'Set a Payroll PIN before enabling the lock.');
        }

        SystemSetting::updateOrCreate(
            ['key' => self::ENABLED_KEY],
            ['value' => $enabled ? '1' : '0', 'group' => 'payroll'],
        );
        SystemSetting::updateOrCreate(
            ['key' => self::MINUTES_KEY],
            ['value' => (string) max(1, min(480, $minutes)), 'group' => 'payroll'],
        );

        if ($pin) {
            SystemSetting::updateOrCreate(
                ['key' => self::PIN_HASH_KEY],
                ['value' => Hash::make($pin), 'group' => 'payroll'],
            );
        }

        Cache::forget('system_settings.all');
        Cache::forget('payroll_security.settings');

        return $this->status($request);
    }

    public function assertUnlocked(Request $request): void
    {
        if ($this->isEnabled($this->settings()) && ! $this->isUnlocked($request)) {
            abort(423, 'Payroll History is locked. Enter the Payroll PIN to continue.');
        }
    }

    private function isUnlocked(Request $request): bool
    {
        return Cache::get($this->unlockCacheKey($request)) === true;
    }

    private function isEnabled(array $settings): bool
    {
        return ($settings[self::ENABLED_KEY] ?? '0') === '1' && filled($settings[self::PIN_HASH_KEY] ?? null);
    }

    private function unlockMinutes(array $settings): int
    {
        return max(1, min(480, (int) ($settings[self::MINUTES_KEY] ?? 15)));
    }

    private function settings(): array
    {
        return Cache::remember('payroll_security.settings', now()->addMinutes(10), fn () => SystemSetting::query()
            ->whereIn('key', [self::ENABLED_KEY, self::PIN_HASH_KEY, self::MINUTES_KEY])
            ->pluck('value', 'key')
            ->all());
    }

    private function unlockCacheKey(Request $request): string
    {
        $userId = $request->user()?->id ?: 'guest';
        $tokenId = $request->user()?->currentAccessToken()?->id ?: 'session';
        $pinVersion = substr(md5($this->settings()[self::PIN_HASH_KEY] ?? 'no-pin'), 0, 12);

        return "payroll_security.unlocked.{$pinVersion}.{$userId}.{$tokenId}";
    }

    private function expiresCacheKey(Request $request): string
    {
        return $this->unlockCacheKey($request).'.expires_at';
    }

}
