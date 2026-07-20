<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('place_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->text('start_address');
            $table->decimal('start_latitude', 10, 7);
            $table->decimal('start_longitude', 10, 7);
            $table->timestamp('started_at')->index();
            $table->string('start_photo_path')->nullable();
            $table->text('start_notes')->nullable();
            $table->text('end_address')->nullable();
            $table->decimal('end_latitude', 10, 7)->nullable();
            $table->decimal('end_longitude', 10, 7)->nullable();
            $table->timestamp('ended_at')->nullable()->index();
            $table->string('end_photo_path')->nullable();
            $table->text('end_notes')->nullable();
            $table->unsignedInteger('duration_minutes')->default(0);
            $table->string('status')->default('open')->index();
            $table->timestamps();
            $table->index(['employee_id', 'started_at', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('place_visits');
    }
};
