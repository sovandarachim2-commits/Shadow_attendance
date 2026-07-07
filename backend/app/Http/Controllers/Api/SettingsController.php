<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return $this->settings();
    }

    /** Public branding for favicon, home-screen icon, and document title (no auth). */
    public function branding()
    {
        $keys = ['company_name', 'site_title', 'company_logo_url', 'company_icon_url'];

        return Cache::remember('system_settings.branding', now()->addMinutes(10), fn () => SystemSetting::query()
            ->whereIn('key', $keys)
            ->pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings'   => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:1000'],
        ]);

        $now = now();

        foreach ($data['settings'] as $key => $value) {
            if (str_starts_with($key, 'payroll_lock_')) {
                continue;
            }

            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'updated_at' => $now],
            );
        }

        Cache::forget('system_settings.all');
        Cache::forget('system_settings.branding');

        return $this->settings();
    }

    public function uploadLogo(Request $request, ImageUploadService $images)
    {
        return $this->uploadImageSetting($request, $images, 'logo', 'logos', 'company_logo_url', 'logo_url');
    }

    public function uploadIcon(Request $request, ImageUploadService $images)
    {
        return $this->uploadImageSetting($request, $images, 'icon', 'icons', 'company_icon_url', 'icon_url');
    }

    private function uploadImageSetting(Request $request, ImageUploadService $images, string $field, string $folder, string $settingKey, string $responseKey)
    {
        $request->validate([
            $field => ['required', 'image', 'max:4096'],
        ]);

        $path = $images->store($request->file($field), "branding/{$folder}");
        $url  = $images->url($path);

        SystemSetting::updateOrCreate(
            ['key' => $settingKey],
            ['value' => $url, 'group' => 'general'],
        );

        Cache::forget('system_settings.all');
        Cache::forget('system_settings.branding');

        return response()->json([$responseKey => $url]);
    }

    private function settings()
    {
        return Cache::remember('system_settings.all', now()->addMinutes(10), fn () => SystemSetting::query()
            ->where('key', 'not like', 'payroll_lock_%')
            ->pluck('value', 'key'));
    }
}
