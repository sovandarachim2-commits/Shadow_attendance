# Project Features

This document explains the main features in the Employee Attendance & Outdoor Sales Tracking project.

## 1. Authentication

Users can log in and log out with Laravel Sanctum API tokens.

Main files:

- `backend/app/Http/Controllers/Api/AuthController.php`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/services/api.js`

Key behavior:

- Login returns a bearer token.
- Frontend stores the token in `localStorage`.
- Authenticated API calls send the token in the `Authorization` header.
- Current user data loads from `/api/auth/me`.

## 2. Dashboard

The dashboard shows attendance and activity summaries for admins and employees.

Main files:

- `backend/app/Http/Controllers/Api/DashboardController.php`
- `backend/app/Http/Controllers/Api/BootstrapController.php`
- `frontend/src/pages/DashboardPage.jsx`

Key behavior:

- Admins can see broader team data.
- Employees see their own attendance-focused summary.
- The frontend loads common dashboard data through `/api/bootstrap`.

## 3. Attendance Check In / Check Out

Employees can check in and check out with GPS and optional selfie/photo proof.

Main files:

- `backend/app/Http/Controllers/Api/AttendanceController.php`
- `backend/app/Services/AttendanceService.php`
- `backend/app/Services/AttendanceRuleService.php`
- `backend/app/Services/GpsValidationService.php`
- `backend/app/Services/ImageUploadService.php`
- `frontend/src/pages/AttendancePage.jsx`
- `frontend/src/components/attendance/AttendanceActionModal.jsx`
- `frontend/src/components/shared/CameraCaptureModal.jsx`

Key behavior:

- Prevents duplicate daily check-in.
- Requires check-in before check-out.
- Captures GPS latitude, longitude, accuracy, and address.
- Saves attendance selfie/photo when enabled.
- Calculates late status and late deductions.
- Records GPS history in `gps_locations`.
- Blocks check-in on scheduled days off unless the user is admin/super admin.

## 4. Attendance Rules

Admins can configure attendance requirements and automation rules.

Main files:

- `backend/app/Http/Controllers/Api/AttendanceRuleController.php`
- `backend/app/Services/AttendanceRuleService.php`
- `frontend/src/components/settings/AttendanceRulesSettings.jsx`

Key behavior:

- Controls GPS requirement.
- Controls selfie/photo requirement.
- Controls whether selfies are saved.
- Supports office and outdoor attendance behavior.
- Supports reminder and automation settings.

## 5. Work Schedules

Admins can create schedules and assign employees to schedules.

Main files:

- `backend/app/Http/Controllers/Api/WorkScheduleController.php`
- `backend/app/Services/WorkScheduleService.php`
- `frontend/src/components/settings/WorkScheduleSettings.jsx`

Key behavior:

- Supports default schedule.
- Supports employee schedule assignment.
- Determines whether today is a working day.
- Prevents normal employees from checking in on scheduled days off.

## 6. Attendance Requests

Employees can submit attendance-related requests for approval.

Current request types:

- `Late Check In`
- `Early Check Out`
- `Day Off`
- `Missing Check In`
- `Personal Request`

Main files:

- `backend/app/Http/Controllers/Api/PermissionRequestController.php`
- `backend/app/Models/PermissionRequest.php`
- `backend/app/Models/PermissionType.php`
- `frontend/src/pages/PermissionRequestsPage.jsx`
- `frontend/src/constants/permissionRequestTypes.js`

Key behavior:

- Employees submit requests with date, time, duration, reason, and optional cover person.
- Admins approve or reject pending requests.
- Duplicate active requests for the same type/date/time are blocked.
- Approved `Late Check In` requests can reduce late deductions.
- `Day Off` blocks check-in.
- Full-day or multiple-day `Personal Request` blocks check-in.
- Hourly or half-day `Personal Request` does not block check-in.

## 7. Permission Types

Admins can edit the settings for fixed request types. They cannot create, delete, or rename request types.

Main files:

- `backend/app/Http/Controllers/Api/PermissionTypeController.php`
- `frontend/src/pages/PermissionTypesPage.jsx`

Key behavior:

- The five request types are fixed system data.
- Controls allowed request count.
- Controls duration type: any, single day, multiple day, or hours.
- Controls max hours for hourly request types.
- Provides colors and descriptions used in the request UI.
- Users and admins cannot add extra request types from the app.

## 8. Attendance Reports

The system provides admin and employee attendance reports.

Main files:

- `backend/app/Http/Controllers/Api/AttendanceReportController.php`
- `backend/app/Http/Controllers/Api/EmployeeMonthlyReportController.php`
- `backend/app/Services/AttendanceReportService.php`
- `backend/app/Repositories/AttendanceRepository.php`
- `frontend/src/pages/AdminAttendanceReportsPage.jsx`
- `frontend/src/pages/MyAttendanceReportsPage.jsx`
- `frontend/src/pages/EmployeeMonthlyReportPage.jsx`
- `frontend/src/components/attendance/reports/attendanceReportShared.jsx`

Key behavior:

- Supports present, late, absent, day off, personal request, missing check-in, and missing check-out labels.
- Keeps `Missing Check In` and `Missing Check Out` separate.
- Supports filters by date, employee, department, branch, status, and GPS status.
- Supports CSV/export flows.
- Employee monthly report includes calendar-style month data.

## 9. Employees

Admins can manage employee records and login-linked employee data.

Main files:

- `backend/app/Http/Controllers/Api/EmployeeController.php`
- `backend/app/Models/Employee.php`
- `frontend/src/pages/EmployeesPage.jsx`
- `frontend/src/components/employees/EmployeeModal.jsx`

Key behavior:

- Stores employee profile, code, department, position, branch, and status.
- Supports login account creation/editing.
- Supports employment type such as office or outdoor sales.
- Supports face/GPS/IP restriction flags.

## 10. Profile

Users can view and update profile details when permitted.

Main files:

- `backend/app/Http/Controllers/Api/ProfileController.php`
- `frontend/src/pages/ProfilePage.jsx`

Key behavior:

- Employee can update allowed own profile fields.
- Admin/super admin can update broader profile data depending on permission.
- Profile page shows today attendance and employee details.

## 11. Roles, Permissions, and IP Access

Admins can manage roles, permissions, and IP restrictions.

Main files:

- `backend/app/Http/Controllers/Api/RoleController.php`
- `backend/app/Http/Controllers/Api/PermissionController.php`
- `backend/app/Http/Controllers/Api/IpRestrictionController.php`
- `backend/app/Http/Middleware/EnsurePermission.php`
- `backend/app/Http/Middleware/EnsureRole.php`
- `frontend/src/pages/UsersRolesPage.jsx`

Key behavior:

- Menu access is permission-driven.
- API routes are protected by permission middleware.
- Roles can be restricted to allowed IP addresses.
- Admin and super admin bypass some attendance restrictions.

## 12. Customer Visits

Outdoor sales employees can record customer visits.

Main files:

- `backend/app/Http/Controllers/Api/CustomerVisitController.php`
- `backend/app/Models/CustomerVisit.php`
- `frontend/src/pages/CustomerVisitsPage.jsx`
- `frontend/src/components/visits/VisitModal.jsx`
- `frontend/src/components/visits/EditVisitModal.jsx`

Key behavior:

- Records customer/store visit details.
- Captures GPS location.
- Supports selfie and store photo.
- Supports checkout/end visit.
- Provides visit summaries and province filters.

## 13. Outdoor Sales / Route Map

Outdoor sales activity can be viewed through route and location screens.

Main files:

- `frontend/src/pages/OutdoorSalesPage.jsx`
- `backend/app/Models/GpsLocation.php`
- `backend/app/Http/Controllers/Api/DashboardController.php`

Key behavior:

- Uses GPS data from attendance and visits.
- Supports live/recent location display when map API is configured.
- Outdoor sales employees can use outdoor attendance mode.

## 14. Daily Reports

Employees can submit daily reports.

Main files:

- `backend/app/Http/Controllers/Api/ReportController.php`
- `backend/app/Models/Report.php`
- `frontend/src/pages/ReportsPage.jsx`
- `frontend/src/components/reports/ReportModal.jsx`

Key behavior:

- Employees submit work reports.
- Admins/managers can view reports depending on permission.
- Reports can be exported.

## 15. Notifications

The app stores and displays system notifications.

Main files:

- `backend/app/Http/Controllers/Api/NotificationController.php`
- `backend/app/Models/Notification.php`
- `frontend/src/pages/NotificationsPage.jsx`

Key behavior:

- Shows request and system notifications.
- Supports read/unread state.
- Admin notifications can be global.
- Employee notifications can target a specific user.

## 16. Telegram Notifications

The backend can send Telegram notifications for attendance, late arrivals, requests, visits, and system events.

Main files:

- `backend/app/Services/TelegramNotificationService.php`
- `backend/app/Http/Controllers/Api/TelegramNotificationController.php`
- `backend/app/Http/Controllers/Api/TelegramDestinationController.php`
- `frontend/src/components/settings/TelegramNotificationSettings.jsx`

Key behavior:

- Supports event-based Telegram destinations.
- Supports Telegram templates.
- Supports test connection and test message actions.
- Supports employee private Telegram messages when `telegram_chat_id` is configured.

## 17. Late Rules and Deductions

Admins can configure late arrival deduction rules.

Main files:

- `backend/app/Http/Controllers/Api/LateRuleController.php`
- `backend/app/Http/Controllers/Api/LateDeductionRuleController.php`
- `backend/app/Services/LateRuleService.php`
- `frontend/src/components/settings/LateRulesSettings.jsx`

Key behavior:

- Calculates late minutes.
- Applies deduction rules.
- Supports schedule-specific late rules.
- Approved `Late Check In` requests can reduce chargeable late minutes.

## 18. Bonus Rules

Admins can configure and calculate bonus rules.

Main files:

- `backend/app/Http/Controllers/Api/BonusRuleController.php`
- `backend/app/Http/Controllers/Api/EmployeeBonusController.php`
- `backend/app/Services/BonusRuleService.php`
- `frontend/src/components/settings/BonusRulesSettings.jsx`

Key behavior:

- Manages bonus settings.
- Manages bonus rules.
- Calculates employee bonuses.
- Supports approval/rejection status updates.

## 19. Payroll

The payroll module manages salary setup, payroll generation, deductions, advances, and payslips.

Main files:

- `backend/app/Http/Controllers/Api/PayrollController.php`
- `backend/app/Services/PayrollService.php`
- `backend/resources/views/payroll/payslip.blade.php`
- `frontend/src/pages/PayrollPage.jsx`

Key behavior:

- Stores salary setup per employee.
- Generates payroll for a month.
- Supports payroll status flow.
- Supports salary advances.
- Supports deduction rules.
- Generates payslip output.

## 20. Branding and Settings

Admins can update company branding and system settings.

Main files:

- `backend/app/Http/Controllers/Api/SettingsController.php`
- `backend/app/Models/SystemSetting.php`
- `frontend/src/pages/BrandingPage.jsx`
- `frontend/src/pages/SecurityPage.jsx`
- `frontend/src/utils/branding.js`

Key behavior:

- Public branding can load before login.
- Supports company name, site title, logo, and icon.
- Frontend applies branding to the document title and favicon.

## 21. Storage

The app supports local public storage in development and Cloudflare R2-ready production storage.

Main files:

- `backend/config/filesystems.php`
- `backend/app/Services/ImageUploadService.php`
- `backend/app/Console/Commands/TestR2Upload.php`

Key behavior:

- Attendance photos and uploaded assets can be stored on the configured disk.
- Development uses the public disk.
- Production can use R2 with `ATTENDANCE_IMAGE_DISK=r2`.

## 22. Face Detection / Selfie Safety

The frontend includes face/selfie utilities for attendance photo capture.

Main files:

- `frontend/src/utils/faceDetection.js`
- `frontend/src/utils/selfieSpoofDetection.js`
- `frontend/src/utils/imageCapture.js`
- `frontend/public/models/human/`

Key behavior:

- Supports camera capture.
- Supports face detection model assets.
- Supports image resizing/compression before upload.
- Includes spoof-detection helper logic.

## 23. Deployment Helpers

The repository includes scripts and docs for local and Hostinger-style deployment.

Main files:

- `docs/DEPLOYMENT.md`
- `deploy/`
- `deploy-hostinger.ps1`
- `Upload to Hostinger.bat`
- `vercel.json`

Key behavior:

- Includes public entrypoint files for deployment.
- Includes Hostinger deployment notes.
- Includes Vercel configuration file.

## Still To Improve

- Add stronger automated tests for attendance requests and payroll.
- Add browser verification for the full login, request, approval, and check-in flows.
- Keep `README.md` run URL aligned with `DEV_HTTPS=true` when HTTPS mode is enabled.
- Consider code splitting the frontend bundle to reduce Vite chunk-size warnings.
