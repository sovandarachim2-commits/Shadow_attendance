<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\PermissionRequest;
use App\Models\User;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PermissionRequestController extends Controller
{
    private const TYPES = [
        'Early Leave',
        'Attendance Edit',
        'Manual Check In',
        'Missing Check Out',
        'Day Off',
        'Outdoor Work',
        'Request Permission',
    ];

    private const EVENT_KEY = 'permission_request';

    public function index(Request $request)
    {
        $query = PermissionRequest::query()
            ->with(['employee', 'reviewer'])
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

        $data = $request->validate([
            'type' => ['required', 'string', Rule::in(self::TYPES)],
            'request_date' => ['required', 'date'],
            'request_date_end' => ['required', 'date', 'after_or_equal:request_date'],
            'request_time' => ['nullable', 'string', 'max:20'],
            'reason' => ['required', 'string', 'max:5000'],
            'is_emergency' => ['nullable', 'boolean'],
            'gps_location' => ['nullable', 'string', 'max:500'],
        ]);

        $record = PermissionRequest::create([
            'employee_id' => $employee->id,
            'request_code' => 'PR-PENDING-'.uniqid(),
            'type' => $data['type'],
            'request_date' => $data['request_date'],
            'request_date_end' => $data['request_date_end'],
            'request_time' => $data['request_time'] ?? null,
            'reason' => $data['reason'],
            'status' => 'pending',
            'is_emergency' => (bool) ($data['is_emergency'] ?? false),
            'gps_location' => $data['gps_location'] ?? null,
            'admin_notes' => 'Submitted and waiting for approval.',
        ]);

        $record->update([
            'request_code' => sprintf('PR-%s-%04d', $record->created_at->format('Y'), $record->id),
        ]);

        $record = $record->fresh(['employee', 'reviewer']);

        Notification::create([
            'user_id' => null,
            'type' => self::EVENT_KEY,
            'title' => "New Permission Request: {$record->request_code}",
            'message' => "{$employee->first_name} {$employee->last_name} submitted a {$record->type} for ".$this->formatDateRange($record),
            'payload' => [
                'request_id' => $record->id,
                'request_code' => $record->request_code,
                'status' => $record->status,
            ],
        ]);

        $telegram->send(
            "✅ <b>បានដាក់សំណើសុំអនុញ្ញាត</b>\n".
            "<b>លេខសំណើ:</b> {$record->request_code}\n".
            "<b>បុគ្គលិក:</b> {$employee->first_name} {$employee->last_name}\n".
            "<b>ប្រភេទ:</b> {$record->type}\n".
            '<b>រយៈពេល:</b> '.$this->formatDateRange($record)."\n".
            "<b>មូលហេតុ:</b> {$record->reason}\n".
            "<b>ស្ថានភាព:</b> រង់ចាំអនុម័ត",
            self::EVENT_KEY,
        );

        $this->sendPrivateAdminTelegram(
            $telegram,
            $this->buildAdminRequestPrivateMessage($record),
        );

        $telegram->sendToEmployee(
            $employee,
            $this->buildEmployeeRequestSubmittedMessage($record),
            'permission_request_submitted_private',
        );

        return $record;
    }

    public function update(Request $request, PermissionRequest $permissionRequest)
    {
        $this->assertOwnPending($request, $permissionRequest);

        $data = $request->validate([
            'type' => ['sometimes', 'required', 'string', Rule::in(self::TYPES)],
            'request_date' => ['sometimes', 'required', 'date'],
            'request_date_end' => ['sometimes', 'required', 'date', 'after_or_equal:request_date'],
            'request_time' => ['nullable', 'string', 'max:20'],
            'reason' => ['sometimes', 'required', 'string', 'max:5000'],
            'is_emergency' => ['nullable', 'boolean'],
            'gps_location' => ['nullable', 'string', 'max:500'],
        ]);

        if (isset($data['request_date'], $data['request_date_end']) && $data['request_date_end'] < $data['request_date']) {
            throw ValidationException::withMessages(['request_date_end' => 'End date must be on or after start date.']);
        }

        $permissionRequest->update($data);

        return $permissionRequest->fresh(['employee', 'reviewer']);
    }

    public function updateStatus(Request $request, PermissionRequest $permissionRequest, TelegramNotificationService $telegram)
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

        $updated = $permissionRequest->fresh(['employee', 'reviewer']);
        $employeeUserId = optional($updated->employee->user)->id;
        $statusLabel = ucfirst($updated->status);
        $statusKhmer = $updated->status === 'approved' ? 'បានអនុម័ត' : 'បានបដិសេធ';
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

        $statusMessage = "✅ <b>សំណើសុំអនុញ្ញាត {$statusKhmer}</b>\n".
            "<b>លេខសំណើ:</b> {$updated->request_code}\n".
            "<b>បុគ្គលិក:</b> {$updated->employee->first_name} {$updated->employee->last_name}\n".
            "<b>ស្ថានភាព:</b> {$statusKhmer}\n".
            "<b>ពិនិត្យដោយ:</b> {$adminName}";

        $telegram->send($statusMessage, self::EVENT_KEY);

        $telegram->sendToEmployee(
            $updated->employee,
            $this->buildEmployeeStatusPrivateMessage($updated, $adminName),
            'permission_status_private',
        );

        return $updated;
    }

    public function destroy(Request $request, PermissionRequest $permissionRequest)
    {
        $this->assertOwnPending($request, $permissionRequest);

        $permissionRequest->delete();

        return response()->noContent();
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

    private function buildAdminRequestPrivateMessage(PermissionRequest $record): string
    {
        $employee = $record->employee;

        return "✅ <b>បានដាក់សំណើសុំអនុញ្ញាត</b>\n\n"
            ."📄 <b>លេខសំណើ:</b> {$record->request_code}\n"
            ."<b>👤 បុគ្គលិក:</b> {$employee->first_name} {$employee->last_name}\n"
            ."📌 <b>ប្រភេទ:</b> {$record->type}\n"
            ."📅 <b>រយៈពេល:</b> {$this->formatDateRange($record)}\n"
            ."📝 <b>មូលហេតុ:</b> {$record->reason}\n\n"
            ."⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត";
    }

    private function buildEmployeeRequestSubmittedMessage(PermissionRequest $record): string
    {
        return "📝 <b>សំណើរបស់អ្នកត្រូវបានដាក់រួចរាល់</b>\n\n"
            ."📄 <b>លេខសំណើ:</b> {$record->request_code}\n"
            ."📌 <b>ប្រភេទ:</b> {$record->type}\n"
            ."📅 <b>រយៈពេល:</b> {$this->formatDateRange($record)}\n"
            ."📝 <b>មូលហេតុ:</b> {$record->reason}\n\n"
            ."⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត";
    }

    private function buildEmployeeStatusPrivateMessage(PermissionRequest $record, string $adminName): string
    {
        $reviewedAt = optional($record->reviewed_at)->format('d M Y · h:i A');

        if ($record->status === 'approved') {
            return "✅ <b>សំណើរបស់អ្នកត្រូវបានអនុម័ត</b>\n\n"
                ."📄 <b>លេខសំណើ:</b> {$record->request_code}\n"
                ."📌 <b>ប្រភេទ:</b> {$record->type}\n"
                ."📅 <b>រយៈពេល:</b> {$this->formatDateRange($record)}\n\n"
                ."👨‍💼 <b>អនុម័តដោយ:</b> {$adminName}\n"
                ."🕒 <b>អនុម័តនៅ:</b> {$reviewedAt}\n\n"
                ."✅ <b>ស្ថានភាព:</b> អនុម័តរួចរាល់";
        }

        return "❌ <b>សំណើរបស់អ្នកមិនត្រូវបានអនុម័ត</b>\n\n"
            ."📄 <b>លេខសំណើ:</b> {$record->request_code}\n"
            ."📌 <b>ប្រភេទ:</b> {$record->type}\n"
            ."📅 <b>រយៈពេល:</b> {$this->formatDateRange($record)}\n\n"
            ."👨‍💼 <b>ពិនិត្យដោយ:</b> {$adminName}\n"
            ."🕒 <b>បដិសេធនៅ:</b> {$reviewedAt}\n"
            ."📝 <b>មូលហេតុ:</b> {$record->admin_notes}\n\n"
            ."❌ <b>ស្ថានភាព:</b> មិនអនុម័ត";
    }

    private function formatDateRange(PermissionRequest $record): string
    {
        $start = $record->request_date->format('d M Y');
        $endDate = $record->request_date_end ?? $record->request_date;
        $end = $endDate->format('d M Y');

        return $end === $start ? $start : "{$start} – {$end}";
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
}
