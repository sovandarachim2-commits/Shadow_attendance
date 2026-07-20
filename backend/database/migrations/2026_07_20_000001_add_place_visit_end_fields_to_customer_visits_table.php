<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_visits', function (Blueprint $table) {
            $table->decimal('end_latitude', 10, 7)->nullable()->after('longitude');
            $table->decimal('end_longitude', 10, 7)->nullable()->after('end_latitude');
            $table->text('end_address')->nullable()->after('end_longitude');
            $table->string('end_photo_path')->nullable()->after('store_photo_path');
            $table->text('end_notes')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('customer_visits', function (Blueprint $table) {
            $table->dropColumn([
                'end_latitude',
                'end_longitude',
                'end_address',
                'end_photo_path',
                'end_notes',
            ]);
        });
    }
};
