<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeSchedule;
use App\Models\WorkSchedule;
use Illuminate\Http\Request;

class WorkScheduleController extends Controller
{
    public function index()
    {
        return WorkSchedule::withCount('employeeSchedules')->orderByDesc('is_default')->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if (!empty($data['is_default'])) {
            WorkSchedule::where('is_default', true)->update(['is_default' => false]);
        }

        return WorkSchedule::create($data);
    }

    public function update(Request $request, WorkSchedule $workSchedule)
    {
        $data = $this->validated($request);

        if (!empty($data['is_default'])) {
            WorkSchedule::where('id', '!=', $workSchedule->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $workSchedule->update($data);
        return $workSchedule->fresh();
    }

    public function destroy(WorkSchedule $workSchedule)
    {
        $workSchedule->delete();
        return response()->noContent();
    }

    public function assign(Request $request)
    {
        $data = $request->validate([
            'employee_id'    => ['required', 'exists:employees,id'],
            'schedule_id'    => ['required', 'exists:work_schedules,id'],
            'effective_date' => ['required', 'date'],
        ]);

        $assignment = EmployeeSchedule::updateOrCreate(
            ['employee_id' => $data['employee_id']],
            ['schedule_id' => $data['schedule_id'], 'effective_date' => $data['effective_date']],
        );

        return $assignment->load('schedule', 'employee');
    }

    public function assignments()
    {
        return [
            'assignments' => EmployeeSchedule::with(['employee.department', 'employee.position', 'schedule'])
                ->orderBy('effective_date', 'desc')
                ->get(),
            'employees' => Employee::query()
                ->where('status', 'active')
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'last_name', 'employee_code']),
        ];
    }

    public function updateAssignment(Request $request, EmployeeSchedule $employeeSchedule)
    {
        $data = $request->validate([
            'employee_id'    => ['required', 'exists:employees,id'],
            'schedule_id'    => ['required', 'exists:work_schedules,id'],
            'effective_date' => ['required', 'date'],
        ]);

        if ((int) $data['employee_id'] !== (int) $employeeSchedule->employee_id) {
            $exists = EmployeeSchedule::query()
                ->where('employee_id', $data['employee_id'])
                ->where('id', '!=', $employeeSchedule->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This employee already has a schedule assignment. Edit that row or delete it first.',
                ], 422);
            }
        }

        $employeeSchedule->update($data);

        return $employeeSchedule->load('schedule', 'employee.department', 'employee.position');
    }

    public function destroyAssignment(EmployeeSchedule $employeeSchedule)
    {
        $employeeSchedule->delete();

        return response()->noContent();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'schedule_name'     => ['required', 'string', 'max:100'],
            'monday_start'      => ['nullable', 'date_format:H:i,H:i:s'],
            'monday_end'        => ['nullable', 'date_format:H:i,H:i:s'],
            'tuesday_start'     => ['nullable', 'date_format:H:i,H:i:s'],
            'tuesday_end'       => ['nullable', 'date_format:H:i,H:i:s'],
            'wednesday_start'   => ['nullable', 'date_format:H:i,H:i:s'],
            'wednesday_end'     => ['nullable', 'date_format:H:i,H:i:s'],
            'thursday_start'    => ['nullable', 'date_format:H:i,H:i:s'],
            'thursday_end'      => ['nullable', 'date_format:H:i,H:i:s'],
            'friday_start'      => ['nullable', 'date_format:H:i,H:i:s'],
            'friday_end'        => ['nullable', 'date_format:H:i,H:i:s'],
            'saturday_start'    => ['nullable', 'date_format:H:i,H:i:s'],
            'saturday_end'      => ['nullable', 'date_format:H:i,H:i:s'],
            'sunday_start'      => ['nullable', 'date_format:H:i,H:i:s'],
            'sunday_end'        => ['nullable', 'date_format:H:i,H:i:s'],
            'break_time_minutes'=> ['nullable', 'integer', 'min:0', 'max:480'],
            'is_default'        => ['nullable', 'boolean'],
        ]);
    }
}
