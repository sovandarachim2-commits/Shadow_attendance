<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permission_requests', function (Blueprint $table) {
            $table->string('duration_type', 20)->default('single_day')->after('reason');
            $table->string('start_time', 20)->nullable()->after('request_time');
            $table->string('end_time', 20)->nullable()->after('start_time');
            $table->decimal('total_hours', 8, 2)->nullable()->after('end_time');
            $table->unsignedInteger('total_days')->nullable()->after('total_hours');
            $table->string('day_part', 20)->nullable()->after('total_days');
            $table->text('note')->nullable()->after('reason');
            $table->string('attachment_path')->nullable()->after('note');
            $table->string('attachment_name')->nullable()->after('attachment_path');
            $table->string('attachment_mime')->nullable()->after('attachment_name');
        });
    }

    public function down(): void
    {
        Schema::table('permission_requests', function (Blueprint $table) {
            $table->dropColumn([
                'duration_type',
                'start_time',
                'end_time',
                'total_hours',
                'total_days',
                'day_part',
                'note',
                'attachment_path',
                'attachment_name',
                'attachment_mime',
            ]);
        });
    }
};
