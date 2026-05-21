<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeBonus;
use App\Services\BonusRuleService;
use App\Services\TelegramNotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EmployeeBonusController extends Controller
{
    public function __construct(private BonusRuleService $bonuses) {}

    public function calculate(Request $request)
    {
        $data = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
        ]);

        $month = Carbon::parse(($data['month'] ?? now()->format('Y-m')).'-01');
        $settings = $this->bonuses->settings();

        if (! $settings->auto_calculate_bonus) {
            throw ValidationException::withMessages([
                'bonus' => 'Auto calculate bonus is disabled in settings.',
            ]);
        }

        $created = $this->bonuses->calculateMonth($month, (bool) $settings->auto_approve_bonus);

        return response()->json([
            'created' => count($created),
            'message' => count($created)
                ? count($created).' bonus record(s) created.'
                : 'No new bonuses to create for this month.',
        ]);
    }

    public function updateStatus(Request $request, EmployeeBonus $employeeBonus, TelegramNotificationService $telegram)
    {
        if ($employeeBonus->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'Only pending bonuses can be reviewed.']);
        }

        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected,paid'],
        ]);

        $employeeBonus->update([
            'status' => $data['status'],
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        $employeeBonus->load(['employee', 'bonusRule']);
        $employee = $employeeBonus->employee;

        if ($data['status'] === 'approved' && $employee) {
            $settings = $this->bonuses->settings();
            if ($settings->notify_admin) {
                $name = trim("{$employee->first_name} {$employee->last_name}");
                $typeLabel = $this->bonuses->bonusTypeLabel($employeeBonus->bonus_type ?? 'custom');
                $amount = number_format((float) $employeeBonus->bonus_amount, 2);
                $month = $employeeBonus->month->format('M Y');

                $telegram->send(
                    "🎉 <b>ប្រាក់លើកទឹកចិត្តបានអនុម័ត</b>\n\n"
                    ."👤 បុគ្គលិក: {$name}\n"
                    ."💰 ប្រភេទប្រាក់លើកទឹកចិត្ត: {$typeLabel}\n"
                    ."💵 ចំនួនទឹកប្រាក់: \${$amount}\n"
                    ."📅 ខែ: {$month}\n\n"
                    .'ស្ថានភាព: បានអនុម័ត',
                    'bonus_approved',
                );
            }
        }

        return response()->json([
            'id' => $employeeBonus->id,
            'status' => $employeeBonus->status,
        ]);
    }
}
