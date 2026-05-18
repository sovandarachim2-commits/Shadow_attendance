<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AttendanceReportController;
use App\Http\Controllers\Api\AttendanceRuleController;
use App\Http\Controllers\Api\WorkScheduleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\CustomerVisitController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\IpRestrictionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PermissionRequestController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TelegramDestinationController;
use App\Http\Controllers\Api\TelegramNotificationController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/profile', [ProfileController::class, 'update'])
        ->middleware('permission:profile.update_own,profile.update_all');

    Route::get('/dashboard', DashboardController::class)
        ->middleware('permission:dashboard.admin,dashboard.employee');

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])
        ->middleware('permission:attendance.view_all,attendance.view_own');
    Route::get('/attendance/reports/admin', [AttendanceReportController::class, 'admin'])
        ->middleware('permission:reports.attendance.view_all,attendance.view_all');
    Route::get('/attendance/reports/employee', [AttendanceReportController::class, 'employee'])
        ->middleware('permission:reports.attendance.view_own,attendance.view_own,reports.attendance.view_all,attendance.view_all');
    Route::get('/attendance/reports/export', [AttendanceReportController::class, 'export'])
        ->middleware('permission:reports.attendance.export,reports.attendance.view_all,reports.attendance.view_own,attendance.view_all,attendance.view_own');
    Route::get('/attendance/reports/{attendance}', [AttendanceReportController::class, 'show'])
        ->middleware('permission:reports.attendance.view_all,reports.attendance.view_own,attendance.view_all,attendance.view_own');
    Route::get('/attendance/report', [AttendanceReportController::class, 'employee'])
        ->middleware('permission:reports.attendance.view_own,attendance.view_own,reports.attendance.view_all,attendance.view_all');
    Route::get('/attendance/export', [AttendanceReportController::class, 'export'])
        ->middleware('permission:reports.attendance.export,reports.attendance.view_all,reports.attendance.view_own,attendance.view_all,attendance.view_own');
    Route::get('/attendance/today', [AttendanceController::class, 'today'])
        ->middleware('permission:attendance.view_own,attendance.view_all');
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])
        ->middleware('permission:attendance.check_in');
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut'])
        ->middleware('permission:attendance.check_out');
    Route::match(['put', 'patch'], '/attendance/{attendance}', [AttendanceController::class, 'edit'])
        ->middleware('permission:attendance.edit');
    Route::patch('/attendance/{attendance}/edit', [AttendanceController::class, 'edit'])
        ->middleware('permission:attendance.edit');

    // Employees
    Route::get('/employee-options', [EmployeeController::class, 'options'])
        ->middleware('permission:employees.view,employees.create,employees.update');
    Route::get('/employees', [EmployeeController::class, 'index'])
        ->middleware('permission:employees.view');
    Route::post('/employees', [EmployeeController::class, 'store'])
        ->middleware('permission:employees.create');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])
        ->middleware('permission:employees.view');
    Route::match(['put', 'patch'], '/employees/{employee}', [EmployeeController::class, 'update'])
        ->middleware('permission:employees.update,profile.update_all');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])
        ->middleware('permission:employees.delete');

    // Departments & Positions
    Route::apiResource('/departments', DepartmentController::class)
        ->except(['show'])->middleware('permission:departments.manage');
    Route::apiResource('/positions', PositionController::class)
        ->except(['show'])->middleware('permission:positions.manage');

    // Roles & Permissions
    Route::get('/roles/permissions', [RoleController::class, 'permissions'])
        ->middleware('permission:roles.manage,permissions.manage');
    Route::apiResource('/roles', RoleController::class)
        ->except(['show'])->middleware('permission:roles.manage');
    Route::apiResource('/permissions', PermissionController::class)
        ->except(['show'])->middleware('permission:permissions.manage');

    // Customer Visits
    Route::get('/customer-visits', [CustomerVisitController::class, 'index'])
        ->middleware('permission:visits.view,visits.manage,visits.create');
    Route::post('/customer-visits', [CustomerVisitController::class, 'store'])
        ->middleware('permission:visits.create,visits.manage');
    Route::patch('/customer-visits/{customerVisit}/checkout', [CustomerVisitController::class, 'checkout'])
        ->middleware('permission:visits.update,visits.manage');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])
        ->middleware('permission:reports.view_all,reports.view_own');
    Route::post('/reports', [ReportController::class, 'store'])
        ->middleware('permission:reports.create');
    Route::get('/reports/export', [ReportController::class, 'export'])
        ->middleware('permission:reports.export');

    // Permission Requests
    Route::get('/permission-requests', [PermissionRequestController::class, 'index'])
        ->middleware('permission:requests.view_all,requests.view_own');
    Route::post('/permission-requests', [PermissionRequestController::class, 'store'])
        ->middleware('permission:requests.create');
    Route::match(['put', 'patch'], '/permission-requests/{permissionRequest}', [PermissionRequestController::class, 'update'])
        ->middleware('permission:requests.create,requests.view_all');
    Route::patch('/permission-requests/{permissionRequest}/status', [PermissionRequestController::class, 'updateStatus'])
        ->middleware('permission:requests.approve');
    Route::delete('/permission-requests/{permissionRequest}', [PermissionRequestController::class, 'destroy'])
        ->middleware('permission:requests.create,requests.view_all');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->middleware('permission:notifications.view,notifications.manage');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead'])
        ->middleware('permission:notifications.view,notifications.manage');

    // Attendance Rules
    Route::get('/attendance-rules', [AttendanceRuleController::class, 'index'])
        ->middleware('permission:settings.manage,settings.view');
    Route::put('/attendance-rules', [AttendanceRuleController::class, 'update'])
        ->middleware('permission:settings.manage');

    // Late Rules
    Route::get('/late-rules', [\App\Http\Controllers\Api\LateRuleController::class, 'index'])
        ->middleware('permission:settings.manage,settings.view');
    Route::put('/late-rules', [\App\Http\Controllers\Api\LateRuleController::class, 'update'])
        ->middleware('permission:settings.manage');
    Route::apiResource('/late-deduction-rules', \App\Http\Controllers\Api\LateDeductionRuleController::class)
        ->except(['show'])
        ->middleware('permission:settings.manage');

    // Bonus Rules
    Route::get('/bonus-rules', [\App\Http\Controllers\Api\BonusRuleController::class, 'index'])
        ->middleware('permission:settings.manage,settings.view');
    Route::put('/bonus-rules/settings', [\App\Http\Controllers\Api\BonusRuleController::class, 'updateSettings'])
        ->middleware('permission:settings.manage');
    Route::post('/bonus-rules/rules', [\App\Http\Controllers\Api\BonusRuleController::class, 'storeRule'])
        ->middleware('permission:settings.manage');
    Route::put('/bonus-rules/rules/{bonusRule}', [\App\Http\Controllers\Api\BonusRuleController::class, 'updateRule'])
        ->middleware('permission:settings.manage');
    Route::delete('/bonus-rules/rules/{bonusRule}', [\App\Http\Controllers\Api\BonusRuleController::class, 'destroyRule'])
        ->middleware('permission:settings.manage');
    Route::post('/employee-bonuses/calculate', [\App\Http\Controllers\Api\EmployeeBonusController::class, 'calculate'])
        ->middleware('permission:settings.manage');
    Route::patch('/employee-bonuses/{employeeBonus}/status', [\App\Http\Controllers\Api\EmployeeBonusController::class, 'updateStatus'])
        ->middleware('permission:settings.manage,requests.approve');

    // Work Schedules
    Route::get('/work-schedules', [WorkScheduleController::class, 'index'])
        ->middleware('permission:settings.manage,settings.view,settings.schedules');
    Route::post('/work-schedules', [WorkScheduleController::class, 'store'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::put('/work-schedules/{workSchedule}', [WorkScheduleController::class, 'update'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::delete('/work-schedules/{workSchedule}', [WorkScheduleController::class, 'destroy'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::post('/work-schedules/assign', [WorkScheduleController::class, 'assign'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::put('/work-schedules/assignments/{employeeSchedule}', [WorkScheduleController::class, 'updateAssignment'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::delete('/work-schedules/assignments/{employeeSchedule}', [WorkScheduleController::class, 'destroyAssignment'])
        ->middleware('permission:settings.manage,settings.schedules');
    Route::get('/work-schedules/assignments', [WorkScheduleController::class, 'assignments'])
        ->middleware('permission:settings.manage,settings.schedules,settings.view');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])
        ->middleware('permission:settings.view,settings.security,settings.api,settings.manage,settings.schedules,roles.manage,dashboard.admin,dashboard.employee');
    Route::put('/settings', [SettingsController::class, 'update'])
        ->middleware('permission:settings.security,settings.manage');
    Route::post('/settings/logo', [SettingsController::class, 'uploadLogo'])
        ->middleware('permission:settings.security,settings.manage');

    // IP Restrictions
    Route::get('/ip-restrictions', [IpRestrictionController::class, 'index'])
        ->middleware('permission:roles.manage');
    Route::post('/ip-restrictions', [IpRestrictionController::class, 'store'])
        ->middleware('permission:roles.manage');
    Route::delete('/ip-restrictions/{ipRestriction}', [IpRestrictionController::class, 'destroy'])
        ->middleware('permission:roles.manage');

    // Telegram
    Route::get('/telegram-notifications', [TelegramNotificationController::class, 'index'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');
    Route::put('/telegram-notifications/settings', [TelegramNotificationController::class, 'updateSettings'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');
    Route::put('/telegram-notifications/toggles', [TelegramNotificationController::class, 'updateToggles'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');
    Route::put('/telegram-notifications/templates/{telegramTemplate}', [TelegramNotificationController::class, 'updateTemplate'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');
    Route::post('/telegram-notifications/test-connection', [TelegramNotificationController::class, 'testConnection'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');
    Route::post('/telegram-notifications/test', [TelegramNotificationController::class, 'test'])
        ->middleware('permission:notifications.manage,settings.security,settings.manage');

    Route::apiResource('/telegram-destinations', TelegramDestinationController::class)
        ->except(['show'])->middleware('permission:notifications.manage,settings.security');
    Route::get('/telegram-destinations/events', [TelegramDestinationController::class, 'events'])
        ->middleware('permission:notifications.manage,settings.security');
    Route::post('/telegram-destinations/{telegramDestination}/test', [TelegramDestinationController::class, 'test'])
        ->middleware('permission:notifications.manage,settings.security');
    Route::get('/telegram-destinations/verify-bot', [TelegramDestinationController::class, 'verifyBot'])
        ->middleware('permission:notifications.manage,settings.security');
    Route::get('/telegram-destinations/token-status', [TelegramDestinationController::class, 'getTokenStatus'])
        ->middleware('permission:notifications.manage,settings.security');
    Route::post('/telegram-destinations/save-token', [TelegramDestinationController::class, 'saveToken'])
        ->middleware('permission:notifications.manage,settings.security');
});
