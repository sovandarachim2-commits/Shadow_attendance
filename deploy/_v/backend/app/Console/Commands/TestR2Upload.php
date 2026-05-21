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
        $missing = collect([
            'R2_ACCESS_KEY_ID',
            'R2_SECRET_ACCESS_KEY',
            'R2_BUCKET',
            'R2_ENDPOINT',
        ])->filter(fn (string $key) => ! trim((string) env($key)));

        if ($missing->isNotEmpty()) {
            $this->error('Missing in .env (project root): '.$missing->implode(', '));

            return self::FAILURE;
        }

        $this->info('Bucket: '.trim(env('R2_BUCKET')));
        $this->info('Endpoint: '.env('R2_ENDPOINT'));
        $this->info('Public URL base: '.(env('R2_PUBLIC_URL') ?: '(not set)'));

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
        $this->info('Upload succeeded.');
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
}
