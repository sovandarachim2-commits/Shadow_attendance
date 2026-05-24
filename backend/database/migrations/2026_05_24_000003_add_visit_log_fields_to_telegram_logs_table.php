<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('telegram_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_visit_id')->nullable()->after('employee_id');
            $table->foreign('customer_visit_id')
                ->references('id')->on('customer_visits')
                ->nullOnDelete();

            $table->text('selfie_url')->nullable()->after('telegram_message');
            $table->text('store_photo_url')->nullable()->after('selfie_url');
            $table->text('error_message')->nullable()->after('store_photo_url');
            $table->string('event_key', 80)->nullable()->after('message_type');
            $table->unsignedTinyInteger('attempts')->default(0)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('telegram_logs', function (Blueprint $table) {
            $table->dropForeign(['customer_visit_id']);
            $table->dropColumn([
                'customer_visit_id',
                'selfie_url',
                'store_photo_url',
                'error_message',
                'event_key',
                'attempts',
            ]);
        });
    }
};
