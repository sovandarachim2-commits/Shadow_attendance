<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $templates = [
            'check_in_success' => "✅ បានចូលធ្វើការ\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n🏢 ផ្នែក: {department}\n\n📅 កាលបរិច្ឆេទ: {date}\n🕘 ម៉ោងចូល: {check_in}\n📍 ទីតាំង: {location}\n\n📡 ស្ថានភាព GPS: បានផ្ទៀងផ្ទាត់\n\nស្ថានភាព: {status}",
            'check_out_success' => "🚪 បានចេញពីធ្វើការ\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n📅 កាលបរិច្ឆេទ: {date}\n🕔 ម៉ោងចេញ: {check_out}\n⏱ ម៉ោងធ្វើការ: {working_hours}\n\n📍 ទីតាំង: {location}\n\nស្ថានភាព: បានបញ្ចប់",
            'late_attendance' => "⚠️ ជូនដំណឹងមកយឺត\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n🕘 ម៉ោងចូល: {check_in}\n⌛ យឺតចំនួន: {late_minutes} នាទី\n💰 កាត់ប្រាក់: \${deduction_amount}\n\n📍 ទីតាំង: {location}\n\nស្ថានភាព: មកយឺត",
            'permission_request' => "📝 សំណើសុំអនុញ្ញាតថ្មី\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n📌 ប្រភេទសំណើ: {request_type}\n📅 កាលបរិច្ឆេទ: {date}\n\n📝 មូលហេតុ:\n{reason}\n\n⏳ ស្ថានភាព: រង់ចាំអនុម័ត",
        ];

        foreach ($templates as $type => $message) {
            DB::table('telegram_templates')
                ->where('type', $type)
                ->update([
                    'message_template' => $message,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        $templates = [
            'check_in_success' => "✅ CHECK IN SUCCESS\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n🏢 Department: {department}\n\n📅 Date: {date}\n🕘 Check In Time: {check_in}\n📍 Location: {location}\n\n📡 GPS Status: Verified\n\nStatus: {status}",
            'check_out_success' => "🚪 CHECK OUT SUCCESS\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n📅 Date: {date}\n🕔 Check Out Time: {check_out}\n⏱ Working Hours: {working_hours}\n\n📍 Location: {location}\n\nStatus: Completed",
            'late_attendance' => "⚠️ LATE ATTENDANCE ALERT\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n🕘 Check In: {check_in}\n⌛ Late By: {late_minutes} Minutes\n💰 Deduction: \${deduction_amount}\n\n📍 Location: {location}\n\nStatus: Late",
            'permission_request' => "📝 NEW PERMISSION REQUEST\n\n👤 Employee: {name}\n🆔 Employee ID: {employee_id}\n\n📌 Request Type: {request_type}\n📅 Date: {date}\n\n📝 Reason:\n{reason}\n\n⏳ Status: Pending Approval",
        ];

        foreach ($templates as $type => $message) {
            DB::table('telegram_templates')
                ->where('type', $type)
                ->update([
                    'message_template' => $message,
                    'updated_at' => now(),
                ]);
        }
    }
};
