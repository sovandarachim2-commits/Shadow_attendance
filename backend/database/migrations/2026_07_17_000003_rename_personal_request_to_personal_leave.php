<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('permission_types')
            ->where('name', 'Personal Request')
            ->update([
                'name' => 'Personal Leave',
                'description' => 'Request approval for personal leave.',
                'updated_at' => now(),
            ]);

        DB::table('permission_requests')
            ->where('type', 'Personal Request')
            ->update(['type' => 'Personal Leave']);
    }

    public function down(): void
    {
        DB::table('permission_types')
            ->where('name', 'Personal Leave')
            ->update([
                'name' => 'Personal Request',
                'description' => 'Request approval for personal matters.',
                'updated_at' => now(),
            ]);

        DB::table('permission_requests')
            ->where('type', 'Personal Leave')
            ->update(['type' => 'Personal Request']);
    }
};
