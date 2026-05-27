<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\CustomerVisit;
use App\Models\Employee;
use App\Models\GpsLocation;
use App\Models\PermissionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $today      = Carbon::today();
        $user       = $request->user();
        $isAdmin    = $user->hasPermission('dashboard.admin');
        $employeeId = $isAdmin ? null : $user->employee_id;

        // ── Common counts ────────────────────────────────────────────────────
        $totalEmployees = $employeeId ? 1 : Employee::where('status', 'active')->count();

        $present = Attendance::whereDate('attendance_date', $today)
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->whereIn('status', ['present', 'late'])
            ->count();

        $late = Attendance::whereDate('attendance_date', $today)
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->where('status', 'late')
            ->count();

        $outdoorVisits = CustomerVisit::whereDate('check_in_at', $today)
            ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
            ->count();

        // ── Admin-only: absent / on_leave / missing_checkout ─────────────────
        $absent          = 0;
        $onLeave         = 0;
        $missingCheckout = 0;
        $presentDays     = null;

        if ($isAdmin) {
            // IDs of active employees who have any attendance record today
            $checkedInIds = Attendance::whereDate('attendance_date', $today)
                ->pluck('employee_id')
                ->unique()
                ->values()
                ->all();

            // Missing check-out: checked in today but no check-out yet
            $missingCheckout = Attendance::whereDate('attendance_date', $today)
                ->whereNotNull('check_in_at')
                ->whereNull('check_out_at')
                ->count();

            // On leave: approved permission requests that cover today for employees
            // who haven't checked in yet
            $onLeave = PermissionRequest::where('status', 'approved')
                ->whereDate('request_date', '<=', $today)
                ->where(function ($q) use ($today) {
                    $q->whereDate('request_date_end', '>=', $today)
                      ->orWhereDate('request_date', $today);
                })
                ->when(count($checkedInIds) > 0, fn ($q) => $q->whereNotIn('employee_id', $checkedInIds))
                ->distinct('employee_id')
                ->count('employee_id');

            // Absent = active employees with no attendance record today and not on leave
            $absent = max(0, $totalEmployees - count($checkedInIds) - $onLeave);

        } elseif ($employeeId) {
            // Employee view: count present days this month
            $presentDays = Attendance::where('employee_id', $employeeId)
                ->whereMonth('attendance_date', $today->month)
                ->whereYear('attendance_date', $today->year)
                ->whereIn('status', ['present', 'late'])
                ->count();
        }

        return [
            'cards' => [
                'total_employees'  => $totalEmployees,
                'present'          => $present,
                'late'             => $late,
                'absent'           => $absent,
                'on_leave'         => $onLeave,
                'missing_checkout' => $missingCheckout,
                'outdoor_visits'   => $outdoorVisits,
                'present_days'     => $presentDays,
            ],

            'attendance_chart' => Attendance::selectRaw('attendance_date, status, count(*) as total')
                ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
                ->where('attendance_date', '>=', $today->copy()->subDays(6))
                ->groupBy('attendance_date', 'status')
                ->orderBy('attendance_date')
                ->get(),

            'live_locations' => GpsLocation::with('employee')
                ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
                ->latest('recorded_at')
                ->limit(50)
                ->get(),

            'recent_activity' => Attendance::with('employee')
                ->when($employeeId, fn ($q) => $q->where('employee_id', $employeeId))
                ->latest()
                ->limit(10)
                ->get(),
        ];
    }
}
