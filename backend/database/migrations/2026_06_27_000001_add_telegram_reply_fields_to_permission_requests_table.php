<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permission_requests', function (Blueprint $table) {
            $table->string('telegram_chat_id', 120)->nullable()->after('admin_notes');
            $table->unsignedBigInteger('telegram_message_thread_id')->nullable()->after('telegram_chat_id');
            $table->unsignedBigInteger('telegram_message_id')->nullable()->after('telegram_message_thread_id');
        });
    }

    public function down(): void
    {
        Schema::table('permission_requests', function (Blueprint $table) {
            $table->dropColumn([
                'telegram_chat_id',
                'telegram_message_thread_id',
                'telegram_message_id',
            ]);
        });
    }
};
