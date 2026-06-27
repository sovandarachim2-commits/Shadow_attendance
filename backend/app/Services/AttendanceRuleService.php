<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\AttendanceRule;
use App\Models\Employee;
use App\Models\PermissionRequest;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class AttendanceRuleService
{
    public function rules(): AttendanceRule
    {
        return AttendanceRule::query()->firstOrCreate([]);
    }

    public function attendanceTypeFor(?Employee $employee): string
    {
        return $employee?->employment_type === 'outdoor_sales' ? 'outdoor' : 'office';
    }

    /**
     * @return array{attendance_type: string, require_gps: bool, require_photo: bool, save_selfie: bool}
     */
    public function requirementsFor(User $user, ?string $attendanceType = null): array
    {
        $employee = $user->relationLoaded('employee')
            ? $user->employee
            : $user->employee()->first();

        $rules = $this->rules();
        $attendanceType ??= $this->attendanceTypeFor($employee);

        $requirePhoto = config('attendance.face_verification_enabled', false)
            || (bool) ($employee?->require_face_verification)
            || $rules->require_selfie;

        $requireGps = config('attendance.require_gps_on_checkin', true)
            || (bool) ($employee?->require_gps)
            || ($attendanceType === 'outdoor' && $rules->require_gps);

        return [
            'attendance_type' => $attendanceType,
            'require_gps' => $requireGps,
            'require_photo' => $requirePhoto,
            'save_selfie' => (bool) $rules->save_selfie,
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function locationValidationRules(User $user, ?string $attendanceType = null): array
    {
        $requirements = $this->requirementsFor($user, $attendanceType);
        $presence = $requirements['require_gps'] ? 'required' : 'nullable';

        return [
            'latitude' => [$presence, 'numeric', 'between:-90,90'],
            'longitude' => [$presence, 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function photoValidationRules(User $user, ?string $attendanceType = null): array
    {
        $requirements = $this->requirementsFor($user, $attendanceType);
        $presence = $requirements['require_photo'] ? 'required' : 'nullable';

        return [
            'photo' => [$presence, 'image', 'max:4096'],
        ];
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
        $workEnd = $this->workEndToday($user, $checkOutAt);
        $approvedEarlyCheckOutAt = $this->approvedEarlyCheckOutAt($user, $checkOutAt, $workEnd);

        if ($approvedEarlyCheckOutAt && $checkOutAt->lessThan($approvedEarlyCheckOutAt)) {
            $blockers[] = sprintf(
                'Check-out is before approved Early Check Out time (%s). Check-out is not allowed.',
                $approvedEarlyCheckOutAt->format('h:i A')
            );

            return $blockers;
        }

        if (! $approvedEarlyCheckOutAt && $minHours > 0 && $workMinutes < (int) round($minHours * 60)) {
            $blockers[] = sprintf(
                'You worked %.1f hours (minimum is %.1f). Check-out is not allowed.',
                $workMinutes / 60,
                $minHours
            );
        }

        if (! $approvedEarlyCheckOutAt && $workEnd && $checkOutAt->lessThan($workEnd)) {
            $blockers[] = sprintf(
                'Check-out is before work end (%s). Check-out is not allowed.',
                $workEnd->format('h:i A')
            );
        }

        return $blockers;
    }

    private function approvedEarlyCheckOutAt(User $user, Carbon $checkOutAt, ?Carbon $workEnd): ?Carbon
    {
        if (! $user->employee_id) {
            return null;
        }

        $date = $checkOutAt->toDateString();

        $approvedAt = PermissionRequest::query()
            ->where('employee_id', $user->employee_id)
            ->where('status', 'approved')
            ->where('type', 'Early Check Out')
            ->whereDate('request_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('request_date_end')
                    ->orWhereDate('request_date_end', '>=', $date);
            })
            ->get(['request_time', 'start_time'])
            ->map(function (PermissionRequest $request) use ($date) {
                $time = $request->request_time ?: $request->start_time;
                return $time ? Carbon::parse("{$date} {$time}") : null;
            })
            ->filter()
            ->sortBy(fn (Carbon $time) => $time->timestamp)
            ->first();

        if (! $approvedAt) {
            return null;
        }

        if ($workEnd && $approvedAt->greaterThanOrEqualTo($workEnd)) {
            return null;
        }

        return $approvedAt;
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
