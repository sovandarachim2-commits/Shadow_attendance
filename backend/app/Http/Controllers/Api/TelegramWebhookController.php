<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PermissionRequest;
use App\Models\TelegramPermissionReviewAction;
use App\Models\User;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;

class TelegramWebhookController extends Controller
{
    public function __invoke(Request $request, TelegramNotificationService $telegram)
    {
        $callback = $request->input('callback_query');
        if (! $callback) {
            $this->handleMessage($request, $telegram);
            return response()->json(['ok' => true]);
        }

        $callbackId = (string) ($callback['id'] ?? '');
        $chatId = (string) data_get($callback, 'message.chat.id', '');
        $data = (string) ($callback['data'] ?? '');

        if (! preg_match('/^pr:(approve|reject):(\d+):([a-f0-9]{12})$/', $data, $matches)) {
            $telegram->answerCallbackQuery($callbackId, 'សំណើមិនត្រឹមត្រូវ។', true);
            return response()->json(['ok' => true]);
        }

        [, $action, $requestId, $signature] = $matches;
        $payload = "pr:{$action}:{$requestId}";
        $expected = substr(hash_hmac('sha256', $payload, config('app.key')), 0, 12);

        if (! hash_equals($expected, $signature)) {
            $telegram->answerCallbackQuery($callbackId, 'សុវត្ថិភាពមិនត្រឹមត្រូវ។', true);
            return response()->json(['ok' => true]);
        }

        $telegram->answerCallbackQuery($callbackId, 'កំពុងរៀបចំសំណើ សូម Reply មូលហេតុ...');

        $user = User::query()
            ->with(['role.permissions', 'employee'])
            ->where('status', 'active')
            ->whereHas('employee', fn ($query) => $query->where('telegram_chat_id', $chatId))
            ->first();

        if (! $user || ! $user->hasPermission('requests.approve')) {
            $telegram->answerCallbackQuery($callbackId, 'អ្នកមិនមានសិទ្ធិអនុម័ត/បដិសេធសំណើនេះទេ។', true);
            return response()->json(['ok' => true]);
        }

        $permissionRequest = PermissionRequest::query()->find($requestId);
        if (! $permissionRequest) {
            $telegram->answerCallbackQuery($callbackId, 'រកមិនឃើញសំណើ។', true);
            return response()->json(['ok' => true]);
        }

        if ($permissionRequest->status !== 'pending') {
            $telegram->answerCallbackQuery($callbackId, 'សំណើនេះត្រូវបានពិនិត្យរួចហើយ។', true);
            return response()->json(['ok' => true]);
        }

        TelegramPermissionReviewAction::query()->updateOrCreate(
            [
                'permission_request_id' => $permissionRequest->id,
                'user_id' => $user->id,
            ],
            [
                'telegram_chat_id' => $chatId,
                'action' => $action,
            ]
        );

        $prompt = $action === 'approve'
            ? "សូម Reply មូលហេតុ HR ដើម្បីអនុម័តសំណើ {$permissionRequest->request_code}។"
            : "សូម Reply មូលហេតុ HR ដើម្បីបដិសេធសំណើ {$permissionRequest->request_code}។";

        $telegram->sendReply($chatId, $prompt, null, data_get($callback, 'message.message_id'));

        return response()->json(['ok' => true]);
    }

    private function handleMessage(Request $request, TelegramNotificationService $telegram): void
    {
        $message = $request->input('message');
        if (! $message) {
            return;
        }

        $chatId = (string) data_get($message, 'chat.id', '');
        $reason = trim((string) data_get($message, 'text', ''));

        if ($chatId === '' || $reason === '' || str_starts_with($reason, '/')) {
            return;
        }

        $pending = TelegramPermissionReviewAction::query()
            ->with(['permissionRequest', 'user.employee'])
            ->where('telegram_chat_id', $chatId)
            ->latest()
            ->first();

        if (! $pending) {
            return;
        }

        $permissionRequest = $pending->permissionRequest;
        if (! $permissionRequest || $permissionRequest->status !== 'pending') {
            $pending->delete();
            $telegram->sendReply($chatId, 'សំណើនេះត្រូវបានពិនិត្យរួចហើយ។', null, data_get($message, 'message_id'));
            return;
        }

        $status = $pending->action === 'approve' ? 'approved' : 'rejected';
        $permissionRequest->forceFill([
            'status' => $status,
            'admin_notes' => $reason,
            'reviewed_by' => $pending->user_id,
            'reviewed_at' => now(),
        ])->save();

        $pending->delete();

        $text = $status === 'approved'
            ? "✅ បានអនុម័តសំណើ {$permissionRequest->request_code}។"
            : "❌ បានបដិសេធសំណើ {$permissionRequest->request_code}។";

        $telegram->sendReply($chatId, $text, null, data_get($message, 'message_id'));
    }
}
