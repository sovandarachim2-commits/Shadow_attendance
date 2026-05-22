<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return SystemSetting::all()->pluck('value', 'key');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings'   => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:1000'],
        ]);

        $now = now();

        foreach ($data['settings'] as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'updated_at' => $now],
            );
        }

        return SystemSetting::all()->pluck('value', 'key');
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

        return response()->json([$responseKey => $url]);
    }
}
