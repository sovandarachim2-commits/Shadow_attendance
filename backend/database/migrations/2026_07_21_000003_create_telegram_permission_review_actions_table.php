<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_permission_review_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_request_id')->constrained('permission_requests')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('telegram_chat_id', 120);
            $table->string('action', 20);
            $table->timestamps();

            $table->unique(['permission_request_id', 'user_id'], 'telegram_permission_review_unique');
            $table->index(['telegram_chat_id', 'created_at'], 'telegram_permission_review_chat_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_permission_review_actions');
    }
};
