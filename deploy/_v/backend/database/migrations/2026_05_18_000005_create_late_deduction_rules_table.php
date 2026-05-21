<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('late_deduction_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_name', 100);
            $table->integer('grace_minutes')->default(0);
            $table->integer('from_minutes');
            $table->integer('to_minutes')->nullable();
            $table->enum('deduction_type', ['none', 'fixed', 'percentage', 'half_day', 'full_day'])->default('fixed');
            $table->decimal('deduction_amount', 10, 2)->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        DB::table('late_deduction_rules')->insert([
            ['rule_name' => 'Late 1–15 Minutes',  'grace_minutes' => 0, 'from_minutes' => 1,  'to_minutes' => 15, 'deduction_type' => 'none',  'deduction_amount' => null, 'status' => true,  'created_at' => now(), 'updated_at' => now()],
            ['rule_name' => 'Late 16–30 Minutes', 'grace_minutes' => 0, 'from_minutes' => 16, 'to_minutes' => 30, 'deduction_type' => 'fixed', 'deduction_amount' => 1.00, 'status' => true,  'created_at' => now(), 'updated_at' => now()],
            ['rule_name' => 'Late 31–60 Minutes', 'grace_minutes' => 0, 'from_minutes' => 31, 'to_minutes' => 60, 'deduction_type' => 'fixed', 'deduction_amount' => 2.00, 'status' => true,  'created_at' => now(), 'updated_at' => now()],
            ['rule_name' => 'Late > 60 Minutes',  'grace_minutes' => 0, 'from_minutes' => 61, 'to_minutes' => null, 'deduction_type' => 'half_day', 'deduction_amount' => null, 'status' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('late_deduction_rules');
    }
};
