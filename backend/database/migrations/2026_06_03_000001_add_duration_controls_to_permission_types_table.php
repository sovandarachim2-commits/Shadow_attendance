<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permission_types', function (Blueprint $table) {
            if (! Schema::hasColumn('permission_types', 'duration_control')) {
                $table->string('duration_control', 20)->default('any')->after('limit_type');
            }

            if (! Schema::hasColumn('permission_types', 'max_hours')) {
                $table->decimal('max_hours', 5, 2)->nullable()->after('duration_control');
            }
        });
    }

    public function down(): void
    {
        Schema::table('permission_types', function (Blueprint $table) {
            if (Schema::hasColumn('permission_types', 'max_hours')) {
                $table->dropColumn('max_hours');
            }

            if (Schema::hasColumn('permission_types', 'duration_control')) {
                $table->dropColumn('duration_control');
            }
        });
    }
};
