# DEVELOPMENT TASK: Super Admin Exclusive User Activity Module

**Project:** Shadow Attendance  
**Priority:** High  
**Module:** User Activity / Audit Logs  
**Access Level:** Super Admin Only

## 1. Objective

Implement a secure User Activity module in Shadow Attendance.

This module allows Super Admin to monitor and review all important actions performed by users across the entire system.

**CRITICAL RULE: Only Super Admin can access this module.**

No other role can access it, even if Super Admin grants that role all available permissions.

## 2. Sidebar Integration

Add a new sidebar menu:

- Name: User Activity
- Icon: `activity`
- Route: `/user-activity`
- Position: Administration / System Management section.

Visibility:
- Super Admin: Visible.
- Admin: Hidden.
- HR Manager: Hidden.
- HR Staff: Hidden.
- Manager: Hidden.
- Employee: Hidden.
- Custom roles: Hidden.

Do not add User Activity to the configurable role permission matrix.

## 3. Strict Backend Authorization

Implement server-side Super Admin authorization.

Requirements:
- Every User Activity API endpoint must verify the authenticated user's actual Super Admin role.
- All other roles must receive HTTP 403 Forbidden.
- Direct URL access must be blocked.
- Manual API requests must be blocked.
- Changing frontend state or local storage must not bypass authorization.
- Granting all normal permissions to another role must not grant User Activity access.
- Do not trust role information submitted by the frontend.

Use the existing authentication and authorization architecture.

## 4. User Activity Dashboard

Create a professional dashboard with:

### Summary Cards
- Total Activities Today
- Active Users Today
- Successful Logins
- Failed Login Attempts
- Security Events

All values must come from real database records, not dummy data.

### Activity Table

Columns:
1. No.
2. User
3. Role
4. Action
5. Module
6. Description
7. IP Address
8. Device / Browser
9. Date & Time
10. Status
11. Details

## 5. Activity Logging

Automatically record important actions:

### Authentication
- Login
- Logout
- Failed Login
- Password Changed
- Session Expired

### Employee
- Employee Created
- Employee Updated
- Employee Deactivated

### Attendance
- Clock In
- Clock Out
- Attendance Created
- Attendance Edited
- Attendance Corrected

### Leave
- Leave Requested
- Leave Approved
- Leave Rejected
- Leave Cancelled

### Payroll
- Payroll Created
- Payroll Updated
- Payroll Approved
- Payroll Exported

### Administration
- User Created
- Role Changed
- Permission Changed
- Settings Updated

Record activities on the backend, not just through frontend events.

## 6. Activity Details Drawer

When Super Admin selects a record, display:

- User information
- User role
- Action and module
- Description
- Record reference
- IP address
- Browser / device
- Timestamp
- Previous values
- Updated values

Mask passwords, tokens, cookies, and other sensitive information. Never store these secrets in audit logs.

## 7. Search and Filtering

Implement:
- Search by user name.
- Filter by role.
- Filter by activity module.
- Filter by action.
- Filter by status.
- Date range filtering.
- Server-side pagination.
- CSV/Excel export.

Only Super Admin may use these functions.

## 8. Database and Audit Security

Create or reuse an appropriate audit log model.

Suggested fields:
- id
- user_id
- action
- module
- description
- record_type
- record_id
- old_values
- new_values
- ip_address
- user_agent
- status
- created_at

Requirements:
- Audit records must be append-only.
- Normal users cannot modify or delete records.
- Do not allow ordinary application CRUD operations to alter audit history.
- Protect sensitive audit information.
- Use server-generated timestamps.
- Capture the real authenticated actor.

## 9. UI/UX Design

Follow Shadow Attendance's existing design system.

Design direction:
- Clean enterprise HR dashboard.
- White and light-slate backgrounds.
- Deep navy sidebar.
- Royal Purple accent (#7c3aed).
- Compact professional data table.
- Clear status indicators.
- Responsive desktop, tablet, and mobile layouts.
- Consistent spacing and typography.

Avoid excessive gradients, unnecessary cards, and generic AI-generated dashboard styling.

## 10. Testing and Acceptance Criteria

Test all roles:

| Role | Expected Result |
|---|---|
| Super Admin | Full access |
| Admin | HTTP 403 |
| HR Manager | HTTP 403 |
| HR Staff | HTTP 403 |
| Manager | HTTP 403 |
| Employee | HTTP 403 |
| Custom role with all permissions | HTTP 403 |

Additional tests:
- Direct route access.
- Direct API access.
- Manually modified frontend permissions.
- Login and failed-login logging.
- Activity detail visibility.
- Search and filters.
- Export permissions.
- Existing HR functionality.

## 11. Implementation Rules

Before coding:
1. Inspect the existing project architecture.
2. Inspect authentication and role models.
3. Inspect existing permission middleware.
4. Inspect database structure.
5. Reuse existing components and conventions.

Do not:
- Create duplicate authentication systems.
- Create duplicate role systems.
- Give other roles access through configurable permissions.
- Disable existing security protections.
- Break existing attendance, employee, leave, or payroll functionality.
- Use mock data in production.

## 12. Final Deliverables

After implementation, report:
1. Files created and modified.
2. Database migrations.
3. API endpoints.
4. Super Admin authorization implementation.
5. Sidebar and routing changes.
6. Automated logging coverage.
7. Test results for every role.
8. Deployment and migration instructions.

**FINAL SECURITY REQUIREMENT: USER ACTIVITY IS A PERMANENT SUPER ADMIN-ONLY MODULE. NO OTHER ROLE CAN ACCESS IT, REGARDLESS OF CONFIGURABLE PERMISSIONS.**