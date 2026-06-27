<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Notification;
use App\Models\PermissionRequest;
use App\Models\PermissionType;
use App\Models\User;
use App\Services\AttendanceService;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PermissionRequestController extends Controller
{
    private const TYPES = [
        'Late Check In',
        'Early Check Out',
        'Day Off',
        'Missing Check In',
        'Missing Check Out',
        'Personal Request',
    ];

    private const EVENT_KEY = 'permission_request';

    public function index(Request $request)
    {
        $query = PermissionRequest::query()
            ->with(['employee.department', 'replacementEmployee', 'reviewer'])
            ->when(
                ! $request->user()->hasPermission('requests.view_all'),
                fn ($q) => $q->where('employee_id', $request->user()->employee_id)
            )
            ->when($request->status, fn ($q, $status) => $q->where('status', strtolower($status)))
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->latest();

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request, TelegramNotificationService $telegram)
    {
        $employee = $request->user()->employee;

        if (! $employee) {
            throw ValidationException::withMessages(['employee' => 'Your account is not linked to an employee profile.']);
        }

        $data = $this->validatedPayload($request);
        $data = $this->normalizeDurationFields($data);

        $this->assertNoDuplicateActiveRequest($employee->id, $data);

        $attachment = $this->storeAttachment($request);

        $record = PermissionRequest::create([
            'employee_id' => $employee->id,
            'replacement_employee_id' => $data['replacement_employee_id'] ?? null,
            'request_code' => 'PR-PENDING-'.uniqid(),
            'type' => $data['type'],
            'request_date' => $data['request_date'],
            'request_date_end' => $data['request_date_end'],
            'request_time' => $data['request_time'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'total_hours' => $data['total_hours'] ?? null,
            'total_days' => $data['total_days'] ?? null,
            'day_part' => $data['day_part'] ?? null,
            'reason' => $data['reason'],
            'duration_type' => $data['duration_type'],
            'note' => $data['note'] ?? null,
            'attachment_path' => $attachment['path'] ?? null,
            'attachment_name' => $attachment['name'] ?? null,
            'attachment_mime' => $attachment['mime'] ?? null,
            'status' => 'pending',
            'is_emergency' => (bool) ($data['is_emergency'] ?? false),
            'gps_location' => $data['gps_location'] ?? null,
            'admin_notes' => 'Submitted and waiting for approval.',
        ]);

        $record->update([
            'request_code' => sprintf('PR-%s-%04d', $record->created_at->format('Y'), $record->id),
        ]);

        $record = $record->fresh(['employee', 'replacementEmployee', 'reviewer']);

        Notification::create([
            'user_id' => null,
            'type' => self::EVENT_KEY,
            'title' => "New Permission Request: {$record->request_code}",
            'message' => "{$employee->first_name} {$employee->last_name} submitted a {$record->type} for ".$this->formatDuration($record),
            'payload' => [
                'request_id' => $record->id,
                'request_code' => $record->request_code,
                'status' => $record->status,
            ],
        ]);

        $telegramResults = $telegram->sendWithResults($this->buildPermissionRequestMessage($record), $this->eventKeyForEmployee($employee));
        $this->storeTelegramMessageReference($record, $telegramResults);
        $this->sendPrivateAdminTelegram($telegram, $this->buildPermissionRequestMessage($record));
        $telegram->sendToEmployee($employee, $this->buildEmployeeRequestSubmittedMessage($record), 'permission_request_submitted_private');

        return $record;
    }

    public function update(Request $request, PermissionRequest $permissionRequest, AttendanceService $attendance, TelegramNotificationService $telegram)
    {
        $this->assertCanUpdateRequest($request, $permissionRequest);
        $shouldRefreshLateApproval = $permissionRequest->type === 'Late Check In';

        $data = $this->validatedPayload($request, true);
        $data = $this->normalizeDurationFields(array_merge([
            'type' => $permissionRequest->type,
            'request_date' => $permissionRequest->request_date->toDateString(),
            'request_date_end' => optional($permissionRequest->request_date_end)->toDateString() ?: $permissionRequest->request_date->toDateString(),
            'duration_type' => $permissionRequest->duration_type ?: 'single_day',
            'replacement_employee_id' => $permissionRequest->replacement_employee_id,
        ], $data));
        $shouldRefreshLateApproval = $shouldRefreshLateApproval || ($data['type'] ?? null) === 'Late Check In';

        if (array_key_exists('status', $data)) {
            if (! $request->user()->hasPermission('requests.approve')) {
                abort(403, 'You do not have permission to change request status.');
            }

            if ($data['status'] === 'pending') {
                $data['admin_notes'] = $data['admin_notes'] ?? 'Submitted and waiting for approval.';
                $data['reviewed_by'] = null;
                $data['reviewed_at'] = null;
            } else {
                $data['admin_notes'] = $data['admin_notes'] ?? ($data['status'] === 'approved' ? 'Approved.' : 'Rejected.');
                $data['reviewed_by'] = $request->user()->id;
                $data['reviewed_at'] = now();
            }
        }

        $this->assertNoDuplicateActiveRequest($permissionRequest->employee_id, $data, $permissionRequest->id);

        $attachment = $this->storeAttachment($request);
        if ($attachment) {
            $data = array_merge($data, [
                'attachment_path' => $attachment['path'],
                'attachment_name' => $attachment['name'],
                'attachment_mime' => $attachment['mime'],
            ]);
        }

        $permissionRequest->update($data);

        $updated = $permissionRequest->fresh(['employee', 'replacementEmployee', 'reviewer']);

        if ($shouldRefreshLateApproval) {
            $attendance->applyLateCheckInApproval($updated);
        }

        $this->replyToPermissionRequestMessage(
            $telegram,
            $updated,
            $this->buildUpdatedReplyMessage($updated, $request->user()->name ?? 'Admin')
        );

        return $updated;
    }

    public function updateStatus(Request $request, PermissionRequest $permissionRequest, TelegramNotificationService $telegram, AttendanceService $attendance)
    {
        if ($permissionRequest->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'Only pending requests can be reviewed.']);
        }

        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $permissionRequest->update([
            'status' => $data['status'],
            'admin_notes' => $data['admin_notes'] ?? ($data['status'] === 'approved' ? 'Approved.' : 'Rejected.'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $updated = $permissionRequest->fresh(['employee', 'replacementEmployee', 'reviewer']);
        $attendance->applyLateCheckInApproval($updated);
        $employeeUserId = optional($updated->employee->user)->id;
        $statusLabel = ucfirst($updated->status);
        $adminName = $request->user()->name ?? 'Admin';

        Notification::create([
            'user_id' => $employeeUserId,
            'type' => self::EVENT_KEY,
            'title' => "Permission Request {$updated->request_code} {$statusLabel}",
            'message' => "Your {$updated->type} has been {$statusLabel} by {$adminName}.",
            'payload' => [
                'request_id' => $updated->id,
                'request_code' => $updated->request_code,
                'status' => $updated->status,
            ],
        ]);

        $telegram->send($this->buildStatusMessage($updated, $adminName), $this->eventKeyForEmployee($updated->employee));
        $telegram->sendToEmployee($updated->employee, $this->buildStatusMessage($updated, $adminName), 'permission_status_private');

        return $updated;
    }

    public function destroy(Request $request, PermissionRequest $permissionRequest, TelegramNotificationService $telegram)
    {
        $this->assertOwnPending($request, $permissionRequest);
        $permissionRequest->loadMissing(['employee', 'replacementEmployee', 'reviewer']);

        $this->replyToPermissionRequestMessage(
            $telegram,
            $permissionRequest,
            $this->buildDeletedReplyMessage($permissionRequest, $request->user()->name ?? 'User')
        );

        $permissionRequest->delete();

        return response()->noContent();
    }

    public function replacements()
    {
        return response()->json([
            'data' => Employee::query()
                ->with(['user.role'])
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereDoesntHave('user.role')
                        ->orWhereHas('user.role', fn ($role) => $role->whereNotIn('slug', ['admin', 'super_admin']));
                })
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'employee_code']),
        ]);
    }

    private function validatedPayload(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'type' => [$required, 'string', 'max:100'],
            'replacement_employee_id' => ['nullable', 'exists:employees,id'],
            'request_date' => [$required, 'date'],
            'request_date_end' => ['nullable', 'date', 'after_or_equal:request_date'],
            'request_time' => ['nullable', 'string', 'max:20'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'total_hours' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'total_days' => ['nullable', 'integer', 'min:1', 'max:366'],
            'day_part' => ['nullable', Rule::in(['Full Day', 'Half Day'])],
            'duration_type' => ['nullable', Rule::in(['single_day', 'multiple_day', 'hours'])],
            'reason' => [$required, 'string', 'max:5000'],
            'note' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected'])],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
            'is_emergency' => ['nullable', 'boolean'],
            'gps_location' => ['nullable', 'string', 'max:500'],
        ]);
    }

    private function normalizeDurationFields(array $data): array
    {
        $data['duration_type'] ??= 'single_day';
        $data['request_date_end'] ??= $data['request_date'];

        if ($data['request_date_end'] < $data['request_date']) {
            throw ValidationException::withMessages(['request_date_end' => 'End date must be on or after start date.']);
        }

        $data['replacement_employee_id'] = $data['replacement_employee_id'] ?? null;
        if ($data['replacement_employee_id']) {
            $isProtected = Employee::query()
                ->whereKey($data['replacement_employee_id'])
                ->whereHas('user.role', fn ($role) => $role->whereIn('slug', ['admin', 'super_admin']))
                ->exists();

            if ($isProtected) {
                throw ValidationException::withMessages(['replacement_employee_id' => 'Admin and Super Admin cannot be selected as replacement.']);
            }
        }

        if ($data['duration_type'] === 'hours') {
            if ($this->usesSingleRequestTime($data['type'] ?? null)) {
                $time = $data['request_time'] ?? $data['start_time'] ?? null;
                if (empty($time)) {
                    throw ValidationException::withMessages(['request_time' => 'Request time is required.']);
                }

                $data['request_date_end'] = $data['request_date'];
                $data['request_time'] = $time;
                $data['start_time'] = $time;
                $data['end_time'] = null;
                $data['total_days'] = 1;
                $data['day_part'] = null;
                $data['total_hours'] = null;
            } elseif (empty($data['start_time']) || empty($data['end_time'])) {
                throw ValidationException::withMessages(['start_time' => 'Start time and end time are required for hours requests.']);
            } else {
                if ($data['end_time'] <= $data['start_time']) {
                    throw ValidationException::withMessages(['end_time' => 'End time must be after start time.']);
                }

                $data['request_date_end'] = $data['request_date'];
                $data['request_time'] = $data['start_time'];
                $data['total_days'] = 1;
                $data['day_part'] = null;
                $data['total_hours'] = $data['total_hours'] ?? round((strtotime($data['end_time']) - strtotime($data['start_time'])) / 3600, 2);
            }
        } elseif ($data['duration_type'] === 'multiple_day') {
            $data['start_time'] = null;
            $data['end_time'] = null;
            $data['request_time'] = null;
            $data['total_hours'] = null;
            $data['day_part'] = null;
            $data['total_days'] = $data['total_days'] ?? (int) ((strtotime($data['request_date_end']) - strtotime($data['request_date'])) / 86400) + 1;
        } else {
            $data['duration_type'] = 'single_day';
            $data['request_date_end'] = $data['request_date'];
            $data['start_time'] = null;
            $data['end_time'] = null;
            $data['request_time'] = null;
            $data['total_hours'] = null;
            $data['total_days'] = 1;
            $data['day_part'] = $data['day_part'] ?? 'Full Day';
        }

        $this->enforcePermissionTypeDuration($data);

        return $data;
    }

    private function enforcePermissionTypeDuration(array $data): void
    {
        $type = PermissionType::query()->where('name', $data['type'])->first();

        if (! $type) {
            return;
        }

        if ($type->duration_control !== 'any' && $data['duration_type'] !== $type->duration_control) {
            throw ValidationException::withMessages([
                'duration_type' => "{$type->name} must use {$this->durationControlLabel($type->duration_control)}.",
            ]);
        }

        if ($type->duration_control === 'hours' && $type->max_hours !== null && (float) ($data['total_hours'] ?? 0) > (float) $type->max_hours) {
            throw ValidationException::withMessages([
                'total_hours' => "{$type->name} cannot be more than {$type->max_hours} hour(s).",
            ]);
        }
    }

    private function usesSingleRequestTime(?string $type): bool
    {
        return in_array($type, ['Late Check In', 'Early Check Out'], true);
    }

    private function durationControlLabel(string $control): string
    {
        return match ($control) {
            'single_day' => 'Single Day',
            'multiple_day' => 'Multiple Day',
            'hours' => 'Hours',
            default => 'Any Duration',
        };
    }

    private function storeAttachment(Request $request): ?array
    {
        if (! $request->hasFile('attachment')) {
            return null;
        }

        $file = $request->file('attachment');
        $path = $file->store('permission-requests', 'public');

        return [
            'path' => Storage::disk('public')->url($path),
            'name' => $file->getClientOriginalName(),
            'mime' => $file->getClientMimeType(),
        ];
    }

    private function sendPrivateAdminTelegram(TelegramNotificationService $telegram, string $message): void
    {
        User::query()
            ->with(['role', 'employee'])
            ->where('status', 'active')
            ->whereHas('role', fn ($query) => $query->whereIn('slug', ['super_admin', 'admin']))
            ->whereHas('employee', fn ($query) => $query->whereNotNull('telegram_chat_id')->where('telegram_chat_id', '!=', ''))
            ->get()
            ->each(fn (User $user) => $telegram->sendToEmployee($user->employee, $message, 'permission_request_admin_private'));
    }

    private function storeTelegramMessageReference(PermissionRequest $record, array $results): void
    {
        $sent = collect($results)->first(fn ($result) => ($result['ok'] ?? false) && ! empty($result['message_id']));

        if (! $sent) {
            return;
        }

        $record->forceFill([
            'telegram_chat_id' => (string) ($sent['chat_id'] ?? ''),
            'telegram_message_thread_id' => $sent['message_thread_id'] ?? null,
            'telegram_message_id' => $sent['message_id'],
        ])->save();
    }

    private function replyToPermissionRequestMessage(TelegramNotificationService $telegram, PermissionRequest $record, string $message): void
    {
        if ($record->telegram_chat_id && $record->telegram_message_id) {
            $telegram->sendReply(
                $record->telegram_chat_id,
                $message,
                $record->telegram_message_thread_id,
                $record->telegram_message_id
            );

            return;
        }

        $telegram->send($message, $this->eventKeyForEmployee($record->employee));
    }

    private function eventKeyForEmployee($employee): string
    {
        return $employee?->employment_type === 'outdoor_sales'
            ? 'outdoor_permission_request'
            : 'office_permission_request';
    }

    private function buildPermissionRequestMessage(PermissionRequest $record): string
    {
        $employee = $record->employee;

        return "📄 <b>NEW PERMISSION REQUEST</b>\n\n"
            ."👤 <b>Employee:</b> {$employee->first_name} {$employee->last_name}\n"
            ."📌 <b>Type:</b> {$record->type}\n"
            ."📅 <b>Duration:</b> {$this->formatDuration($record)}\n"
            ."📝 <b>Reason:</b> {$record->reason}\n\n"
            ."⏳ <b>Status:</b> Pending Approval";
    }

    private function buildEmployeeRequestSubmittedMessage(PermissionRequest $record): string
    {
        return "📄 <b>Your permission request was submitted</b>\n\n"
            ."<b>Request:</b> {$record->request_code}\n"
            ."<b>Type:</b> {$record->type}\n"
            ."<b>Duration:</b> {$this->formatDuration($record)}\n"
            ."<b>Reason:</b> {$record->reason}\n\n"
            ."⏳ <b>Status:</b> Pending Approval";
    }

    private function buildStatusMessage(PermissionRequest $record, string $adminName): string
    {
        $status = ucfirst($record->status);

        return "📄 <b>PERMISSION REQUEST {$status}</b>\n\n"
            ."👤 <b>Employee:</b> {$record->employee->first_name} {$record->employee->last_name}\n"
            ."📌 <b>Type:</b> {$record->type}\n"
            ."📅 <b>Duration:</b> {$this->formatDuration($record)}\n"
            ."👨‍💼 <b>Reviewed by:</b> {$adminName}\n"
            ."📝 <b>Note:</b> {$record->admin_notes}";
    }

    private function buildUpdatedReplyMessage(PermissionRequest $record, string $actorName): string
    {
        $status = ucfirst($record->status);

        return "<b>PERMISSION REQUEST UPDATED</b>\n\n"
            ."<b>Request:</b> {$record->request_code}\n"
            ."<b>Employee:</b> {$record->employee->first_name} {$record->employee->last_name}\n"
            ."<b>Type:</b> {$record->type}\n"
            ."<b>Duration:</b> {$this->formatDuration($record)}\n"
            ."<b>Status:</b> {$status}\n"
            ."<b>Updated by:</b> {$actorName}\n"
            ."<b>HR Reason:</b> {$record->admin_notes}";
    }

    private function buildDeletedReplyMessage(PermissionRequest $record, string $actorName): string
    {
        return "<b>PERMISSION REQUEST CANCELLED</b>\n\n"
            ."<b>Request:</b> {$record->request_code}\n"
            ."<b>Employee:</b> {$record->employee->first_name} {$record->employee->last_name}\n"
            ."<b>Type:</b> {$record->type}\n"
            ."<b>Duration:</b> {$this->formatDuration($record)}\n"
            ."<b>Cancelled by:</b> {$actorName}";
    }

    private function formatDuration(PermissionRequest $record): string
    {
        $start = $record->request_date->format('d M Y');
        $endDate = $record->request_date_end ?? $record->request_date;
        $end = $endDate->format('d M Y');

        if ($record->duration_type === 'hours') {
            $from = $record->start_time ?: $record->request_time;
            $to = $record->end_time;
            if ($this->usesSingleRequestTime($record->type)) {
                return trim("{$start} {$from}");
            }
            $hours = $record->total_hours ? " ({$record->total_hours} hour(s))" : '';
            return trim("{$start} {$from} - {$to}{$hours}");
        }

        if ($record->duration_type === 'single_day') {
            return trim($start.' '.($record->day_part ?: 'Full Day'));
        }

        $days = $record->total_days ? " ({$record->total_days} day(s))" : '';

        return ($end === $start ? $start : "{$start} - {$end}").$days;
    }

    private function assertOwnPending(Request $request, PermissionRequest $permissionRequest): void
    {
        if ($permissionRequest->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'Only pending requests can be changed.']);
        }

        $canManageAll = $request->user()->hasPermission('requests.view_all');

        if (! $canManageAll && $permissionRequest->employee_id !== $request->user()->employee_id) {
            abort(403, 'You can only modify your own permission requests.');
        }
    }

    private function assertCanUpdateRequest(Request $request, PermissionRequest $permissionRequest): void
    {
        if ($request->user()->hasPermission('requests.view_all')) {
            return;
        }

        $this->assertOwnPending($request, $permissionRequest);
    }

    private function assertNoDuplicateActiveRequest(int $employeeId, array $data, ?int $ignoreId = null): void
    {
        $duplicate = PermissionRequest::query()
            ->where('employee_id', $employeeId)
            ->where('type', $data['type'])
            ->whereDate('request_date', $data['request_date'])
            ->whereDate('request_date_end', $data['request_date_end'])
            ->when(
                array_key_exists('request_time', $data) && $data['request_time'],
                fn ($query) => $query->where('request_time', $data['request_time']),
                fn ($query) => $query->whereNull('request_time')
            )
            ->whereIn('status', ['pending', 'approved'])
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();

        if ($duplicate) {
            throw ValidationException::withMessages([
                'request_date' => 'You already have this permission request for the selected date and time.',
            ]);
        }
    }
}
