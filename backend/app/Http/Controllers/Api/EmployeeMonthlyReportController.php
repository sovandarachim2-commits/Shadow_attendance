<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\EmployeeMonthlyPayrollHistory;
use App\Models\PermissionRequest;
use App\Services\ImageUploadService;
use App\Services\PayrollSecurityService;
use App\Services\WorkScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeMonthlyReportController extends Controller
{
    public function __construct(
        private WorkScheduleService $workSchedules,
        private PayrollSecurityService $payrollSecurity,
    ) {}
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
            'Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late',
            'Deduction', 'Overtime', 'Status',
        ])."\n";
        $totals = $this->attendanceDetailTotals($report['days']);

        foreach ($report['days'] as $day) {
            $csv .= implode(',', [
                $escape($day['date']),
                $escape($day['schedule'] ?? '-'),
                $escape($day['check_in'] ?? '-'),
                $escape($day['check_out'] ?? '-'),
                $escape($fmtWork($day['work_minutes'])),
                $escape($this->formatWorkDuration($day['late_minutes'] ?? 0)),
                $escape(number_format((float) ($day['deduction_amount'] ?? 0), 2, '.', '')),
                $escape($fmtWork($day['overtime_minutes'] ?? 0)),
                $escape(self::STATUS_LABELS[$day['status']] ?? $day['status']),
            ])."\n";
        }

        $csv .= implode(',', [
            $escape('Total'),
            $escape(''),
            $escape(''),
            $escape(''),
            $escape($this->formatWorkDuration($totals['work_minutes'])),
            $escape($this->formatWorkDuration($totals['late_minutes'])),
            $escape(number_format((float) $totals['deduction_amount'], 2, '.', '')),
            $escape($this->formatWorkDuration($totals['overtime_minutes'])),
            $escape(''),
        ])."\n";

        $code = $report['employee']['employee_code'] ?? 'emp';

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"monthly-report-{$code}-{$report['month']}.csv\"",
        ]);
    }

    public function exportExcel(Request $request): Response
    {
        $report = $this->buildReport($request);

        if (! $report['employee']) {
            abort(422, 'Select an employee before exporting.');
        }

        $code = $report['employee']['employee_code'] ?? 'emp';
        $filename = "monthly-report-{$code}-{$report['month']}.xls";

        return response($this->buildExcelHtml($report), 200, [
            'Content-Type'        => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control'       => 'max-age=0',
        ]);
    }

    public function payrollHistory(Request $request)
    {
        $this->payrollSecurity->assertUnlocked($request);

        $data = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
            'employee_id' => ['nullable', 'integer', 'exists:employees,id'],
        ]);

        $month = Carbon::parse($data['month'].'-01')->startOfMonth();

        if (empty($data['employee_id'])) {
            return response()->json([
                'month' => $month->format('Y-m'),
                'month_label' => $month->format('F Y'),
                'items' => $this->payrollHistoryRows($request, $month),
            ]);
        }

        $employeeId = $this->resolvePayrollHistoryEmployeeId($request, $data['employee_id']);

        $history = EmployeeMonthlyPayrollHistory::query()
            ->where('employee_id', $employeeId)
            ->whereDate('month', $month->toDateString())
            ->first();

        return response()->json([
            'history' => $history ? $this->formatPayrollHistory($history) : null,
        ]);
    }

    public function savePayrollHistory(Request $request)
    {
        $this->payrollSecurity->assertUnlocked($request);

        $user = $request->user();

        abort_unless(
            $user->hasPermission('payroll.create') || $user->hasPermission('payroll.update'),
            403,
            'You do not have permission to save payroll history.'
        );

        $data = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
            'employee_id' => ['nullable', 'integer', 'exists:employees,id'],
            'base_salary' => ['nullable', 'numeric', 'min:0'],
            'allowances' => ['nullable', 'numeric', 'min:0'],
            'overtime' => ['nullable', 'numeric', 'min:0'],
            'commission' => ['nullable', 'numeric', 'min:0'],
            'bonus' => ['nullable', 'numeric', 'min:0'],
            'deductions' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:pending,paid'],
            'report_snapshot' => ['nullable', 'array'],
        ]);

        $employeeId = $this->resolvePayrollHistoryEmployeeId($request, $data['employee_id'] ?? null);
        $month = Carbon::parse($data['month'].'-01')->startOfMonth();
        $values = [
            'base_salary' => (float) ($data['base_salary'] ?? 0),
            'allowances' => (float) ($data['allowances'] ?? 0),
            'overtime' => (float) ($data['overtime'] ?? 0),
            'commission' => (float) ($data['commission'] ?? 0),
            'bonus' => (float) ($data['bonus'] ?? 0),
            'deductions' => (float) ($data['deductions'] ?? 0),
            'tax' => (float) ($data['tax'] ?? 0),
        ];
        $values['net_salary'] = $values['base_salary']
            + $values['allowances']
            + $values['overtime']
            + $values['commission']
            + $values['bonus']
            - $values['deductions']
            - $values['tax'];

        $history = EmployeeMonthlyPayrollHistory::query()->updateOrCreate(
            [
                'employee_id' => $employeeId,
                'month' => $month->toDateString(),
            ],
            [
                ...$values,
                'status' => $data['status'] ?? 'pending',
                'report_snapshot' => $data['report_snapshot'] ?? null,
                'updated_by' => $user->id,
                'created_by' => EmployeeMonthlyPayrollHistory::query()
                    ->where('employee_id', $employeeId)
                    ->whereDate('month', $month->toDateString())
                    ->value('created_by') ?: $user->id,
            ]
        );

        return response()->json([
            'history' => $this->formatPayrollHistory($history->fresh()),
        ]);
    }

    private function buildExcelHtml(array $report): string
    {
        $employee = $report['employee'];
        $cell = fn ($value): string => htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $summary = $report['summary'] ?? [];
        $monthly = $report['monthly_summary'] ?? [];
        $requests = $report['request_summary'] ?? [];
        $late = $report['late_analysis'] ?? [];
        $summaryRows = [
            ['Working Days', $summary['working_days'] ?? 0],
            ['Present', $summary['present'] ?? 0],
            ['Late Check In', $summary['late'] ?? 0],
            ['Early Check Out', $summary['early_checkout'] ?? 0],
            ['Absent', $summary['absent'] ?? 0],
            ['Missing Check In', $summary['missing_checkin'] ?? 0],
            ['Missing Check Out', $summary['missing_checkout'] ?? 0],
            ['Day Off', $summary['day_off'] ?? 0],
            ['Personal Request', $summary['personal_request'] ?? 0],
        ];
        $monthlyRows = [
            ['Total Working Hours (Expected)', $this->formatWorkDuration($monthly['expected_minutes'] ?? 0)],
            ['Total Worked Hours', $this->formatWorkDuration($monthly['worked_minutes'] ?? 0)],
            ['Overtime', $this->formatWorkDuration($monthly['overtime_minutes'] ?? 0)],
            ['Late Time', $this->formatWorkDuration($monthly['late_minutes'] ?? 0)],
            ['Missing Hours', $this->formatWorkDuration($monthly['missing_minutes'] ?? 0)],
            ['Average Daily Work Hours', $this->formatWorkDuration($monthly['average_minutes'] ?? 0)],
            ['Longest Work Day', $this->formatWorkDuration($monthly['longest_minutes'] ?? 0)],
            ['Shortest Work Day', $this->formatWorkDuration($monthly['shortest_minutes'] ?? 0)],
        ];
        $lateRows = [
            ['Total Late Days', $late['days'] ?? 0],
            ['Total Late Time', $this->formatWorkDuration($late['total_minutes'] ?? 0)],
            ['Average Late', $this->formatWorkDuration((int) round((float) ($late['average_minutes'] ?? 0)))],
            ['Longest Late', $this->formatWorkDuration($late['longest_minutes'] ?? 0)],
            ['Late Deduction', '$'.number_format((float) ($late['deduction_amount'] ?? 0), 2, '.', '')],
        ];
        $summaryHtml = $this->buildKeyValueExcelTable('Attendance Summary', $summaryRows, $cell);
        $monthlyHtml = $this->buildKeyValueExcelTable('Work Summary', $monthlyRows, $cell);
        $lateHtml = $this->buildKeyValueExcelTable('Late Summary', $lateRows, $cell);
        $requestHtml = count($requests)
            ? $this->buildKeyValueExcelTable('Approved Requests', collect($requests)->map(fn ($count, $type) => [$type, $count])->all(), $cell)
            : $this->buildKeyValueExcelTable('Approved Requests', [['No approved requests', 0]], $cell);
        $totals = $this->attendanceDetailTotals($report['days']);

        $rows = '';
        foreach ($report['days'] as $day) {
            $status = self::STATUS_LABELS[$day['status']] ?? $day['status'];
            $rows .= '<tr>'
                .'<td>'.$cell($day['date']).'</td>'
                .'<td>'.$cell($day['schedule'] ?? '-').'</td>'
                .'<td>'.$cell($day['check_in'] ?? '-').'</td>'
                .'<td>'.$cell($day['check_out'] ?? '-').'</td>'
                .'<td>'.$cell($this->formatWorkDuration($day['work_minutes'])).'</td>'
                .'<td>'.$cell($this->formatWorkDuration($day['late_minutes'] ?? 0)).'</td>'
                .'<td>'.$cell(number_format((float) ($day['deduction_amount'] ?? 0), 2, '.', '')).'</td>'
                .'<td>'.$cell($this->formatWorkDuration($day['overtime_minutes'] ?? 0)).'</td>'
                .'<td>'.$cell($status).'</td>'
                .'</tr>';
        }
        $rows .= '<tr>'
            .'<th colspan="4">Total</th>'
            .'<th>'.$cell($this->formatWorkDuration($totals['work_minutes'])).'</th>'
            .'<th>'.$cell($this->formatWorkDuration($totals['late_minutes'])).'</th>'
            .'<th>'.$cell(number_format((float) $totals['deduction_amount'], 2, '.', '')).'</th>'
            .'<th>'.$cell($this->formatWorkDuration($totals['overtime_minutes'])).'</th>'
            .'<th></th>'
            .'</tr>';

        return '<!doctype html>'
            .'<html><head><meta charset="UTF-8">'
            .'<style>table{border-collapse:collapse}td,th{border:1px solid #999;padding:6px}th{font-weight:bold;background:#eef2f7}.meta th{text-align:left;background:#f8fafc}</style>'
            .'</head><body>'
            .'<table class="meta">'
            .'<tr><th colspan="2">Employee Monthly Report</th></tr>'
            .'<tr><td>Employee</td><td>'.$cell($employee['name'] ?? '-').'</td></tr>'
            .'<tr><td>Employee Code</td><td>'.$cell($employee['employee_code'] ?? '-').'</td></tr>'
            .'<tr><td>Department</td><td>'.$cell($employee['department'] ?? '-').'</td></tr>'
            .'<tr><td>Month</td><td>'.$cell($report['month_label'] ?? $report['month']).'</td></tr>'
            .'</table><br>'
            .$summaryHtml.'<br>'
            .$monthlyHtml.'<br>'
            .$lateHtml.'<br>'
            .$requestHtml.'<br>'
            .'<table>'
            .'<thead><tr>'
            .'<th>Date</th><th>Schedule</th><th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Late</th><th>Deduction</th><th>Overtime</th><th>Status</th>'
            .'</tr></thead><tbody>'
            .$rows
            .'</tbody></table>'
            .'</body></html>';
    }

    private function buildKeyValueExcelTable(string $title, array $rows, callable $cell): string
    {
        $html = '<table class="meta"><tr><th colspan="2">'.$cell($title).'</th></tr>';

        foreach ($rows as [$label, $value]) {
            $html .= '<tr><td>'.$cell($label).'</td><td>'.$cell($value).'</td></tr>';
        }

        return $html.'</table>';
    }

    private function attendanceDetailTotals(array $days): array
    {
        return array_reduce(
            $days,
            fn (array $totals, array $day) => [
                'work_minutes' => $totals['work_minutes'] + (int) ($day['work_minutes'] ?? 0),
                'late_minutes' => $totals['late_minutes'] + (int) ($day['late_minutes'] ?? 0),
                'deduction_amount' => $totals['deduction_amount'] + (float) ($day['deduction_amount'] ?? 0),
                'overtime_minutes' => $totals['overtime_minutes'] + (int) ($day['overtime_minutes'] ?? 0),
            ],
            ['work_minutes' => 0, 'late_minutes' => 0, 'deduction_amount' => 0.0, 'overtime_minutes' => 0],
        );
    }

    private function formatWorkDuration(?int $minutes): string
    {
        if ($minutes === null) {
            return '-';
        }

        $h = intdiv($minutes, 60);
        $m = $minutes % 60;

        return sprintf('%dh %02dm', $h, $m);
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
        $today    = Carbon::today();
        $reportTo = $from->isAfter($today) ? $from->copy()->subDay() : $to->min($today);

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
                'monthly_summary' => $this->emptyMonthlySummary(),
                'request_summary' => [],
                'late_analysis' => $this->emptyLateAnalysis(),
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
            'photo_url'     => $emp->photo_url,
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
        $imageService = app(ImageUploadService::class);
        $approvedRequests = PermissionRequest::query()
            ->where('employee_id', $employeeId)
            ->where('status', 'approved')
            ->whereIn('type', ['Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Check Out', 'Missing Attendance', 'Personal Request'])
            ->whereDate('request_date', '<=', $to->toDateString())
            ->where(function ($dateQuery) use ($from) {
                $dateQuery
                    ->whereDate('request_date_end', '>=', $from->toDateString())
                    ->orWhereNull('request_date_end');
            })
            ->get();

        while ($cursor->lte($reportTo)) {
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
                    'is_working_day' => (bool) $dayInfo['is_working_day'],
                    'scheduled_minutes' => $this->scheduledMinutes($dayInfo),
                    'schedule'     => $this->scheduleLabel($dayInfo),
                    'check_in'     => $record->check_in_at?->format('H:i'),
                    'check_out'    => $record->check_out_at?->format('H:i'),
                    'check_in_at'  => $record->check_in_at?->toIso8601String(),
                    'check_out_at' => $record->check_out_at?->toIso8601String(),
                    'work_minutes' => $record->work_minutes,
                    'late_minutes' => $record->late_minutes,
                    'deduction_amount' => (float) ($record->deduction_amount ?? 0),
                    'overtime_minutes' => max(
                        0,
                        (int) ($record->work_minutes ?? 0) - $this->scheduledMinutes($dayInfo)
                    ),
                    'status'       => $status,
                    'location'     => $this->locationLabel($record),
                    'check_in_photo_url' => $record->check_in_photo_path ? $imageService->url($record->check_in_photo_path) : null,
                    'check_out_photo_url' => $record->check_out_photo_path ? $imageService->url($record->check_out_photo_path) : null,
                    'notes'        => $this->displayNote($record->notes, $status, (int) ($record->late_minutes ?? 0), $dayInfo),
                    'id'           => $record->id,
                ];
            } else {
                $offStatus = $requestStatus ?: ($dayInfo['is_working_day'] ? 'absent' : 'day_off');
                $allDays[] = [
                    'date'         => $dateStr,
                    'day'          => $cursor->format('D'),
                    'is_working_day' => (bool) $dayInfo['is_working_day'],
                    'scheduled_minutes' => $this->scheduledMinutes($dayInfo),
                    'schedule'     => $this->scheduleLabel($dayInfo),
                    'check_in'     => null,
                    'check_out'    => null,
                    'check_in_at'  => null,
                    'check_out_at' => null,
                    'work_minutes' => null,
                    'late_minutes' => null,
                    'deduction_amount' => 0,
                    'overtime_minutes' => 0,
                    'status'       => $offStatus,
                    'location'     => null,
                    'check_in_photo_url' => null,
                    'check_out_photo_url' => null,
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

        $summary['working_days'] = count(array_filter(
            $allDays,
            fn (array $day) => $day['is_working_day']
        ));

        $workedDays = array_values(array_filter(
            $allDays,
            fn (array $day) => (int) ($day['work_minutes'] ?? 0) > 0
        ));
        $expectedMinutes = array_sum(array_column($allDays, 'scheduled_minutes'));
        $workedMinutes = array_sum(array_map(
            fn (array $day) => (int) ($day['work_minutes'] ?? 0),
            $allDays
        ));
        $overtimeMinutes = array_sum(array_map(
            fn (array $day) => max(0, (int) ($day['work_minutes'] ?? 0) - (int) $day['scheduled_minutes']),
            $allDays
        ));
        $missingMinutes = array_sum(array_map(
            fn (array $day) => $day['is_working_day']
                ? max(0, (int) $day['scheduled_minutes'] - (int) ($day['work_minutes'] ?? 0))
                : 0,
            $allDays
        ));
        $workedValues = array_map(
            fn (array $day) => (int) $day['work_minutes'],
            $workedDays
        );
        $monthlySummary = [
            'expected_minutes' => $expectedMinutes,
            'worked_minutes'   => $workedMinutes,
            'overtime_minutes' => $overtimeMinutes,
            'late_minutes'     => array_sum(array_map(
                fn (array $day) => (int) ($day['late_minutes'] ?? 0),
                $allDays
            )),
            'missing_minutes'  => $missingMinutes,
            'average_minutes'  => count($workedValues) ? (int) round($workedMinutes / count($workedValues)) : 0,
            'longest_minutes'  => count($workedValues) ? max($workedValues) : 0,
            'shortest_minutes' => count($workedValues) ? min($workedValues) : 0,
        ];
        $requestSummary = $approvedRequests
            ->groupBy('type')
            ->map(fn ($requests) => $requests->count())
            ->sortKeys()
            ->all();
        $lateRecords = $records
            ->filter(fn (Attendance $record) => (int) ($record->late_minutes ?? 0) > 0)
            ->values();
        $lateAnalysis = [
            'days'              => $lateRecords->count(),
            'total_minutes'     => (int) $lateRecords->sum('late_minutes'),
            'average_minutes'   => $lateRecords->count()
                ? round((float) $lateRecords->avg('late_minutes'), 1)
                : 0,
            'longest_minutes'   => (int) ($lateRecords->max('late_minutes') ?? 0),
            'deduction_amount'  => round((float) $lateRecords->sum('deduction_amount'), 2),
        ];

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
            'monthly_summary' => $monthlySummary,
            'request_summary' => $requestSummary,
            'late_analysis' => $lateAnalysis,
            'days'        => array_values($days),
            'total_days'  => count($allDays),
        ];
    }

    private function canViewAll($user): bool
    {
        return $user->hasPermission('employee_report.view_all');
    }

    private function canViewPayrollAll($user): bool
    {
        return $user->hasPermission('payroll.view_all')
            || $user->hasPermission('payroll.create')
            || $user->hasPermission('payroll.update');
    }

    private function payrollHistoryRows(Request $request, Carbon $month): array
    {
        $user = $request->user();
        $canAll = $this->canViewPayrollAll($user) || $this->canViewAll($user);
        $ownEmployeeId = (int) ($user->employee_id ?? $user->employee?->id ?? 0);

        if (! $canAll && ! $ownEmployeeId) {
            abort(422, 'Your user account is not linked to an employee profile.');
        }

        $employees = Employee::query()
            ->with(['department', 'position', 'branch', 'salarySetup'])
            ->when(! $canAll, fn ($query) => $query->whereKey($ownEmployeeId))
            ->orderBy('employee_code')
            ->orderBy('first_name')
            ->get();

        $histories = EmployeeMonthlyPayrollHistory::query()
            ->whereDate('month', $month->toDateString())
            ->whereIn('employee_id', $employees->pluck('id'))
            ->get()
            ->keyBy('employee_id');

        $previousHistories = EmployeeMonthlyPayrollHistory::query()
            ->whereDate('month', '<', $month->toDateString())
            ->whereIn('employee_id', $employees->pluck('id'))
            ->orderByDesc('month')
            ->get()
            ->unique('employee_id')
            ->keyBy('employee_id');

        return $employees
            ->values()
            ->map(function (Employee $employee, int $index) use ($request, $month, $histories, $previousHistories) {
                $history = $histories->get($employee->id);
                $previousHistory = $previousHistories->get($employee->id);
                $report = $this->buildEmployeePayrollReportSnapshot($request, $employee, $month);

                return $this->formatPayrollHistoryRow($employee, $history, $previousHistory, $report, $index + 1);
            })
            ->all();
    }

    private function buildEmployeePayrollReportSnapshot(Request $request, Employee $employee, Carbon $month): array
    {
        $reportRequest = $request->duplicate([
            'month' => $month->format('Y-m'),
            'employee_id' => $employee->id,
        ]);
        $reportRequest->setUserResolver(fn () => $request->user());

        return $this->buildReport($reportRequest);
    }

    private function formatPayrollHistoryRow(
        Employee $employee,
        ?EmployeeMonthlyPayrollHistory $history,
        ?EmployeeMonthlyPayrollHistory $previousHistory,
        array $report,
        int $number
    ): array
    {
        $summary = $history
            ? $this->formatPayrollHistory($history)['summary']
            : [
                'baseSalary' => (float) ($previousHistory?->base_salary ?? $employee->salarySetup?->base_salary ?? 0),
                'allowances' => 0.0,
                'overtime' => 0.0,
                'commission' => 0.0,
                'bonus' => 0.0,
                'deductions' => (float) ($report['late_analysis']['deduction_amount'] ?? 0),
                'tax' => 0.0,
            ];
        $gross = (float) $summary['baseSalary']
            + (float) $summary['allowances']
            + (float) $summary['overtime']
            + (float) $summary['commission']
            + (float) $summary['bonus'];
        $deductions = (float) $summary['deductions'] + (float) $summary['tax'];
        $net = $history ? (float) $history->net_salary : $gross - $deductions;

        return [
            'number' => $number,
            'employee_id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'employee_name' => trim("{$employee->first_name} {$employee->last_name}"),
            'department' => $employee->department?->name,
            'position' => $employee->position?->name,
            'branch' => $employee->branch?->name,
            'photo_url' => $employee->photo_url,
            'summary' => $summary,
            'gross_salary' => round($gross, 2),
            'total_deductions' => round($deductions, 2),
            'net_salary' => round($net, 2),
            'status' => $history?->status ?: 'pending',
            'history' => $history ? $this->formatPayrollHistory($history) : null,
            'report_snapshot' => [
                'employee' => $report['employee'],
                'month' => $report['month'],
                'month_label' => $report['month_label'],
                'summary' => $report['summary'],
                'monthly_summary' => $report['monthly_summary'],
                'late_analysis' => $report['late_analysis'],
                'request_summary' => $report['request_summary'],
                'schedule' => $report['schedule'],
                'days' => $report['days'],
                'total_days' => $report['total_days'],
            ],
        ];
    }

    private function resolvePayrollHistoryEmployeeId(Request $request, ?int $requestedEmployeeId): int
    {
        $user = $request->user();

        if ($this->canViewPayrollAll($user) || $this->canViewAll($user)) {
            if (! $requestedEmployeeId) {
                abort(422, 'Select an employee before opening payroll history.');
            }

            return $requestedEmployeeId;
        }

        $employeeId = (int) ($user->employee_id ?? $user->employee?->id ?? 0);

        if (! $employeeId) {
            abort(422, 'Your user account is not linked to an employee profile.');
        }

        if ($requestedEmployeeId && $requestedEmployeeId !== $employeeId) {
            abort(403);
        }

        return $employeeId;
    }

    private function formatPayrollHistory(EmployeeMonthlyPayrollHistory $history): array
    {
        return [
            'id' => $history->id,
            'employee_id' => $history->employee_id,
            'month' => $history->month?->format('Y-m'),
            'summary' => [
                'baseSalary' => (float) $history->base_salary,
                'allowances' => (float) $history->allowances,
                'overtime' => (float) $history->overtime,
                'commission' => (float) $history->commission,
                'bonus' => (float) $history->bonus,
                'deductions' => (float) $history->deductions,
                'tax' => (float) $history->tax,
            ],
            'net_salary' => (float) $history->net_salary,
            'status' => $history->status ?: 'pending',
            'report_snapshot' => $history->report_snapshot,
            'updated_at' => $history->updated_at?->toIso8601String(),
        ];
    }

    private function canViewOwn($user): bool
    {
        return $user->hasPermission('employee_report.view_own');
    }

    private function emptySummary(): array
    {
        return [
            'working_days'     => 0,
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

    private function emptyMonthlySummary(): array
    {
        return [
            'expected_minutes' => 0,
            'worked_minutes'   => 0,
            'overtime_minutes' => 0,
            'late_minutes'     => 0,
            'missing_minutes'  => 0,
            'average_minutes'  => 0,
            'longest_minutes'  => 0,
            'shortest_minutes' => 0,
        ];
    }

    private function emptyLateAnalysis(): array
    {
        return [
            'days' => 0,
            'total_minutes' => 0,
            'average_minutes' => 0,
            'longest_minutes' => 0,
            'deduction_amount' => 0,
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

    private function scheduleLabel(?array $dayInfo): string
    {
        if (! $dayInfo || empty($dayInfo['is_working_day'])) {
            return '-';
        }

        $start = $dayInfo['start'] ?? null;
        $end = $dayInfo['end'] ?? null;

        if ($start && $end) {
            return Carbon::parse($start)->format('h:i A').' - '.Carbon::parse($end)->format('h:i A');
        }

        return $dayInfo['schedule_name'] ?? '-';
    }

    private function scheduledMinutes(?array $dayInfo): int
    {
        if (! $dayInfo || empty($dayInfo['is_working_day']) || empty($dayInfo['start']) || empty($dayInfo['end'])) {
            return 0;
        }

        $start = Carbon::parse($dayInfo['start']);
        $end = Carbon::parse($dayInfo['end']);

        return max(0, $start->diffInMinutes($end, false));
    }

    private function locationLabel(Attendance $record): string
    {
        return $record->check_in_address
            ?: $record->check_out_address
            ?: ($record->check_in_latitude !== null
                ? round((float) $record->check_in_latitude, 5).', '.round((float) $record->check_in_longitude, 5)
                : '-');
    }

    private function requestStatusForDate($requests, string $date): ?string
    {
        $priority = [
            'Late Check In' => 'late',
            'Early Check Out' => 'early_checkout',
            'Day Off' => 'day_off',
            'Missing Check In' => 'missing_checkin',
            'Missing Check Out' => 'missing_checkout',
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
