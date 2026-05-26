<?php

namespace App\Services;

use App\Models\LateDeductionRule;
use App\Models\LateRule;
use App\Models\WorkSchedule;
use Illuminate\Support\Carbon;

class LateRuleService
{
    public function __construct(
        private WorkScheduleService $workSchedules,
    ) {}

    public function settings(): LateRule
    {
        return LateRule::query()->firstOrCreate([]);
    }

    /**
     * @return array{
     *   is_late: bool,
     *   status: string,
     *   raw_late_minutes: int,
     *   late_minutes: int,
     *   grace_minutes: int,
     *   work_start: Carbon,
     *   applied_rule: ?LateDeductionRule,
     *   deduction_amount: ?float,
     *   deduction_reason: ?string,
     * }
     */
    public function evaluate(Carbon $checkInAt, ?int $employeeId = null): array
    {
        $settings = $this->settings();
        $schedule = $employeeId ? $this->workSchedules->scheduleForEmployee($employeeId) : null;
        $workStart = $this->workStartForCheckIn($settings, $checkInAt, $schedule);
        $grace = (int) ($settings->grace_minutes ?? 0);

        $rawSeconds  = $checkInAt->greaterThan($workStart)
            ? (int) $workStart->diffInSeconds($checkInAt)
            : 0;
        $rawLate     = (int) ceil($rawSeconds / 60);
        $lateSeconds = max(0, $rawSeconds - ($grace * 60));
        $lateMinutes = max(0, $rawLate - $grace);
        $isLate = (bool) $settings->auto_mark_late && $lateMinutes > 0;

        $appliedRule = $isLate ? $this->findMatchingRule($lateMinutes, $schedule?->id) : null;
        $deduction = $this->resolveDeduction($appliedRule, $settings);

        return [
            'is_late'            => $isLate,
            'status'             => $isLate ? 'late' : 'present',
            'raw_late_minutes'   => $rawLate,
            'late_minutes'       => $lateMinutes,
            'late_seconds'       => $lateSeconds,
            'grace_minutes'      => $grace,
            'work_start'         => $workStart,
            'applied_rule'       => $appliedRule,
            'deduction_amount'   => $deduction['amount'],
            'deduction_reason'   => $deduction['reason'],
        ];
    }

    public function formatLateDuration(int $seconds): string
    {
        $h = intdiv($seconds, 3600);
        $m = intdiv($seconds % 3600, 60);
        $s = $seconds % 60;

        if ($h > 0) {
            return "{$h}h {$m}m {$s}s";
        }

        if ($m > 0) {
            return "{$m}m {$s}s";
        }

        return "{$s}s";
    }

    public function formatRuleRange(?LateDeductionRule $rule): string
    {
        if (! $rule) {
            return '—';
        }

        if ($rule->to_minutes === null) {
            return "{$rule->from_minutes}+ min";
        }

        return "{$rule->from_minutes}-{$rule->to_minutes} min";
    }

    public function formatDeductionAmount(?float $amount, ?LateDeductionRule $rule = null): string
    {
        if ($amount !== null) {
            return '$'.number_format((float) $amount, 2);
        }

        if (! $rule || $rule->deduction_type === 'none') {
            return '$0.00';
        }

        return $this->formatDeductionLabel($rule);
    }

    public function formatDeductionLabel(?LateDeductionRule $rule): string
    {
        if (! $rule) {
            return '$0.00';
        }

        return match ($rule->deduction_type) {
            'none'       => '$0.00',
            'half_day'   => 'Half Day',
            'full_day'   => 'Full Day',
            'percentage' => ($rule->deduction_amount ?? 0).'%',
            'fixed'      => '$'.number_format((float) ($rule->deduction_amount ?? 0), 2),
            default      => '—',
        };
    }

    private function workStartForCheckIn(LateRule $settings, Carbon $checkInAt, ?WorkSchedule $schedule = null): Carbon
    {
        // Use the employee's assigned schedule start time for today if available
        if ($schedule) {
            $dayKey = strtolower($checkInAt->format('l'));
            $startTime = $schedule->{"{$dayKey}_start"};
            if ($startTime !== null && $startTime !== '') {
                return $checkInAt->copy()->startOfDay()->setTimeFromTimeString(
                    substr((string) $startTime, 0, 8)
                );
            }
        }

        // Fall back to global work_start_time setting
        $time = $settings->work_start_time;
        if ($time instanceof Carbon) {
            $time = $time->format('H:i:s');
        }

        return $checkInAt->copy()->startOfDay()->setTimeFromTimeString(
            $time ? (string) $time : config('attendance.office_start_time', '08:00:00')
        );
    }

    private function findMatchingRule(int $lateMinutes, ?int $scheduleId = null): ?LateDeductionRule
    {
        $activeRules = LateDeductionRule::query()
            ->with('schedules')
            ->where('status', true)
            ->orderBy('from_minutes')
            ->get();

        $matcher = function (LateDeductionRule $rule) use ($lateMinutes) {
            $to = $rule->to_minutes === null ? PHP_INT_MAX : (int) $rule->to_minutes;
            return $lateMinutes >= (int) $rule->from_minutes && $lateMinutes <= $to;
        };

        // First: try schedule-specific rules (rule has the employee's schedule assigned)
        if ($scheduleId !== null) {
            $scheduleRule = $activeRules
                ->filter(fn ($r) => $r->schedules->pluck('id')->contains($scheduleId))
                ->first($matcher);
            if ($scheduleRule) {
                return $scheduleRule;
            }
        }

        // Fall back: global rules (no schedules assigned)
        return $activeRules
            ->filter(fn ($r) => $r->schedules->isEmpty())
            ->first($matcher);
    }

    /**
     * @return array{amount: ?float, reason: ?string}
     */
    private function resolveDeduction(?LateDeductionRule $rule, LateRule $settings): array
    {
        if (! $rule || ! $settings->auto_apply_deduction) {
            return ['amount' => null, 'reason' => null];
        }

        $range = $this->formatRuleRange($rule);
        $reason = $rule->rule_name ?: "Late {$range}";

        return match ($rule->deduction_type) {
            'none' => ['amount' => 0.0, 'reason' => $reason],
            'fixed', 'percentage' => [
                'amount' => $rule->deduction_amount !== null ? (float) $rule->deduction_amount : null,
                'reason' => $reason,
            ],
            'half_day', 'full_day' => [
                'amount' => null,
                'reason' => "{$reason} ({$this->formatDeductionLabel($rule)})",
            ],
            default => ['amount' => null, 'reason' => $reason],
        };
    }
}
