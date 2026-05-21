<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LateDeductionRule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LateDeductionRuleController extends Controller
{
    public function index()
    {
        $rules = LateDeductionRule::orderBy('from_minutes')->get();

        $today = Carbon::today();
        $todayAttendances = Attendance::whereDate('attendance_date', $today)->get();

        $stats = [
            'total_rules'     => $rules->count(),
            'active_rules'    => $rules->where('status', true)->count(),
            'deduction_today' => (float) $todayAttendances->sum('deduction_amount'),
            'late_today'      => $todayAttendances->whereIn('status', ['late', 'Late'])->count(),
        ];

        return response()->json([
            'rules' => $rules,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        return LateDeductionRule::create($this->validated($request));
    }

    public function update(Request $request, LateDeductionRule $lateDeductionRule)
    {
        $lateDeductionRule->update($this->validated($request));
        return $lateDeductionRule->fresh();
    }

    public function destroy(LateDeductionRule $lateDeductionRule)
    {
        $lateDeductionRule->delete();
        return response()->noContent();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'rule_name'        => ['required', 'string', 'max:100'],
            'grace_minutes'    => ['nullable', 'integer', 'min:0', 'max:120'],
            'from_minutes'     => ['required', 'integer', 'min:0'],
            'to_minutes'       => ['nullable', 'integer', 'min:0'],
            'deduction_type'   => ['required', 'in:none,fixed,percentage,half_day,full_day'],
            'deduction_amount' => ['nullable', 'numeric', 'min:0'],
            'status'           => ['nullable', 'boolean'],
        ]);
    }
}
