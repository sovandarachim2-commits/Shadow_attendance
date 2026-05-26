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
        $rules = LateDeductionRule::with('schedules')->orderBy('from_minutes')->get();

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
        $data = $this->validated($request);
        $scheduleIds = $data['schedule_ids'] ?? [];
        unset($data['schedule_ids']);

        $rule = LateDeductionRule::create($data);
        $rule->schedules()->sync($scheduleIds);

        return $rule->load('schedules');
    }

    public function update(Request $request, LateDeductionRule $lateDeductionRule)
    {
        $data = $this->validated($request);
        $scheduleIds = $data['schedule_ids'] ?? [];
        unset($data['schedule_ids']);

        $lateDeductionRule->update($data);
        $lateDeductionRule->schedules()->sync($scheduleIds);

        return $lateDeductionRule->fresh('schedules');
    }

    public function destroy(LateDeductionRule $lateDeductionRule)
    {
        $lateDeductionRule->delete();
        return response()->noContent();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'rule_name'          => ['required', 'string', 'max:100'],
            'grace_minutes'      => ['nullable', 'integer', 'min:0', 'max:120'],
            'from_minutes'       => ['required', 'integer', 'min:0'],
            'to_minutes'         => ['nullable', 'integer', 'min:0'],
            'deduction_type'     => ['required', 'in:none,fixed,percentage,half_day,full_day'],
            'deduction_amount'   => ['nullable', 'numeric', 'min:0'],
            'status'             => ['nullable', 'boolean'],
            'telegram_chat_id'   => ['nullable', 'string', 'max:120'],
            'telegram_topic_id'  => ['nullable', 'integer', 'min:1'],
            'schedule_ids'       => ['nullable', 'array'],
            'schedule_ids.*'     => ['integer', 'exists:work_schedules,id'],
        ]);
    }
}
