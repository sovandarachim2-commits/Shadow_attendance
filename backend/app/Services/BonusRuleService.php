<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\BonusRule;
use App\Models\BonusSetting;
use App\Models\CustomerVisit;
use App\Models\Employee;
use App\Models\EmployeeBonus;
use App\Models\Report;
use Carbon\Carbon;

class BonusRuleService
{
    public function settings(): BonusSetting
    {
        return BonusSetting::query()->firstOrCreate([]);
    }

    public function activeRules(?Carbon $onDate = null): \Illuminate\Support\Collection
    {
        $onDate = $onDate ?? Carbon::today();

        return BonusRule::query()
            ->where('status', true)
            ->orderBy('rule_name')
            ->get()
            ->filter(function (BonusRule $rule) use ($onDate) {
                if ($rule->start_date && $onDate->lt($rule->start_date)) {
                    return false;
                }
                if ($rule->end_date && $onDate->gt($rule->end_date)) {
                    return false;
                }

                return true;
            });
    }

    public function monthRange(Carbon $month): array
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        return [$start, $end];
    }

    public function evaluate(Employee $employee, BonusRule $rule, Carbon $month): array
    {
        [$start, $end] = $this->monthRange($month);

        $attendances = Attendance::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('attendance_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $lateCount = $attendances->where('status', 'late')->count();
        $absentCount = $attendances->where('status', 'absent')->count();
        $presentDays = $attendances->filter(fn ($a) => $a->check_in_at)->count();
        $overtimeMinutes = (int) $attendances->sum('work_minutes');
        $visitCount = CustomerVisit::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('check_in_at', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])
            ->count();

        $salesTotal = (float) Report::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('report_date', [$start->toDateString(), $end->toDateString()])
            ->get()
            ->sum(fn ($r) => (float) ($r->metrics['sales_amount'] ?? $r->metrics['amount'] ?? 0));

        $threshold = (float) ($rule->condition_value ?? 0);
        $eligible = match ($rule->condition_type) {
            'no_late' => $lateCount === 0 && $presentDays > 0,
            'no_absent' => $absentCount === 0 && $presentDays > 0,
            'full_attendance' => $presentDays > 0 && $lateCount === 0 && $absentCount === 0,
            'overtime_hours' => $overtimeMinutes >= ($threshold * 60),
            'customer_visit_count' => $visitCount >= $threshold,
            'sales_amount' => $salesTotal >= $threshold,
            'route_completion' => $visitCount >= max(1, $threshold),
            'working_days' => $presentDays >= $threshold,
            'custom_logic' => false,
            default => false,
        };

        return [
            'eligible' => $eligible,
            'metrics' => [
                'late_count' => $lateCount,
                'absent_count' => $absentCount,
                'present_days' => $presentDays,
                'visit_count' => $visitCount,
                'overtime_hours' => round($overtimeMinutes / 60, 1),
                'sales_amount' => $salesTotal,
            ],
        ];
    }

    public function preview(Employee $employee, ?BonusRule $rule, Carbon $month): array
    {
        $rules = $rule ? collect([$rule]) : $this->activeRules($month);
        $applied = null;
        $amount = 0.0;

        foreach ($rules as $candidate) {
            $result = $this->evaluate($employee, $candidate, $month);
            if ($result['eligible']) {
                $applied = $candidate;
                $amount = (float) $candidate->bonus_amount;
                break;
            }
        }

        if (! $applied && $rules->isNotEmpty()) {
            $result = $this->evaluate($employee, $rules->first(), $month);
        } else {
            $result = $applied
                ? $this->evaluate($employee, $applied, $month)
                : ['eligible' => false, 'metrics' => ['late_count' => 0, 'absent_count' => 0, 'present_days' => 0, 'visit_count' => 0, 'overtime_hours' => 0, 'sales_amount' => 0]];
        }

        return [
            'employee' => $employee,
            'applied_rule' => $applied,
            'bonus_amount' => $amount,
            'eligible' => (bool) $applied,
            'metrics' => $result['metrics'],
        ];
    }

    public function previewFull(Employee $employee, Carbon $month): array
    {
        [$start, $end] = $this->monthRange($month);

        $attendances = Attendance::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('attendance_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $missingCheckout = $attendances->filter(fn ($a) => $a->check_in_at && ! $a->check_out_at)->count();

        $appliedRules = [];
        $total = 0.0;

        foreach ($this->activeRules($month) as $rule) {
            $eval = $this->evaluate($employee, $rule, $month);
            if ($eval['eligible']) {
                $appliedRules[] = $rule;
                $total += (float) $rule->bonus_amount;
            }
        }

        $firstRule = $this->activeRules($month)->first();
        $metrics = $firstRule
            ? $this->evaluate($employee, $firstRule, $month)['metrics']
            : ['late_count' => 0, 'absent_count' => 0, 'present_days' => 0, 'visit_count' => 0, 'overtime_hours' => 0, 'sales_amount' => 0];
        $metrics['missing_checkout'] = $missingCheckout;

        return [
            'employee' => $employee,
            'applied_rules' => $appliedRules,
            'applied_rules_count' => count($appliedRules),
            'bonus_amount' => $total,
            'eligible' => count($appliedRules) > 0,
            'metrics' => $metrics,
        ];
    }

    public function bonusChartSummary(Carbon $month): array
    {
        $monthStart = $month->copy()->startOfMonth();
        $bonuses = EmployeeBonus::query()
            ->whereDate('month', $monthStart)
            ->whereIn('status', ['approved', 'paid', 'pending'])
            ->get();

        $groups = [
            'attendance' => ['label' => 'Attendance', 'color' => '#10b981', 'amount' => 0],
            'outdoor_sales' => ['label' => 'Outdoor Sales', 'color' => '#f97316', 'amount' => 0],
            'sales' => ['label' => 'Sales', 'color' => '#3b82f6', 'amount' => 0],
            'performance' => ['label' => 'Performance', 'color' => '#8b5cf6', 'amount' => 0],
        ];

        foreach ($bonuses as $bonus) {
            $key = $this->bonusCategory($bonus->bonus_type ?? 'custom');
            $groups[$key]['amount'] += (float) $bonus->bonus_amount;
        }

        $total = array_sum(array_column($groups, 'amount'));

        return [
            'total' => $total,
            'segments' => array_values($groups),
        ];
    }

    public function bonusCategory(string $type): string
    {
        return match ($type) {
            'perfect_attendance', 'no_late', 'no_absent' => 'attendance',
            'outdoor_sales', 'customer_visit' => 'outdoor_sales',
            'sales_target' => 'sales',
            default => 'performance',
        };
    }

    /**
     * @return array<int, EmployeeBonus>
     */
    public function calculateMonth(Carbon $month, bool $autoApprove = false): array
    {
        $settings = $this->settings();
        $created = [];
        $employees = Employee::query()->get();

        foreach ($employees as $employee) {
            foreach ($this->activeRules($month) as $rule) {
                $eval = $this->evaluate($employee, $rule, $month);
                if (! $eval['eligible']) {
                    continue;
                }

                $exists = EmployeeBonus::query()
                    ->where('employee_id', $employee->id)
                    ->where('bonus_rule_id', $rule->id)
                    ->whereDate('month', $month->copy()->startOfMonth())
                    ->exists();

                if ($exists) {
                    continue;
                }

                $status = ($autoApprove || $settings->auto_approve_bonus) ? 'approved' : 'pending';

                $created[] = EmployeeBonus::create([
                    'employee_id' => $employee->id,
                    'bonus_rule_id' => $rule->id,
                    'month' => $month->copy()->startOfMonth(),
                    'bonus_amount' => $rule->bonus_amount,
                    'bonus_type' => $rule->bonus_type,
                    'reason' => $rule->rule_name,
                    'status' => $status,
                    'approved_at' => $status === 'approved' ? now() : null,
                ]);
            }
        }

        return $created;
    }

    public function conditionLabel(BonusRule $rule): string
    {
        return match ($rule->condition_type) {
            'no_late' => 'No late attendance',
            'no_absent' => 'No absent days',
            'full_attendance' => 'Full attendance',
            'overtime_hours' => 'Overtime ≥ '.(int) $rule->condition_value.' hrs',
            'customer_visit_count' => (int) $rule->condition_value.' customer visits',
            'sales_amount' => 'Sales ≥ $'.number_format((float) $rule->condition_value, 2),
            'route_completion' => 'Route completion',
            'working_days' => (int) $rule->condition_value.' working days',
            'custom_logic' => 'Custom logic',
            default => $rule->condition_type,
        };
    }

    public function bonusTypeLabel(string $type): string
    {
        return match ($type) {
            'perfect_attendance' => 'Perfect Attendance Bonus',
            'no_late' => 'No Late Bonus',
            'no_absent' => 'No Absent Bonus',
            'overtime' => 'Overtime Bonus',
            'outdoor_sales' => 'Outdoor Sales Bonus',
            'customer_visit' => 'Customer Visit Bonus',
            'sales_target' => 'Sales Target Bonus',
            'monthly_performance' => 'Monthly Performance Bonus',
            'custom' => 'Custom Bonus',
            default => ucwords(str_replace('_', ' ', $type)),
        };
    }
}
