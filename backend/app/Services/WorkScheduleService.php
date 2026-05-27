<?php

namespace App\Services;

use App\Models\EmployeeSchedule;
use App\Models\WorkSchedule;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class WorkScheduleService
{
    public function scheduleForEmployee(int $employeeId): WorkSchedule
    {
        return $this->scheduleForEmployeeOnDate($employeeId, Carbon::today());
    }

    public function scheduleForEmployeeOnDate(int $employeeId, Carbon $date): WorkSchedule
    {
        $assignment = EmployeeSchedule::query()
            ->with('schedule')
            ->where('employee_id', $employeeId)
            ->where('effective_date', '<=', $date->toDateString())
            ->orderByDesc('effective_date')
            ->first();

        if ($assignment?->schedule) {
            return $assignment->schedule;
        }

        $default = WorkSchedule::query()->where('is_default', true)->first();

        return $default ?? WorkSchedule::query()->firstOrFail();
    }

    public function dayInfoForDate(WorkSchedule $schedule, Carbon $date): array
    {
        $dayKey = strtolower($date->format('l'));
        $startKey = "{$dayKey}_start";
        $start = $schedule->{$startKey};
        $isWorking = $start !== null && $start !== '';

        return [
            'day_key'         => $dayKey,
            'day_label'       => $date->format('l'),
            'is_working_day'  => $isWorking,
            'start'           => $isWorking ? $this->formatTime($schedule->{$startKey}) : null,
            'end'             => $isWorking ? $this->formatTime($schedule->{"{$dayKey}_end"}) : null,
            'schedule_id'     => $schedule->id,
            'schedule_name'   => $schedule->schedule_name,
        ];
    }

    public function todayInfoForEmployee(int $employeeId): array
    {
        return $this->dayInfoForDate($this->scheduleForEmployee($employeeId), Carbon::today());
    }

    public function canOverrideSchedule(User $user): bool
    {
        return in_array($user->role?->slug, ['super_admin', 'admin'], true);
    }

    public function assertCanCheckInToday(User $user): void
    {
        if ($this->canOverrideSchedule($user) || ! $user->employee_id) {
            return;
        }

        $info = $this->todayInfoForEmployee($user->employee_id);

        if ($info['is_working_day']) {
            return;
        }

        throw ValidationException::withMessages([
            'schedule' => "Today ({$info['day_label']}) is your scheduled day off ({$info['schedule_name']}). "
                .'You cannot check in. Ask your administrator to assign a schedule that includes this day, or to record your attendance manually.',
        ]);
    }

    private function formatTime(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->format('H:i');
        }

        return substr((string) $value, 0, 5);
    }
}
