<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\GpsLocation;
use App\Models\User;
use App\Repositories\AttendanceRepository;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function __construct(
        private AttendanceRepository $attendanceRepository,
        private GpsValidationService $gps,
        private ImageUploadService $images,
        private TelegramNotificationService $telegram,
        private LateRuleService $lateRules,
        private WorkScheduleService $workSchedules,
        private AttendanceRuleService $attendanceRules,
    ) {}

    private function assertIpAllowed(User $user): void
    {
        if (in_array($user->role?->slug, ['super_admin', 'admin'], true)) {
            return;
        }

        $allowed = $user->role?->load('ipAddresses')->ipAddresses ?? collect();

        if ($allowed->isEmpty()) {
            throw ValidationException::withMessages([
                'ip' => "Your role ({$user->role?->name}) has no allowed IP addresses configured. An administrator must add at least one allowed IP before you can check in or out.",
            ]);
        }

        $clientIp = request()->ip();

        $isAllowed = $allowed->pluck('ip_address')->contains(
            fn (string $rule) => $this->ipMatchesRule($clientIp, $rule)
        );

        if (! $isAllowed) {
            throw ValidationException::withMessages([
                'ip' => "Check-in not allowed from your current IP address ({$clientIp}). Your role is restricted to specific office networks. Contact your administrator.",
            ]);
        }
    }

    private function ipMatchesRule(string $clientIp, string $rule): bool
    {
        $rule = trim($rule);

        if ($rule === $clientIp) {
            return true;
        }

        if (! str_contains($rule, '/')) {
            return false;
        }

        [$network, $prefix] = explode('/', $rule, 2);
        if (
            ! filter_var($clientIp, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)
            || ! filter_var($network, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)
            || ! ctype_digit($prefix)
        ) {
            return false;
        }

        $prefixLength = (int) $prefix;
        if ($prefixLength < 0 || $prefixLength > 32) {
            return false;
        }

        $clientLong = ip2long($clientIp);
        $networkLong = ip2long($network);
        $mask = $prefixLength === 0 ? 0 : (-1 << (32 - $prefixLength));

        return ($clientLong & $mask) === ($networkLong & $mask);
    }

    private function gpsMapLink(float|string $latitude, float|string $longitude): string
    {
        return 'https://www.google.com/maps?q='.rawurlencode("{$latitude},{$longitude}");
    }

    private function gpsOpenLink(float|string $latitude, float|string $longitude): string
    {
        return '<a href="'.$this->gpsMapLink($latitude, $longitude).'">Open</a>';
    }

    public function checkIn(User $user, array $data): Attendance
    {
        $this->assertIpAllowed($user);
        $this->workSchedules->assertCanCheckInToday($user);

        $employee = $user->employee()->with(['branch', 'position', 'department'])->firstOrFail();
        $existing = $this->attendanceRepository->todayForEmployee($employee->id);

        if ($existing && $existing->check_in_at) {
            throw ValidationException::withMessages(['attendance' => 'Employee already checked in today.']);
        }

        if (
            ($data['type'] ?? 'office') === 'office'
            && config('attendance.validate_office_gps_radius', false)
        ) {
            $branch = $employee->branch;
            if (! $branch) {
                throw ValidationException::withMessages(['branch' => 'Employee has no office branch assigned.']);
            }

            $result = $this->gps->assertWithinRadius(
                (float) $data['latitude'],
                (float) $data['longitude'],
                (float) $branch->latitude,
                (float) $branch->longitude,
                (int) $branch->attendance_radius_meters
            );

            if (! $result['valid']) {
                throw ValidationException::withMessages([
                    'gps' => "Outside office radius. Distance {$result['distance_meters']}m, allowed {$result['radius_meters']}m.",
                ]);
            }
        }

        $now = now();
        $lateEval = $this->lateRules->evaluate($now);

        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'branch_id' => $employee->branch_id,
            'attendance_date' => Carbon::today(),
            'type' => $data['type'] ?? 'office',
            'status' => $lateEval['status'],
            'check_in_at' => $now,
            'check_in_latitude' => $data['latitude'],
            'check_in_longitude' => $data['longitude'],
            'check_in_address' => $data['address'] ?? null,
            'check_in_photo_path' => $this->images->store($data['photo'] ?? null, 'attendance/selfies'),
            'qr_code' => $data['qr_code'] ?? null,
            'late_minutes' => $lateEval['late_minutes'],
            'deduction_amount' => $lateEval['deduction_amount'],
            'deduction_reason' => $lateEval['deduction_reason'],
            'notes' => $data['notes'] ?? null,
            'offline_sync_uuid' => $data['offline_sync_uuid'] ?? null,
            'synced_at' => now(),
        ]);

        GpsLocation::create([
            'employee_id' => $employee->id,
            'attendance_id' => $attendance->id,
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'accuracy' => $data['accuracy'] ?? null,
            'speed' => $data['speed'] ?? null,
            'recorded_at' => $now,
            'source' => 'check_in',
        ]);

        $employeeName = trim("{$employee->first_name} {$employee->last_name}");
        $position     = $employee->position?->name ?? 'N/A';
        $address      = $data['address'] ?? 'N/A';
        $gpsLink      = $this->gpsOpenLink($data['latitude'], $data['longitude']);
        $checkInFmt   = $now->format('h:i A');
        $dateFmt      = $now->format('d M Y');
        $statusLabel = $lateEval['is_late'] ? 'មកយឺត' : 'វត្តមាន';

        $this->sendTelegramSafely(function () use ($employeeName, $employee, $position, $checkInFmt, $dateFmt, $address, $gpsLink, $statusLabel) {
            if (! $this->telegram->alertEnabled('telegram_alert_check_in')) {
                return false;
            }

            $checkInMessage = "✅ <b>បានចូលធ្វើការ</b>\n\n"
                . "👤 បុគ្គលិក: {$employeeName}\n"
                . "🆔 លេខសម្គាល់: {$employee->employee_code}\n"
                . "💼 តួនាទី: {$position}\n\n"
                . "🕘 ម៉ោងចូល: {$checkInFmt}\n"
                . "📅 កាលបរិច្ឆេទ: {$dateFmt}\n\n"
                . "📍 ទីតាំង: {$address}\n"
                . "🗺️ តំណ GPS: {$gpsLink}\n\n"
                . "✅ ស្ថានភាព: {$statusLabel}";

            $this->telegram->send($checkInMessage, 'daily_attendance');

            $this->notifyEmployeePrivate(
                $employee,
                "✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n"
                . "🕘 {$checkInFmt} · 📅 {$dateFmt}\n"
                . "📍 {$address}\n"
                . "ស្ថានភាព: {$statusLabel}",
                'check_in_private',
            );

            return true;
        });

        if ($lateEval['is_late'] && $this->shouldSendLateTelegram()) {
            $lateMinutes = $lateEval['late_minutes'];
            $rule        = $lateEval['applied_rule'];
            $deduction   = $this->lateRules->formatDeductionAmount($lateEval['deduction_amount'], $rule);

            $lateMessage = "⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n"
                . "👤 បុគ្គលិក: {$employeeName}\n"
                . "🆔 លេខសម្គាល់: {$employee->employee_code}\n"
                . "🕘 ម៉ោងចូល: {$checkInFmt}\n"
                . "⌛ យឺតចំនួន: {$lateMinutes} នាទី\n"
                . "💰 កាត់ប្រាក់: {$deduction}\n\n"
                . "ស្ថានភាព: មកយឺត";

            $this->sendTelegramSafely(function () use ($employee, $lateMessage) {
                $this->telegram->send($lateMessage, 'late_attendance');

                if ($this->shouldNotifyEmployeeLate()) {
                    $this->notifyEmployeePrivate($employee, $lateMessage, 'late_private');
                }

                return true;
            });
        }

        return $attendance->fresh(['employee', 'branch']);
    }

    private function shouldSendLateTelegram(): bool
    {
        if (! $this->lateRules->settings()->notify_admin) {
            return false;
        }

        return $this->telegram->alertEnabled('telegram_alert_late_check_in');
    }

    public function checkOut(User $user, array $data): array
    {
        $this->assertIpAllowed($user);

        $employee = $user->employee()->with(['position'])->firstOrFail();
        $attendance = $this->attendanceRepository->todayForEmployee($employee->id);

        if (! $attendance || ! $attendance->check_in_at) {
            throw ValidationException::withMessages(['attendance' => 'Check in is required before check out.']);
        }

        if ($attendance->check_out_at) {
            throw ValidationException::withMessages(['attendance' => 'Employee already checked out today.']);
        }

        $now = now();
        $this->attendanceRules->assertCanCheckOut($user, $attendance, $now);

        $attendance->update([
            'check_out_at' => $now,
            'check_out_latitude' => $data['latitude'],
            'check_out_longitude' => $data['longitude'],
            'check_out_address' => $data['address'] ?? null,
            'check_out_photo_path' => $this->images->store($data['photo'] ?? null, 'attendance/checkouts'),
            'work_minutes' => $attendance->check_in_at->diffInMinutes($now),
            'notes' => trim(($attendance->notes ? $attendance->notes."\n" : '').($data['notes'] ?? '')),
        ]);

        GpsLocation::create([
            'employee_id' => $employee->id,
            'attendance_id' => $attendance->id,
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'accuracy' => $data['accuracy'] ?? null,
            'speed' => $data['speed'] ?? null,
            'recorded_at' => $now,
            'source' => 'check_out',
        ]);

        $attendance = $attendance->fresh(['employee', 'branch']);
        $workMinutes  = $attendance->check_in_at->diffInMinutes($now);
        $workFmt      = sprintf('%02dh %02dm', intdiv($workMinutes, 60), $workMinutes % 60);
        $employeeName = trim("{$employee->first_name} {$employee->last_name}");
        $position     = $employee->position?->name ?? 'N/A';
        $address      = $data['address'] ?? 'N/A';
        $gpsLink      = $this->gpsOpenLink($data['latitude'], $data['longitude']);

        $telegramSent = $this->sendTelegramSafely(function () use ($employeeName, $employee, $position, $now, $workFmt, $address, $gpsLink) {
            if (! $this->telegram->alertEnabled('telegram_alert_check_out')) {
                return false;
            }

            $checkOutMessage = "🔔 <b>បានចេញពីធ្វើការ</b>\n\n"
                . "👤 បុគ្គលិក: {$employeeName}\n"
                . "🆔 លេខសម្គាល់: {$employee->employee_code}\n"
                . "💼 តួនាទី: {$position}\n\n"
                . "🕔 ម៉ោងចេញ: {$now->format('h:i A')}\n"
                . "📅 កាលបរិច្ឆេទ: {$now->format('d M Y')}\n\n"
                . "⏱ ម៉ោងធ្វើការ: {$workFmt}\n"
                . "📍 ទីតាំង: {$address}\n"
                . "🗺️ តំណ GPS: {$gpsLink}\n\n"
                . "✅ វត្តមានបានបញ្ចប់";

            $this->telegram->send($checkOutMessage, 'daily_attendance');

            $this->notifyEmployeePrivate(
                $employee,
                "🔔 <b>អ្នកបានចេញពីធ្វើការ</b>\n\n"
                . "🕔 {$now->format('h:i A')} · ⏱ {$workFmt}\n"
                . "📍 {$address}",
                'check_out_private',
            );

            return true;
        });

        return [
            'attendance' => $attendance,
            'warnings' => [],
            'telegram_sent' => $telegramSent,
        ];
    }

    private function shouldNotifyEmployeeLate(): bool
    {
        if ($this->lateRules->settings()->notify_employee) {
            return true;
        }

        return $this->telegram->alertEnabled('telegram_late_notify_employee');
    }

    private function notifyEmployeePrivate(Employee $employee, string $message, string $messageType = 'employee_private'): void
    {
        if (trim((string) ($employee->telegram_chat_id ?? '')) === '') {
            return;
        }

        $this->telegram->sendToEmployee($employee, $message, $messageType);
    }

    private function sendTelegramSafely(callable $callback): bool
    {
        try {
            return (bool) $callback();
        } catch (\Throwable $e) {
            Log::warning('Telegram notification skipped', ['message' => $e->getMessage()]);

            return false;
        }
    }
}
