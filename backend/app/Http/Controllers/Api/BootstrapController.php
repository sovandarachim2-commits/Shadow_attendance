<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\CustomerVisit;
use App\Models\Employee;
use App\Models\GpsLocation;
use App\Models\HotelStay;
use App\Models\MealRecord;
use App\Models\Notification;
use App\Models\PlaceVisit;
use App\Models\Report;
use App\Models\SystemSetting;
use App\Repositories\AttendanceRepository;
use App\Services\AttendanceRuleService;
use App\Services\ImageUploadService;
use App\Services\WorkScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class BootstrapController extends Controller
{
    public function __construct(
        private AttendanceRepository $attendance,
        private AttendanceRuleService $attendanceRules,
        private WorkScheduleService $workSchedules,
        private ImageUploadService $images,
    ) {}

    public function __invoke(Request $request)
    {
        $user = $request->user()->loadMissing(['role.permissions', 'employee.department', 'employee.position', 'employee.branch']);

        return response()->json([
            'dashboard' => $this->can($user, ['dashboard.admin', 'dashboard.employee'])
                ? $this->dashboard($user)
                : null,
            'todayAttendance' => $this->can($user, ['attendance.view_own', 'attendance.view_all'])
                ? $this->todayAttendance($user)
                : null,
            'attendance' => $this->can($user, ['attendance.view_all', 'attendance.view_own'])
                ? $this->attendanceRows($user)
                : [],
            'employees' => $this->can($user, ['employees.view', 'employees.create', 'employees.update', 'employee_report.view_all'])
                ? $this->employees()
                : [],
            'visits' => $this->can($user, ['visits.view', 'visits.create', 'visits.manage'])
                ? $this->visits($user)
                : [],
            'placeVisits' => $this->can($user, ['visits.view', 'visits.create', 'visits.manage'])
                ? $this->placeVisits($user)
                : [],
            'mealRecords' => $this->can($user, ['visits.view', 'visits.create', 'visits.manage', 'reports.view_all', 'reports.view_own'])
                ? $this->mealRecords($user)
                : [],
            'hotelStays' => $this->can($user, ['visits.view', 'visits.create', 'visits.manage', 'reports.view_all', 'reports.view_own'])
                ? $this->hotelStays($user)
                : [],
            'reports' => $this->can($user, ['reports.view_all', 'reports.view_own'])
                ? $this->reports($user)
                : [],
            'notifications' => $this->can($user, ['notifications.view', 'notifications.manage'])
                ? $this->notifications($user)
                : [],
            'appSettings' => $this->can($user, ['settings.view', 'settings.security', 'settings.api', 'settings.manage', 'settings.schedules', 'roles.manage', 'dashboard.admin', 'dashboard.employee'])
                ? Cache::remember('system_settings.all', now()->addMinutes(10), fn () => SystemSetting::query()->pluck('value', 'key'))
                : [],
        ]);
    }

    private function dashboard($user): array
    {
        $today = Carbon::today();
        $employeeId = $user->hasPermission('dashboard.admin') ? null : $user->employee_id;

        return [
            'cards' => [
                'total_employees' => $employeeId ? 1 : Employee::where('status', 'active')->count(),
                'present' => Attendance::when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                    ->whereDate('attendance_date', $today)
                    ->whereIn('status', ['present', 'late'])
                    ->count(),
                'late' => Attendance::when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                    ->whereDate('attendance_date', $today)
                    ->where('status', 'late')
                    ->count(),
                'outdoor_visits' => CustomerVisit::when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                    ->whereDate('check_in_at', $today)
                    ->count(),
            ],
            'attendance_chart' => Attendance::selectRaw('attendance_date, status, count(*) as total')
                ->when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                ->where('attendance_date', '>=', $today->copy()->subDays(6))
                ->groupBy('attendance_date', 'status')
                ->orderBy('attendance_date')
                ->get(),
            'live_locations' => GpsLocation::with('employee')
                ->when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                ->latest('recorded_at')
                ->limit(50)
                ->get(),
            'recent_activity' => Attendance::with('employee')
                ->when($employeeId, fn ($query) => $query->where('employee_id', $employeeId))
                ->latest()
                ->limit(10)
                ->get(),
        ];
    }

    private function todayAttendance($user): array
    {
        $attendance = $user->employee_id ? $this->attendance->todayForEmployee($user->employee_id) : null;
        $payload = $attendance ? $attendance->toArray() : [];

        if ($user->employee_id) {
            $scheduleToday = $this->workSchedules->todayInfoForEmployee($user->employee_id);
            $scheduleToday['can_check_in'] = $scheduleToday['is_working_day']
                || $this->workSchedules->canOverrideSchedule($user)
                || ! empty($payload['check_in_at']);
            $payload['schedule_today'] = $scheduleToday;
        }

        $payload['requirements'] = $this->attendanceRules->requirementsFor($user);

        return $payload;
    }

    private function attendanceRows($user)
    {
        $filters = ['per_page' => 50];

        if (! $user->hasPermission('attendance.view_all')) {
            $filters['employee_id'] = $user->employee_id;
        }

        return $this->attendance->filtered($filters)->items();
    }

    private function employees()
    {
        return Employee::query()
            ->with(['department', 'position', 'branch', 'user.role'])
            ->latest()
            ->limit(500)
            ->get();
    }

    private function visits($user)
    {
        $canViewAll = $user->hasAnyPermission('visits.view', 'visits.manage');

        return CustomerVisit::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $user->employee_id))
            ->latest('check_in_at')
            ->limit(50)
            ->get();
    }

    private function placeVisits($user)
    {
        $canViewAll = $user->hasAnyPermission('visits.view', 'visits.manage');

        return PlaceVisit::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $user->employee_id))
            ->latest('started_at')
            ->limit(50)
            ->get();
    }

    private function mealRecords($user)
    {
        $canViewAll = $user->hasAnyPermission('visits.view', 'visits.manage', 'reports.view_all');

        return MealRecord::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $user->employee_id))
            ->latest('recorded_at')
            ->limit(50)
            ->get();
    }

    private function hotelStays($user)
    {
        $canViewAll = $user->hasAnyPermission('visits.view', 'visits.manage', 'reports.view_all');

        return HotelStay::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $user->employee_id))
            ->latest('check_in_at')
            ->limit(50)
            ->get()
            ->map(function (HotelStay $stay) {
                $stay->check_in_photo_url = $this->images->url($stay->check_in_photo_path);
                $stay->check_out_photo_url = $this->images->url($stay->check_out_photo_path);

                return $stay;
            });
    }

    private function reports($user)
    {
        $canViewAll = $user->hasAnyPermission('reports.view_all');

        return Report::query()
            ->with('employee')
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $user->employee_id))
            ->latest('report_date')
            ->limit(50)
            ->get();
    }

    private function notifications($user)
    {
        $canViewAll = $user->hasPermission('notifications.manage');

        return Notification::query()
            ->when(! $canViewAll, fn ($query) => $query
                ->where(fn ($inner) => $inner
                    ->whereNull('user_id')
                    ->orWhere('user_id', $user->id)))
            ->with(['user.employee'])
            ->latest()
            ->limit(20)
            ->get();
    }

    private function can($user, array $permissions): bool
    {
        return $user->hasAnyPermission(...$permissions);
    }
}
