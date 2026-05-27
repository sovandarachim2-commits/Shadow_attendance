<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PermissionType;
use Illuminate\Http\Request;

class PermissionTypeController extends Controller
{
    public function index()
    {
        return response()->json(PermissionType::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:100',
            'allowedTimes'     => 'required|integer|min:0',
            'limitType'        => 'required|in:per_day,per_month',
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
        ]);

        $type = PermissionType::create([
            'name'             => $data['name'],
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
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
            'deductionAmount'  => 'required|numeric|min:0',
            'color'            => 'required|string|max:20',
            'description'      => 'nullable|string|max:500',
        ]);

        $permissionType->update([
            'name'             => $data['name'],
            'allowed_times'    => $data['allowedTimes'],
            'limit_type'       => $data['limitType'],
            'deduction_amount' => $data['deductionAmount'],
            'color'            => $data['color'],
            'description'      => $data['description'] ?? null,
        ]);

        return response()->json($permissionType);
    }

    public function destroy(PermissionType $permissionType)
    {
        $permissionType->delete();
        return response()->json(['message' => 'Deleted.']);
    }
}
