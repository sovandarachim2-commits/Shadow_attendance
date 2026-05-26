<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LateDeductionRule;
use App\Models\LateRule;
use App\Models\WorkSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LateRuleController extends Controller
{
    public function index()
    {
        $settings = LateRule::query()->firstOrCreate([]);
        $rules = LateDeductionRule::with('schedules')->orderBy('from_minutes')->get();
        $workSchedules = WorkSchedule::orderBy('schedule_name')->get([
            'id', 'schedule_name',
            'monday_start', 'tuesday_start', 'wednesday_start',
            'thursday_start', 'friday_start', 'saturday_start', 'sunday_start',
        ]);

        $today = Carbon::today();
        $todayAttendances = Attendance::whereDate('attendance_date', $today)->get();

        $workStart = Carbon::parse($settings->work_start_time ?? '08:00:00');
        $lateAfter = $workStart->copy()->addMinutes((int) ($settings->grace_minutes ?? 15));

        return response()->json([
            'settings' => $settings,
            'deduction_rules' => $rules,
            'work_schedules' => $workSchedules,
            'stats' => [
                'work_start_time'      => $workStart->format('h:i A'),
                'grace_minutes'        => (int) $settings->grace_minutes,
                'late_after'           => $lateAfter->format('h:i A'),
                'employees_late_today' => $todayAttendances->where('status', 'late')->count(),
                'deduction_today'      => (float) $todayAttendances->sum(fn ($a) => $a->deduction_amount ?? 0),
                'active_rules'         => $rules->where('status', true)->count(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'work_start_time'       => ['nullable', 'date_format:H:i,H:i:s'],
            'grace_minutes'         => ['nullable', 'integer', 'min:0', 'max:240'],
            'auto_mark_late'        => ['nullable', 'boolean'],
            'notify_admin'          => ['nullable', 'boolean'],
            'auto_apply_deduction'  => ['nullable', 'boolean'],
            'include_in_payroll'    => ['nullable', 'boolean'],
            'notify_employee'       => ['nullable', 'boolean'],
            'exclude_on_holidays'   => ['nullable', 'boolean'],
            'preview_check_in'      => ['nullable', 'date_format:H:i,H:i:s'],
        ]);

        $settings = LateRule::query()->firstOrCreate([]);
        $settings->update($data);

        return $this->index();
    }
}
