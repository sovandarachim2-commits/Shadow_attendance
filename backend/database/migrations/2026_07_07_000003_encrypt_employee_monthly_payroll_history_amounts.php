<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $columns = [
        'base_salary',
        'allowances',
        'overtime',
        'commission',
        'bonus',
        'deductions',
        'tax',
        'net_salary',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('employee_monthly_payroll_histories')) {
            return;
        }

        $rows = DB::table('employee_monthly_payroll_histories')
            ->select(array_merge(['id'], $this->columns))
            ->get();

        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE employee_monthly_payroll_histories MODIFY {$column} TEXT NULL");
        }

        foreach ($rows as $row) {
            $values = [];

            foreach ($this->columns as $column) {
                $values[$column] = Crypt::encryptString((string) ((float) ($row->{$column} ?? 0)));
            }

            DB::table('employee_monthly_payroll_histories')
                ->where('id', $row->id)
                ->update($values);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('employee_monthly_payroll_histories')) {
            return;
        }

        $rows = DB::table('employee_monthly_payroll_histories')
            ->select(array_merge(['id'], $this->columns))
            ->get();

        foreach ($rows as $row) {
            $values = [];

            foreach ($this->columns as $column) {
                $value = $row->{$column};

                try {
                    $value = $value === null ? 0 : Crypt::decryptString($value);
                } catch (Throwable) {
                    $value = $value ?? 0;
                }

                $values[$column] = round((float) $value, 2);
            }

            DB::table('employee_monthly_payroll_histories')
                ->where('id', $row->id)
                ->update($values);
        }

        foreach ($this->columns as $column) {
            DB::statement("ALTER TABLE employee_monthly_payroll_histories MODIFY {$column} DECIMAL(12, 2) NOT NULL DEFAULT 0");
        }
    }
};
