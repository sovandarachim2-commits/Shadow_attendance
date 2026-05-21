<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bonus_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('auto_calculate_bonus')->default(true);
            $table->boolean('include_in_payroll')->default(true);
            $table->boolean('notify_employee')->default(true);
            $table->boolean('notify_admin')->default(true);
            $table->boolean('auto_approve_bonus')->default(false);
            $table->boolean('bonus_expiration')->default(false);
            $table->timestamps();
        });

        Schema::create('bonus_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_name');
            $table->string('bonus_type');
            $table->string('condition_type');
            $table->decimal('condition_value', 12, 2)->nullable();
            $table->decimal('bonus_amount', 12, 2)->default(0);
            $table->string('frequency')->default('monthly');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('employee_bonuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bonus_rule_id')->nullable()->constrained()->nullOnDelete();
            $table->date('month');
            $table->decimal('bonus_amount', 12, 2)->default(0);
            $table->string('bonus_type')->nullable();
            $table->text('reason')->nullable();
            $table->string('status')->default('pending')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'month']);
        });

        DB::table('bonus_settings')->insert([
            'auto_calculate_bonus' => true,
            'include_in_payroll' => true,
            'notify_employee' => true,
            'notify_admin' => true,
            'auto_approve_bonus' => false,
            'bonus_expiration' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $now = now();
        DB::table('bonus_rules')->insert([
            [
                'rule_name' => 'Perfect Attendance Bonus',
                'bonus_type' => 'perfect_attendance',
                'condition_type' => 'full_attendance',
                'condition_value' => null,
                'bonus_amount' => 20,
                'frequency' => 'monthly',
                'status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'rule_name' => 'No Late Attendance',
                'bonus_type' => 'no_late',
                'condition_type' => 'no_late',
                'condition_value' => null,
                'bonus_amount' => 10,
                'frequency' => 'monthly',
                'status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'rule_name' => '100 Customer Visits',
                'bonus_type' => 'customer_visit',
                'condition_type' => 'customer_visit_count',
                'condition_value' => 100,
                'bonus_amount' => 30,
                'frequency' => 'monthly',
                'status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_bonuses');
        Schema::dropIfExists('bonus_rules');
        Schema::dropIfExists('bonus_settings');
    }
};
