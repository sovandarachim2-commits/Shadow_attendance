<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * TIMESTAMP columns follow the server timezone. This data was saved as
     * Cambodia wall-clock time, so a host on +07:00 displays every clock
     * seven hours ahead. DATETIME keeps the saved clock on any server.
     */
    public function up(): void
    {
        DB::statement("SET time_zone = '+00:00'");

        DB::statement('
            ALTER TABLE `attendance`
                MODIFY `check_in_at` datetime NULL DEFAULT NULL,
                MODIFY `check_out_at` datetime NULL DEFAULT NULL,
                MODIFY `synced_at` datetime NULL DEFAULT NULL,
                MODIFY `created_at` datetime NULL DEFAULT NULL,
                MODIFY `updated_at` datetime NULL DEFAULT NULL
        ');
    }

    public function down(): void
    {
        DB::statement("SET time_zone = '+00:00'");

        DB::statement('
            ALTER TABLE `attendance`
                MODIFY `check_in_at` timestamp NULL DEFAULT NULL,
                MODIFY `check_out_at` timestamp NULL DEFAULT NULL,
                MODIFY `synced_at` timestamp NULL DEFAULT NULL,
                MODIFY `created_at` timestamp NULL DEFAULT NULL,
                MODIFY `updated_at` timestamp NULL DEFAULT NULL
        ');
    }
};
