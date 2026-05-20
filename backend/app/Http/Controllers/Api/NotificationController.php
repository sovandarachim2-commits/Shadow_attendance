<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $scope = $request->query('scope', 'mine');
        $canViewAll = $request->user()->hasPermission('notifications.manage');

        return Notification::query()
            ->when($scope !== 'all' || ! $canViewAll, fn ($query) => $query
                ->where(fn ($inner) => $inner
                    ->whereNull('user_id')
                    ->orWhere('user_id', $request->user()->id)))
            ->with(['user.employee'])
            ->latest()
            ->paginate((int) $request->query('per_page', 20));
    }

    public function store(Request $request)
    {
        if (! $request->user()->hasPermission('notifications.manage')) {
            abort(403, 'You cannot send notifications.');
        }

        $data = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:2000'],
            'type' => ['nullable', 'string', 'max:80'],
        ]);

        $target = ! empty($data['user_id'])
            ? User::query()->findOrFail($data['user_id'])
            : null;

        return Notification::create([
            'user_id' => $target?->id,
            'type' => $data['type'] ?? 'admin_message',
            'title' => $data['title'],
            'message' => $data['message'],
            'payload' => [
                'sent_by' => $request->user()->id,
                'target' => $target ? 'user' : 'all',
            ],
        ])->load(['user.employee']);
    }

    public function markRead(Request $request, Notification $notification)
    {
        if (
            $notification->user_id !== null
            && $notification->user_id !== $request->user()->id
            && ! $request->user()->hasPermission('notifications.manage')
        ) {
            abort(403, 'You cannot update this notification.');
        }

        $notification->update(['read_at' => now()]);

        return $notification;
    }
}
