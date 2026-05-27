<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedSmallInteger('allowed_times')->default(1);
            $table->enum('limit_type', ['per_day', 'per_month'])->default('per_month');
            $table->decimal('deduction_amount', 10, 2)->default(0);
            $table->string('color', 20)->default('#f59e0b');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_types');
    }
};
