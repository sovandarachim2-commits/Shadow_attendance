<?php

namespace App\Jobs;

use App\Models\TelegramLog;
use App\Services\TelegramNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RetryTelegramNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Maximum delivery attempts before the job is marked as failed. */
    public int $tries = 3;

    /** Seconds to wait before each retry: 1 min, 5 min, 15 min. */
    public array $backoff = [60, 300, 900];

    public function __construct(public readonly int $telegramLogId) {}

    public function handle(TelegramNotificationService $telegram): void
    {
        $log = TelegramLog::find($this->telegramLogId);

        if (! $log) {
            return;
        }

        // Already succeeded in a previous attempt — nothing to do.
        if ($log->status === 'sent') {
            return;
        }

        $log->increment('attempts');

        $result = $telegram->resendFromLog($log);

        if ($result['ok']) {
            $log->update([
                'status'        => 'sent',
                'error_message' => null,
                'sent_at'       => now(),
            ]);
        } else {
            $log->update([
                'status'        => 'failed',
                'error_message' => $result['description'] ?? 'Unknown error',
            ]);

            // Re-throw so the queue retries (if attempts remain).
            throw new \RuntimeException(
                "Telegram retry failed (log #{$log->id}): " . ($result['description'] ?? 'Unknown error')
            );
        }
    }

    /** Called by Laravel after all retries are exhausted. */
    public function failed(\Throwable $e): void
    {
        Log::error('Telegram notification permanently failed after all retries', [
            'log_id' => $this->telegramLogId,
            'error'  => $e->getMessage(),
        ]);

        TelegramLog::where('id', $this->telegramLogId)->update([
            'status'        => 'failed',
            'error_message' => 'Permanently failed after 3 attempts: ' . $e->getMessage(),
        ]);
    }
}
