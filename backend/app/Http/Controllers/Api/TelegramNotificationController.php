<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\TelegramLog;
use App\Models\TelegramSetting;
use App\Models\TelegramTemplate;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;

class TelegramNotificationController extends Controller
{
    private const VARIABLES = [
        '{name}',
        '{employee_id}',
        '{department}',
        '{date}',
        '{time}',
        '{check_in}',
        '{check_out}',
        '{working_hours}',
        '{status}',
        '{location}',
        '{late_minutes}',
        '{deduction_amount}',
        '{request_type}',
        '{reason}',
    ];

    private const TOGGLE_KEYS = [
        'telegram_alert_check_in_success',
        'telegram_alert_check_out_success',
        'telegram_alert_late_check_in',
        'telegram_alert_missing_check_out',
        'telegram_alert_attendance_edited',
        'telegram_alert_permission_new',
        'telegram_alert_permission_approved',
        'telegram_alert_permission_rejected',
        'telegram_alert_manual_check_in',
        'telegram_alert_missing_check_out_request',
        'telegram_alert_outdoor_check_in',
        'telegram_alert_visit_started',
        'telegram_alert_visit_completed',
        'telegram_alert_daily_report',
        'telegram_alert_route_tracking',
        'telegram_late_notify_admin_group',
        'telegram_late_notify_employee',
        'telegram_late_include_deduction_amount',
        'telegram_late_include_late_minutes',
    ];

    public function index()
    {
        return response()->json([
            'settings' => $this->settings(),
            'templates' => TelegramTemplate::query()->orderBy('type')->get(),
            'toggles' => $this->toggles(),
            'logs' => TelegramLog::query()->latest()->limit(20)->get(),
            'variables' => self::VARIABLES,
        ]);
    }

    public function updateSettings(Request $request, TelegramNotificationService $telegram)
    {
        $data = $request->validate([
            'enabled' => ['nullable', 'boolean'],
            'bot_token' => ['nullable', 'string', 'max:255'],
            'chat_id' => ['nullable', 'string', 'max:120'],
            'webhook_url' => ['nullable', 'string', 'max:255'],
        ]);

        $setting = TelegramSetting::query()->firstOrCreate([]);
        $setting->fill([
            'bot_token' => $data['bot_token'] ?? $setting->bot_token,
            'chat_id' => $data['chat_id'] ?? null,
            'webhook_url' => $data['webhook_url'] ?? null,
            'status' => $setting->status ?: 'disconnected',
        ])->save();

        SystemSetting::updateOrCreate(
            ['key' => 'telegram_bot_enabled'],
            ['value' => ! empty($data['enabled']) ? '1' : '0', 'group' => 'telegram'],
        );

        if (! empty($data['bot_token'])) {
            SystemSetting::updateOrCreate(
                ['key' => 'telegram_bot_token'],
                ['value' => trim($data['bot_token']), 'group' => 'telegram'],
            );
        }

        if (array_key_exists('chat_id', $data)) {
            SystemSetting::updateOrCreate(
                ['key' => 'telegram_default_chat_id'],
                ['value' => $data['chat_id'] ?? '', 'group' => 'telegram'],
            );
        }

        if (array_key_exists('webhook_url', $data)) {
            SystemSetting::updateOrCreate(
                ['key' => 'telegram_webhook_url'],
                ['value' => $data['webhook_url'] ?? '', 'group' => 'telegram'],
            );
        }

        $result = $telegram->verifyBot();
        $setting->update(['status' => $result['ok'] ? 'connected' : 'disconnected']);

        return response()->json(['settings' => $this->settings()]);
    }

    public function updateToggles(Request $request)
    {
        $data = $request->validate([
            'toggles' => ['required', 'array'],
            'toggles.*' => ['boolean'],
        ]);

        foreach ($data['toggles'] as $key => $value) {
            if (! in_array($key, self::TOGGLE_KEYS, true)) {
                continue;
            }

            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ? '1' : '0', 'group' => 'telegram'],
            );
        }

        return response()->json(['toggles' => $this->toggles()]);
    }

    public function updateTemplate(Request $request, TelegramTemplate $telegramTemplate)
    {
        $data = $request->validate([
            'message_template' => ['required', 'string', 'max:5000'],
            'is_active' => ['required', 'boolean'],
        ]);

        $telegramTemplate->update($data);

        return $telegramTemplate->fresh();
    }

    public function testChat(Request $request, TelegramNotificationService $telegram)
    {
        $data = $request->validate([
            'chat_id'   => ['required', 'string', 'max:120'],
            'topic_id'  => ['nullable', 'integer', 'min:1'],
        ]);

        $result = $telegram->sendRaw(
            $data['chat_id'],
            "✅ <b>SalesTrack Test</b>\nThis is a test message from your attendance system.\nChat ID: <code>{$data['chat_id']}</code>",
            $data['topic_id'] ?? null,
        );

        if (! $result['ok']) {
            return response()->json(['message' => $result['description']], 422);
        }

        return response()->json(['message' => 'Test message sent successfully.']);
    }

    public function testConnection(TelegramNotificationService $telegram)
    {
        $result = $telegram->verifyBot();
        TelegramSetting::query()->firstOrCreate([])->update([
            'status' => $result['ok'] ? 'connected' : 'disconnected',
        ]);

        if (! $result['ok']) {
            return response()->json(['message' => $result['description']], 422);
        }

        return response()->json([
            'message' => 'Telegram bot connection is active.',
            'bot' => $result['bot'],
            'settings' => $this->settings(),
        ]);
    }

    public function test(Request $request, TelegramNotificationService $telegram)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'exists:telegram_templates,type'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $result = $telegram->sendTestMessage($data['message'], $data['type']);

        if (! $result['ok']) {
            return response()->json(['message' => $result['description']], 422);
        }

        return response()->json([
            'message' => 'Test notification sent successfully.',
            'settings' => $this->settings(),
            'logs' => TelegramLog::query()->latest()->limit(20)->get(),
        ]);
    }

    private function settings(): array
    {
        $setting = TelegramSetting::query()->firstOrCreate([]);
        $lastLog = TelegramLog::query()->where('status', 'sent')->latest('sent_at')->first();

        return [
            'id' => $setting->id,
            'enabled' => $this->settingOn('telegram_bot_enabled', true),
            'bot_token' => $setting->bot_token ?: SystemSetting::where('key', 'telegram_bot_token')->value('value'),
            'chat_id' => $setting->chat_id ?: SystemSetting::where('key', 'telegram_default_chat_id')->value('value'),
            'webhook_url' => $setting->webhook_url ?: SystemSetting::where('key', 'telegram_webhook_url')->value('value'),
            'status' => $setting->status ?: 'disconnected',
            'last_notification_sent_at' => optional($lastLog?->sent_at ?: $setting->last_notification_sent_at)->toISOString(),
        ];
    }

    private function toggles(): array
    {
        $values = [];

        foreach (self::TOGGLE_KEYS as $key) {
            $values[$key] = $this->settingOn($key, true);
        }

        return $values;
    }

    private function settingOn(string $key, bool $default): bool
    {
        $value = SystemSetting::where('key', $key)->value('value');

        if ($value === null || $value === '') {
            return $default;
        }

        return in_array($value, ['1', 1, true], true);
    }
}
