<?php

namespace App\Services;

use App\Models\AttendanceRule;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class AttendanceRuleService
{
    public function rules(): AttendanceRule
    {
        return AttendanceRule::query()->firstOrCreate([]);
    }

    public function workEndToday(User $user, ?Carbon $date = null): ?Carbon
    {
        $date = $date ?? Carbon::today();

        try {
            $schedule = app(WorkScheduleService::class)->scheduleForEmployee($user->employee_id);
            $day = app(WorkScheduleService::class)->dayInfoForDate($schedule, $date);

            if ($day['is_working_day'] && $day['end']) {
                return Carbon::today()->setTimeFromTimeString($day['end'].':00');
            }
        } catch (\Throwable) {
            // Fall through to attendance rules defaults.
        }

        $rules = $this->rules();
        $end = $rules->work_end_time;

        if (! $end) {
            return null;
        }

        if ($end instanceof Carbon) {
            $end = $end->format('H:i:s');
        }

        return Carbon::today()->setTimeFromTimeString((string) $end);
    }

    /**
     * @return array<int, string>
     */
    public function checkOutBlockers(User $user, Attendance $attendance, Carbon $checkOutAt): array
    {
        $blockers = [];
        $rules = $this->rules();
        $workMinutes = $attendance->check_in_at->diffInMinutes($checkOutAt);
        $minHours = (float) ($rules->minimum_work_hours ?? 0);

        if ($minHours > 0 && $workMinutes < (int) round($minHours * 60)) {
            $blockers[] = sprintf(
                'You worked %.1f hours (minimum is %.1f). Check-out is not allowed.',
                $workMinutes / 60,
                $minHours
            );
        }

        $workEnd = $this->workEndToday($user, $checkOutAt);

        if ($workEnd && $checkOutAt->lessThan($workEnd)) {
            $blockers[] = sprintf(
                'Check-out is before work end (%s). Check-out is not allowed.',
                $workEnd->format('h:i A')
            );
        }

        return $blockers;
    }

    public function assertCanCheckOut(User $user, Attendance $attendance, Carbon $checkOutAt): void
    {
        $blockers = $this->checkOutBlockers($user, $attendance, $checkOutAt);

        if ($blockers === []) {
            return;
        }

        throw ValidationException::withMessages([
            'attendance' => $blockers,
        ]);
    }
}
