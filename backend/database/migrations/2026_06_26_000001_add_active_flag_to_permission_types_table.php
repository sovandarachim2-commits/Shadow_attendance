<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permission_types', function (Blueprint $table) {
            if (! Schema::hasColumn('permission_types', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('permission_types', function (Blueprint $table) {
            if (Schema::hasColumn('permission_types', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};
