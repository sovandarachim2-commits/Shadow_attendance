<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\DeductionRule;
use App\Models\Employee;
use App\Models\EmployeeBonus;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollLog;
use App\Models\PermissionRequest;
use App\Models\PermissionType;
use App\Models\Report;
use App\Models\SalaryAdvance;
use App\Models\SalarySetup;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function generate(Carbon $month, ?int $userId = null): Payroll
    {
        $month = $month->copy()->startOfMonth();

        return DB::transaction(function () use ($month, $userId) {
            $payroll = Payroll::query()->updateOrCreate(
                ['month' => $month->toDateString()],
                [
                    'status' => 'draft',
                    'generated_by' => $userId,
                    'generated_at' => now(),
                ],
            );

            $payroll->items()->delete();

            Employee::query()
                ->with(['department', 'position', 'salarySetup'])
                ->where('status', 'active')
                ->get()
                ->each(function (Employee $employee) use ($payroll, $month) {
                    $setup = $employee->salarySetup;
                    if (! $setup || $setup->status !== 'active') {
                        return;
                    }

                    $snapshot = $this->calculateEmployee($employee, $setup, $month);
                    $payroll->items()->create($snapshot);
                });

            $this->recalculateTotals($payroll);
            $this->log($payroll, null, $userId, 'generated', 'Payroll generated from attendance snapshots.');

            return $payroll->fresh(['items.employee.department', 'items.employee.position']);
        });
    }

    public function calculateEmployee(Employee $employee, SalarySetup $setup, Carbon $month): array
    {
        [$start, $end] = [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()];

        $attendances = Attendance::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('attendance_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $presentDays = $attendances->filter(fn ($row) => $row->check_in_at && $row->status !== 'absent')->count();
        $lateDays = $attendances->where('status', 'late')->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $halfDays = $attendances->where('status', 'half_day')->count();
        $missingCheckout = $attendances->filter(fn ($row) => $row->check_in_at && ! $row->check_out_at && $row->status !== 'absent')->count();

        $expectedWorkMinutes = max(1, $presentDays * 8 * 60);
        $actualWorkMinutes = (int) $attendances->sum('work_minutes');
        $overtimeHours = max(0, round(($actualWorkMinutes - $expectedWorkMinutes) / 60, 2));

        $baseSalary = $this->baseSalaryForMonth($setup, $presentDays, $month);
        $dailySalary = $this->dailySalary($setup, $month);
        $overtimeAmount = round($overtimeHours * (float) $setup->overtime_rate, 2);
        [$bonusAmount, $bonusBreakdown] = $this->bonusForEmployee($employee, $month);
        [$salesAmount, $commissionAmount, $commissionBreakdown] = $this->commissionForEmployee($employee, $setup, $start, $end);
        [$deductionAmount, $deductionBreakdown] = $this->deductionsForEmployee($employee, $attendances, $dailySalary, $month);
        [$advanceAmount, $advanceBreakdown] = $this->advancesForEmployee($employee, $month);

        if ($advanceAmount > 0) {
            $deductionBreakdown[] = [
                'type' => 'salary_advance',
                'label' => 'Salary Advance',
                'amount' => $advanceAmount,
                'count' => count($advanceBreakdown),
            ];
        }

        $netSalary = round($baseSalary + $bonusAmount + $commissionAmount + $overtimeAmount - $deductionAmount - $advanceAmount, 2);

        return [
            'employee_id' => $employee->id,
            'salary_setup_id' => $setup->id,
            'salary_type' => $setup->salary_type,
            'base_salary' => $baseSalary,
            'present_days' => $presentDays,
            'late_days' => $lateDays,
            'absent_days' => $absentDays,
            'half_days' => $halfDays,
            'missing_checkout_days' => $missingCheckout,
            'overtime_hours' => $overtimeHours,
            'sales_amount' => $salesAmount,
            'bonus_amount' => $bonusAmount,
            'deduction_amount' => $deductionAmount,
            'advance_amount' => $advanceAmount,
            'overtime_amount' => $overtimeAmount,
            'commission_amount' => $commissionAmount,
            'net_salary' => $netSalary,
            'bonus_breakdown' => $bonusBreakdown,
            'deduction_breakdown' => $deductionBreakdown,
            'commission_breakdown' => $commissionBreakdown,
            'attendance_snapshot' => [
                'present_days' => $presentDays,
                'late_days' => $lateDays,
                'absent_days' => $absentDays,
                'half_days' => $halfDays,
                'missing_checkout' => $missingCheckout,
                'work_minutes' => $actualWorkMinutes,
            ],
            'status' => 'draft',
        ];
    }

    public function recalculateTotals(Payroll $payroll): void
    {
        $items = $payroll->items()->get();

        $payroll->update([
            'total_base_salary' => $items->sum('base_salary'),
            'total_bonus' => $items->sum('bonus_amount'),
            'total_deductions' => $items->sum(fn ($item) => (float) $item->deduction_amount + (float) $item->advance_amount),
            'total_overtime' => $items->sum('overtime_amount'),
            'total_commission' => $items->sum('commission_amount'),
            'total_net_salary' => $items->sum('net_salary'),
        ]);
    }

    public function changeStatus(Payroll $payroll, string $status, ?int $userId = null): Payroll
    {
        $data = ['status' => $status];

        if ($status === 'approved') {
            $data['approved_by'] = $userId;
            $data['approved_at'] = now();
        }

        if ($status === 'paid') {
            $data['paid_by'] = $userId;
            $data['paid_at'] = now();
        }

        $payroll->update($data);
        $payroll->items()->update(['status' => $status === 'pending' ? 'pending' : ($status === 'paid' ? 'paid' : 'approved')]);
        $this->log($payroll, null, $userId, $status, "Payroll marked {$status}.");

        if ($status === 'paid') {
            SalaryAdvance::query()
                ->whereIn('employee_id', $payroll->items()->pluck('employee_id'))
                ->where('status', 'approved')
                ->whereDate('deduct_month', $payroll->month->toDateString())
                ->update(['status' => 'deducted', 'remaining_amount' => 0]);
        }

        return $payroll->fresh(['items.employee.department', 'items.employee.position']);
    }

    private function baseSalaryForMonth(SalarySetup $setup, int $presentDays, Carbon $month): float
    {
        return match ($setup->salary_type) {
            'daily' => round((float) $setup->base_salary * $presentDays, 2),
            'commission_only' => 0.0,
            default => round((float) $setup->base_salary, 2),
        };
    }

    private function dailySalary(SalarySetup $setup, Carbon $month): float
    {
        return match ($setup->salary_type) {
            'daily' => (float) $setup->base_salary,
            'commission_only' => 0.0,
            default => round(((float) $setup->base_salary) / max(1, $month->daysInMonth), 2),
        };
    }

    private function bonusForEmployee(Employee $employee, Carbon $month): array
    {
        $bonuses = EmployeeBonus::query()
            ->where('employee_id', $employee->id)
            ->whereDate('month', $month->copy()->startOfMonth())
            ->whereIn('status', ['approved', 'paid'])
            ->get();

        return [
            round((float) $bonuses->sum('bonus_amount'), 2),
            $bonuses->map(fn ($bonus) => [
                'label' => $bonus->reason ?: ucwords(str_replace('_', ' ', $bonus->bonus_type ?? 'Bonus')),
                'type' => $bonus->bonus_type,
                'amount' => (float) $bonus->bonus_amount,
            ])->values()->all(),
        ];
    }

    private function commissionForEmployee(Employee $employee, SalarySetup $setup, Carbon $start, Carbon $end): array
    {
        $salesAmount = (float) Report::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('report_date', [$start->toDateString(), $end->toDateString()])
            ->get()
            ->sum(fn ($report) => (float) ($report->metrics['sales_amount'] ?? $report->metrics['amount'] ?? 0));

        $commission = round($salesAmount * ((float) $setup->commission_percent / 100), 2);

        return [
            $salesAmount,
            $commission,
            [[
                'label' => 'Sales Commission',
                'sales_amount' => $salesAmount,
                'percent' => (float) $setup->commission_percent,
                'amount' => $commission,
            ]],
        ];
    }

    private function deductionsForEmployee(Employee $employee, $attendances, float $dailySalary, Carbon $month): array
    {
        $rules = DeductionRule::query()->where('status', true)->get();
        $total = 0.0;
        $breakdown = [];

        foreach ($rules as $rule) {
            $count = match ($rule->deduction_type) {
                'late' => $attendances->filter(fn ($row) => $this->chargeableLateMinutes($row) > (int) ($rule->threshold_minutes ?? 0))->count(),
                'absent' => $attendances->where('status', 'absent')->count(),
                'missing_checkout' => $attendances->filter(fn ($row) => $row->check_in_at && ! $row->check_out_at && $row->status !== 'absent')->count(),
                default => 0,
            };

            if ($count <= 0) {
                continue;
            }

            $amount = $rule->amount_type === 'daily_salary'
                ? $dailySalary * $count
                : (float) $rule->amount * $count;

            $amount = round($amount, 2);
            $total += $amount;
            $breakdown[] = [
                'type' => $rule->deduction_type,
                'label' => $rule->rule_name,
                'count' => $count,
                'amount' => $amount,
            ];
        }

        [$permissionTotal, $permissionBreakdown] = $this->permissionRequestDeductionsForEmployee($employee, $month);
        $total += $permissionTotal;
        $breakdown = array_merge($breakdown, $permissionBreakdown);

        return [round($total, 2), $breakdown];
    }

    private function permissionRequestDeductionsForEmployee(Employee $employee, Carbon $month): array
    {
        $types = PermissionType::query()
            ->where('is_active', true)
            ->with('rules')
            ->get()
            ->keyBy('name');

        if ($types->isEmpty()) {
            return [0.0, []];
        }

        $requests = PermissionRequest::query()
            ->where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->whereIn('type', $types->keys())
            ->whereBetween('request_date', [
                $month->copy()->startOfYear()->toDateString(),
                $month->copy()->endOfMonth()->toDateString(),
            ])
            ->orderBy('request_date')
            ->get();

        $total = 0.0;
        $breakdown = [];

        $usage = [];
        foreach ($requests as $request) {
            $type = $types->get($request->type);
            if (! $type) {
                continue;
            }

            $effective = $this->effectivePermissionTypeForPayroll($type, $employee, $request->request_date);
            if (! $effective || (float) $effective->deduction_amount <= 0) {
                continue;
            }

            $period = match ($effective->limit_type) {
                'per_day' => $request->request_date->toDateString(),
                'per_year' => $request->request_date->format('Y'),
                default => $request->request_date->format('Y-m'),
            };
            $key = implode('|', [$request->type, $effective->limit_type, (int) $effective->allowed_times, (float) $effective->deduction_amount, $period]);
            $usage[$key] = ($usage[$key] ?? 0) + 1;

            if (! $request->request_date->betweenIncluded($month->copy()->startOfMonth(), $month->copy()->endOfMonth())) {
                continue;
            }

            if ($usage[$key] <= (int) $effective->allowed_times) {
                continue;
            }

            $amount = round((float) $effective->deduction_amount, 2);
            $total += $amount;
            $breakdownKey = "{$request->type}|{$effective->limit_type}|{$effective->deduction_amount}";
            if (! isset($breakdown[$breakdownKey])) {
                $breakdown[$breakdownKey] = [
                    'type' => 'permission_request',
                    'label' => "{$request->type} over allowance",
                    'count' => 0,
                    'amount' => 0.0,
                ];
            }
            $breakdown[$breakdownKey]['count']++;
            $breakdown[$breakdownKey]['amount'] = round($breakdown[$breakdownKey]['amount'] + $amount, 2);
        }

        return [round($total, 2), array_values($breakdown)];
    }

    private function effectivePermissionTypeForPayroll(PermissionType $type, Employee $employee, Carbon $date): PermissionType
    {
        $schedule = app(WorkScheduleService::class)->scheduleForEmployeeOnDate($employee->id, $date);
        $rule = $type->rules->first(fn ($item) => (int) $item->employee_id === (int) $employee->id)
            ?: ($schedule ? $type->rules->first(fn ($item) => (int) $item->work_schedule_id === (int) $schedule->id) : null);

        if (! $rule) {
            return $type;
        }

        $type = clone $type;
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

    private function chargeableLateMinutes(Attendance $attendance): int
    {
        $reason = (string) $attendance->deduction_reason;

        if (preg_match('/charged\s+(\d+)m/i', $reason, $matches)) {
            return (int) $matches[1];
        }

        if (str_contains($reason, 'approved Late Check In request')) {
            return 0;
        }

        return (int) $attendance->late_minutes;
    }

    private function advancesForEmployee(Employee $employee, Carbon $month): array
    {
        $advances = SalaryAdvance::query()
            ->where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->whereDate('deduct_month', $month->copy()->startOfMonth()->toDateString())
            ->get();

        return [
            round((float) $advances->sum('amount'), 2),
            $advances->map(fn ($advance) => [
                'id' => $advance->id,
                'amount' => (float) $advance->amount,
                'reason' => $advance->reason,
            ])->values()->all(),
        ];
    }

    public function log(Payroll $payroll, ?PayrollItem $item, ?int $userId, string $action, ?string $notes = null): void
    {
        PayrollLog::create([
            'payroll_id' => $payroll->id,
            'payroll_item_id' => $item?->id,
            'user_id' => $userId,
            'action' => $action,
            'notes' => $notes,
        ]);
    }
}
