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
use App\Services\WorkScheduleService;
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
        'Personal Leave',
    ];

    private const EVENT_KEY = 'permission_request';

    public function __construct(private WorkScheduleService $workSchedules) {}

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

        $this->enforcePermissionTypeDuration($employee->id, $data);
        $this->assertPermissionTypeAvailable($employee->id, $data);
        $this->assertSingleTimeWithinMaxHours($employee->id, $data);
        $this->assertNoDuplicateActiveRequest($employee->id, $data);
        $this->assertPermissionAllowance($employee->id, $data);

        $attachment = $this->storeAttachment($request);

        $record = PermissionRequest::create([
            'employee_id' => $employee->id,
            'replacement_employee_id' => $data['replacement_employee_id'] ?? null,
            'request_code' => 'PR-PENDING-'.uniqid(),
            'type' => $data['type'],
            'request_date' => $data['request_date'],
            'request_date_end' => $data['request_date_end'],
            'return_date' => $data['return_date'] ?? null,
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

        $this->createReviewerNotifications($record);

        $telegramResults = $telegram->sendWithResults($this->buildPermissionRequestMessage($record), $this->eventKeyForEmployee($employee));
        $this->storeTelegramMessageReference($record, $telegramResults);
        $this->sendPrivateAdminTelegram($telegram, $record, $this->buildPermissionRequestMessage($record));
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
            'return_date' => optional($permissionRequest->return_date)->toDateString(),
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

        $this->enforcePermissionTypeDuration($permissionRequest->employee_id, $data);
        $this->assertPermissionTypeAvailable($permissionRequest->employee_id, $data);
        $this->assertSingleTimeWithinMaxHours($permissionRequest->employee_id, $data);
        $this->assertNoDuplicateActiveRequest($permissionRequest->employee_id, $data, $permissionRequest->id);
        $this->assertPermissionAllowance($permissionRequest->employee_id, $data, $permissionRequest->id);

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
            'type' => [$required, 'string', 'max:100', Rule::in(self::TYPES)],
            'replacement_employee_id' => ['nullable', 'exists:employees,id'],
            'request_date' => [$required, 'date'],
            'request_date_end' => ['nullable', 'date', 'after_or_equal:request_date'],
            'return_date' => ['nullable', 'date', 'after:request_date_end'],
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
        $data['return_date'] ??= null;

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

        if ($this->usesDateOnlyRequest($data['type'] ?? null)) {
            $data['duration_type'] = 'single_day';
            $data['request_date_end'] = $data['request_date'];
            $data['start_time'] = null;
            $data['end_time'] = null;
            $data['request_time'] = null;
            $data['total_hours'] = null;
            $data['total_days'] = 1;
            $data['day_part'] = null;
        } elseif ($this->usesDayRangeRequest($data['type'] ?? null)) {
            if ($data['duration_type'] === 'hours') {
                throw ValidationException::withMessages([
                    'duration_type' => "{$data['type']} can only use Single Day or Multiple Day.",
                ]);
            }

            if ($data['duration_type'] === 'multiple_day') {
                $data['start_time'] = null;
                $data['end_time'] = null;
                $data['request_time'] = null;
                $data['total_hours'] = null;
                $data['day_part'] = null;
                $data['total_days'] = $data['total_days'] ?? (int) ((strtotime($data['request_date_end']) - strtotime($data['request_date'])) / 86400) + 1;

                if (empty($data['return_date'])) {
                    throw ValidationException::withMessages([
                        'return_date' => 'Please select the date you will come back.',
                    ]);
                }
            } else {
                $data['duration_type'] = 'single_day';
                $data['request_date_end'] = $data['request_date'];
                if (($data['day_part'] ?? 'Full Day') === 'Half Day') {
                    $time = $data['request_time'] ?? $data['start_time'] ?? null;
                    if (empty($time)) {
                        throw ValidationException::withMessages([
                            'request_time' => 'Please select the time you want to go.',
                        ]);
                    }
                    $data['request_time'] = $time;
                    $data['start_time'] = $time;
                } else {
                    $data['request_time'] = null;
                    $data['start_time'] = null;
                }
                $data['end_time'] = null;
                $data['total_hours'] = null;
                $data['total_days'] = 1;
                $data['day_part'] = $data['day_part'] ?? 'Full Day';
                $data['return_date'] = null;
            }
        } elseif ($data['duration_type'] === 'hours') {
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

        return $data;
    }

    private function enforcePermissionTypeDuration(int $employeeId, array $data): void
    {
        $type = $this->effectivePermissionType($data['type'], $employeeId, $data['request_date']);

        if (! $type) {
            return;
        }

        if (! $type->is_active) {
            throw ValidationException::withMessages([
                'type' => "{$type->name} is not available for new requests.",
            ]);
        }

        if (! $this->usesDateOnlyRequest($data['type'] ?? null) && ! $this->usesDayRangeRequest($data['type'] ?? null) && $type->duration_control !== 'any' && $data['duration_type'] !== $type->duration_control) {
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

    private function usesDateOnlyRequest(?string $type): bool
    {
        return in_array($type, ['Missing Check In', 'Missing Check Out'], true);
    }

    private function usesDayRangeRequest(?string $type): bool
    {
        return in_array($type, ['Day Off', 'Personal Leave'], true);
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

    private function sendPrivateAdminTelegram(TelegramNotificationService $telegram, PermissionRequest $record, string $message): void
    {
        $keyboard = $this->telegramReviewKeyboard($record);

        User::query()
            ->with(['role.permissions', 'employee'])
            ->where('status', 'active')
            ->whereHas('role', fn ($query) => $query
                ->whereIn('slug', ['super_admin', 'admin'])
                ->orWhereHas('permissions', fn ($permissionQuery) => $permissionQuery
                    ->whereIn('slug', ['requests.view_all', 'requests.approve'])))
            ->whereHas('employee', fn ($query) => $query->whereNotNull('telegram_chat_id')->where('telegram_chat_id', '!=', ''))
            ->get()
            ->unique('employee_id')
            ->each(fn (User $user) => $telegram->sendToEmployeeWithKeyboard($user->employee, $message, $keyboard, 'permission_request_reviewer_private'));
    }

    private function telegramReviewKeyboard(PermissionRequest $record): array
    {
        return [
            'inline_keyboard' => [[
                [
                    'text' => '✅ អនុម័ត',
                    'callback_data' => $this->telegramReviewCallbackData($record, 'approve'),
                ],
                [
                    'text' => '❌ បដិសេធ',
                    'callback_data' => $this->telegramReviewCallbackData($record, 'reject'),
                ],
            ]],
        ];
    }

    private function telegramReviewCallbackData(PermissionRequest $record, string $action): string
    {
        $payload = "pr:{$action}:{$record->id}";
        $signature = substr(hash_hmac('sha256', $payload, config('app.key')), 0, 12);

        return "{$payload}:{$signature}";
    }

    private function createReviewerNotifications(PermissionRequest $record): void
    {
        $employee = $record->employee;
        $payload = [
            'type' => self::EVENT_KEY,
            'title' => "New Permission Request: {$record->request_code}",
            'message' => "{$employee->first_name} {$employee->last_name} submitted a {$record->type} for ".$this->formatDuration($record),
            'payload' => [
                'request_id' => $record->id,
                'request_code' => $record->request_code,
                'status' => $record->status,
            ],
        ];

        User::query()
            ->with('role.permissions')
            ->where('status', 'active')
            ->whereHas('role', fn ($query) => $query
                ->where('slug', 'super_admin')
                ->orWhereHas('permissions', fn ($permissionQuery) => $permissionQuery
                    ->whereIn('slug', ['requests.view_all', 'requests.approve'])))
            ->get()
            ->each(fn (User $user) => Notification::create($payload + ['user_id' => $user->id]));
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
        return "📄 <b>សំណើសុំអនុញ្ញាតថ្មី</b>\n\n"
            .$this->telegramRequestFields($record)."\n\n"
            ."⏳ <b>ស្ថានភាព:</b> រង់ចាំអនុម័ត";
    }

    private function buildEmployeeRequestSubmittedMessage(PermissionRequest $record): string
    {
        return "📄 <b>សំណើសុំអនុញ្ញាតរបស់អ្នកត្រូវបានដាក់ស្នើ</b>\n\n"
            .$this->telegramRequestFields($record, false)."\n\n"
            ."⏳ <b>ស្ថានភាព:</b> រង់ចាំអនុម័ត";
    }

    private function buildStatusMessage(PermissionRequest $record, string $adminName): string
    {
        $status = $this->khmerStatus($record->status);

        return "📄 <b>សំណើសុំអនុញ្ញាត {$status}</b>\n\n"
            .$this->telegramRequestFields($record)."\n"
            ."👨‍💼 <b>ពិនិត្យដោយ:</b> {$adminName}\n"
            ."📝 <b>ចំណាំ:</b> {$record->admin_notes}";
    }

    private function buildUpdatedReplyMessage(PermissionRequest $record, string $actorName): string
    {
        $status = $this->khmerStatus($record->status);

        return "<b>សំណើសុំអនុញ្ញាតត្រូវបានកែប្រែ</b>\n\n"
            .$this->telegramRequestFields($record)."\n"
            ."<b>ស្ថានភាព:</b> {$status}\n"
            ."<b>កែប្រែដោយ:</b> {$actorName}\n"
            ."<b>មូលហេតុ HR:</b> {$record->admin_notes}";
    }

    private function buildDeletedReplyMessage(PermissionRequest $record, string $actorName): string
    {
        return "<b>សំណើសុំអនុញ្ញាតត្រូវបានបោះបង់</b>\n\n"
            .$this->telegramRequestFields($record)."\n"
            ."<b>បោះបង់ដោយ:</b> {$actorName}";
    }

    private function telegramRequestFields(PermissionRequest $record, bool $includeEmployee = true): string
    {
        $record->loadMissing(['employee', 'replacementEmployee']);
        $employee = $record->employee;
        $replacement = $record->replacementEmployee;
        $lines = [
            "🆔 លេខសំណើ: {$this->telegramText($record->request_code)}",
        ];

        if ($includeEmployee) {
            $employeeName = trim(($employee->first_name ?? '').' '.($employee->last_name ?? ''));
            $lines[] = "👤 បុគ្គលិក: {$this->telegramText($employeeName ?: '-')}";
        }

        $lines[] = "📌 ប្រភេទសំណើ: {$this->telegramText($this->khmerRequestType($record->type))}";

        if ($this->usesSingleRequestTime($record->type)) {
            $timeLabel = $record->type === 'Early Check Out' ? 'ម៉ោងចេញដែលស្នើ' : 'ម៉ោងចូលដែលស្នើ';
            $lines[] = "📅 កាលបរិច្ឆេទ: ".$record->request_date->format('d M Y');
            $lines[] = "🕒 {$timeLabel}: {$this->telegramText($record->request_time ?: $record->start_time)}";
        } elseif ($this->usesDateOnlyRequest($record->type)) {
            $lines[] = "📅 កាលបរិច្ឆេទ: ".$record->request_date->format('d M Y');
        } elseif ($record->duration_type === 'multiple_day') {
            $lines[] = "📅 ថ្ងៃចាប់ផ្តើម: ".$record->request_date->format('d M Y');
            $lines[] = "📅 ថ្ងៃបញ្ចប់: ".($record->request_date_end ?: $record->request_date)->format('d M Y');
            if ($record->return_date) {
                $lines[] = "🔁 ថ្ងៃត្រឡប់មកវិញ: ".$record->return_date->format('d M Y');
            }
            if ($record->total_days) {
                $lines[] = "📆 សរុបថ្ងៃ: {$this->telegramText($record->total_days)} ថ្ងៃ";
            }
        } else {
            $lines[] = "📅 កាលបរិច្ឆេទ: ".$record->request_date->format('d M Y');
            $lines[] = "🗓 រយៈពេលថ្ងៃ: {$this->telegramText($this->khmerDayPart($record->day_part ?: 'Full Day'))}";
            if ($record->day_part === 'Half Day' && $record->request_time) {
                $lines[] = "🕒 ម៉ោងទៅធ្វើការ: {$this->telegramText($record->request_time)}";
            }
        }

        if ($replacement) {
            $replacementName = trim(($replacement->first_name ?? '').' '.($replacement->last_name ?? ''));
            $lines[] = "👥 បុគ្គលិកជំនួស: {$this->telegramText($replacementName ?: '-')}";
        }

        if ($record->attachment_name) {
            $lines[] = "📎 ឯកសារភ្ជាប់: {$this->telegramText($record->attachment_name)}";
        }

        $lines[] = "📝 មូលហេតុ: {$this->telegramText($record->reason)}";

        if ($record->note) {
            $lines[] = "💬 ចំណាំបន្ថែម: {$this->telegramText($record->note)}";
        }

        return implode("\n", $lines);
    }

    private function telegramText($value): string
    {
        return htmlspecialchars((string) ($value ?? '-'), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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
            $hours = $record->total_hours ? " ({$record->total_hours} ម៉ោង)" : '';
            return trim("{$start} {$from} - {$to}{$hours}");
        }

        if ($this->usesDateOnlyRequest($record->type)) {
            return $start;
        }

        if ($record->duration_type === 'single_day') {
            $dayPart = $record->day_part ?: 'Full Day';
            $time = $dayPart === 'Half Day' && $record->request_time ? " (ម៉ោងទៅធ្វើការ {$record->request_time})" : '';

            return trim($start.' '.$this->khmerDayPart($dayPart).$time);
        }

        $days = $record->total_days ? " ({$record->total_days} ថ្ងៃ)" : '';
        $returnDate = $record->return_date ? ' | ថ្ងៃត្រឡប់មកវិញ '.$record->return_date->format('d M Y') : '';

        return ($end === $start ? $start : "{$start} - {$end}").$days.$returnDate;
    }

    private function khmerRequestType(?string $type): string
    {
        return match ($type) {
            'Late Check In' => 'ចូលយឺត',
            'Early Check Out' => 'ចេញមុនម៉ោង',
            'Day Off' => 'ឈប់សម្រាក',
            'Missing Check In' => 'ភ្លេចចុះម៉ោងចូល',
            'Missing Check Out' => 'ភ្លេចចុះម៉ោងចេញ',
            'Personal Leave' => 'ច្បាប់ផ្ទាល់ខ្លួន',
            default => (string) $type,
        };
    }

    private function khmerStatus(?string $status): string
    {
        return match (strtolower((string) $status)) {
            'approved' => 'បានអនុម័ត',
            'rejected' => 'បានបដិសេធ',
            'pending' => 'រង់ចាំអនុម័ត',
            default => (string) $status,
        };
    }

    private function khmerDayPart(?string $dayPart): string
    {
        return match ($dayPart) {
            'Half Day' => 'កន្លះថ្ងៃ',
            'Full Day' => 'ពេញមួយថ្ងៃ',
            default => (string) $dayPart,
        };
    }

    private function khmerDurationType(?string $durationType): string
    {
        return match ($durationType) {
            'single_day' => 'មួយថ្ងៃ',
            'multiple_day' => 'ច្រើនថ្ងៃ',
            'hours' => 'តាមម៉ោង',
            default => (string) $durationType,
        };
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

    private function assertPermissionAllowance(int $employeeId, array $data, ?int $ignoreId = null): void
    {
        $type = $this->effectivePermissionType($data['type'], $employeeId, $data['request_date']);

        if (! $type || (float) $type->deduction_amount > 0) {
            return;
        }

        $allowed = (int) $type->allowed_times;
        $date = \Carbon\Carbon::parse($data['request_date']);
        $query = PermissionRequest::query()
            ->where('employee_id', $employeeId)
            ->where('type', $data['type'])
            ->whereIn('status', ['pending', 'approved'])
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId));

        if ($type->limit_type === 'per_day') {
            $query->whereDate('request_date', $date->toDateString());
        } elseif ($type->limit_type === 'per_year') {
            $query->whereBetween('request_date', [
                $date->copy()->startOfYear()->toDateString(),
                $date->copy()->endOfYear()->toDateString(),
            ]);
        } else {
            $query->whereBetween('request_date', [
                $date->copy()->startOfMonth()->toDateString(),
                $date->copy()->endOfMonth()->toDateString(),
            ]);
        }

        if ($query->count() >= $allowed) {
            $period = $type->limit_type === 'per_day' ? 'day' : ($type->limit_type === 'per_year' ? 'year' : 'month');
            throw ValidationException::withMessages([
                'type' => "You already used the {$type->name} allowance for this {$period}.",
            ]);
        }
    }

    private function assertPermissionTypeAvailable(int $employeeId, array $data): void
    {
        $type = PermissionType::query()
            ->with(['employees:id', 'workSchedules:id', 'rules'])
            ->where('name', $data['type'])
            ->first();

        if (! $type) {
            return;
        }

        $this->assertEffectiveRuleActive($type, $employeeId, $data);
    }

    private function assertSingleTimeWithinMaxHours(int $employeeId, array $data): void
    {
        if (! $this->usesSingleRequestTime($data['type'] ?? null)) {
            return;
        }

        $type = $this->effectivePermissionType($data['type'], $employeeId, $data['request_date']);
        if (! $type || $type->max_hours === null) {
            return;
        }

        $requestTime = $data['request_time'] ?? $data['start_time'] ?? null;
        if (! $requestTime) {
            return;
        }

        $date = \Carbon\Carbon::parse($data['request_date']);
        $dayInfo = $this->workSchedules->dayInfoForEmployeeOnDate($employeeId, $date);
        $scheduleTime = $data['type'] === 'Late Check In' ? ($dayInfo['start'] ?? null) : ($dayInfo['end'] ?? null);

        if (! $scheduleTime) {
            return;
        }

        $requestedAt = \Carbon\Carbon::parse($date->toDateString().' '.$requestTime);
        $scheduledAt = \Carbon\Carbon::parse($date->toDateString().' '.$scheduleTime);
        $minutes = $data['type'] === 'Late Check In'
            ? $scheduledAt->diffInMinutes($requestedAt, false)
            : $requestedAt->diffInMinutes($scheduledAt, false);

        if ($minutes <= 0) {
            return;
        }

        $hours = $minutes / 60;
        if ($hours <= (float) $type->max_hours) {
            return;
        }

        $direction = $data['type'] === 'Late Check In' ? 'after scheduled check-in' : 'before scheduled check-out';
        throw ValidationException::withMessages([
            'request_time' => "{$type->name} cannot be more than {$type->max_hours} hour(s) {$direction}.",
        ]);
    }

    private function assertEffectiveRuleActive(PermissionType $type, int $employeeId, array $data): void
    {
        $effective = $this->effectivePermissionType($type->name, $employeeId, $data['request_date']);

        if ($effective && $effective->is_active) {
            return;
        }

        throw ValidationException::withMessages([
            'type' => "{$type->name} is not assigned to you for the selected date.",
        ]);
    }

    private function effectivePermissionType(string $name, int $employeeId, ?string $date): ?PermissionType
    {
        $type = PermissionType::query()
            ->with('rules')
            ->where('name', $name)
            ->first();

        if (! $type || ! $date) {
            return $type;
        }

        $requestDate = \Carbon\Carbon::parse($date);
        $schedule = $this->workSchedules->scheduleForEmployeeOnDate($employeeId, $requestDate);
        $rule = $type->rules->first(fn ($item) => (int) $item->employee_id === $employeeId)
            ?: ($schedule ? $type->rules->first(fn ($item) => (int) $item->work_schedule_id === (int) $schedule->id) : null);

        if (! $rule) {
            return $type;
        }

        $type->forceFill([
            'allowed_times' => $rule->allowed_times,
            'limit_type' => $rule->limit_type,
            'duration_control' => $rule->duration_control,
            'max_hours' => $rule->max_hours,
            'deduction_amount' => $rule->deduction_amount,
            'is_active' => $type->is_active && $rule->is_active,
        ]);

        return $type;
    }
}
