<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_settings', function (Blueprint $table) {
            $table->id();
            $table->text('bot_token')->nullable();
            $table->string('chat_id')->nullable();
            $table->string('webhook_url')->nullable();
            $table->string('status')->default('disconnected');
            $table->timestamp('last_notification_sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('telegram_templates', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique();
            $table->text('message_template');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('telegram_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('message_type');
            $table->text('telegram_message');
            $table->string('status')->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        DB::table('telegram_settings')->insert([
            'status' => 'disconnected',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('telegram_templates')->insert($this->templates());
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_logs');
        Schema::dropIfExists('telegram_templates');
        Schema::dropIfExists('telegram_settings');
    }

    private function templates(): array
    {
        $now = now();

        return [
            [
                'type' => 'check_in_success',
                'message_template' => "✅ CHECK IN SUCCESS\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n🏢 Department: {department}\n\n📅 Date: {date}\n🕘 Check In Time: {check_in}\n📍 Location: {location}\n\n📡 GPS Status: Verified\n\nStatus: {status}",
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'type' => 'check_out_success',
                'message_template' => "🚪 CHECK OUT SUCCESS\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n📅 Date: {date}\n🕔 Check Out Time: {check_out}\n⏱ Working Hours: {working_hours}\n\n📍 Location: {location}\n\nStatus: Completed",
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'type' => 'late_attendance',
                'message_template' => "⚠️ LATE ATTENDANCE ALERT\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n🕘 Check In: {check_in}\n⌛ Late By: {late_minutes} Minutes\n💰 Deduction: \${deduction_amount}\n\n📍 Location: {location}\n\nStatus: Late",
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'type' => 'permission_request',
                'message_template' => "📝 NEW PERMISSION REQUEST\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n📌 Request Type: {request_type}\n📅 Date: {date}\n\n📝 Reason:\n{reason}\n\n⏳ Status: Pending Approval",
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
    }
};
