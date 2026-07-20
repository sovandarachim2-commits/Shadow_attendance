<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_stays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('check_in_km');
            $table->unsignedInteger('check_out_km')->nullable();
            $table->unsignedInteger('total_km')->nullable();
            $table->text('check_in_address');
            $table->decimal('check_in_latitude', 10, 7);
            $table->decimal('check_in_longitude', 10, 7);
            $table->text('check_out_address')->nullable();
            $table->decimal('check_out_latitude', 10, 7)->nullable();
            $table->decimal('check_out_longitude', 10, 7)->nullable();
            $table->timestamp('check_in_at')->index();
            $table->timestamp('check_out_at')->nullable()->index();
            $table->string('check_in_photo_path');
            $table->string('check_out_photo_path')->nullable();
            $table->text('check_in_notes')->nullable();
            $table->text('check_out_notes')->nullable();
            $table->string('status')->default('checked_in')->index();
            $table->timestamps();
            $table->index(['employee_id', 'check_in_at', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_stays');
    }
};
