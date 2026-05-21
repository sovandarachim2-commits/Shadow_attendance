<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Repositories\AttendanceRepository;
use App\Services\AttendanceService;
use App\Services\WorkScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceRepository $attendance, private AttendanceService $service) {}

    public function index(Request $request)
    {
        $filters = $request->only(['date', 'from', 'to', 'status', 'employee_id', 'per_page']);

        if (! $request->user()->hasPermission('attendance.view_all')) {
            $filters['employee_id'] = $request->user()->employee_id;
        }

        return $this->attendance->filtered($filters);
    }

    public function report(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'integer', 'exists:employees,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $filters = $this->reportFilters($request, $data);
        $records = $this->attendance->listForReport($filters);
        $employee = Employee::with(['department', 'position', 'branch'])->find($filters['employee_id']);

        return response()->json([
            'employee' => $employee ? [
                'id' => $employee->id,
                'employee_code' => $employee->employee_code,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'full_name' => trim("{$employee->first_name} {$employee->last_name}"),
                'department' => $employee->department?->name,
                'position' => $employee->position?->name,
                'branch' => $employee->branch?->name,
            ] : null,
            'period' => [
                'from' => $filters['from'] ?? $filters['date'] ?? null,
                'to' => $filters['to'] ?? $filters['date'] ?? null,
            ],
            'summary' => $this->attendance->summaryForCollection($records),
            'records' => $records,
        ]);
    }

    public function export(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'integer', 'exists:employees,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $filters = $this->reportFilters($request, $data);
        $records = $this->attendance->listForReport($filters);
        $escape = fn ($value) => '"'.str_replace('"', '""', (string) $value).'"';

        $csv = implode(',', [
            'date', 'employee_code', 'employee', 'department', 'check_in', 'check_out',
            'work_minutes', 'status', 'type', 'late_minutes', 'deduction', 'check_in_location', 'check_out_location',
        ])."\n";

        $csv .= $records->map(fn ($row) => implode(',', [
            $escape($row->attendance_date?->toDateString()),
            $escape($row->employee?->employee_code),
            $escape(trim(($row->employee?->first_name ?? '').' '.($row->employee?->last_name ?? ''))),
            $escape($row->employee?->department?->name),
            $escape($row->check_in_at?->format('Y-m-d H:i:s')),
            $escape($row->check_out_at?->format('Y-m-d H:i:s')),
            $escape($row->work_minutes),
            $escape($row->status),
            $escape($row->type),
            $escape($row->late_minutes),
            $escape($row->deduction_amount),
            $escape($row->check_in_address),
            $escape($row->check_out_address),
        ]))->implode("\n");

        $from = $filters['from'] ?? $filters['date'] ?? 'all';
        $to = $filters['to'] ?? $filters['date'] ?? 'all';
        $filename = "attendance-report-{$from}-to-{$to}.csv";

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function reportFilters(Request $request, array $data): array
    {
        $filters = array_filter([
            'employee_id' => $data['employee_id'] ?? null,
            'from' => $data['from'] ?? null,
            'to' => $data['to'] ?? null,
            'date' => $data['date'] ?? null,
            'status' => $data['status'] ?? null,
        ], fn ($value) => $value !== null && $value !== '');

        if (! $request->user()->hasPermission('attendance.view_all')) {
            $filters['employee_id'] = $request->user()->employee_id;
        } elseif (empty($filters['employee_id'])) {
            $filters['employee_id'] = $request->user()->employee_id;
        }

        if (empty($filters['from']) && empty($filters['to']) && empty($filters['date'])) {
            $filters['from'] = now()->startOfMonth()->toDateString();
            $filters['to'] = now()->toDateString();
        }

        return $filters;
    }

    public function today(Request $request, WorkScheduleService $workSchedules)
    {
        $user = $request->user();
        $attendance = $this->attendance->todayForEmployee($user->employee_id);

        $payload = $attendance ? $attendance->toArray() : [];

        if ($user->employee_id) {
            $scheduleToday = $workSchedules->todayInfoForEmployee($user->employee_id);
            $scheduleToday['can_check_in'] = $scheduleToday['is_working_day']
                || $workSchedules->canOverrideSchedule($user)
                || ! empty($payload['check_in_at']);
            $payload['schedule_today'] = $scheduleToday;
        }

        return $payload;
    }

    public function checkIn(Request $request)
    {
        $photoRules = config('attendance.face_verification_enabled', false)
            ? ['required', 'image', 'max:4096']
            : ['nullable', 'image', 'max:4096'];

        $data = $request->validate([
            'type' => ['required', 'in:office,outdoor'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric'],
            'speed' => ['nullable', 'numeric'],
            'photo' => $photoRules,
            'qr_code' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'address' => ['nullable', 'string', 'max:2000'],
            'offline_sync_uuid' => ['nullable', 'uuid'],
        ]);

        $data['photo'] = $request->file('photo');

        return $this->service->checkIn($request->user(), $data);
    }

    public function checkOut(Request $request)
    {
        $photoRules = config('attendance.face_verification_enabled', false)
            ? ['required', 'image', 'max:4096']
            : ['nullable', 'image', 'max:4096'];

        $data = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric'],
            'speed' => ['nullable', 'numeric'],
            'photo' => $photoRules,
            'notes' => ['nullable', 'string', 'max:2000'],
            'address' => ['nullable', 'string', 'max:2000'],
        ]);

        $data['photo'] = $request->file('photo');

        return $this->service->checkOut($request->user(), $data);
    }

    public function edit(Request $request, Attendance $attendance)
    {
        $data = $request->validate([
            'changes' => ['sometimes', 'array'],
            'date' => ['sometimes', 'date'],
            'check_in_time' => ['nullable', 'date_format:H:i'],
            'check_out_time' => ['nullable', 'date_format:H:i'],
            'status' => ['sometimes', 'string', 'max:40'],
            'type' => ['sometimes', 'in:office,outdoor'],
            'reason' => ['required', 'string', 'min:8', 'max:2000'],
        ]);

        $changes = $data['changes'] ?? [];

        if (! $changes) {
            if (array_key_exists('date', $data)) {
                $changes['attendance_date'] = $data['date'];
            }

            $attendanceDate = $data['date'] ?? $attendance->attendance_date?->format('Y-m-d') ?? now()->toDateString();

            if (array_key_exists('check_in_time', $data)) {
                $changes['check_in_at'] = $data['check_in_time']
                    ? "{$attendanceDate} {$data['check_in_time']}:00"
                    : null;
            }

            if (array_key_exists('check_out_time', $data)) {
                $changes['check_out_at'] = $data['check_out_time']
                    ? "{$attendanceDate} {$data['check_out_time']}:00"
                    : null;
            }

            foreach (['status', 'type'] as $field) {
                if (array_key_exists($field, $data)) {
                    $changes[$field] = $data[$field];
                }
            }
        }

        foreach ($changes as $field => $value) {
            if (! in_array($field, ['attendance_date', 'type', 'status', 'check_in_at', 'check_out_at', 'notes'], true)) {
                continue;
            }

            if (in_array($field, ['check_in_at', 'check_out_at'], true) && $value) {
                $value = Carbon::parse($value);
            }

            AttendanceLog::create([
                'attendance_id' => $attendance->id,
                'edited_by' => $request->user()->id,
                'field_name' => $field,
                'previous_value' => (string) ($attendance->{$field} ?? ''),
                'new_value' => (string) $value,
                'reason' => $data['reason'],
                'ip_address' => $request->ip(),
            ]);

            $attendance->{$field} = $value;
        }

        if ($attendance->check_in_at && $attendance->check_out_at) {
            $attendance->work_minutes = $attendance->check_in_at->diffInMinutes($attendance->check_out_at);
        } else {
            $attendance->work_minutes = null;
        }

        $attendance->save();

        return $attendance->fresh(['employee', 'logs.editor']);
    }
}
