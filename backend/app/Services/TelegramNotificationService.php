<?php

namespace App\Services;

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
            ->unique(fn ($destination) => $destination->chat_id.'|'.($destination->message_thread_id ?? ''))
            ->each(function ($destination) use ($token, $message) {
                $this->sendPayload($token, $destination->chat_id, $message, $destination->message_thread_id ?? null);
            });
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

        $result = $this->sendPayload($token, $chatId, $message);
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

    private function sendPayload(string $token, string $chatId, string $message, ?int $threadId = null): array
    {
        try {
            $payload = [
                'chat_id'    => $chatId,
                'text'       => $message,
                'parse_mode' => 'HTML',
            ];

            if ($threadId) {
                $payload['message_thread_id'] = $threadId;
            }

            $response = Http::withOptions(['proxy' => false])->timeout(10)->post("https://api.telegram.org/bot{$token}/sendMessage", $payload);
            $body     = $response->json();

            if (! ($body['ok'] ?? false)) {
                $desc = $body['description'] ?? 'Unknown Telegram error';
                Log::warning('Telegram send failed', ['chat_id' => $chatId, 'description' => $desc]);
                return ['ok' => false, 'description' => $desc];
            }

            return ['ok' => true];
        } catch (\Throwable $e) {
            Log::warning('Telegram notification exception', ['message' => $e->getMessage()]);
            return ['ok' => false, 'description' => 'Network error: '.$e->getMessage()];
        }
    }
}
