<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\PermissionRequest;
use App\Services\WorkScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeMonthlyReportController extends Controller
{
    public function __construct(private WorkScheduleService $workSchedules) {}
    private const STATUS_LABELS = [
        'present'          => 'Present',
        'late'             => 'Late Check In',
        'early_checkout'   => 'Early Check Out',
        'absent'           => 'Absent',
        'missing_checkin'  => 'Missing Check In',
        'missing_checkout' => 'Missing Check Out',
        'missing_attendance' => 'Missing Check In',
        'day_off'          => 'Day Off',
        'personal_request' => 'Personal Request',
        'on_leave'         => 'Personal Request',
        'leave'            => 'Personal Request',
        'half_day'         => 'Personal Request',
        'holiday'          => 'Holiday',
    ];

    public function index(Request $request)
    {
        return response()->json($this->buildReport($request));
    }

    public function export(Request $request): Response
    {
        $report = $this->buildReport($request);

        if (! $report['employee']) {
            abort(422, 'Select an employee before exporting.');
        }

        $escape = fn ($value) => '"'.str_replace('"', '""', (string) $value).'"';
        $fmtWork = function (?int $minutes): string {
            if ($minutes === null) {
                return '–';
            }
            $h = intdiv($minutes, 60);
            $m = $minutes % 60;

            return sprintf('%dh %02dm', $h, $m);
        };

        $csv = implode(',', [
            'Date', 'Day', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Late (min)', 'Note',
        ])."\n";

        foreach ($report['days'] as $day) {
            $csv .= implode(',', [
                $escape($day['date']),
                $escape($day['day']),
                $escape($day['check_in'] ?? '–'),
                $escape($day['check_out'] ?? '–'),
                $escape($fmtWork($day['work_minutes'])),
                $escape(self::STATUS_LABELS[$day['status']] ?? $day['status']),
                $escape($day['late_minutes'] ?? 0),
                $escape($day['notes'] ?? ''),
            ])."\n";
        }

        $code = $report['employee']['employee_code'] ?? 'emp';

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"monthly-report-{$code}-{$report['month']}.csv\"",
        ]);
    }

    private function buildReport(Request $request): array
    {
        $user = $request->user();

        if (! $this->canViewAll($user) && ! $this->canViewOwn($user)) {
            abort(403, 'You do not have permission to view employee monthly reports.');
        }

        $isAdmin = $this->canViewAll($user);

        $validated = $request->validate([
            'month'         => ['nullable', 'date_format:Y-m'],
            'employee_id'   => ['nullable', 'integer', 'exists:employees,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'status'        => ['nullable', 'string', 'max:40'],
        ]);

        $monthStr = $validated['month'] ?? now()->format('Y-m');
        $month    = Carbon::parse($monthStr.'-01');
        $from     = $month->copy()->startOfMonth();
        $to       = $month->copy()->endOfMonth();

        if ($isAdmin) {
            $employeeId = isset($validated['employee_id']) ? (int) $validated['employee_id'] : null;
        } else {
            $employeeId = (int) ($user->employee_id ?? $user->employee?->id ?? 0);
            if (! $employeeId) {
                abort(422, 'Your user account is not linked to an employee profile.');
            }
        }

        if (! $employeeId) {
            return [
                'month'       => $monthStr,
                'month_label' => $month->format('F Y'),
                'employee'    => null,
                'schedule'    => null,
                'summary'     => $this->emptySummary(),
                'days'        => [],
                'total_days'  => $to->day,
            ];
        }

        $empQuery = Employee::with(['department', 'position', 'branch'])->whereKey($employeeId);

        if ($isAdmin && ! empty($validated['department_id'])) {
            $empQuery->where('department_id', (int) $validated['department_id']);
        }

        $emp = $empQuery->first();

        if (! $emp) {
            abort(404, 'Employee not found for the selected filters.');
        }

        $employeeId = (int) $emp->id;

        $ownEmployeeId = (int) ($user->employee_id ?? $user->employee?->id ?? 0);

        if (! $isAdmin && $employeeId !== $ownEmployeeId) {
            abort(403);
        }

        $employee = [
            'id'            => $emp->id,
            'name'          => trim("{$emp->first_name} {$emp->last_name}"),
            'employee_code' => $emp->employee_code,
            'department'    => $emp->department?->name,
            'position'      => $emp->position?->name,
            'branch'        => $emp->branch?->name,
        ];

        $records = Attendance::where('employee_id', $employeeId)
            ->whereBetween('attendance_date', [$from->toDateString(), $to->toDateString()])
            ->orderBy('attendance_date')
            ->get()
            ->keyBy(function ($r) {
                $date = $r->attendance_date;
                if ($date === null) {
                    return 'invalid';
                }
                if ($date instanceof \DateTimeInterface) {
                    return Carbon::instance($date)->format('Y-m-d');
                }

                return Carbon::parse((string) $date)->format('Y-m-d');
            })
            ->filter(fn ($_, $key) => $key !== 'invalid');

        $allDays = [];
        $cursor  = $from->copy();
        $approvedRequests = PermissionRequest::query()
            ->where('employee_id', $employeeId)
            ->where('status', 'approved')
            ->whereIn('type', ['Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Attendance', 'Personal Request'])
            ->whereDate('request_date', '<=', $to->toDateString())
            ->where(function ($dateQuery) use ($from) {
                $dateQuery
                    ->whereDate('request_date_end', '>=', $from->toDateString())
                    ->orWhereNull('request_date_end');
            })
            ->get();

        while ($cursor->lte($to)) {
            $dateStr  = $cursor->toDateString();
            $record   = $records->get($dateStr);
            $dayInfo = $this->workSchedules->dayInfoForEmployeeOnDate($employeeId, $cursor);
            $requestStatus = $this->requestStatusForDate($approvedRequests, $dateStr);

            if ($record) {
                $isMissing = $record->check_in_at
                    && ! $record->check_out_at
                    && $record->status !== 'absent';

                $status = $isMissing
                    ? 'missing_checkout'
                    : ($record->status ?? 'present');

                if ($status === 'present' && (int) ($record->late_minutes ?? 0) > 0) {
                    $status = 'late';
                }

                if ($requestStatus && ! in_array($status, ['late', 'missing_checkout'], true)) {
                    $status = $requestStatus;
                }

                $allDays[] = [
                    'date'         => $dateStr,
                    'day'          => $cursor->format('D'),
                    'check_in'     => $record->check_in_at?->format('H:i'),
                    'check_out'    => $record->check_out_at?->format('H:i'),
                    'work_minutes' => $record->work_minutes,
                    'late_minutes' => $record->late_minutes,
                    'status'       => $status,
                    'notes'        => $this->displayNote($record->notes, $status, (int) ($record->late_minutes ?? 0), $dayInfo),
                    'id'           => $record->id,
                ];
            } else {
                $offStatus = $requestStatus ?: ($dayInfo['is_working_day'] ? 'absent' : 'day_off');
                $allDays[] = [
                    'date'         => $dateStr,
                    'day'          => $cursor->format('D'),
                    'check_in'     => null,
                    'check_out'    => null,
                    'work_minutes' => null,
                    'late_minutes' => null,
                    'status'       => $offStatus,
                    'notes'        => $this->displayNote(null, $offStatus, 0, $dayInfo),
                    'id'           => null,
                ];
            }

            $cursor->addDay();
        }

        $summary = $this->emptySummary();

        foreach ($allDays as $d) {
            $s = $d['status'];
            if (in_array($s, ['on_leave', 'leave', 'half_day', 'personal_request'], true)) {
                $summary['personal_request']++;
            } elseif (array_key_exists($s, $summary)) {
                $summary[$s]++;
            }
        }

        $statusKey = $validated['status'] ?? null;
        $days      = $statusKey
            ? array_values(array_filter($allDays, fn ($d) => $d['status'] === $statusKey))
            : $allDays;

        $activeSchedule = $this->workSchedules->scheduleForEmployeeOnDate($employeeId, $to);

        return [
            'month'       => $monthStr,
            'month_label' => $month->format('F Y'),
            'employee'    => $employee,
            'schedule'    => $activeSchedule ? [
                'id'   => $activeSchedule->id,
                'name' => $activeSchedule->schedule_name,
            ] : null,
            'summary'     => $summary,
            'days'        => array_values($days),
            'total_days'  => $to->day,
        ];
    }

    private function canViewAll($user): bool
    {
        return $user->hasPermission('employee_report.view_all');
    }

    private function canViewOwn($user): bool
    {
        return $user->hasPermission('employee_report.view_own');
    }

    private function emptySummary(): array
    {
        return [
            'present'          => 0,
            'late'             => 0,
            'early_checkout'   => 0,
            'absent'           => 0,
            'missing_checkin'  => 0,
            'missing_checkout' => 0,
            'day_off'          => 0,
            'personal_request' => 0,
        ];
    }

    private function displayNote(?string $stored, string $status, int $lateMinutes, ?array $dayInfo = null): ?string
    {
        if ($stored !== null && trim($stored) !== '') {
            return trim($stored);
        }

        return match ($status) {
            'late'             => $lateMinutes > 0 ? "Late check in {$lateMinutes}m" : 'Late arrival',
            'early_checkout'   => 'Approved early check out',
            'missing_checkin', 'missing_attendance' => 'Missing check-in request approved',
            'missing_checkout' => 'Missing check-out',
            'day_off'          => $this->dayOffNote($dayInfo),
            'personal_request', 'on_leave', 'leave', 'half_day' => 'Personal request approved',
            'holiday'          => 'Public holiday',
            'absent'           => $dayInfo && $dayInfo['is_working_day']
                ? 'No attendance record (scheduled work day)'
                : 'No attendance record',
            default            => null,
        };
    }

    private function dayOffNote(?array $dayInfo): string
    {
        $schedule = $dayInfo['schedule_name'] ?? null;
        $label    = $dayInfo['day_label'] ?? 'Day';

        if ($schedule) {
            return "{$label} off — {$schedule}";
        }

        return 'Scheduled day off';
    }

    private function requestStatusForDate($requests, string $date): ?string
    {
        $priority = [
            'Late Check In' => 'late',
            'Early Check Out' => 'early_checkout',
            'Day Off' => 'day_off',
            'Missing Check In' => 'missing_checkin',
            'Missing Attendance' => 'missing_checkin',
            'Personal Request' => 'personal_request',
        ];

        foreach ($priority as $type => $status) {
            $match = $requests->first(function (PermissionRequest $request) use ($date, $type) {
                if ($request->type !== $type) {
                    return false;
                }

                $start = $request->request_date?->toDateString();
                $end = $request->request_date_end?->toDateString() ?: $start;

                return $start <= $date && $end >= $date;
            });

            if ($match) {
                return $status;
            }
        }

        return null;
    }
}
