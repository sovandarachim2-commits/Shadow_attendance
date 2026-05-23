<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Repositories\AttendanceRepository;
use App\Services\AttendanceReportService;
use Illuminate\Http\Request;

class AttendanceReportController extends Controller
{
    public function __construct(
        private AttendanceRepository $attendance,
        private AttendanceReportService $reports,
    ) {}

    public function admin(Request $request)
    {
        $this->authorizeReport($request, true);

        $data = $this->validatedFilters($request);
        $filters = $this->buildFilters($request, $data, true);
        $records = $this->attendance->listForReport($filters);

        return response()->json([
            'today_stats' => $this->reports->todayStats(),
            'period' => [
                'from' => $filters['from'] ?? $filters['date'] ?? null,
                'to' => $filters['to'] ?? $filters['date'] ?? null,
            ],
            'summary' => $this->reports->summaryForCollection($records),
            'records' => $records->map(fn ($row) => $this->reports->formatRecord($row))->values(),
        ]);
    }

    public function employee(Request $request)
    {
        $this->authorizeReport($request, false);

        if (! $request->user()->employee_id) {
            abort(422, 'Your user account is not linked to an employee profile.');
        }

        $data = $this->validatedFilters($request);
        $filters = $this->buildFilters($request, $data, false);
        $records = $this->attendance->listForReport($filters);
        $employee = Employee::with(['department', 'position', 'branch'])->find($filters['employee_id']);

        return response()->json([
            'employee' => $employee ? [
                'id' => $employee->id,
                'employee_code' => $employee->employee_code,
                'full_name' => trim("{$employee->first_name} {$employee->last_name}"),
                'department' => $employee->department?->name,
                'position' => $employee->position?->name,
                'branch' => $employee->branch?->name,
            ] : null,
            'period' => [
                'from' => $filters['from'] ?? null,
                'to' => $filters['to'] ?? null,
            ],
            'summary' => $this->reports->summaryForCollection($records),
            'records' => $records->map(fn ($row) => $this->reports->formatRecord($row))->values(),
        ]);
    }

    public function show(Request $request, Attendance $attendance)
    {
        $this->authorizeRecord($request, $attendance);

        $attendance->load(['employee.department', 'employee.position', 'branch', 'logs.editor']);

        $formatted = $this->reports->formatRecord($attendance);
        $formatted['logs'] = $attendance->logs;
        $formatted['bonus_eligible'] = in_array($attendance->status, ['present'], true)
            && ($attendance->late_minutes ?? 0) === 0;

        return response()->json($formatted);
    }

    public function export(Request $request)
    {
        $canExport = $request->user()->hasAnyPermission(
            'reports.attendance.export',
            'reports.attendance.view_all',
            'attendance.view_all',
        ) || $request->user()->hasAnyPermission('reports.attendance.view_own', 'attendance.view_own');

        if (! $canExport) {
            abort(403, 'You do not have permission to export attendance reports.');
        }

        $isAdmin = $this->canViewAll($request);
        $data = $this->validatedFilters($request);
        $filters = $this->buildFilters($request, $data, $isAdmin);
        $records = $this->attendance->listForReport($filters);
        $escape = fn ($value) => '"'.str_replace('"', '""', (string) $value).'"';

        $csv = implode(',', [
            'date', 'employee_code', 'employee', 'department', 'branch', 'check_in', 'check_out',
            'work_minutes', 'status', 'type', 'late_minutes', 'deduction', 'gps_status', 'location',
        ])."\n";

        $csv .= $records->map(function ($row) use ($escape) {
            $formatted = $this->reports->formatRecord($row);

            return implode(',', [
                $escape($formatted['attendance_date']),
                $escape($formatted['employee_code']),
                $escape($formatted['employee_name']),
                $escape($formatted['department']),
                $escape($formatted['branch']),
                $escape($row->check_in_at?->format('Y-m-d H:i:s')),
                $escape($row->check_out_at?->format('Y-m-d H:i:s')),
                $escape($row->work_minutes),
                $escape($formatted['display_status']),
                $escape($row->type),
                $escape($row->late_minutes),
                $escape($row->deduction_amount),
                $escape($formatted['gps_status']),
                $escape($formatted['location']),
            ]);
        })->implode("\n");

        $from = $filters['from'] ?? 'all';
        $to = $filters['to'] ?? 'all';

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"attendance-reports-{$from}-to-{$to}.csv\"",
        ]);
    }

    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'employee_id' => ['nullable', 'integer', 'exists:employees,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:40'],
            'type' => ['nullable', 'in:office,outdoor'],
            'gps_status' => ['nullable', 'in:verified,partial,unverified'],
            'month' => ['nullable', 'date_format:Y-m'],
        ]);
    }

    private function buildFilters(Request $request, array $data, bool $adminScope): array
    {
        $filters = array_filter([
            'employee_id' => $data['employee_id'] ?? null,
            'department_id' => $data['department_id'] ?? null,
            'branch_id' => $data['branch_id'] ?? null,
            'from' => $data['from'] ?? null,
            'to' => $data['to'] ?? null,
            'date' => $data['date'] ?? null,
            'status' => $data['status'] ?? null,
            'type' => $data['type'] ?? null,
            'gps_status' => $data['gps_status'] ?? null,
        ], fn ($v) => $v !== null && $v !== '');

        if (! empty($data['month'])) {
            $month = \Carbon\Carbon::parse($data['month'].'-01');
            $filters['from'] = $month->copy()->startOfMonth()->toDateString();
            $filters['to'] = $month->copy()->endOfMonth()->toDateString();
        }

        if (! $adminScope) {
            $filters['employee_id'] = $request->user()->employee_id;
        }

        if (empty($filters['from']) && empty($filters['to']) && empty($filters['date'])) {
            $filters['from'] = now()->startOfMonth()->toDateString();
            $filters['to'] = now()->toDateString();
        }

        return $filters;
    }

    private function canViewAll(Request $request): bool
    {
        return $request->user()->hasAnyPermission(
            'reports.attendance.view_all',
            'attendance.view_all',
        );
    }

    private function authorizeReport(Request $request, bool $admin): void
    {
        if ($admin && ! $this->canViewAll($request)) {
            abort(403);
        }
        if (! $admin && ! $request->user()->hasAnyPermission('reports.attendance.view_own', 'attendance.view_own')) {
            abort(403);
        }
    }

    private function authorizeRecord(Request $request, Attendance $attendance): void
    {
        if ($this->canViewAll($request)) {
            return;
        }
        if ((int) $attendance->employee_id !== (int) $request->user()->employee_id) {
            abort(403);
        }
    }
}
