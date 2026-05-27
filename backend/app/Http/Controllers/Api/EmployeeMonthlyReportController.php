<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeMonthlyReportController extends Controller
{
    private const STATUS_LABELS = [
        'present'          => 'Present',
        'late'             => 'Late',
        'absent'           => 'Absent',
        'missing_checkout' => 'Missing Check Out',
        'day_off'          => 'Day Off',
        'on_leave'         => 'Leave',
        'leave'            => 'Leave',
        'half_day'         => 'Half Day',
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

        if (! $isAdmin && $employeeId !== (int) $user->employee_id) {
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
            ->keyBy(fn ($r) => $r->attendance_date->format('Y-m-d'));

        $allDays = [];
        $cursor  = $from->copy();

        while ($cursor->lte($to)) {
            $dateStr   = $cursor->toDateString();
            $record    = $records->get($dateStr);
            $isWeekend = in_array($cursor->dayOfWeek, [0, 6], true);

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

                $allDays[] = [
                    'date'         => $dateStr,
                    'day'          => $cursor->format('D'),
                    'check_in'     => $record->check_in_at?->format('H:i'),
                    'check_out'    => $record->check_out_at?->format('H:i'),
                    'work_minutes' => $record->work_minutes,
                    'late_minutes' => $record->late_minutes,
                    'status'       => $status,
                    'notes'        => $this->displayNote($record->notes, $status, (int) ($record->late_minutes ?? 0)),
                    'id'           => $record->id,
                ];
            } else {
                $offStatus = $isWeekend ? 'day_off' : 'absent';
                $allDays[] = [
                    'date'         => $dateStr,
                    'day'          => $cursor->format('D'),
                    'check_in'     => null,
                    'check_out'    => null,
                    'work_minutes' => null,
                    'late_minutes' => null,
                    'status'       => $offStatus,
                    'notes'        => $this->displayNote(null, $offStatus, 0),
                    'id'           => null,
                ];
            }

            $cursor->addDay();
        }

        $summary = $this->emptySummary();

        foreach ($allDays as $d) {
            $s = $d['status'];
            if (in_array($s, ['on_leave', 'leave', 'half_day'], true)) {
                $summary['on_leave']++;
            } elseif (array_key_exists($s, $summary)) {
                $summary[$s]++;
            }
        }

        $statusKey = $validated['status'] ?? null;
        $days      = $statusKey
            ? array_values(array_filter($allDays, fn ($d) => $d['status'] === $statusKey))
            : $allDays;

        return [
            'month'       => $monthStr,
            'month_label' => $month->format('F Y'),
            'employee'    => $employee,
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
            'absent'           => 0,
            'missing_checkout' => 0,
            'day_off'          => 0,
            'on_leave'         => 0,
        ];
    }

    private function displayNote(?string $stored, string $status, int $lateMinutes): ?string
    {
        if ($stored !== null && trim($stored) !== '') {
            return trim($stored);
        }

        return match ($status) {
            'late'             => $lateMinutes > 0 ? "Late check in {$lateMinutes}m" : 'Late arrival',
            'missing_checkout' => 'Forgot to check out',
            'day_off'          => 'Weekly Off',
            'on_leave', 'leave', 'half_day' => 'On leave',
            'holiday'          => 'Public holiday',
            'absent'           => 'No attendance record',
            default            => null,
        };
    }
}
