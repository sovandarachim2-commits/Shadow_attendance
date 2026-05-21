<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return Branch::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        return Branch::create($this->validated($request));
    }

    public function update(Request $request, Branch $branch)
    {
        $branch->update($this->validated($request, $branch->id));
        return $branch->fresh();
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return response()->noContent();
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name'                      => ['required', 'string', 'max:100'],
            'code'                      => ['nullable', 'string', 'max:30', 'unique:branches,code,' . ($ignoreId ?? 'NULL')],
            'address'                   => ['nullable', 'string', 'max:255'],
            'latitude'                  => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'                 => ['nullable', 'numeric', 'between:-180,180'],
            'attendance_radius_meters'  => ['nullable', 'integer', 'min:10', 'max:50000'],
            'status'                    => ['nullable', 'boolean'],
        ]);
    }
}
