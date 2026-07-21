<?php

namespace App\Services;

use App\Jobs\RetryTelegramNotification;
use App\Models\Employee;
use App\Models\SystemSetting;
use App\Models\TelegramDestination;
use App\Models\TelegramLog;
use App\Models\TelegramSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramNotificationService
{
    private function getToken(): ?string
    {
        $dbToken = TelegramSetting::query()->value('bot_token')
            ?: SystemSetting::where('key', 'telegram_bot_token')->value('value');

        return ($dbToken && trim($dbToken) !== '') ? trim($dbToken) : config('services.telegram.bot_token');
    }

    public function alertEnabled(string $settingKey, bool $default = true): bool
    {
        $pref = SystemSetting::where('key', $settingKey)->value('value');

        if ($pref === null || $pref === '') {
            return $default;
        }

        return in_array($pref, ['1', 1, true], true);
    }

    public function send(string $message, string|array $eventKeys = 'daily_attendance'): void
    {
        $this->sendWithResults($message, $eventKeys);
    }

    public function sendWithResults(string $message, string|array $eventKeys = 'daily_attendance'): array
    {
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return [];
        }

        $keys = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $eventKey) {
            $destinations = $destinations->merge($this->resolveDestinations($eventKey));
        }

        return $destinations
            ->unique(fn ($destination) => $destination->chat_id.'|'.($destination->message_thread_id ?? ''))
            ->map(function ($destination) use ($token, $message) {
                $result = $this->sendPayload($token, $destination->chat_id, $message, $destination->message_thread_id ?? null);

                return array_merge($result, [
                    'chat_id' => (string) $destination->chat_id,
                    'message_thread_id' => $destination->message_thread_id ?? null,
                ]);
            })
            ->values()
            ->all();
    }

    public function sendReply(string $chatId, string $message, ?int $threadId = null, ?int $replyToMessageId = null): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set.'];
        }

        return $this->sendPayload($token, $chatId, $message, $threadId, true, null, $replyToMessageId);
    }

    private function resolveDestinations(string $eventKey)
    {
        $destinations = TelegramDestination::query()
            ->where('enabled', true)
            ->whereIn('event_key', [$eventKey, 'other'])
            ->get();

        if ($destinations->isNotEmpty()) {
            return $destinations;
        }

        if ($eventKey !== 'daily_attendance') {
            return collect();
        }

        $chatId = TelegramSetting::query()->value('chat_id')
            ?: SystemSetting::where('key', 'telegram_default_chat_id')->value('value')
            ?: config('services.telegram.chat_id');

        if (! $chatId || trim($chatId) === '') {
            return collect();
        }

        return collect([(object) [
            'chat_id' => $chatId,
            'message_thread_id' => null,
        ]]);
    }

    /**
     * Send attendance notification as a text message with the selfie URL pinned as the
     * link preview. Telegram will render the photo as a large image above/below the text
     * if the URL is publicly accessible — no sendPhoto API call needed.
     */
    public function sendAttendancePhoto(?string $photoUrl, string $caption, string|array $eventKeys): void
    {
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return;
        }

        $keys = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $eventKey) {
            $destinations = $destinations->merge($this->resolveDestinations($eventKey));
        }

        $destinations
            ->unique(fn ($d) => $d->chat_id.'|'.($d->message_thread_id ?? ''))
            ->each(function ($d) use ($token, $photoUrl, $caption) {
                $this->sendPayload($token, $d->chat_id, $caption, $d->message_thread_id ?? null, true, $photoUrl ?: null);
            });
    }

    /**
     * Reusable: send one sendPhoto message with caption. Falls back to text if photo fails.
     */
    public function sendAttendancePhotoTelegram(string $chatId, string $photoUrl, string $caption, ?int $threadId = null): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'Bot token not configured.'];
        }

        try {
            $payload = [
                'chat_id'    => $chatId,
                'photo'      => $photoUrl,
                'caption'    => $caption,
                'parse_mode' => 'HTML',
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(15)
                ->post("https://api.telegram.org/bot{$token}/sendPhoto", $payload);

            $body = $response->json();

            if (! ($body['ok'] ?? false)) {
                Log::warning('Telegram sendPhoto failed, falling back to text', [
                    'chat_id'     => $chatId,
                    'description' => $body['description'] ?? 'Unknown error',
                ]);

                // Fallback: text-only message
                return $this->sendPayload($token, $chatId, $caption, $threadId);
            }

            return ['ok' => true];
        } catch (\Throwable $e) {
            Log::warning('Telegram sendPhoto exception, falling back to text', ['message' => $e->getMessage()]);

            return $this->sendPayload($token, $chatId, $caption, $threadId);
        }
    }

    /**
     * Send to all enabled destinations for the event key.
     * Destinations with send_photo=true receive the photo; others receive text only.
     */
    public function sendWithPhoto(string $message, ?string $photoUrl, string|array $eventKeys, ?string $photoCaption = null): void
    {
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return;
        }

        $keys = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $eventKey) {
            $destinations = $destinations->merge($this->resolveDestinationsWithMeta($eventKey));
        }

        $destinations
            ->unique(fn ($destination) => $destination->chat_id.'|'.($destination->message_thread_id ?? ''))
            ->each(function ($destination) use ($token, $message, $photoUrl, $photoCaption) {
                $threadId = $destination->message_thread_id ?? null;
                if ($photoUrl && ($destination->send_photo ?? false)) {
                    $this->sendAttendancePhotoTelegram($destination->chat_id, $photoUrl, $photoCaption ?? $message, $threadId);
                } else {
                    $this->sendPayload($token, $destination->chat_id, $message, $threadId);
                }
            });
    }

    private function sendPhotoOnly(string $chatId, string $photoUrl, ?int $threadId = null, ?string $caption = null): void
    {
        $token = $this->getToken();
        if (! $token) {
            return;
        }

        try {
            $payload = ['chat_id' => $chatId, 'photo' => $photoUrl];

            if ($caption) {
                $payload['caption']     = $caption;
                $payload['parse_mode'] = 'HTML';
            }

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(15)->post("https://api.telegram.org/bot{$token}/sendPhoto", $payload);
            $body     = $response->json();

            if (! ($body['ok'] ?? false)) {
                Log::warning('Telegram sendPhotoOnly failed', ['chat_id' => $chatId, 'description' => $body['description'] ?? 'Unknown error']);
            }
        } catch (\Throwable $e) {
            Log::warning('Telegram sendPhotoOnly exception', ['message' => $e->getMessage()]);
        }
    }

    private function resolveDestinationsWithMeta(string $eventKey)
    {
        $destinations = TelegramDestination::query()
            ->where('enabled', true)
            ->whereIn('event_key', [$eventKey, 'other'])
            ->get();

        if ($destinations->isNotEmpty()) {
            return $destinations;
        }

        if ($eventKey !== 'daily_attendance') {
            return collect();
        }

        $chatId = TelegramSetting::query()->value('chat_id')
            ?: SystemSetting::where('key', 'telegram_default_chat_id')->value('value')
            ?: config('services.telegram.chat_id');

        if (! $chatId || trim($chatId) === '') {
            return collect();
        }

        return collect([(object) [
            'chat_id' => $chatId,
            'message_thread_id' => null,
            'send_photo' => false,
        ]]);
    }

    public function sendToDestination(TelegramDestination $destination, string $message): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set in .env'];
        }

        return $this->sendPayload($token, $destination->chat_id, $message, $destination->message_thread_id);
    }

    /** Send a private DM to one employee (uses telegram_chat_id on their profile). */
    public function sendToEmployee(?Employee $employee, string $message, string $messageType = 'employee_private'): array
    {
        return $this->sendToEmployeeWithKeyboard($employee, $message, null, $messageType);
    }

    public function sendToEmployeeWithKeyboard(?Employee $employee, string $message, ?array $replyMarkup = null, string $messageType = 'employee_private'): array
    {
        if (! $employee) {
            return ['ok' => false, 'description' => 'No employee linked.'];
        }

        $chatId = trim((string) ($employee->telegram_chat_id ?? ''));

        if ($chatId === '') {
            return ['ok' => false, 'description' => 'Telegram Chat ID is not set on this employee profile.'];
        }

        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return ['ok' => false, 'description' => 'Telegram bot is not configured or disabled.'];
        }

        $result = $this->sendPayload($token, $chatId, $message, null, true, null, null, $replyMarkup);
        $sent = $result['ok'] ? now() : null;

        TelegramLog::create([
            'employee_id' => $employee->id,
            'message_type' => $messageType,
            'telegram_message' => $message,
            'status' => $result['ok'] ? 'sent' : 'failed',
            'sent_at' => $sent,
        ]);

        return $result;
    }

    public function answerCallbackQuery(string $callbackQueryId, string $text, bool $alert = false): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set.'];
        }

        try {
            $response = Http::withOptions(['proxy' => false])->timeout(10)->post("https://api.telegram.org/bot{$token}/answerCallbackQuery", [
                'callback_query_id' => $callbackQueryId,
                'text' => $text,
                'show_alert' => $alert,
            ]);

            return $response->json() ?: ['ok' => false, 'description' => 'Empty Telegram response'];
        } catch (\Throwable $e) {
            Log::warning('Telegram answerCallbackQuery exception', ['message' => $e->getMessage()]);
            return ['ok' => false, 'description' => 'Network error: '.$e->getMessage()];
        }
    }

    /**
     * Send selfie + store photo as a Telegram media album with caption on the first photo.
     * Falls back to single photo, then text-only on failure.
     */
    public function sendVisitAlbum(
        ?string $selfieUrl,
        ?string $storePhotoUrl,
        string  $caption,
        string|array $eventKeys,
    ): void {
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return;
        }

        $keys         = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $eventKey) {
            $destinations = $destinations->merge($this->resolveDestinationsWithMeta($eventKey));
        }

        $destinations
            ->unique(fn ($d) => $d->chat_id.'|'.($d->message_thread_id ?? ''))
            ->each(function ($d) use ($selfieUrl, $storePhotoUrl, $caption) {
                $threadId = $d->message_thread_id ?? null;

                if (! ($d->send_photo ?? false)) {
                    $token = $this->getToken();
                    $this->sendPayload($token, $d->chat_id, $caption, $threadId);
                    return;
                }

                // Build media array — include both photos when available
                $media = [];

                if ($selfieUrl) {
                    $media[] = [
                        'type'       => 'photo',
                        'media'      => $selfieUrl,
                        'caption'    => $caption,
                        'parse_mode' => 'HTML',
                    ];
                }

                if ($storePhotoUrl) {
                    $media[] = ['type' => 'photo', 'media' => $storePhotoUrl];
                }

                if (count($media) >= 2) {
                    $result = $this->sendMediaGroupToChat($d->chat_id, $media, $threadId);
                    if ($result['ok'] ?? false) {
                        return;
                    }
                }

                // Fallback: single photo
                $photoUrl = $selfieUrl ?? $storePhotoUrl;
                if ($photoUrl) {
                    $this->sendAttendancePhotoTelegram($d->chat_id, $photoUrl, $caption, $threadId);
                } else {
                    $this->sendPayload($this->getToken(), $d->chat_id, $caption, $threadId);
                }
            });
    }

    private function sendMediaGroupToChat(string $chatId, array $media, ?int $threadId = null): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false];
        }

        try {
            $payload = [
                'chat_id' => $chatId,
                'media'   => json_encode($media),
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(20)
                ->post("https://api.telegram.org/bot{$token}/sendMediaGroup", $payload);

            $body = $response->json();

            if (! ($body['ok'] ?? false)) {
                Log::warning('Telegram sendMediaGroup failed', [
                    'chat_id'     => $chatId,
                    'description' => $body['description'] ?? 'Unknown error',
                ]);
            }

            return $body ?? ['ok' => false];
        } catch (\Throwable $e) {
            Log::warning('Telegram sendMediaGroup exception', ['message' => $e->getMessage()]);
            return ['ok' => false];
        }
    }

    // ── Customer Visit Text Notification ─────────────────────────────────────

    /**
     * Send a customer visit notification using sendMessage() only.
     * Image URLs are embedded as plain clickable links — no sendPhoto/sendMediaGroup.
     * Creates a TelegramLog entry and dispatches a retry job on failure.
     */
    public function sendVisitTextMessage(
        string      $message,
        ?string     $selfieUrl,
        ?string     $storePhotoUrl,
        int         $visitId,
        int         $employeeId,
        string|array $eventKeys = 'outdoor_visit',
    ): void {
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return;
        }

        $keys         = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $key) {
            $destinations = $destinations->merge($this->resolveDestinations($key));
        }

        $destinations = $destinations
            ->unique(fn ($d) => $d->chat_id . '|' . ($d->message_thread_id ?? ''));

        // Log immediately so there is always an audit trail, even with no destinations.
        if ($destinations->isEmpty()) {
            TelegramLog::create([
                'employee_id'       => $employeeId,
                'customer_visit_id' => $visitId,
                'message_type'      => 'customer_visit',
                'event_key'         => implode(',', $keys),
                'telegram_message'  => $message,
                'selfie_url'        => $selfieUrl,
                'store_photo_url'   => $storePhotoUrl,
                'status'            => 'skipped',
                'attempts'          => 0,
                'error_message'     => 'No enabled destinations found for event key: ' . implode(',', $keys),
                'sent_at'           => null,
            ]);
            return;
        }

        $successCount = 0;
        $errors       = [];

        foreach ($destinations as $d) {
            $result = $this->sendPayload($token, $d->chat_id, $message, $d->message_thread_id ?? null);

            if ($result['ok']) {
                $successCount++;
            } else {
                $errors[] = "[{$d->chat_id}] " . ($result['description'] ?? 'Unknown error');
            }
        }

        $total  = $destinations->count();
        $status = match (true) {
            $successCount === $total             => 'sent',
            $successCount > 0 && $errors !== [] => 'partial',
            default                             => 'failed',
        };

        $log = TelegramLog::create([
            'employee_id'       => $employeeId,
            'customer_visit_id' => $visitId,
            'message_type'      => 'customer_visit',
            'event_key'         => implode(',', $keys),
            'telegram_message'  => $message,
            'selfie_url'        => $selfieUrl,
            'store_photo_url'   => $storePhotoUrl,
            'status'            => $status,
            'attempts'          => 1,
            'error_message'     => $errors ? implode('; ', $errors) : null,
            'sent_at'           => $successCount > 0 ? now() : null,
        ]);

        if ($status !== 'sent') {
            RetryTelegramNotification::dispatch($log->id)->delay(now()->addSeconds(60));
        }
    }

    /**
     * Send visit notification with the store photo as an actual Telegram image.
     * Caption contains all visit details + clickable selfie / map links.
     * Falls back to sendMessage if no photo URL or if sendPhoto fails.
     */
    public function sendVisitWithStorePhoto(
        string       $caption,
        ?string      $storePhotoUrl,
        ?string      $selfieUrl,
        int          $visitId,
        int          $employeeId,
        string|array $eventKeys = 'outdoor_visit',
    ): void {
        // visitId = 0 means a test call — skip DB log to avoid FK violation.
        $isTest = $visitId === 0;
        $token = $this->getToken();

        if (! $token || ! $this->alertEnabled('telegram_bot_enabled', true)) {
            return;
        }

        $keys         = is_array($eventKeys) ? $eventKeys : [$eventKeys];
        $destinations = collect();

        foreach (array_values(array_unique($keys)) as $key) {
            $destinations = $destinations->merge($this->resolveDestinations($key));
        }

        $destinations = $destinations
            ->unique(fn ($d) => $d->chat_id . '|' . ($d->message_thread_id ?? ''));

        if ($destinations->isEmpty()) {
            if (! $isTest) {
                TelegramLog::create([
                    'employee_id'       => $employeeId,
                    'customer_visit_id' => $visitId,
                    'message_type'      => 'customer_visit',
                    'event_key'         => implode(',', $keys),
                    'telegram_message'  => $caption,
                    'selfie_url'        => $selfieUrl,
                    'store_photo_url'   => $storePhotoUrl,
                    'status'            => 'skipped',
                    'attempts'          => 0,
                    'error_message'     => 'No enabled destinations for: ' . implode(',', $keys),
                    'sent_at'           => null,
                ]);
            }
            return;
        }

        $successCount = 0;
        $errors       = [];

        foreach ($destinations as $d) {
            $threadId = $d->message_thread_id ?? null;

            if ($storePhotoUrl) {
                $result = $this->sendPhotoPayload($token, $d->chat_id, $storePhotoUrl, $caption, $threadId);
            } else {
                $result = $this->sendPayload($token, $d->chat_id, $caption, $threadId);
            }

            if ($result['ok']) {
                $successCount++;
            } else {
                $errors[] = "[{$d->chat_id}] " . ($result['description'] ?? 'Unknown error');
            }
        }

        $total  = $destinations->count();
        $status = match (true) {
            $successCount === $total             => 'sent',
            $successCount > 0 && $errors !== [] => 'partial',
            default                             => 'failed',
        };

        if (! $isTest) {
            $log = TelegramLog::create([
                'employee_id'       => $employeeId,
                'customer_visit_id' => $visitId,
                'message_type'      => 'customer_visit',
                'event_key'         => implode(',', $keys),
                'telegram_message'  => $caption,
                'selfie_url'        => $selfieUrl,
                'store_photo_url'   => $storePhotoUrl,
                'status'            => $status,
                'attempts'          => 1,
                'error_message'     => $errors ? implode('; ', $errors) : null,
                'sent_at'           => $successCount > 0 ? now() : null,
            ]);

            if ($status !== 'sent') {
                RetryTelegramNotification::dispatch($log->id)->delay(now()->addSeconds(60));
            }
        }
    }

    /**
     * Re-send the message stored in a TelegramLog entry.
     * Called by RetryTelegramNotification job.
     */
    public function resendFromLog(TelegramLog $log): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'Bot token not configured.'];
        }

        $keys         = array_filter(explode(',', $log->event_key ?? 'outdoor_visit'));
        $destinations = collect();

        foreach ($keys as $key) {
            $destinations = $destinations->merge($this->resolveDestinations(trim($key)));
        }

        $destinations = $destinations
            ->unique(fn ($d) => $d->chat_id . '|' . ($d->message_thread_id ?? ''));

        if ($destinations->isEmpty()) {
            return ['ok' => false, 'description' => 'No enabled destinations found.'];
        }

        $errors = [];

        foreach ($destinations as $d) {
            $result = $this->sendPayload($token, $d->chat_id, $log->telegram_message, $d->message_thread_id ?? null);

            if (! $result['ok']) {
                $errors[] = "[{$d->chat_id}] " . ($result['description'] ?? 'Unknown error');
            }
        }

        if ($errors) {
            return ['ok' => false, 'description' => implode('; ', $errors)];
        }

        return ['ok' => true];
    }

    public function sendRaw(string $chatId, string $message, ?int $threadId = null): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set.'];
        }

        return $this->sendPayload($token, $chatId, $message, $threadId);
    }

    public function sendPhotoRaw(string $chatId, string $photoUrl, string $caption, ?int $threadId = null): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set.'];
        }

        try {
            $payload = [
                'chat_id'    => $chatId,
                'photo'      => $photoUrl,
                'caption'    => $caption,
                'parse_mode' => 'HTML',
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(15)->post("https://api.telegram.org/bot{$token}/sendPhoto", $payload);
            $body     = $response->json();

            if (! ($body['ok'] ?? false)) {
                $desc = $body['description'] ?? 'Unknown Telegram error';
                Log::warning('Telegram sendPhoto failed', ['chat_id' => $chatId, 'description' => $desc]);
                // Fall back to text-only message
                return $this->sendPayload($token, $chatId, $caption, $threadId);
            }

            return ['ok' => true];
        } catch (\Throwable $e) {
            Log::warning('Telegram sendPhoto exception', ['message' => $e->getMessage()]);
            return $this->sendPayload($token, $chatId, $caption, $threadId);
        }
    }

    public function sendTestMessage(string $message, string $messageType = 'test'): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set in .env or Telegram settings'];
        }

        $setting = TelegramSetting::query()->firstOrCreate([]);
        $chatId = $setting->chat_id
            ?: SystemSetting::where('key', 'telegram_default_chat_id')->value('value')
            ?: config('services.telegram.chat_id');

        if (! $chatId || trim($chatId) === '') {
            return ['ok' => false, 'description' => 'Telegram Chat ID is not configured.'];
        }

        $result = $this->sendPayload($token, $chatId, $message);
        $sent = $result['ok'] ? now() : null;

        TelegramLog::create([
            'employee_id' => null,
            'message_type' => $messageType,
            'telegram_message' => $message,
            'status' => $result['ok'] ? 'sent' : 'failed',
            'sent_at' => $sent,
        ]);

        if ($result['ok']) {
            $setting->update([
                'status' => 'connected',
                'last_notification_sent_at' => $sent,
            ]);
        }

        return $result;
    }

    public function verifyBot(): array
    {
        $token = $this->getToken();

        if (! $token) {
            return ['ok' => false, 'description' => 'TELEGRAM_BOT_TOKEN is not set in .env'];
        }

        try {
            $response = Http::withOptions(['proxy' => false])->timeout(10)->get("https://api.telegram.org/bot{$token}/getMe");
            $body     = $response->json();

            if (! ($body['ok'] ?? false)) {
                return ['ok' => false, 'description' => $body['description'] ?? 'Invalid bot token'];
            }

            return ['ok' => true, 'bot' => $body['result']];
        } catch (\Throwable $e) {
            return ['ok' => false, 'description' => 'Network error: '.$e->getMessage()];
        }
    }

    /**
     * Send a photo with caption via sendPhoto. Falls back to sendMessage on failure.
     */
    private function sendPhotoPayload(string $token, string $chatId, string $photoUrl, string $caption, ?int $threadId = null): array
    {
        try {
            $payload = [
                'chat_id'    => $chatId,
                'photo'      => $photoUrl,
                'caption'    => $caption,
                'parse_mode' => 'HTML',
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(20)
                ->post("https://api.telegram.org/bot{$token}/sendPhoto", $payload);

            $body = $response->json();

            if ($body['ok'] ?? false) {
                return ['ok' => true];
            }

            Log::warning('Telegram sendPhoto failed, falling back to text', [
                'chat_id'     => $chatId,
                'description' => $body['description'] ?? 'Unknown error',
            ]);

            return $this->sendPayload($token, $chatId, $caption, $threadId, false);
        } catch (\Throwable $e) {
            Log::warning('Telegram sendPhoto exception, falling back to text', ['message' => $e->getMessage()]);

            return $this->sendPayload($token, $chatId, $caption, $threadId, false);
        }
    }

    private function sendPayload(string $token, string $chatId, string $message, ?int $threadId = null, bool $preview = true, ?string $previewUrl = null, ?int $replyToMessageId = null, ?array $replyMarkup = null): array
    {
        try {
            $linkPreviewOptions = ['is_disabled' => ! $preview];
            if ($preview && $previewUrl) {
                $linkPreviewOptions['url']               = $previewUrl;
                $linkPreviewOptions['prefer_large_media'] = true;
            }

            $payload = [
                'chat_id'              => $chatId,
                'text'                 => $message,
                'parse_mode'           => 'HTML',
                'link_preview_options' => $linkPreviewOptions,
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            if ($replyToMessageId) {
                $payload['reply_parameters'] = [
                    'message_id' => $replyToMessageId,
                    'allow_sending_without_reply' => true,
                ];
            }

            if ($replyMarkup) {
                $payload['reply_markup'] = $replyMarkup;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(10)->post("https://api.telegram.org/bot{$token}/sendMessage", $payload);
            $body     = $response->json();

            if (! ($body['ok'] ?? false)) {
                $desc = $body['description'] ?? 'Unknown Telegram error';
                Log::warning('Telegram send failed', ['chat_id' => $chatId, 'description' => $desc]);
                return ['ok' => false, 'description' => $desc];
            }

            return [
                'ok' => true,
                'message_id' => $body['result']['message_id'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::warning('Telegram notification exception', ['message' => $e->getMessage()]);
            return ['ok' => false, 'description' => 'Network error: '.$e->getMessage()];
        }
    }
}
