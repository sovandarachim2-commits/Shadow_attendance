<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeductionRule;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\SalaryAdvance;
use App\Models\SalarySetup;
use App\Services\PayrollService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PayrollController extends Controller
{
    public function __construct(private PayrollService $payrollService) {}

    public function index(Request $request)
    {
        $month = Carbon::parse($request->query('month', now()->format('Y-m')).'-01')->startOfMonth();
        $user = $request->user();
        $canViewAll = $user->hasPermission('payroll.view_all');

        $payrolls = Payroll::query()
            ->with(['items.employee.department', 'items.employee.position'])
            ->when(! $canViewAll, function ($query) use ($user) {
                $query->whereHas('items', fn ($items) => $items->where('employee_id', $user->employee_id));
            })
            ->orderByDesc('month')
            ->limit(12)
            ->get();

        $current = Payroll::query()
            ->with(['items.employee.department', 'items.employee.position'])
            ->whereDate('month', $month->toDateString())
            ->first();

        if ($current && ! $canViewAll) {
            $current->setRelation('items', $current->items->where('employee_id', $user->employee_id)->values());
        }

        return response()->json([
            'month' => $month->format('Y-m'),
            'summary' => $this->summary($month),
            'payroll' => $current ? $this->formatPayroll($current) : null,
            'payrolls' => $payrolls->map(fn ($payroll) => $this->formatPayroll($payroll, false))->values(),
            'salary_setups' => $canViewAll ? $this->salarySetups() : [],
            'deduction_rules' => $canViewAll ? DeductionRule::orderBy('deduction_type')->orderBy('rule_name')->get() : [],
            'salary_advances' => $this->salaryAdvances($request),
            'employees' => $canViewAll ? Employee::query()->with(['department', 'position', 'salarySetup'])->orderBy('first_name')->get()->map(fn ($e) => [
                'id' => $e->id,
                'employee_code' => $e->employee_code,
                'name' => $e->full_name,
                'department' => $e->department?->name,
                'position' => $e->position?->name,
                'has_salary_setup' => (bool) $e->salarySetup,
            ]) : [],
        ]);
    }

    public function storeSalarySetup(Request $request)
    {
        $data = $request->validate($this->salarySetupRules());
        $setup = SalarySetup::updateOrCreate(['employee_id' => $data['employee_id']], $data);

        return response()->json($setup->load('employee.department', 'employee.position'));
    }

    public function destroySalarySetup(SalarySetup $salarySetup)
    {
        $salarySetup->delete();

        return response()->noContent();
    }

    public function storeDeductionRule(Request $request)
    {
        $data = $request->validate($this->deductionRuleRules());
        $rule = DeductionRule::create($data);

        return response()->json($rule, 201);
    }

    public function updateDeductionRule(Request $request, DeductionRule $deductionRule)
    {
        $deductionRule->update($request->validate($this->deductionRuleRules()));

        return response()->json($deductionRule->fresh());
    }

    public function destroyDeductionRule(DeductionRule $deductionRule)
    {
        $deductionRule->delete();

        return response()->noContent();
    }

    public function storeAdvance(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['nullable', 'exists:employees,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'request_date' => ['nullable', 'date'],
            'deduct_month' => ['nullable', 'date_format:Y-m'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $employeeId = $request->user()->hasPermission('payroll.view_all')
            ? ($data['employee_id'] ?? $request->user()->employee_id)
            : $request->user()->employee_id;

        abort_if(! $employeeId, 422, 'No employee profile linked to this user.');

        $advance = SalaryAdvance::create([
            'employee_id' => $employeeId,
            'amount' => $data['amount'],
            'remaining_amount' => $data['amount'],
            'request_date' => $data['request_date'] ?? now()->toDateString(),
            'deduct_month' => isset($data['deduct_month']) ? Carbon::parse($data['deduct_month'].'-01')->toDateString() : null,
            'reason' => $data['reason'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json($advance->load('employee'), 201);
    }

    public function updateAdvanceStatus(Request $request, SalaryAdvance $salaryAdvance)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
            'deduct_month' => ['nullable', 'date_format:Y-m'],
        ]);

        $salaryAdvance->update([
            'status' => $data['status'],
            'deduct_month' => isset($data['deduct_month'])
                ? Carbon::parse($data['deduct_month'].'-01')->toDateString()
                : $salaryAdvance->deduct_month,
            'approved_by' => $data['status'] === 'approved' ? $request->user()->id : null,
            'approved_at' => $data['status'] === 'approved' ? now() : null,
        ]);

        return response()->json($salaryAdvance->fresh('employee', 'approver'));
    }

    public function generate(Request $request)
    {
        $data = $request->validate(['month' => ['required', 'date_format:Y-m']]);
        $payroll = $this->payrollService->generate(Carbon::parse($data['month'].'-01'), $request->user()->id);

        return response()->json($this->formatPayroll($payroll));
    }

    public function updateStatus(Request $request, Payroll $payroll)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['pending', 'approved', 'paid', 'locked'])]]);
        $permission = match ($data['status']) {
            'approved' => 'payroll.approve',
            'paid' => 'payroll.pay',
            default => 'payroll.update',
        };

        abort_unless($request->user()->hasPermission($permission), 403, 'You do not have permission to update this payroll status.');

        return response()->json($this->formatPayroll($this->payrollService->changeStatus($payroll, $data['status'], $request->user()->id)));
    }

    public function showItem(Request $request, PayrollItem $payrollItem)
    {
        $this->authorizePayrollItem($request, $payrollItem);

        return response()->json($this->formatItem($payrollItem->load('payroll', 'employee.department', 'employee.position')));
    }

    public function payslip(Request $request, PayrollItem $payrollItem)
    {
        $this->authorizePayrollItem($request, $payrollItem);
        $item = $payrollItem->load('payroll', 'employee.department', 'employee.position');
        $employee = $item->employee;
        $month = $item->payroll->month->format('F Y');
        $html = view('payroll.payslip', compact('item', 'employee', 'month'))->render();

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="payslip-'.$employee->employee_code.'-'.$item->payroll->month->format('Y-m').'.html"');
    }

    private function salarySetupRules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'salary_type' => ['required', Rule::in(['monthly', 'daily', 'commission_only'])],
            'base_salary' => ['required', 'numeric', 'min:0'],
            'payroll_day' => ['required', 'integer', 'min:1', 'max:31'],
            'overtime_rate' => ['nullable', 'numeric', 'min:0'],
            'commission_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    private function deductionRuleRules(): array
    {
        return [
            'rule_name' => ['required', 'string', 'max:120'],
            'deduction_type' => ['required', Rule::in(['late', 'absent', 'missing_checkout', 'manual_penalty', 'salary_advance'])],
            'threshold_minutes' => ['nullable', 'integer', 'min:0'],
            'amount' => ['required', 'numeric', 'min:0'],
            'amount_type' => ['required', Rule::in(['fixed', 'daily_salary'])],
            'status' => ['required', 'boolean'],
        ];
    }

    private function salarySetups()
    {
        return SalarySetup::query()
            ->with(['employee.department', 'employee.position'])
            ->latest()
            ->get()
            ->map(fn ($setup) => [
                'id' => $setup->id,
                'employee_id' => $setup->employee_id,
                'employee_name' => $setup->employee?->full_name,
                'employee_code' => $setup->employee?->employee_code,
                'department' => $setup->employee?->department?->name,
                'position' => $setup->employee?->position?->name,
                'salary_type' => $setup->salary_type,
                'base_salary' => (float) $setup->base_salary,
                'payroll_day' => $setup->payroll_day,
                'overtime_rate' => (float) $setup->overtime_rate,
                'commission_percent' => (float) $setup->commission_percent,
                'status' => $setup->status,
            ]);
    }

    private function salaryAdvances(Request $request)
    {
        return SalaryAdvance::query()
            ->with(['employee', 'approver'])
            ->when(! $request->user()->hasPermission('payroll.view_all'), fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->latest()
            ->limit(50)
            ->get();
    }

    private function summary(Carbon $month): array
    {
        $payroll = Payroll::query()->whereDate('month', $month->toDateString())->first();

        if (! $payroll) {
            return [
                'total_payroll' => 0,
                'paid_employees' => 0,
                'pending_payroll' => 0,
                'total_bonus' => 0,
                'total_deductions' => 0,
            ];
        }

        return [
            'total_payroll' => (float) $payroll->total_net_salary,
            'paid_employees' => $payroll->items()->where('status', 'paid')->count(),
            'pending_payroll' => $payroll->items()->whereIn('status', ['draft', 'pending'])->count(),
            'total_bonus' => (float) $payroll->total_bonus,
            'total_deductions' => (float) $payroll->total_deductions,
        ];
    }

    private function formatPayroll(Payroll $payroll, bool $withItems = true): array
    {
        return [
            'id' => $payroll->id,
            'month' => $payroll->month->format('Y-m'),
            'month_label' => $payroll->month->format('F Y'),
            'status' => $payroll->status,
            'total_base_salary' => (float) $payroll->total_base_salary,
            'total_bonus' => (float) $payroll->total_bonus,
            'total_deductions' => (float) $payroll->total_deductions,
            'total_overtime' => (float) $payroll->total_overtime,
            'total_commission' => (float) $payroll->total_commission,
            'total_net_salary' => (float) $payroll->total_net_salary,
            'paid_at' => $payroll->paid_at?->toIso8601String(),
            'items' => $withItems ? $payroll->items->map(fn ($item) => $this->formatItem($item))->values() : [],
        ];
    }

    private function formatItem(PayrollItem $item): array
    {
        return [
            'id' => $item->id,
            'payroll_id' => $item->payroll_id,
            'employee_id' => $item->employee_id,
            'employee_name' => $item->employee?->full_name,
            'employee_code' => $item->employee?->employee_code,
            'department' => $item->employee?->department?->name,
            'position' => $item->employee?->position?->name,
            'salary_type' => $item->salary_type,
            'base_salary' => (float) $item->base_salary,
            'bonus_amount' => (float) $item->bonus_amount,
            'deduction_amount' => (float) $item->deduction_amount,
            'advance_amount' => (float) $item->advance_amount,
            'overtime_amount' => (float) $item->overtime_amount,
            'commission_amount' => (float) $item->commission_amount,
            'net_salary' => (float) $item->net_salary,
            'present_days' => $item->present_days,
            'late_days' => $item->late_days,
            'absent_days' => $item->absent_days,
            'half_days' => $item->half_days,
            'missing_checkout_days' => $item->missing_checkout_days,
            'overtime_hours' => (float) $item->overtime_hours,
            'sales_amount' => (float) $item->sales_amount,
            'status' => $item->status,
            'bonus_breakdown' => $item->bonus_breakdown ?? [],
            'deduction_breakdown' => $item->deduction_breakdown ?? [],
            'commission_breakdown' => $item->commission_breakdown ?? [],
            'attendance_snapshot' => $item->attendance_snapshot ?? [],
        ];
    }

    private function authorizePayrollItem(Request $request, PayrollItem $item): void
    {
        abort_unless(
            $request->user()->hasPermission('payroll.view_all') || (int) $item->employee_id === (int) $request->user()->employee_id,
            403,
            'You do not have permission to view this payslip.',
        );
    }
}
