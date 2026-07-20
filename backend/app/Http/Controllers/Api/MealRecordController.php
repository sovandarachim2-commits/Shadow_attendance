<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MealRecord;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MealRecordController extends Controller
{
    public function index(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage', 'reports.view_all');

        return MealRecord::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('recorded_at', $date))
            ->latest('recorded_at')
            ->limit($request->integer('limit', 50))
            ->get();
    }

    public function store(Request $request)
    {
        $employee = $request->user()->employee()->firstOrFail();

        $data = $request->validate([
            'meal_type' => ['required', 'string', 'in:breakfast,lunch,dinner'],
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $alreadyRecorded = MealRecord::where('employee_id', $employee->id)
            ->where('meal_type', $data['meal_type'])
            ->whereDate('recorded_at', now()->toDateString())
            ->exists();

        if ($alreadyRecorded) {
            throw ValidationException::withMessages([
                'meal' => ucfirst($data['meal_type']) . ' has already been recorded for today.',
            ]);
        }

        return MealRecord::create([
            'employee_id' => $employee->id,
            'meal_type' => $data['meal_type'],
            'address' => $data['address'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'recorded_at' => now(),
            'notes' => $data['notes'] ?? null,
        ])->fresh(['employee.department', 'employee.position']);
    }
}
