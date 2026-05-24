<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\TelegramDestination;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TelegramDestinationController extends Controller
{
    private const EVENTS = [
        'daily_attendance',
        'office_attendance',
        'outdoor_attendance',
        'permission_request',
        'office_permission_request',
        'outdoor_permission_request',
        'late_attendance',
        'office_late_attendance',
        'outdoor_late_attendance',
        'missing_checkout',
        'outdoor_visit',
        'system_alert',
        'bonus_approved',
        'other',
    ];

    private const EVENT_LABELS = [
        'daily_attendance' => 'Daily Attendance',
        'office_attendance' => 'Office Staff Attendance',
        'outdoor_attendance' => 'Outdoor Sales Attendance',
        'permission_request' => 'Permission Requests',
        'office_permission_request' => 'Office Staff Permission Requests',
        'outdoor_permission_request' => 'Outdoor Sales Permission Requests',
        'late_attendance' => 'Late Attendance',
        'office_late_attendance' => 'Office Staff Late Attendance',
        'outdoor_late_attendance' => 'Outdoor Sales Late Attendance',
        'missing_checkout' => 'Missing Check Out',
        'outdoor_visit' => 'Outdoor Visits',
        'system_alert' => 'System Alerts',
        'bonus_approved' => 'Bonus Approved',
        'other' => 'Other',
    ];

    public function events()
    {
        return collect(self::EVENT_LABELS)->map(fn ($label, $value) => [
            'value' => $value,
            'label' => $label,
        ])->values();
    }

    public function index()
    {
        return TelegramDestination::query()
            ->orderBy('event_key')
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        return TelegramDestination::create($this->validated($request));
    }

    public function update(Request $request, TelegramDestination $telegramDestination)
    {
        $telegramDestination->update($this->validated($request));

        return $telegramDestination->fresh();
    }

    public function destroy(TelegramDestination $telegramDestination)
    {
        $telegramDestination->delete();

        return response()->noContent();
    }

    public function test(TelegramDestination $telegramDestination, TelegramNotificationService $telegram)
    {
        if ($telegramDestination->event_key === 'outdoor_visit') {
            $result = $telegram->sendToDestination($telegramDestination, $this->sampleVisitMessage());

            if (! $result['ok']) {
                return response()->json(['message' => $result['description']], 422);
            }

            return response()->json(['message' => 'Test visit notification sent.']);
        }

        $result = $telegram->sendToDestination(
            $telegramDestination,
            "✅ <b>SalesTrack Test</b>\nThis is a test message from your attendance system.\nDestination: <b>{$telegramDestination->name}</b>"
        );

        if (! $result['ok']) {
            return response()->json(['message' => $result['description']], 422);
        }

        return response()->json(['message' => 'Test message sent successfully.']);
    }

    private function sampleVisitMessage(): string
    {
        $now    = now()->format('d/m/Y H:i');
        $mapUrl = 'https://maps.google.com/?q=11.5625,104.916022';

        return "🏪 <b>CUSTOMER VISIT COMPLETED</b>\n\n"
            . "👤 Seller: <b>Sokha Chan</b>\n"
            . "🆔 Employee ID: <b>EMP-1042</b>\n\n"
            . "🧑 Customer: <b>Lakamo Shop</b>\n"
            . "📞 Phone: 012 345 678\n"
            . "🏬 Store: Lakamo Store\n\n"
            . "📍 Address:\nNo. 123, Street 99, Phnom Penh\n📌 Phnom Penh\n\n"
            . "🛰 <a href=\"{$mapUrl}\">Open Map</a>\n"
            . "🤳 <a href=\"https://placehold.co/600x800/3b82f6/ffffff.jpg\">View Selfie</a>\n"
            . "🏬 <a href=\"https://placehold.co/800x600/22c55e/ffffff.jpg\">View Store Photo</a>\n\n"
            . "🕒 {$now}  ✅ Visit Completed";
    }

    public function verifyBot(TelegramNotificationService $telegram)
    {
        $result = $telegram->verifyBot();

        if (! $result['ok']) {
            return response()->json(['message' => $result['description']], 422);
        }

        $bot = $result['bot'];
        return response()->json([
            'message' => 'Bot is valid.',
            'bot'     => [
                'id'       => $bot['id'],
                'name'     => $bot['first_name'],
                'username' => '@'.$bot['username'],
            ],
        ]);
    }

    public function saveToken(Request $request, TelegramNotificationService $telegram)
    {
        $data = $request->validate([
            'bot_token' => ['required', 'string', 'min:10', 'max:200'],
        ]);

        SystemSetting::updateOrCreate(
            ['key' => 'telegram_bot_token'],
            ['value' => trim($data['bot_token']), 'group' => 'telegram'],
        );

        $result = $telegram->verifyBot();

        if (! $result['ok']) {
            return response()->json(['message' => 'Token saved but verification failed: '.$result['description']], 422);
        }

        $bot = $result['bot'];
        return response()->json([
            'message' => 'Bot token saved and verified.',
            'bot'     => [
                'id'       => $bot['id'],
                'name'     => $bot['first_name'],
                'username' => '@'.$bot['username'],
            ],
        ]);
    }

    public function getTokenStatus(TelegramNotificationService $telegram)
    {
        $hasDbToken = SystemSetting::where('key', 'telegram_bot_token')
            ->whereNotNull('value')
            ->where('value', '!=', '')
            ->exists();

        $result = $telegram->verifyBot();

        return response()->json([
            'has_token'  => $hasDbToken || config('services.telegram.bot_token'),
            'source'     => $hasDbToken ? 'database' : (config('services.telegram.bot_token') ? 'env' : 'none'),
            'verified'   => $result['ok'],
            'bot'        => $result['ok'] ? $result['bot'] : null,
            'error'      => $result['ok'] ? null : $result['description'],
        ]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'event_key' => ['required', 'string', Rule::in(self::EVENTS)],
            'chat_id' => ['nullable', 'string', 'max:120'],
            'message_thread_id' => ['nullable', 'integer', 'min:1'],
            'enabled' => ['required', 'boolean'],
            'send_photo' => ['sometimes', 'boolean'],
        ]);

        $data['chat_id'] = trim((string) ($data['chat_id'] ?? ''));

        if ($data['enabled'] && $data['chat_id'] === '') {
            abort(422, 'Chat ID is required when a Telegram destination is enabled.');
        }

        return $data;
    }
}
