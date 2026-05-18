<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BonusRule;
use App\Models\Employee;
use App\Models\EmployeeBonus;
use App\Services\BonusRuleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BonusRuleController extends Controller
{
    private const BONUS_TYPES = [
        'perfect_attendance', 'no_late', 'no_absent', 'overtime', 'outdoor_sales',
        'customer_visit', 'sales_target', 'monthly_performance', 'custom',
    ];

    private const CONDITION_TYPES = [
        'no_late', 'no_absent', 'full_attendance', 'overtime_hours', 'customer_visit_count',
        'sales_amount', 'route_completion', 'working_days', 'custom_logic',
    ];

    private const FREQUENCIES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

    public function __construct(private BonusRuleService $bonuses) {}

    public function index(Request $request)
    {
        $settings = $this->bonuses->settings();
        $rules = BonusRule::orderBy('rule_name')->get()->map(fn ($r) => $this->formatRule($r));

        $month = Carbon::parse($request->query('month', now()->format('Y-m')).'-01');
        $monthStart = $month->copy()->startOfMonth();

        $bonusesQuery = EmployeeBonus::with(['employee', 'bonusRule', 'approver'])
            ->whereDate('month', $monthStart);

        $employeeBonuses = $bonusesQuery->latest()->get()->map(fn ($b) => $this->formatEmployeeBonus($b));

        $previewEmployee = null;
        $preview = null;
        if ($request->filled('preview_employee_id')) {
            $previewEmployee = Employee::find($request->preview_employee_id);
            $previewRule = $request->filled('preview_rule_id')
                ? BonusRule::find($request->preview_rule_id)
                : null;
            if ($previewEmployee) {
                $preview = $this->bonuses->previewFull($previewEmployee, $month);
            }
        }

        return response()->json([
            'settings' => $settings,
            'rules' => $rules,
            'employee_bonuses' => $employeeBonuses,
            'options' => [
                'bonus_types' => self::BONUS_TYPES,
                'condition_types' => self::CONDITION_TYPES,
                'frequencies' => self::FREQUENCIES,
            ],
            'stats' => $this->stats($month),
            'chart' => $this->bonuses->bonusChartSummary($month),
            'preview' => $preview ? $this->formatPreview($preview, $month) : null,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'auto_calculate_bonus' => ['nullable', 'boolean'],
            'include_in_payroll' => ['nullable', 'boolean'],
            'notify_employee' => ['nullable', 'boolean'],
            'notify_admin' => ['nullable', 'boolean'],
            'auto_approve_bonus' => ['nullable', 'boolean'],
            'bonus_expiration' => ['nullable', 'boolean'],
        ]);

        $settings = $this->bonuses->settings();
        $settings->update($data);

        return $this->index($request);
    }

    public function storeRule(Request $request)
    {
        $data = $this->validatedRule($request);
        $rule = BonusRule::create($data);

        return response()->json($this->formatRule($rule->fresh()), 201);
    }

    public function updateRule(Request $request, BonusRule $bonusRule)
    {
        $bonusRule->update($this->validatedRule($request));

        return response()->json($this->formatRule($bonusRule->fresh()));
    }

    public function destroyRule(BonusRule $bonusRule)
    {
        $bonusRule->delete();

        return response()->noContent();
    }

    private function validatedRule(Request $request): array
    {
        return $request->validate([
            'rule_name' => ['required', 'string', 'max:120'],
            'bonus_type' => ['required', 'string', Rule::in(self::BONUS_TYPES)],
            'condition_type' => ['required', 'string', Rule::in(self::CONDITION_TYPES)],
            'condition_value' => ['nullable', 'numeric', 'min:0'],
            'bonus_amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', 'string', Rule::in(self::FREQUENCIES)],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'boolean'],
        ]);
    }

    private function stats(Carbon $month): array
    {
        $monthStart = $month->copy()->startOfMonth();
        $bonuses = EmployeeBonus::whereDate('month', $monthStart);

        $prevMonth = $month->copy()->subMonth();
        $prevBonuses = EmployeeBonus::whereDate('month', $prevMonth->copy()->startOfMonth());

        $activeRules = BonusRule::where('status', true)->count();
        $prevActiveRules = BonusRule::where('status', true)->where('created_at', '<', $month->copy()->startOfMonth())->count();

        $totalApproved = (float) (clone $bonuses)->whereIn('status', ['approved', 'paid'])->sum('bonus_amount');
        $prevTotal = (float) (clone $prevBonuses)->whereIn('status', ['approved', 'paid'])->sum('bonus_amount');

        $pending = (clone $bonuses)->where('status', 'pending')->count();

        return [
            'active_rules' => $activeRules,
            'active_rules_delta' => $activeRules - max(0, $prevActiveRules),
            'total_bonus_month' => $totalApproved,
            'total_bonus_delta_pct' => $prevTotal > 0 ? round((($totalApproved - $prevTotal) / $prevTotal) * 100, 1) : null,
            'employees_eligible' => Employee::count(),
            'pending_approval' => $pending,
        ];
    }

    private function formatRule(BonusRule $rule): array
    {
        return [
            'id' => $rule->id,
            'rule_name' => $rule->rule_name,
            'bonus_type' => $rule->bonus_type,
            'bonus_type_label' => $this->bonuses->bonusTypeLabel($rule->bonus_type),
            'condition_type' => $rule->condition_type,
            'condition_label' => $this->bonuses->conditionLabel($rule),
            'condition_value' => $rule->condition_value,
            'bonus_amount' => (float) $rule->bonus_amount,
            'frequency' => $rule->frequency,
            'start_date' => $rule->start_date?->format('Y-m-d'),
            'end_date' => $rule->end_date?->format('Y-m-d'),
            'status' => (bool) $rule->status,
        ];
    }

    private function formatEmployeeBonus(EmployeeBonus $bonus): array
    {
        $employee = $bonus->employee;

        return [
            'id' => $bonus->id,
            'employee_id' => $bonus->employee_id,
            'employee_name' => $employee ? trim("{$employee->first_name} {$employee->last_name}") : '—',
            'employee_code' => $employee?->employee_code,
            'bonus_type' => $bonus->bonus_type,
            'bonus_type_label' => $this->bonuses->bonusTypeLabel($bonus->bonus_type ?? 'custom'),
            'bonus_amount' => (float) $bonus->bonus_amount,
            'month' => $bonus->month->format('Y-m'),
            'month_label' => $bonus->month->format('M Y'),
            'status' => $bonus->status,
            'reason' => $bonus->reason,
            'approved_by' => $bonus->approver?->name,
            'rule_name' => $bonus->bonusRule?->rule_name,
        ];
    }

    private function formatPreview(array $preview, Carbon $month): array
    {
        $employee = $preview['employee'];
        $metrics = $preview['metrics'];
        $appliedRules = $preview['applied_rules'] ?? [];

        return [
            'employee_name' => trim("{$employee->first_name} {$employee->last_name}"),
            'employee_code' => $employee->employee_code,
            'employee_id' => $employee->id,
            'month' => $month->format('M Y'),
            'attendance_status' => $metrics['present_days'] > 0 && $metrics['late_count'] === 0 && $metrics['absent_count'] === 0
                ? 'Present'
                : ($metrics['present_days'] > 0 ? 'Partial' : 'Absent'),
            'late_count' => $metrics['late_count'],
            'absent_count' => $metrics['absent_count'],
            'missing_checkout' => $metrics['missing_checkout'] ?? 0,
            'applied_rules_count' => $preview['applied_rules_count'] ?? count($appliedRules),
            'applied_rule_names' => collect($appliedRules)->pluck('rule_name')->values()->all(),
            'bonus_amount' => $preview['bonus_amount'],
            'eligible' => $preview['eligible'],
        ];
    }
}
