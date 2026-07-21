<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PermissionType;
use App\Models\WorkSchedule;
use App\Services\WorkScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PermissionTypeController extends Controller
{
    public function __construct(private WorkScheduleService $workSchedules) {}

    public function index(Request $request)
    {
        $request->validate([
            'date' => ['nullable', 'date'],
        ]);

        $query = PermissionType::query()
            ->with([
                'employees:id,first_name,last_name,employee_code',
                'workSchedules:id,schedule_name',
                'rules.employee:id,first_name,last_name,employee_code',
                'rules.workSchedule:id,schedule_name',
            ])
            ->whereIn('name', $this->coreTypeNames())
            ->orderByRaw("FIELD(name, 'Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Check Out', 'Personal Leave')");

        $types = $query->get();

        if (! $request->user()->hasPermission('settings.manage')) {
            $employeeId = $request->user()->employee_id;
            $date = Carbon::parse($request->query('date', now()->toDateString()));

            $types = $types
                ->map(fn (PermissionType $type) => $employeeId ? $this->applyEffectiveRule($type, $employeeId, $date) : $type)
                ->filter(fn (?PermissionType $type) => $type && $this->isAvailableForEmployee($type, $employeeId, $date))
                ->values();
        }

        return response()->json([
            'data' => $types->map(fn (PermissionType $type) => $this->serializeType($type))->values(),
        ]);
    }

    private function coreTypeNames(): array
    {
        return ['Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Check Out', 'Personal Leave'];
    }

    private function usesSingleRequestTime(?string $name): bool
    {
        return in_array($name, ['Late Check In', 'Early Check Out'], true);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Request types are fixed. Edit the existing request type settings instead.',
        ], 422);
    }

    public function options()
    {
        return response()->json([
            'employees' => Employee::query()
                ->where('status', 'active')
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'last_name', 'employee_code']),
            'work_schedules' => WorkSchedule::query()
                ->orderByDesc('is_default')
                ->orderBy('schedule_name')
                ->get(['id', 'schedule_name', 'is_default']),
        ]);
    }

    public function update(Request $request, PermissionType $permissionType)
    {
        $data = $request->validate([
            'allowedTimes'     => 'required|integer|min:0',
            'limitType'        => 'required|in:per_day,per_month,per_year',
            'durationControl'  => 'nullable|in:any,single_day,multiple_day,hours',
            'maxHours'         => 'nullable|numeric|min:0.25|max:24',
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
            'isActive'         => 'sometimes|boolean',
            'employeeIds'      => 'sometimes|array',
            'employeeIds.*'    => 'integer|exists:employees,id',
            'scheduleIds'      => 'sometimes|array',
            'scheduleIds.*'    => 'integer|exists:work_schedules,id',
            'rules'            => 'sometimes|array',
            'rules.*.targetType' => 'required_with:rules|in:employee,schedule',
            'rules.*.targetId' => 'required_with:rules|integer',
            'rules.*.allowedTimes' => 'required_with:rules|integer|min:0',
            'rules.*.limitType' => 'required_with:rules|in:per_day,per_month,per_year',
            'rules.*.durationControl' => 'nullable|in:any,single_day,multiple_day,hours',
            'rules.*.maxHours' => 'nullable|numeric|min:0.25|max:24',
            'rules.*.deductionAmount' => 'required_with:rules|numeric|min:0',
            'rules.*.isActive' => 'sometimes|boolean',
        ]);

        $durationControl = $this->usesSingleRequestTime($permissionType->name)
            ? 'hours'
            : ($data['durationControl'] ?? 'any');

        $permissionType->update([
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
            'duration_control' => $durationControl,
            'max_hours'        => $durationControl === 'hours' ? ($data['maxHours'] ?? null) : null,
            'deduction_amount' => $data['deductionAmount'],
            'color'            => $data['color'],
            'description'      => $data['description'] ?? null,
            'is_active'        => array_key_exists('isActive', $data) ? $data['isActive'] : $permissionType->is_active,
        ]);

        if (array_key_exists('employeeIds', $data)) {
            $permissionType->employees()->sync($data['employeeIds']);
        }

        if (array_key_exists('scheduleIds', $data)) {
            $permissionType->workSchedules()->sync($data['scheduleIds']);
        }

        if (array_key_exists('rules', $data)) {
            $this->syncRules($permissionType, $data['rules']);
        }

        return response()->json($this->serializeType(
            $permissionType->fresh(['employees:id,first_name,last_name,employee_code', 'workSchedules:id,schedule_name', 'rules.employee:id,first_name,last_name,employee_code', 'rules.workSchedule:id,schedule_name'])
        ));
    }

    public function destroy(PermissionType $permissionType)
    {
        return response()->json([
            'message' => 'Request types are fixed and cannot be deleted.',
        ], 422);
    }

    private function serializeType(PermissionType $type): array
    {
        return [
            'id' => $type->id,
            'name' => $type->name,
            'allowed_times' => $type->allowed_times,
            'allowedTimes' => $type->allowed_times,
            'limit_type' => $type->limit_type,
            'limitType' => $type->limit_type,
            'duration_control' => $type->duration_control,
            'durationControl' => $type->duration_control,
            'max_hours' => $type->max_hours,
            'maxHours' => $type->max_hours,
            'deduction_amount' => $type->deduction_amount,
            'deductionAmount' => $type->deduction_amount,
            'color' => $type->color,
            'description' => $type->description,
            'is_active' => $type->is_active,
            'isActive' => $type->is_active,
            'employee_ids' => $type->employees->pluck('id')->values(),
            'employeeIds' => $type->employees->pluck('id')->values(),
            'schedule_ids' => $type->workSchedules->pluck('id')->values(),
            'scheduleIds' => $type->workSchedules->pluck('id')->values(),
            'employees' => $type->employees,
            'work_schedules' => $type->workSchedules,
            'workSchedules' => $type->workSchedules,
            'rules' => $type->rules->map(fn ($rule) => $this->serializeRule($rule))->values(),
        ];
    }

    private function serializeRule($rule): array
    {
        $targetType = $rule->employee_id ? 'employee' : 'schedule';
        $targetId = $rule->employee_id ?: $rule->work_schedule_id;

        return [
            'id' => $rule->id,
            'targetType' => $targetType,
            'target_type' => $targetType,
            'targetId' => $targetId,
            'target_id' => $targetId,
            'employee_id' => $rule->employee_id,
            'work_schedule_id' => $rule->work_schedule_id,
            'allowedTimes' => $rule->allowed_times,
            'allowed_times' => $rule->allowed_times,
            'limitType' => $rule->limit_type,
            'limit_type' => $rule->limit_type,
            'durationControl' => $rule->duration_control,
            'duration_control' => $rule->duration_control,
            'maxHours' => $rule->max_hours,
            'max_hours' => $rule->max_hours,
            'deductionAmount' => $rule->deduction_amount,
            'deduction_amount' => $rule->deduction_amount,
            'isActive' => $rule->is_active,
            'is_active' => $rule->is_active,
            'employee' => $rule->employee,
            'workSchedule' => $rule->workSchedule,
            'work_schedule' => $rule->workSchedule,
        ];
    }

    private function syncRules(PermissionType $permissionType, array $rows): void
    {
        $permissionType->rules()->delete();

        foreach ($rows as $row) {
            $targetType = $row['targetType'];
            $durationControl = $this->usesSingleRequestTime($permissionType->name)
                ? 'hours'
                : ($row['durationControl'] ?? $permissionType->duration_control ?? 'any');

            $permissionType->rules()->create([
                'employee_id' => $targetType === 'employee' ? $row['targetId'] : null,
                'work_schedule_id' => $targetType === 'schedule' ? $row['targetId'] : null,
                'allowed_times' => $row['allowedTimes'],
                'limit_type' => $row['limitType'],
                'duration_control' => $durationControl,
                'max_hours' => $durationControl === 'hours' ? ($row['maxHours'] ?? null) : null,
                'deduction_amount' => $row['deductionAmount'],
                'is_active' => array_key_exists('isActive', $row) ? $row['isActive'] : true,
            ]);
        }
    }

    private function applyEffectiveRule(PermissionType $type, int $employeeId, Carbon $date): ?PermissionType
    {
        $schedule = $this->workSchedules->scheduleForEmployeeOnDate($employeeId, $date);
        $rule = $type->rules->first(fn ($item) => (int) $item->employee_id === $employeeId)
            ?: ($schedule ? $type->rules->first(fn ($item) => (int) $item->work_schedule_id === (int) $schedule->id) : null);

        if (! $rule) {
            return $type;
        }

        $type->forceFill([
            'allowed_times' => $rule->allowed_times,
            'limit_type' => $rule->limit_type,
            'duration_control' => $rule->duration_control,
            'max_hours' => $rule->max_hours,
            'deduction_amount' => $rule->deduction_amount,
            'is_active' => $type->is_active && $rule->is_active,
        ]);

        return $type;
    }

    private function isAvailableForEmployee(PermissionType $type, int $employeeId, Carbon $date): bool
    {
        return (bool) $type->is_active;
    }
}
