<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ImageUploadService
{
    private const CLOUD_DISK = 'r2';
    private const FALLBACK_DISK = 'public';
    private const FALLBACK_PREFIX = 'local:';

    public function store(?UploadedFile $file, string $folder): ?string
    {
        if (! $file) {
            return null;
        }

        try {
            return $file->store($folder, self::CLOUD_DISK);
        } catch (Throwable) {
            return self::FALLBACK_PREFIX.$file->store($folder, self::FALLBACK_DISK);
        }
    }

    public function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, self::FALLBACK_PREFIX)) {
            return Storage::disk(self::FALLBACK_DISK)->url(substr($path, strlen(self::FALLBACK_PREFIX)));
        }

        return Storage::disk(self::CLOUD_DISK)->url($path);
    }
}
