<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->string('telegram_chat_id', 120)->nullable()->after('status');
            $table->unsignedInteger('telegram_topic_id')->nullable()->after('telegram_chat_id');
        });
    }

    public function down(): void
    {
        Schema::table('late_deduction_rules', function (Blueprint $table) {
            $table->dropColumn(['telegram_chat_id', 'telegram_topic_id']);
        });
    }
};
