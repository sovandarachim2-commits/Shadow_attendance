<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PermissionType;
use Illuminate\Http\Request;

class PermissionTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            PermissionType::query()
                ->whereIn('name', $this->coreTypeNames())
                ->orderByRaw("FIELD(name, 'Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Check Out', 'Personal Request')")
                ->get()
        );
    }

    private function coreTypeNames(): array
    {
        return ['Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Missing Check Out', 'Personal Request'];
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Request types are fixed. Edit the existing request type settings instead.',
        ], 422);
    }

    public function update(Request $request, PermissionType $permissionType)
    {
        $data = $request->validate([
            'allowedTimes'     => 'required|integer|min:0',
            'limitType'        => 'required|in:per_day,per_month',
            'durationControl'  => 'nullable|in:any,single_day,multiple_day,hours',
            'maxHours'         => 'nullable|numeric|min:0.25|max:24',
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
            'isActive'         => 'sometimes|boolean',
        ]);

        $permissionType->update([
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
            'duration_control' => $data['durationControl'] ?? 'any',
            'max_hours'        => ($data['durationControl'] ?? 'any') === 'hours' ? ($data['maxHours'] ?? null) : null,
            'deduction_amount' => $data['deductionAmount'],
            'color'            => $data['color'],
            'description'      => $data['description'] ?? null,
            'is_active'        => array_key_exists('isActive', $data) ? $data['isActive'] : $permissionType->is_active,
        ]);

        return response()->json($permissionType);
    }

    public function destroy(PermissionType $permissionType)
    {
        return response()->json([
            'message' => 'Request types are fixed and cannot be deleted.',
        ], 422);
    }
}
