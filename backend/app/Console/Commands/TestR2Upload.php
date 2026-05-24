<?php

namespace App\Console\Commands;

use App\Services\ImageUploadService;
use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestR2Upload extends Command
{
    protected $signature = 'r2:test {--image : Upload a tiny PNG instead of a text file}';

    protected $description = 'Upload a test file to Cloudflare R2 and print the stored path and URL';

    public function handle(ImageUploadService $images): int
    {
        $disk = config('filesystems.disks.r2', []);
        $checks = [
            'R2_ACCESS_KEY_ID' => $disk['key'] ?? null,
            'R2_SECRET_ACCESS_KEY' => $disk['secret'] ?? null,
            'R2_BUCKET' => $disk['bucket'] ?? null,
            'R2_ENDPOINT' => $disk['endpoint'] ?? null,
        ];
        $missing = collect($checks)->filter(fn ($value) => ! trim((string) $value))->keys();

        if ($missing->isNotEmpty()) {
            $this->error('Missing R2 config (add to public_html/.env, then config:clear): '.$missing->implode(', '));

            return self::FAILURE;
        }

        $this->info('Bucket: '.trim((string) $disk['bucket']));
        $this->info('Endpoint: '.($disk['endpoint'] ?? ''));
        $this->info('Public URL base: '.($disk['url'] ?: '(not set)'));

        try {
            if ($this->option('image')) {
                $path = $this->uploadTestImage($images);
            } else {
                $path = 'tests/r2-test-'.now()->format('YmdHis').'.txt';
                Storage::disk('r2')->put($path, 'R2 test OK at '.now()->toIso8601String());
            }
        } catch (\Throwable $e) {
            $this->error('Upload failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $url = $images->url($path);

        $this->newLine();
        if (str_starts_with($path, 'local:')) {
            $this->warn('Upload used LOCAL fallback — R2 upload failed. Images are NOT on Cloudflare yet.');
            $this->line('Direct R2 error: '.$this->directR2Error());

            return self::FAILURE;
        }

        $this->info('Upload succeeded (Cloudflare R2).');
        $this->line('Path: '.$path);
        $this->line('URL:  '.($url ?? '(none)'));

        return self::SUCCESS;
    }

    private function uploadTestImage(ImageUploadService $images): string
    {
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
            true,
        );

        $tmp = sys_get_temp_dir().DIRECTORY_SEPARATOR.'r2-test-'.Str::random(8).'.png';
        file_put_contents($tmp, $png);

        $file = new UploadedFile($tmp, 'r2-test.png', 'image/png', null, true);
        $path = $images->store($file, 'tests');

        @unlink($tmp);

        if (! $path) {
            throw new \RuntimeException('ImageUploadService returned no path.');
        }

        return $path;
    }

    private function directR2Error(): string
    {
        try {
            Storage::disk('r2')->put('tests/r2-probe-'.time().'.txt', 'probe');

            return 'none (direct put worked — check ImageUploadService)';
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }
}
