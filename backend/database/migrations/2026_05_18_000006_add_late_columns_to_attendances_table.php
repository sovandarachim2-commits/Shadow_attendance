<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            if (!Schema::hasColumn('attendance', 'late_minutes')) {
                $table->integer('late_minutes')->nullable()->after('status');
            }
            if (!Schema::hasColumn('attendance', 'deduction_amount')) {
                $table->decimal('deduction_amount', 10, 2)->nullable()->after('late_minutes');
            }
            if (!Schema::hasColumn('attendance', 'deduction_reason')) {
                $table->string('deduction_reason', 200)->nullable()->after('deduction_amount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropColumn(array_filter(
                ['late_minutes', 'deduction_amount', 'deduction_reason'],
                fn ($col) => Schema::hasColumn('attendance', $col),
            ));
        });
    }
};
