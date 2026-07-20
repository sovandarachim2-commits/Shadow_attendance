<?php

namespace App\Repositories;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class AttendanceRepository
{
    public function todayForEmployee(int $employeeId): ?Attendance
    {
        return Attendance::where('employee_id', $employeeId)
            ->whereDate('attendance_date', Carbon::today())
            ->first();
    }

    public function filtered(array $filters = [])
    {
        return $this->baseQuery($filters)
            ->latest('attendance_date')
            ->paginate($filters['per_page'] ?? 20);
    }

    public function listForReport(array $filters = [])
    {
        return $this->baseQuery($filters)
            ->orderByDesc('attendance_date')
            ->limit($filters['limit'] ?? 500)
            ->get();
    }

    public function summaryForCollection($records): array
    {
        $collection = collect($records);

        return [
            'total_records' => $collection->count(),
            'present' => $collection->where('status', 'present')->count(),
            'late' => $collection->where('status', 'late')->count(),
            'absent' => $collection->where('status', 'absent')->count(),
            'on_leave' => $collection->where('status', 'on_leave')->count(),
            'half_day' => $collection->where('status', 'half_day')->count(),
            'missing_checkout' => $collection->filter(
                fn ($row) => $row->check_in_at && ! $row->check_out_at && $row->status !== 'absent'
            )->count(),
            'total_work_minutes' => (int) $collection->sum('work_minutes'),
            'total_late_minutes' => (int) $collection->sum('late_minutes'),
            'total_deduction' => round((float) $collection->sum('deduction_amount'), 2),
        ];
    }

    private function baseQuery(array $filters)
    {
        return Attendance::query()
            ->with(['employee.department', 'employee.position', 'branch'])
            ->when($filters['date'] ?? null, fn ($query, $date) => $query->whereDate('attendance_date', $date))
            ->when($filters['from'] ?? null, fn ($query, $from) => $query->whereDate('attendance_date', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, $to) => $query->whereDate('attendance_date', '<=', $to))
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['employee_id'] ?? null, fn ($query, $id) => $query->where('employee_id', $id))
            ->when($filters['department_id'] ?? null, function ($query, $deptId) {
                $query->whereHas('employee', fn ($q) => $q->where('department_id', $deptId));
            })
            ->when($filters['branch_id'] ?? null, function ($query, $branchId) {
                $query->where(function ($q) use ($branchId) {
                    $q->where('branch_id', $branchId)
                        ->orWhereHas('employee', fn ($eq) => $eq->where('branch_id', $branchId));
                });
            })
            ->when(($filters['status'] ?? null) === 'missing_checkout', function ($query) {
                $query->whereNotNull('check_in_at')
                    ->whereNull('check_out_at')
                    ->where('status', '!=', 'absent');
            })
            ->when(($filters['status'] ?? null) === 'early_checkout', fn ($query) => $this->whereApprovedRequestType($query, ['Early Check Out']))
            ->when(($filters['status'] ?? null) === 'day_off', fn ($query) => $this->whereApprovedRequestType($query, ['Day Off']))
            ->when(($filters['status'] ?? null) === 'missing_checkin', fn ($query) => $this->whereApprovedRequestType($query, ['Missing Check In', 'Missing Attendance']))
            ->when(($filters['status'] ?? null) === 'personal_request', fn ($query) => $this->whereApprovedRequestType($query, ['Personal Leave']))
            ->when(($filters['status'] ?? null) === 'half_day', fn ($query) => $this->whereApprovedRequestType($query, ['Day Off', 'Personal Leave'], 'Half Day'))
            ->when(
                ($filters['status'] ?? null)
                    && ! in_array(($filters['status'] ?? null), ['missing_checkout', 'early_checkout', 'day_off', 'missing_checkin', 'personal_request', 'half_day'], true),
                fn ($query) => $query->where('status', $filters['status'])
            )
            ->when($filters['gps_status'] ?? null, function ($query, $gps) {
                if ($gps === 'verified') {
                    $query->whereNotNull('check_in_latitude')->whereNotNull('check_in_longitude')
                        ->whereNotNull('check_out_latitude')->whereNotNull('check_out_longitude');
                } elseif ($gps === 'partial') {
                    $query->where(function ($q) {
                        $q->where(function ($inner) {
                            $inner->whereNotNull('check_in_latitude')->whereNotNull('check_in_longitude');
                        })->orWhere(function ($inner) {
                            $inner->whereNotNull('check_out_latitude')->whereNotNull('check_out_longitude');
                        });
                    })->where(function ($q) {
                        $q->whereNull('check_in_latitude')
                            ->orWhereNull('check_in_longitude')
                            ->orWhereNull('check_out_latitude')
                            ->orWhereNull('check_out_longitude');
                    });
                } elseif ($gps === 'unverified') {
                    $query->whereNull('check_in_latitude')->whereNull('check_out_latitude');
                }
            });
    }

    private function whereApprovedRequestType(Builder $query, array $types, ?string $dayPart = null): void
    {
        $query->whereExists(function ($subquery) use ($types, $dayPart) {
            $subquery->selectRaw('1')
                ->from('permission_requests')
                ->whereColumn('permission_requests.employee_id', 'attendances.employee_id')
                ->where('permission_requests.status', 'approved')
                ->whereIn('permission_requests.type', $types)
                ->when($dayPart, fn ($dayPartQuery) => $dayPartQuery->where('permission_requests.day_part', $dayPart))
                ->whereColumn('permission_requests.request_date', '<=', 'attendances.attendance_date')
                ->where(function ($dateQuery) {
                    $dateQuery
                        ->whereColumn('permission_requests.request_date_end', '>=', 'attendances.attendance_date')
                        ->orWhereNull('permission_requests.request_date_end');
                });
        });
    }
}
