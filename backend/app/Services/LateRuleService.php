<?php

namespace App\Services;

use App\Models\LateDeductionRule;
use App\Models\LateRule;
use Illuminate\Support\Carbon;

class LateRuleService
{
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
    public function evaluate(Carbon $checkInAt): array
    {
        $settings = $this->settings();
        $workStart = $this->workStartForCheckIn($settings, $checkInAt);
        $grace = (int) ($settings->grace_minutes ?? 0);

        $rawLate = $checkInAt->greaterThan($workStart)
            ? (int) ceil($workStart->diffInSeconds($checkInAt) / 60)
            : 0;
        $lateMinutes = max(0, $rawLate - $grace);
        $isLate = (bool) $settings->auto_mark_late && $lateMinutes > 0;

        $appliedRule = $isLate ? $this->findMatchingRule($lateMinutes) : null;
        $deduction = $this->resolveDeduction($appliedRule, $settings);

        return [
            'is_late'            => $isLate,
            'status'             => $isLate ? 'late' : 'present',
            'raw_late_minutes'   => $rawLate,
            'late_minutes'       => $lateMinutes,
            'grace_minutes'      => $grace,
            'work_start'         => $workStart,
            'applied_rule'       => $appliedRule,
            'deduction_amount'   => $deduction['amount'],
            'deduction_reason'   => $deduction['reason'],
        ];
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

    private function workStartForCheckIn(LateRule $settings, Carbon $checkInAt): Carbon
    {
        $time = $settings->work_start_time;
        if ($time instanceof Carbon) {
            $time = $time->format('H:i:s');
        }

        return $checkInAt->copy()->startOfDay()->setTimeFromTimeString(
            $time ? (string) $time : config('attendance.office_start_time', '08:00:00')
        );
    }

    private function findMatchingRule(int $lateMinutes): ?LateDeductionRule
    {
        return LateDeductionRule::query()
            ->where('status', true)
            ->orderBy('from_minutes')
            ->get()
            ->first(function (LateDeductionRule $rule) use ($lateMinutes) {
                $to = $rule->to_minutes === null ? PHP_INT_MAX : (int) $rule->to_minutes;

                return $lateMinutes >= (int) $rule->from_minutes && $lateMinutes <= $to;
            });
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
