<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\AttendanceRule;
use App\Models\Employee;
use App\Models\TelegramLog;
use App\Services\TelegramNotificationService;
use App\Services\WorkScheduleService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendAttendanceReminders extends Command
{
    protected $signature = 'attendance:send-reminders {--force : Send due reminders without matching the configured minute}';

    protected $description = 'Send scheduled Telegram check-in and check-out reminders to employees.';

    public function handle(TelegramNotificationService $telegram, WorkScheduleService $workSchedules): int
    {
        $rules = AttendanceRule::query()->firstOrCreate([]);
        $now = now();
        $sent = 0;

        if ($rules->auto_check_in_reminder && $this->isDue($rules->check_in_reminder_time, $now)) {
            $sent += $this->sendCheckInReminders($telegram, $workSchedules, $now);
        }

        if ($rules->auto_check_out_reminder && $this->isDue($rules->check_out_reminder_time, $now)) {
            $sent += $this->sendCheckOutReminders($telegram, $workSchedules, $now);
        }

        $this->info("Attendance reminders sent: {$sent}");

        return self::SUCCESS;
    }

    private function isDue(?string $time, Carbon $now): bool
    {
        if ($this->option('force')) {
            return true;
        }

        return $time && substr($time, 0, 5) === $now->format('H:i');
    }

    private function sendCheckInReminders(
        TelegramNotificationService $telegram,
        WorkScheduleService $workSchedules,
        Carbon $now,
    ): int {
        $sent = 0;

        $employees = Employee::query()
            ->with('user')
            ->where('status', 'active')
            ->whereNotNull('telegram_chat_id')
            ->where('telegram_chat_id', '!=', '')
            ->whereDoesntHave('attendances', fn ($query) => $query->whereDate('attendance_date', $now->toDateString()))
            ->get();

        foreach ($employees as $employee) {
            if (! $this->shouldSendToEmployee($employee, $workSchedules, $now, 'check_in_reminder')) {
                continue;
            }

            $message = "🔔 <b>Check In Reminder</b>\n\n"
                ."Hi {$employee->full_name}, please check in for today if you are working.\n"
                ."Date: {$now->format('d M Y')}\n"
                ."Time: {$now->format('h:i A')}";

            $result = $telegram->sendToEmployee($employee, $message, 'check_in_reminder');
            $sent += ($result['ok'] ?? false) ? 1 : 0;
        }

        return $sent;
    }

    private function sendCheckOutReminders(
        TelegramNotificationService $telegram,
        WorkScheduleService $workSchedules,
        Carbon $now,
    ): int {
        $sent = 0;

        $attendances = Attendance::query()
            ->with('employee.user')
            ->whereDate('attendance_date', $now->toDateString())
            ->whereNotNull('check_in_at')
            ->whereNull('check_out_at')
            ->get();

        foreach ($attendances as $attendance) {
            $employee = $attendance->employee;

            if (! $employee || trim((string) $employee->telegram_chat_id) === '') {
                continue;
            }

            if (! $this->shouldSendToEmployee($employee, $workSchedules, $now, 'check_out_reminder')) {
                continue;
            }

            $message = "🔔 <b>Check Out Reminder</b>\n\n"
                ."Hi {$employee->full_name}, please check out if your work is finished.\n"
                ."Check in: {$attendance->check_in_at?->format('h:i A')}\n"
                ."Date: {$now->format('d M Y')}";

            $result = $telegram->sendToEmployee($employee, $message, 'check_out_reminder');
            $sent += ($result['ok'] ?? false) ? 1 : 0;
        }

        return $sent;
    }

    private function shouldSendToEmployee(
        Employee $employee,
        WorkScheduleService $workSchedules,
        Carbon $date,
        string $messageType,
    ): bool {
        if ($this->alreadyLogged($employee->id, $messageType, $date)) {
            return false;
        }

        try {
            return $workSchedules->todayInfoForEmployee($employee->id)['is_working_day'] ?? true;
        } catch (\Throwable) {
            return true;
        }
    }

    private function alreadyLogged(int $employeeId, string $messageType, Carbon $date): bool
    {
        return TelegramLog::query()
            ->where('employee_id', $employeeId)
            ->where('message_type', $messageType)
            ->whereDate('created_at', $date->toDateString())
            ->exists();
    }
}
