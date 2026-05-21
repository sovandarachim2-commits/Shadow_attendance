<?php

namespace App\Services;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AttendanceReportService
{
    public function gpsStatus(Attendance $row): string
    {
        $in = $row->check_in_latitude !== null && $row->check_in_longitude !== null;
        $out = $row->check_out_latitude !== null && $row->check_out_longitude !== null;

        if ($in && $out) {
            return 'verified';
        }
        if ($in || $out) {
            return 'partial';
        }

        return 'unverified';
    }

    public function displayStatus(Attendance $row): string
    {
        if ($row->check_in_at && ! $row->check_out_at && $row->status !== 'absent') {
            return 'missing_checkout';
        }

        return $row->status ?? 'present';
    }

    public function locationLabel(Attendance $row): string
    {
        return $row->check_in_address
            ?: $row->check_out_address
            ?: ($row->check_in_latitude !== null
                ? round((float) $row->check_in_latitude, 5).', '.round((float) $row->check_in_longitude, 5)
                : '—');
    }

    public function buildTimeline(Attendance $row): array
    {
        $events = [];

        if ($row->check_in_at) {
            $lateNote = $row->late_minutes > 0
                ? 'Late by '.$row->late_minutes.' min'
                : null;
            $events[] = [
                'key' => 'check_in',
                'label' => $row->type === 'outdoor' ? 'Outdoor Check In' : 'Morning Check In',
                'time' => $row->check_in_at->format('h:i A'),
                'iso' => $row->check_in_at->toIso8601String(),
                'tone' => $row->late_minutes > 0 ? 'orange' : 'green',
                'note' => $lateNote,
            ];
        }

        if ($row->check_out_at) {
            $events[] = [
                'key' => 'check_out',
                'label' => $row->type === 'outdoor' ? 'Outdoor Check Out' : 'Work Check Out',
                'time' => $row->check_out_at->format('h:i A'),
                'iso' => $row->check_out_at->toIso8601String(),
                'tone' => 'green',
                'note' => null,
            ];
        } elseif ($row->check_in_at && $row->status !== 'absent') {
            $events[] = [
                'key' => 'missing_out',
                'label' => 'Check Out',
                'time' => '—',
                'iso' => null,
                'tone' => 'red',
                'note' => 'Missing check out',
            ];
        }

        return $events;
    }

    public function formatRecord(Attendance $row): array
    {
        $employee = $row->employee;
        $displayStatus = $this->displayStatus($row);

        return [
            'id' => $row->id,
            'employee_id' => $row->employee_id,
            'employee_code' => $employee?->employee_code,
            'employee_name' => $employee ? trim("{$employee->first_name} {$employee->last_name}") : '—',
            'department' => $employee?->department?->name,
            'department_id' => $employee?->department_id,
            'branch' => $employee?->branch?->name ?? $row->branch?->name,
            'branch_id' => $employee?->branch_id ?? $row->branch_id,
            'position' => $employee?->position?->name,
            'attendance_date' => $row->attendance_date?->toDateString(),
            'check_in_at' => $row->check_in_at?->toIso8601String(),
            'check_out_at' => $row->check_out_at?->toIso8601String(),
            'work_minutes' => $row->work_minutes,
            'late_minutes' => $row->late_minutes,
            'deduction_amount' => $row->deduction_amount,
            'deduction_reason' => $row->deduction_reason,
            'status' => $row->status,
            'display_status' => $displayStatus,
            'type' => $row->type,
            'gps_status' => $this->gpsStatus($row),
            'location' => $this->locationLabel($row),
            'check_in_address' => $row->check_in_address,
            'check_out_address' => $row->check_out_address,
            'check_in_latitude' => $row->check_in_latitude,
            'check_in_longitude' => $row->check_in_longitude,
            'check_out_latitude' => $row->check_out_latitude,
            'check_out_longitude' => $row->check_out_longitude,
            'notes' => $row->notes,
            'timeline' => $this->buildTimeline($row),
            'employee' => $employee,
            'branch' => $row->branch,
        ];
    }

    public function summaryForCollection(Collection $records): array
    {
        $present = $records->where('status', 'present')->count();
        $late = $records->where('status', 'late')->count();
        $absent = $records->where('status', 'absent')->count();
        $onLeave = $records->whereIn('status', ['on_leave', 'half_day'])->count();
        $missingCheckout = $records->filter(
            fn ($row) => $row->check_in_at && ! $row->check_out_at && $row->status !== 'absent'
        )->count();
        $outdoor = $records->where('type', 'outdoor')->count();
        $totalWork = (int) $records->sum('work_minutes');
        $overtimeMinutes = max(0, $totalWork - ($records->count() * 8 * 60));

        return [
            'total_records' => $records->count(),
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'on_leave' => $onLeave,
            'missing_checkout' => $missingCheckout,
            'outdoor' => $outdoor,
            'total_work_minutes' => $totalWork,
            'total_late_minutes' => (int) $records->sum('late_minutes'),
            'total_deduction' => round((float) $records->sum('deduction_amount'), 2),
            'overtime_minutes' => $overtimeMinutes,
            'bonus_eligible' => $absent === 0 && $late === 0 && $present > 0,
        ];
    }

    public function todayStats(): array
    {
        $today = Carbon::today()->toDateString();
        $rows = Attendance::with(['employee'])
            ->whereDate('attendance_date', $today)
            ->get();

        $total = max(1, $rows->count());
        $summary = $this->summaryForCollection($rows);

        return [
            'present_today' => $summary['present'] + $summary['late'],
            'late_today' => $summary['late'],
            'absent_today' => $summary['absent'],
            'missing_checkout' => $summary['missing_checkout'],
            'outdoor_today' => $summary['outdoor'],
            'total_working_hours' => $this->formatMinutes($summary['total_work_minutes']),
            'present_pct' => round((($summary['present'] + $summary['late']) / $total) * 100, 1),
            'late_pct' => round(($summary['late'] / $total) * 100, 1),
            'absent_pct' => round(($summary['absent'] / $total) * 100, 1),
        ];
    }

    public function formatMinutes(int $minutes): string
    {
        $h = intdiv($minutes, 60);
        $m = $minutes % 60;

        return sprintf('%dh %02dm', $h, $m);
    }
}
