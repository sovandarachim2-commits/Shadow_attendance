<?php

namespace App\Services;

use App\Models\EmployeeSchedule;
use App\Models\PermissionRequest;
use App\Models\WorkSchedule;
use App\Models\User;
use DateTimeInterface;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class WorkScheduleService
{
    public function scheduleForEmployee(int $employeeId): WorkSchedule
    {
        $schedule = $this->scheduleForEmployeeOnDate($employeeId, Carbon::today());

        if ($schedule) {
            return $schedule;
        }

        throw ValidationException::withMessages([
            'schedule' => 'No work schedule is configured. Add a default schedule in Settings → Schedules.',
        ]);
    }

    public function scheduleForEmployeeOnDate(int $employeeId, DateTimeInterface $date): ?WorkSchedule
    {
        $date = Carbon::instance($date);

        try {
            $assignment = EmployeeSchedule::query()
                ->with('schedule')
                ->where('employee_id', $employeeId)
                ->where('effective_date', '<=', $date->toDateString())
                ->orderByDesc('effective_date')
                ->first();

            if ($assignment?->schedule) {
                return $assignment->schedule;
            }

            return WorkSchedule::query()->where('is_default', true)->first()
                ?? WorkSchedule::query()->first();
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    /** Day info for reports; falls back to Mon–Fri working if schedules are missing. */
    public function dayInfoForEmployeeOnDate(int $employeeId, DateTimeInterface $date): array
    {
        $date = Carbon::instance($date);
        $schedule = $this->scheduleForEmployeeOnDate($employeeId, $date);

        if ($schedule) {
            return $this->dayInfoForDate($schedule, $date);
        }

        $isWeekend = in_array($date->dayOfWeek, [Carbon::SUNDAY, Carbon::SATURDAY], true);

        return [
            'day_key'        => strtolower($date->format('l')),
            'day_label'      => $date->format('l'),
            'is_working_day' => ! $isWeekend,
            'start'          => null,
            'end'            => null,
            'schedule_id'    => null,
            'schedule_name'  => null,
        ];
    }

    public function dayInfoForDate(WorkSchedule $schedule, DateTimeInterface $date): array
    {
        $date = Carbon::instance($date);
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

        $today = Carbon::today()->toDateString();

        $blockedRequest = PermissionRequest::query()
            ->where('employee_id', $user->employee_id)
            ->whereIn('type', ['Day Off', 'Personal Leave'])
            ->where('status', 'approved')
            ->where('request_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('request_date_end')
                  ->orWhere('request_date_end', '>=', $today);
            })
            ->where(function ($q) {
                $q->where('type', 'Day Off')
                    ->orWhere(function ($personal) {
                        $personal->where('type', 'Personal Leave')
                            ->where(function ($duration) {
                                $duration->where('duration_type', 'multiple_day')
                                    ->orWhere(function ($singleDay) {
                                        $singleDay->where('duration_type', 'single_day')
                                            ->where(function ($dayPart) {
                                                $dayPart->whereNull('day_part')
                                                    ->orWhere('day_part', 'Full Day');
                                            });
                                    });
                            });
                    });
            })
            ->first(['type']);

        if ($blockedRequest) {
            throw ValidationException::withMessages([
                'schedule' => "You have an approved {$blockedRequest->type} request for today. You cannot check in.",
            ]);
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
