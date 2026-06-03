<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\GpsLocation;
use App\Models\PermissionRequest;
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

        $employee = $user->relationLoaded('employee')
            ? $user->employee
            : $user->employee()->first(['id', 'employment_type', 'require_ip_restriction']);

        if ($employee && $employee->require_ip_restriction === false) {
            return;
        }

        $employmentType = $employee?->employment_type;

        if ($user->role?->slug === 'outdoor_sales' || $employmentType === 'outdoor_sales') {
            return;
        }

        $allowed = $user->role?->load('ipAddresses')->ipAddresses ?? collect();

        if ($allowed->isEmpty()) {
            return;
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

    private function storeAttendancePhoto(User $user, ?\Illuminate\Http\UploadedFile $photo, string $folder, ?string $attendanceType = null): ?string
    {
        if (! $photo) {
            return null;
        }

        if (! $this->attendanceRules->requirementsFor($user, $attendanceType)['save_selfie']) {
            return null;
        }

        return $this->images->store($photo, $folder);
    }

    public function checkIn(User $user, array $data): Attendance
    {
        $this->assertIpAllowed($user);
        $this->workSchedules->assertCanCheckInToday($user);

        if (! $this->workSchedules->canOverrideSchedule($user)) {
            $workEnd = $this->attendanceRules->workEndToday($user);
            if ($workEnd && now()->greaterThan($workEnd)) {
                throw ValidationException::withMessages([
                    'attendance' => "Work has already ended for today ({$workEnd->format('h:i A')}). You cannot check in.",
                ]);
            }
        }

        $employee = $user->employee()->with(['branch', 'position', 'department'])->firstOrFail();
        $attendanceType = $employee->employment_type === 'outdoor_sales' ? 'outdoor' : ($data['type'] ?? 'office');
        $existing = $this->attendanceRepository->todayForEmployee($employee->id);

        if ($existing && $existing->check_in_at) {
            throw ValidationException::withMessages(['attendance' => 'Employee already checked in today.']);
        }

        $hasLocation = isset($data['latitude'], $data['longitude'])
            && $data['latitude'] !== null
            && $data['longitude'] !== null;

        if (
            $hasLocation
            && $attendanceType === 'office'
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
        $lateEval = $this->lateRules->evaluate($now, $employee->id);
        $lateEval = $this->applyApprovedLateCheckInRequests($employee->id, $now, $lateEval);

        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'branch_id' => $employee->branch_id,
            'attendance_date' => Carbon::today(),
            'type' => $attendanceType,
            'status' => $lateEval['status'],
            'check_in_at' => $now,
            'check_in_latitude' => $data['latitude'],
            'check_in_longitude' => $data['longitude'],
            'check_in_address' => $data['address'] ?? null,
            'check_in_photo_path' => $this->storeAttendancePhoto($user, $data['photo'] ?? null, 'attendance/selfies', $attendanceType),
            'qr_code' => $data['qr_code'] ?? null,
            'late_minutes' => $lateEval['late_minutes'],
            'deduction_amount' => $lateEval['deduction_amount'],
            'deduction_reason' => $lateEval['deduction_reason'],
            'notes' => $data['notes'] ?? null,
            'offline_sync_uuid' => $data['offline_sync_uuid'] ?? null,
            'synced_at' => now(),
        ]);

        if ($hasLocation) {
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
        }

        $employeeName = trim("{$employee->first_name} {$employee->last_name}");
        $position     = $employee->position?->name ?? 'N/A';
        $address      = $data['address'] ?? 'N/A';
        $gpsLink      = $hasLocation ? $this->gpsOpenLink($data['latitude'], $data['longitude']) : 'N/A';
        $gpsUrl       = $hasLocation ? $this->gpsMapLink($data['latitude'], $data['longitude']) : null;
        $checkInFmt   = $now->format('h:i A');
        $dateFmt      = $now->format('d M Y');
        $statusLabel  = $lateEval['is_late'] ? 'មកយឺត' : 'វត្តមាន';
        $attendanceEventKey = $attendanceType === 'outdoor' ? 'outdoor_attendance' : 'office_attendance';

        $this->sendTelegramSafely(function () use ($employeeName, $employee, $position, $checkInFmt, $dateFmt, $address, $gpsLink, $gpsUrl, $statusLabel, $lateEval, $attendanceType, $attendanceEventKey, $attendance) {
            $toggleKey = $attendanceType === 'outdoor' ? 'telegram_alert_outdoor_check_in' : 'telegram_alert_check_in_success';
            if (! $this->telegram->alertEnabled($toggleKey)) {
                return false;
            }

            $photoUrl   = $this->images->url($attendance->check_in_photo_path);
            $gpsLine    = $gpsUrl
                ? '🛰 GPS: <a href="'.htmlspecialchars($gpsUrl, ENT_QUOTES).'">Open</a>'
                : '🛰 GPS: N/A';
            $faceLine   = $photoUrl
                ? '📸 Face: <a href="'.htmlspecialchars($photoUrl, ENT_QUOTES).'">Verified ✅</a>'
                : '📸 Face: —';

            $statusLine = $lateEval['is_late']
                ? '⚠️ ស្ថានភាព៖ <b>មកយឺត</b>'
                : '✅ ស្ថានភាព៖ <b>វត្តមាន</b>';

            $caption = "✅ <b>បានចូលធ្វើការ</b>\n\n"
                . "👤 បុគ្គលិក៖ {$employeeName}\n"
                . "🆔 លេខសម្គាល់៖ {$employee->employee_code}\n"
                . "💼 តួនាទី៖ {$position}\n\n"
                . "🕒 ម៉ោងចូល៖ {$checkInFmt}\n"
                . "📅 កាលបរិច្ឆេទ៖ {$dateFmt}\n\n"
                . "📍 ទីតាំង៖ {$address}\n"
                . "{$gpsLine}\n"
                . "{$faceLine}\n\n"
                . "{$statusLine}";
            $this->telegram->sendWithPhoto($caption, $photoUrl, $attendanceEventKey);

            $privateMsg = "✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n"
                . "🕘 ម៉ោង: {$checkInFmt}\n"
                . "📅 ថ្ងៃទី: {$dateFmt}\n";

            if ($lateEval['is_late']) {
                $lateFmt = $this->lateRules->formatLateDuration($lateEval['late_seconds']);
                $privateMsg .= "\n⚠️ ស្ថានភាព: មកយឺត\n"
                    . "⏳ យឺតចំនួន: {$lateFmt}";
            } else {
                $privateMsg .= "\n✅ ស្ថានភាព: វត្តមាន";
            }

            $this->notifyEmployeePrivate($employee, $privateMsg, 'check_in_private');

            return true;
        });

        if ($lateEval['is_late'] && $this->shouldSendLateTelegram()) {
            $lateMinutes = $lateEval['late_minutes'];
            $rule        = $lateEval['applied_rule'];
            $deduction   = $this->lateRules->formatDeductionAmount($lateEval['deduction_amount'], $rule);
            $lateFmt     = $this->lateRules->formatLateDuration($lateEval['late_seconds']);
            $lateEventKey = $attendanceType === 'outdoor' ? 'outdoor_late_attendance' : 'office_late_attendance';

            $lateMessage = "⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n"
                . "👤 បុគ្គលិក: {$employeeName}\n"
                . "🆔 លេខសម្គាល់: {$employee->employee_code}\n"
                . "🕘 ម៉ោងចូល: {$checkInFmt}\n"
                . "⏳ យឺតចំនួន: {$lateFmt}\n"
                . "💰 កាត់ប្រាក់: {$deduction}\n\n"
                . "ស្ថានភាព: មកយឺត";

            $department    = $employee->department?->name ?? 'N/A';
            $branch        = $employee->branch?->name ?? 'N/A';
            $profilePhoto  = $this->images->url($employee->photo_path);
            $selfiePhoto   = $this->images->url($attendance->check_in_photo_path);
            $photoUrl      = $profilePhoto ?: $selfiePhoto;

            $ruleMessage = "⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n"
                . "👤 បុគ្គលិក: {$employeeName}\n"
                . "🆔 លេខសម្គាល់: {$employee->employee_code}\n"
                . "💼 តួនាទី: {$position}\n"
                . "🏢 នាយកដ្ឋាន: {$department}\n"
                . "🏬 សាខា: {$branch}\n\n"
                . "🕘 ម៉ោងចូល: {$checkInFmt}\n"
                . "📅 កាលបរិច្ឆេទ: {$dateFmt}\n"
                . "⏳ យឺតចំនួន: {$lateFmt}\n"
                . "💰 កាត់ប្រាក់: {$deduction}\n\n"
                . "ស្ថានភាព: មកយឺត";

            $this->sendTelegramSafely(function () use ($employee, $lateMessage, $ruleMessage, $rule, $photoUrl, $lateEventKey) {
                $this->telegram->sendWithPhoto($lateMessage, $photoUrl, $lateEventKey);

                // Send richer profile message to the rule's own group if configured.
                $ruleChatId = trim((string) ($rule->telegram_chat_id ?? ''));
                if ($ruleChatId !== '') {
                    if ($photoUrl) {
                        $this->telegram->sendPhotoRaw($ruleChatId, $photoUrl, $ruleMessage, $rule->telegram_topic_id ?? null);
                    } else {
                        $this->telegram->sendRaw($ruleChatId, $ruleMessage, $rule->telegram_topic_id ?? null);
                    }
                }

                if ($this->shouldNotifyEmployeeLate()) {
                    $this->notifyEmployeePrivate($employee, $lateMessage, 'late_private');
                }

                return true;
            });
        }

        return $attendance->fresh(['employee', 'branch']);
    }

    public function applyLateCheckInApproval(PermissionRequest $request): void
    {
        if ($request->type !== 'Late Check In') {
            return;
        }

        $attendance = Attendance::query()
            ->where('employee_id', $request->employee_id)
            ->whereDate('attendance_date', $request->request_date)
            ->where('status', 'late')
            ->first();

        if (! $attendance || ! $attendance->check_in_at) {
            return;
        }

        $lateEval = $this->lateRules->evaluate($attendance->check_in_at, $attendance->employee_id);
        $lateEval = $this->applyApprovedLateCheckInRequests($attendance->employee_id, $attendance->check_in_at, $lateEval);

        $attendance->forceFill([
            'deduction_amount' => $lateEval['deduction_amount'],
            'deduction_reason' => $lateEval['deduction_reason'],
        ])->save();
    }

    private function applyApprovedLateCheckInRequests(int $employeeId, Carbon $checkInAt, array $lateEval): array
    {
        if (! ($lateEval['is_late'] ?? false)) {
            return $lateEval;
        }

        $requests = PermissionRequest::query()
            ->where('employee_id', $employeeId)
            ->where('type', 'Late Check In')
            ->where('status', 'approved')
            ->whereDate('request_date', $checkInAt->toDateString())
            ->orderByDesc('reviewed_at')
            ->get();

        if ($requests->isEmpty()) {
            return $lateEval;
        }

        $approvedMinutes = $requests->sum(fn (PermissionRequest $request) => $this->approvedLateMinutes($request, $checkInAt, $lateEval['work_start']));
        $approvedMinutes = min((int) $lateEval['late_minutes'], (int) $approvedMinutes);

        if ($approvedMinutes <= 0) {
            return $lateEval;
        }

        $chargeableMinutes = max(0, (int) $lateEval['late_minutes'] - $approvedMinutes);
        $requestCodes = $requests
            ->filter(fn (PermissionRequest $request) => $this->approvedLateMinutes($request, $checkInAt, $lateEval['work_start']) > 0)
            ->pluck('request_code')
            ->implode(', ');

        if ($chargeableMinutes <= 0) {
            $lateEval['deduction_amount'] = 0.0;
            $lateEval['deduction_reason'] = "Excused {$approvedMinutes}m by approved Late Check In request {$requestCodes}";
            $lateEval['approved_late_minutes'] = $approvedMinutes;
            $lateEval['chargeable_late_minutes'] = 0;

            return $lateEval;
        }

        $deduction = $this->lateRules->deductionForLateMinutes($chargeableMinutes, $employeeId);
        $lateEval['applied_rule'] = $deduction['applied_rule'];
        $lateEval['deduction_amount'] = $deduction['deduction_amount'];
        $lateEval['deduction_reason'] = trim(
            "Approved {$approvedMinutes}m by Late Check In request {$requestCodes}; charged {$chargeableMinutes}m"
            . ($deduction['deduction_reason'] ? ": {$deduction['deduction_reason']}" : '')
        );
        $lateEval['approved_late_minutes'] = $approvedMinutes;
        $lateEval['chargeable_late_minutes'] = $chargeableMinutes;

        return $lateEval;
    }

    private function approvedLateMinutes(PermissionRequest $request, Carbon $checkInAt, Carbon $workStart): int
    {
        if ($request->request_date?->toDateString() !== $checkInAt->toDateString()) {
            return 0;
        }

        if (! $request->start_time || ! $request->end_time) {
            return max(0, (int) ceil($workStart->diffInSeconds($checkInAt) / 60));
        }

        $date = $checkInAt->toDateString();
        $start = Carbon::parse("{$date} {$request->start_time}");
        $end = Carbon::parse("{$date} {$request->end_time}");

        $overlapStart = $start->greaterThan($workStart) ? $start : $workStart;
        $overlapEnd = $end->lessThan($checkInAt) ? $end : $checkInAt;

        if ($overlapEnd->lessThanOrEqualTo($overlapStart)) {
            return 0;
        }

        return (int) ceil($overlapStart->diffInSeconds($overlapEnd) / 60);
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

        $hasLocation = isset($data['latitude'], $data['longitude'])
            && $data['latitude'] !== null
            && $data['longitude'] !== null;

        $attendance->update([
            'check_out_at' => $now,
            'check_out_latitude' => $data['latitude'] ?? null,
            'check_out_longitude' => $data['longitude'] ?? null,
            'check_out_address' => $data['address'] ?? null,
            'check_out_photo_path' => $this->storeAttendancePhoto($user, $data['photo'] ?? null, 'attendance/checkouts', $attendance->type),
            'work_minutes' => $attendance->check_in_at->diffInMinutes($now),
            'notes' => trim(($attendance->notes ? $attendance->notes."\n" : '').($data['notes'] ?? '')),
        ]);

        if ($hasLocation) {
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
        }

        $attendance = $attendance->fresh(['employee', 'branch']);
        $workMinutes  = $attendance->check_in_at->diffInMinutes($now);
        $workFmt      = sprintf('%02dh %02dm', intdiv($workMinutes, 60), $workMinutes % 60);
        $employeeName = trim("{$employee->first_name} {$employee->last_name}");
        $position     = $employee->position?->name ?? 'N/A';
        $address      = $data['address'] ?? 'N/A';
        $gpsUrl       = $hasLocation ? $this->gpsMapLink($data['latitude'], $data['longitude']) : null;

        $attendanceEventKey = $attendance->type === 'outdoor' ? 'outdoor_attendance' : 'office_attendance';

        $telegramSent = $this->sendTelegramSafely(function () use ($employeeName, $employee, $position, $now, $workFmt, $address, $gpsUrl, $attendance, $attendanceEventKey) {
            if (! $this->telegram->alertEnabled('telegram_alert_check_out_success')) {
                return false;
            }

            $checkOutPhotoUrl = $this->images->url($attendance->check_out_photo_path);
            $gpsLine  = $gpsUrl
                ? '🛰 GPS៖ <a href="'.htmlspecialchars($gpsUrl, ENT_QUOTES).'">បើក</a>'
                : '🛰 GPS៖ N/A';
            $faceLine = $checkOutPhotoUrl
                ? '📸 មុខ៖ <a href="'.htmlspecialchars($checkOutPhotoUrl, ENT_QUOTES).'">បានផ្ទៀងផ្ទាត់ ✅</a>'
                : '📸 មុខ៖ —';

            $caption = "🔔 <b>បានចេញពីធ្វើការ</b>\n\n"
                . "👤 បុគ្គលិក៖ {$employeeName}\n"
                . "🆔 លេខសម្គាល់៖ {$employee->employee_code}\n"
                . "💼 តួនាទី៖ {$position}\n\n"
                . "🕒 ម៉ោងចូល៖ {$attendance->check_in_at->format('h:i A')}\n"
                . "🕔 ម៉ោងចេញ៖ {$now->format('h:i A')}\n"
                . "📅 កាលបរិច្ឆេទ៖ {$now->format('d M Y')}\n\n"
                . "⏱ ម៉ោងធ្វើការ៖ {$workFmt}\n"
                . "📍 ទីតាំង៖ {$address}\n"
                . "{$gpsLine}\n"
                . "{$faceLine}\n\n"
                . "✅ ស្ថានភាព៖ <b>បានបញ្ចប់ការងារ</b>";

            $this->telegram->sendWithPhoto($caption, $checkOutPhotoUrl, $attendanceEventKey);

            $this->notifyEmployeePrivate(
                $employee,
                "🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n"
                . "🕘 ចូលម៉ោង: {$attendance->check_in_at->format('h:i A')}\n"
                . "🕘 ចេញម៉ោង: {$now->format('h:i A')}\n"
                . "📅 ថ្ងៃទី: {$now->format('d M Y')}\n\n"
                . "⏳ ម៉ោងធ្វើការ: {$workFmt}\n"
                . "📌 ស្ថានភាព: បញ្ចប់ការងារ",
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
        defer(function () use ($callback) {
            try {
                $callback();
            } catch (\Throwable $e) {
                Log::warning('Telegram notification skipped', ['message' => $e->getMessage()]);
            }
        });

        return true;
    }
}
