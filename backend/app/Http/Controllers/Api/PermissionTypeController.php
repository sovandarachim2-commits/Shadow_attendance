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
                ->orderByRaw("FIELD(name, 'Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Personal Request')")
                ->get()
        );
    }

    private function coreTypeNames(): array
    {
        return ['Late Check In', 'Early Check Out', 'Day Off', 'Missing Check In', 'Personal Request'];
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:100',
            'allowedTimes'     => 'required|integer|min:0',
            'limitType'        => 'required|in:per_day,per_month',
            'durationControl'  => 'nullable|in:any,single_day,multiple_day,hours',
            'maxHours'         => 'nullable|numeric|min:0.25|max:24',
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
        ]);

        $type = PermissionType::create([
            'name'             => $data['name'],
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
            'duration_control' => $data['durationControl'] ?? 'any',
            'max_hours'        => ($data['durationControl'] ?? 'any') === 'hours' ? ($data['maxHours'] ?? null) : null,
            'deduction_amount' => $data['deductionAmount'],
            'color'            => $data['color'],
            'description'      => $data['description'] ?? null,
        ]);

        return response()->json($type, 201);
    }

    public function update(Request $request, PermissionType $permissionType)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:100',
            'allowedTimes'     => 'required|integer|min:0',
            'limitType'        => 'required|in:per_day,per_month',
            'durationControl'  => 'nullable|in:any,single_day,multiple_day,hours',
            'maxHours'         => 'nullable|numeric|min:0.25|max:24',
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
        ]);

        $permissionType->update([
            'name'             => $data['name'],
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
            'duration_control' => $data['durationControl'] ?? 'any',
            'max_hours'        => ($data['durationControl'] ?? 'any') === 'hours' ? ($data['maxHours'] ?? null) : null,
            'deduction_amount' => $data['deductionAmount'],
            'color'            => $data['color'],
            'description'      => $data['description'] ?? null,
        ]);

        return response()->json($permissionType);
    }

    public function destroy(PermissionType $permissionType)
    {
        if (in_array($permissionType->name, $this->coreTypeNames(), true)) {
            return response()->json(['message' => 'Core permission types cannot be deleted.'], 422);
        }

        $permissionType->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
