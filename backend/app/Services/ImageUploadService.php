<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ImageUploadService
{
    private const FALLBACK_DISK = 'public';
    private const FALLBACK_PREFIX = 'local:';

    private function cloudDisk(): string
    {
        $disk = (string) config('filesystems.attendance_disk', 'r2');

        return in_array($disk, ['r2', 'public'], true) ? $disk : 'r2';
    }

    public function store(?UploadedFile $file, string $folder): ?string
    {
        if (! $file) {
            return null;
        }

        $disk = $this->cloudDisk();

        if ($disk === self::FALLBACK_DISK) {
            return self::FALLBACK_PREFIX.$file->storePublicly($folder, self::FALLBACK_DISK);
        }

        try {
            return $file->storePublicly($folder, $disk);
        } catch (Throwable) {
            return self::FALLBACK_PREFIX.$file->storePublicly($folder, self::FALLBACK_DISK);
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

        return Storage::disk($this->cloudDisk())->url($path);
    }
}
