import { useCallback, useEffect, useRef, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock,
  FileText,
  Hammer,
  Home,
  Image,
  LogOut,
  MapPinned,
  Menu,
  Moon,
  User,
  Settings as SettingsIcon,
  ShoppingBag,
  Sun,
  Users,
  UserRound,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { api, attendanceService, authService, bootstrapService } from './services/api'
import DashboardPage from './pages/DashboardPage'
import AttendancePage from './pages/AttendancePage'
import EmployeesPage from './pages/EmployeesPage'
import BranchesPage from './pages/BranchesPage'
import DepartmentsPage from './pages/DepartmentsPage'
import PositionsPage from './pages/PositionsPage'
import UsersRolesPage from './pages/UsersRolesPage'
import OutdoorSalesPage from './pages/OutdoorSalesPage'
import CustomerVisitsPage from './pages/CustomerVisitsPage'
import ReportsPage from './pages/ReportsPage'
import ActivityReportPage from './pages/ActivityReportPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import SecurityPage from './pages/SecurityPage'
import BrandingPage from './pages/BrandingPage'
import PermissionRequestsPage from './pages/PermissionRequestsPage'
import PermissionTypesPage from './pages/PermissionTypesPage'
import AttendanceHistoryPage from './pages/AttendanceHistoryPage'
import AdminAttendanceReportsPage from './pages/AdminAttendanceReportsPage'
import MyAttendanceReportsPage from './pages/MyAttendanceReportsPage'
import EmployeeMonthlyReportPage from './pages/EmployeeMonthlyReportPage'
import EmployeeDashboardPage from './pages/EmployeeDashboardPage'
import PayrollHistoryPage from './pages/PayrollHistoryPage'
import LoginPage from './pages/LoginPage'
import MobileNav from './components/layout/MobileNav'
import AttendanceActionModal from './components/attendance/AttendanceActionModal'
import EmployeeModal from './components/employees/EmployeeModal'
import VisitModal from './components/visits/VisitModal'
import MealModal from './components/visits/MealModal'
import HotelModal from './components/visits/HotelModal'
import PlaceVisitModal from './components/visits/PlaceVisitModal'
import ReportModal from './components/reports/ReportModal'
import { FloatingSpinner, LoadingScreen, SummaryRow } from './components/shared/UI'
import { applyDocumentBranding } from './utils/branding'
import { canAccess, formatTime, userDisplayName } from './utils/format'

const sidebarMainItems = [
  { label: 'Dashboard', target: 'Dashboard', icon: Home, permissions: ['dashboard.admin', 'dashboard.employee'] },
  { label: 'Customer Visits', target: 'Customer Visits', icon: ShoppingBag, permissions: ['visits.view', 'visits.create', 'visits.manage'] },
  { label: 'Route Map', target: 'Route Map', icon: MapPinned, permissions: ['gps.view', 'gps.live', 'gps.history'] },
  { label: 'Profile', target: 'Profile', icon: UserRound, permissions: ['profile.update_own', 'profile.update_all', 'dashboard.admin', 'dashboard.employee'] },
  { label: 'Notifications', target: 'Notifications', icon: Bell, permissions: ['notifications.view', 'notifications.manage'] },
]

const reportSubItems = [
  { label: 'Employee Dashboard', target: 'Employee Dashboard', activeTargets: ['Employee Dashboard', 'Attendance Dashboard'], permissions: ['employee_report.view_all', 'reports.attendance.view_all', 'attendance.view_all'] },
  { label: 'Employee Monthly Report', target: 'Employee Monthly Report', activeTargets: ['Employee Monthly Report', 'Monthly Report'], permissions: ['employee_report.view_all', 'employee_report.view_own'] },
  { label: 'Payroll History', target: 'Payroll History', activeTargets: ['Payroll History'], permissions: ['payroll.view_all', 'payroll.view_own', 'payroll.create', 'payroll.update'] },
  { label: 'Place Visit Report', target: 'Place Visit Report', activeTargets: ['Place Visit Report'], permissions: ['reports.view_all', 'reports.view_own', 'visits.view', 'visits.manage', 'visits.create'] },
  { label: 'Meal Report', target: 'Meal Report', activeTargets: ['Meal Report'], permissions: ['reports.view_all', 'reports.view_own', 'visits.view', 'visits.manage', 'visits.create'] },
  { label: 'Hotel Report', target: 'Hotel Report', activeTargets: ['Hotel Report'], permissions: ['reports.view_all', 'reports.view_own', 'visits.view', 'visits.manage', 'visits.create'] },
]

const REPORTS_TARGETS = new Set(['Employee Dashboard', 'Attendance Dashboard', 'Employee Monthly Report', 'Monthly Report', 'Payroll History', 'Place Visit Report', 'Meal Report', 'Hotel Report'])

const attendanceSubItems = [
  { label: 'Attendance Records', target: 'Attendance History', activeTargets: ['Attendance History'], permissions: ['attendance.view_all'] },
  { label: 'Team Attendance Report', target: 'Admin Attendance Reports', activeTargets: ['Admin Attendance Reports'], permissions: ['reports.attendance.view_all', 'attendance.view_all'] },
  { label: 'My Attendance Report', target: 'My Attendance Reports', activeTargets: ['My Attendance Reports'], permissions: ['reports.attendance.view_own', 'attendance.view_own'] },
]

const ATTENDANCE_TARGETS = new Set(['Check In / Out', 'Attendance History', 'Admin Attendance Reports', 'My Attendance Reports'])

const permissionMgmtSubItems = [
  { label: 'Attendance Requests', target: 'Permission Requests', activeTargets: ['Permission Requests'], permissions: ['requests.view_all', 'requests.view_own', 'requests.create', 'requests.approve'] },
  { label: 'Permission Types', target: 'Permission Types', activeTargets: ['Permission Types'], permissions: ['settings.manage'] },
]

const PERMISSION_MGMT_TARGETS = new Set(['Permission Requests', 'Permission Types'])

const rolePermissionSubItems = [
  { label: 'Set Permissions', target: 'Roles & Permissions', activeTargets: ['Roles & Permissions', 'Users & Roles'], permissions: ['roles.manage', 'permissions.manage'] },
  { label: 'Roles', target: 'Roles', activeTargets: ['Roles'], permissions: ['roles.manage'] },
  { label: 'Permissions', target: 'Permissions', activeTargets: ['Permissions'], permissions: ['permissions.manage'] },
  { label: 'IP Access', target: 'IP Access', activeTargets: ['IP Access'], permissions: ['roles.manage'] },
]

const ROLE_PERMISSION_TARGETS = new Set(['Roles & Permissions', 'Users & Roles', 'Roles', 'Permissions', 'IP Access'])
const ACTIVE_PAGE_KEY = 'attendance_active_page'
const LANGUAGE_KEY = 'attendance_language'
const SUPPORTED_LANGUAGES = new Set(['en', 'km'])

const translations = {
  km: {
    '#': 'ល.រ',
    'Absent': 'អវត្តមាន',
    'Action': 'សកម្មភាព',
    'Actions': 'សកម្មភាព',
    'Active': 'សកម្ម',
    'Active Staff': 'បុគ្គលិកសកម្ម',
    'Add': 'បន្ថែម',
    'Add Employee': 'បន្ថែមបុគ្គលិក',
    'Add Report': 'បន្ថែមរបាយការណ៍',
    'Admin Attendance Reports': 'របាយការណ៍វត្តមានក្រុម',
    'Admin Dashboard': 'ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង',
    'Admin Notes': 'កំណត់ចំណាំរដ្ឋបាល',
    'All': 'ទាំងអស់',
    'All Attendance Reports': 'របាយការណ៍វត្តមានទាំងអស់',
    'All users': 'អ្នកប្រើប្រាស់ទាំងអស់',
    'Apply': 'អនុវត្ត',
    'Approve': 'អនុម័ត',
    'Approve / Reject': 'អនុម័ត / បដិសេធ',
    'Approved': 'បានអនុម័ត',
    'Attendance': 'វត្តមាន',
    'Attendance Dashboard': 'ផ្ទាំងគ្រប់គ្រងវត្តមាន',
    'Attendance History': 'ប្រវត្តិវត្តមាន',
    'Attendance Records': 'កំណត់ត្រាវត្តមាន',
    'Attendance Requests': 'សំណើវត្តមាន',
    'Back': 'ត្រឡប់ក្រោយ',
    'Branches': 'សាខា',
    'Cancel': 'បោះបង់',
    'Check In': 'ចូលធ្វើការ',
    'Check In / Out': 'ចូល / ចេញ',
    'Check Out': 'ចេញពីធ្វើការ',
    'Close': 'បិទ',
    'Code': 'លេខកូដ',
    'Completed': 'បានបញ្ចប់',
    'Content': 'មាតិកា',
    'Create': 'បង្កើត',
    'Customer Visits': 'ការចុះជួបអតិថិជន',
    'Daily': 'ប្រចាំថ្ងៃ',
    'Daily Reports': 'របាយការណ៍ប្រចាំថ្ងៃ',
    'Dashboard': 'ផ្ទាំងគ្រប់គ្រង',
    'Date': 'កាលបរិច្ឆេទ',
    'Day Off': 'ឈប់សម្រាក',
    'Delete': 'លុប',
    'Departments': 'ផ្នែក',
    'Duration': 'រយៈពេល',
    'Edit': 'កែប្រែ',
    'Email': 'អ៊ីមែល',
    'Employee Dashboard': 'ផ្ទាំងបុគ្គលិក',
    'Employee ID': 'លេខសម្គាល់បុគ្គលិក',
    'Employee Monthly Report': 'របាយការណ៍បុគ្គលិកប្រចាំខែ',
    'Employee Panel': 'ផ្ទាំងបុគ្គលិក',
    'Employee self-service dashboard': 'ផ្ទាំងសេវាកម្មខ្លួនឯងរបស់បុគ្គលិក',
    'Employee': 'បុគ្គលិក',
    'Employees': 'បុគ្គលិក',
    'End Date': 'ថ្ងៃបញ្ចប់',
    'End Time': 'ម៉ោងបញ្ចប់',
    'English': 'English',
    'Export': 'នាំចេញ',
    'Filter': 'ចម្រោះ',
    'Full Day': 'ពេញមួយថ្ងៃ',
    'Half Day': 'កន្លះថ្ងៃ',
    'Help & Support': 'ជំនួយ',
    'Hotel Report': 'របាយការណ៍សណ្ឋាគារ',
    'IP Access': 'ការចូលប្រើ IP',
    'Inactive': 'អសកម្ម',
    'Khmer': 'ខ្មែរ',
    'Late': 'យឺត',
    'Late Check In': 'ចូលយឺត',
    'Logout': 'ចាកចេញ',
    'Manage Notifications': 'គ្រប់គ្រងការជូនដំណឹង',
    'Mark read': 'សម្គាល់ថាបានអាន',
    'Meal Report': 'របាយការណ៍អាហារ',
    'Message': 'សារ',
    'Mine': 'របស់ខ្ញុំ',
    'Missing Check In': 'ភ្លេចចូល',
    'Missing Check Out': 'ភ្លេចចេញ',
    'Monthly': 'ប្រចាំខែ',
    'Monthly Report': 'របាយការណ៍ប្រចាំខែ',
    'My Attendance Report': 'របាយការណ៍វត្តមានខ្ញុំ',
    'My Attendance Reports': 'របាយការណ៍វត្តមានខ្ញុំ',
    'My Reports': 'របាយការណ៍ខ្ញុំ',
    'Name': 'ឈ្មោះ',
    'New Request': 'សំណើថ្មី',
    'No notifications found.': 'រកមិនឃើញការជូនដំណឹង។',
    'No records found.': 'រកមិនឃើញកំណត់ត្រា។',
    'Note': 'កំណត់ចំណាំ',
    'Notifications': 'ការជូនដំណឹង',
    'Open': 'កំពុងបើក',
    'Outdoor Check In': 'ចូលធ្វើការក្រៅ',
    'Outdoor Check Out': 'ចេញពីការងារក្រៅ',
    'Outdoor Sales': 'ផ្នែកលក់ក្រៅ',
    'Outdoor Sales Tracking': 'តាមដានផ្នែកលក់ក្រៅ',
    'Password': 'ពាក្យសម្ងាត់',
    'Payroll History': 'ប្រវត្តិបើកប្រាក់ខែ',
    'Pending': 'កំពុងរង់ចាំ',
    'Pending Approval': 'រង់ចាំការអនុម័ត',
    'Permission Management': 'គ្រប់គ្រងសំណើ',
    'Permission Requests': 'សំណើសុំអនុញ្ញាត',
    'Permission Types': 'ប្រភេទសំណើ',
    'Permissions': 'សិទ្ធិ',
    'Personal Leave': 'ច្បាប់ផ្ទាល់ខ្លួន',
    'Place Visit Report': 'របាយការណ៍ចុះទីតាំង',
    'Positions': 'តួនាទី',
    'Present': 'មានវត្តមាន',
    'Print': 'បោះពុម្ព',
    'Profile': 'ប្រវត្តិរូប',
    'Reason': 'មូលហេតុ',
    'Recipient': 'អ្នកទទួល',
    'Refresh': 'ផ្ទុកឡើងវិញ',
    'Reject': 'បដិសេធ',
    'Rejected': 'បានបដិសេធ',
    'Replacement Employee': 'បុគ្គលិកជំនួស',
    'Report Date': 'កាលបរិច្ឆេទរបាយការណ៍',
    'Reports': 'របាយការណ៍',
    'Request Date': 'កាលបរិច្ឆេទសំណើ',
    'Request Type': 'ប្រភេទសំណើ',
    'Return Date': 'ថ្ងៃត្រឡប់មកវិញ',
    'Roles': 'តួនាទីប្រើប្រាស់',
    'Roles & Permissions': 'តួនាទី និងសិទ្ធិ',
    'Route Map': 'ផែនទីផ្លូវ',
    'Save': 'រក្សាទុក',
    'Search': 'ស្វែងរក',
    'Search requests...': 'ស្វែងរកសំណើ...',
    'Security': 'សុវត្ថិភាព',
    'Select': 'ជ្រើសរើស',
    'Send Notification': 'ផ្ញើការជូនដំណឹង',
    'Send Website Notification': 'ផ្ញើការជូនដំណឹងគេហទំព័រ',
    'Set Permissions': 'កំណត់សិទ្ធិ',
    'Settings': 'ការកំណត់',
    'Status': 'ស្ថានភាព',
    'Submit': 'ដាក់ស្នើ',
    'Submit Request': 'ដាក់ស្នើសំណើ',
    'Submit Report': 'ដាក់ស្នើរបាយការណ៍',
    'Switch to dark mode': 'ប្តូរទៅរបៀបងងឹត',
    'Switch to light mode': 'ប្តូរទៅរបៀបភ្លឺ',
    'Team Attendance Report': 'របាយការណ៍វត្តមានក្រុម',
    'Title': 'ចំណងជើង',
    "Today's Summary": 'សង្ខេបថ្ងៃនេះ',
    'Toggle sidebar': 'បិទ/បើកម៉ឺនុយ',
    'Total Employees': 'បុគ្គលិកសរុប',
    'Total Requests': 'សំណើសរុប',
    'Total Visits': 'ចំនួនចុះជួបសរុប',
    'Type': 'ប្រភេទ',
    'Unread': 'មិនទាន់អាន',
    'Update': 'កែប្រែ',
    'View': 'មើល',
    'View All': 'មើលទាំងអស់',
    'View All Requests': 'មើលសំណើទាំងអស់',
    'View Notifications': 'មើលការជូនដំណឹង',
    'View Own Requests': 'មើលសំណើផ្ទាល់ខ្លួន',
    'Visit': 'ការចុះជួប',
    'Weekly': 'ប្រចាំសប្តាហ៍',
    'Users & Roles': 'អ្នកប្រើប្រាស់ និងតួនាទី',
    'Website Branding': 'ម៉ាកសញ្ញាគេហទំព័រ',
    'Write notification message...': 'សរសេរសារជូនដំណឹង...',
    'Working Minutes': 'នាទីធ្វើការ',
  },
}

Object.assign(translations.km, {
  '0 employees': 'បុគ្គលិក 0 នាក់',
  'employees': 'បុគ្គលិក',
  'employee': 'បុគ្គលិក',
  'of total': 'នៃសរុប',
  'Today': 'ថ្ងៃនេះ',
  'Present Today': 'មានវត្តមានថ្ងៃនេះ',
  'Late Today': 'យឺតថ្ងៃនេះ',
  'Absent Today': 'អវត្តមានថ្ងៃនេះ',
  'On Leave': 'កំពុងសម្រាក',
  'Leave': 'សម្រាក',
  'Missing Out': 'ភ្លេចចេញ',
  'Today\'s Attendance': 'វត្តមានថ្ងៃនេះ',
  'Today\'s Overview': 'ទិដ្ឋភាពថ្ងៃនេះ',
  'Today\'s Status': 'ស្ថានភាពថ្ងៃនេះ',
  'Today\'s Visits': 'ការចុះជួបថ្ងៃនេះ',
  'Attendance Control': 'គ្រប់គ្រងវត្តមាន',
  'Inside Office Radius': 'នៅក្នុងរង្វង់ការិយាល័យ',
  'GPS Verified': 'បានផ្ទៀងផ្ទាត់ GPS',
  'from office': 'ពីការិយាល័យ',
  'Current Location': 'ទីតាំងបច្ចុប្បន្ន',
  'Current Time': 'ម៉ោងបច្ចុប្បន្ន',
  'Current Status': 'ស្ថានភាពបច្ចុប្បន្ន',
  'Working Hours': 'ម៉ោងធ្វើការ',
  'Working Hours Summary': 'សង្ខេបម៉ោងធ្វើការ',
  'Work Hours': 'ម៉ោងធ្វើការ',
  'Work': 'ការងារ',
  'Work Status': 'ស្ថានភាពការងារ',
  'Ready': 'រួចរាល់',
  'Locked': 'បានចាក់សោ',
  'Done': 'រួចរាល់',
  'Not Checked In': 'មិនទាន់ចូលធ្វើការ',
  'No Check In': 'មិនមានការចូលធ្វើការ',
  'Checked in at': 'បានចូលធ្វើការនៅម៉ោង',
  'No attendance yet': 'មិនទាន់មានវត្តមាន',
  'Since': 'ចាប់តាំងពី',
  'This Month': 'ខែនេះ',
  'Present Days': 'ថ្ងៃមានវត្តមាន',
  'Days': 'ថ្ងៃ',
  'Live': 'ផ្ទាល់',
  'Live now': 'កំពុងផ្ទាល់',
  'Live GPS Route': 'ផ្លូវ GPS ផ្ទាល់',
  'Live Location': 'ទីតាំងផ្ទាល់',
  'Live Location Tracking': 'តាមដានទីតាំងផ្ទាល់',
  'Home': 'ទំព័រដើម',
  'Requests': 'សំណើ',
  'My Requests': 'សំណើរបស់ខ្ញុំ',
  'Leave Requests': 'សំណើសុំច្បាប់',
  'Approved Requests': 'សំណើបានអនុម័ត',
  'Total Request Days': 'ចំនួនថ្ងៃសំណើសរុប',
  'Leave & Requests Summary': 'សង្ខេបច្បាប់ និងសំណើ',
  'Early Check Out': 'ចេញមុនម៉ោង',
  'Early Leave': 'សុំចេញមុន',
  'Late Check In Minutes': 'នាទីចូលយឺត',
  'Total Late Check In': 'ចូលយឺតសរុប',
  'Total Missing Check In': 'ភ្លេចចូលសរុប',
  'Check In Time': 'ម៉ោងចូល',
  'Check Out Time': 'ម៉ោងចេញ',
  'Check In Location': 'ទីតាំងចូល',
  'Check Out Location': 'ទីតាំងចេញ',
  'Submit Check In': 'ដាក់ស្នើចូលធ្វើការ',
  'Submit Check Out': 'ដាក់ស្នើចេញពីធ្វើការ',
  'Hotel Check In': 'ចូលសណ្ឋាគារ',
  'Hotel Check Out': 'ចេញពីសណ្ឋាគារ',
  'Check-In Hotel': 'ចូលសណ្ឋាគារ',
  'Check-Out Hotel': 'ចេញពីសណ្ឋាគារ',
  'Check in to your hotel': 'ចូលស្នាក់នៅសណ្ឋាគាររបស់អ្នក',
  'Check out from hotel': 'ចេញពីសណ្ឋាគារ',
  'Submit request for approval?': 'ដាក់សំណើសម្រាប់អនុម័ត?',
  'Save request changes?': 'រក្សាទុកការកែប្រែសំណើ?',
  'The updated request details will be saved.': 'ព័ត៌មានសំណើដែលបានកែប្រែនឹងត្រូវបានរក្សាទុក។',
  'will be submitted to HR for review.': 'នឹងត្រូវបានដាក់ស្នើទៅ HR ដើម្បីពិនិត្យ។',
  'Confirm': 'បញ្ជាក់',
  'Confirm approval?': 'បញ្ជាក់ការអនុម័ត?',
  'Confirm rejection?': 'បញ្ជាក់ការបដិសេធ?',
  'Are you sure you want to': 'តើអ្នកប្រាកដថាចង់',
  'approve': 'អនុម័ត',
  'reject': 'បដិសេធ',
  'this': 'សំណើ',
  'request for': 'របស់',
  'HR Reason': 'មូលហេតុ HR',
  'Enter the approval note for this request...': 'បញ្ចូលកំណត់ចំណាំអនុម័តសម្រាប់សំណើនេះ...',
  'Enter the rejection reason for this request...': 'បញ្ចូលមូលហេតុបដិសេធសម្រាប់សំណើនេះ...',
  'Confirming...': 'កំពុងបញ្ជាក់...',
  'Saving...': 'កំពុងរក្សាទុក...',
  'Submitting...': 'កំពុងដាក់ស្នើ...',
  'Loading...': 'កំពុងផ្ទុក...',
  'Loading all employees…': 'កំពុងផ្ទុកបុគ្គលិកទាំងអស់...',
  'Saving…': 'កំពុងរក្សាទុក...',
  'Submitting…': 'កំពុងដាក់ស្នើ...',
  'Exporting…': 'កំពុងនាំចេញ...',
  'Save Changes': 'រក្សាទុកការកែប្រែ',
  'Save Late Rules': 'រក្សាទុកច្បាប់ចូលយឺត',
  'Add Rule': 'បន្ថែមច្បាប់',
  'Add Type': 'បន្ថែមប្រភេទ',
  'Add User': 'បន្ថែមអ្នកប្រើ',
  'Import Employees': 'នាំចូលបុគ្គលិក',
  'Photo Profiles': 'ប្រវត្តិរូបមានរូបថត',
  'Currently active employees': 'បុគ្គលិកសកម្មបច្ចុប្បន្ន',
  'Employee Directory': 'បញ្ជីបុគ្គលិក',
  'Search employees': 'ស្វែងរកបុគ្គលិក',
  'Search by name, email, code...': 'ស្វែងរកតាមឈ្មោះ អ៊ីមែល ឬលេខកូដ...',
  'All Departments': 'ផ្នែកទាំងអស់',
  'All Status': 'ស្ថានភាពទាំងអស់',
  'All Branches': 'សាខាទាំងអស់',
  'Attendance Type': 'ប្រភេទវត្តមាន',
  'Phone': 'ទូរស័ព្ទ',
  'Address': 'អាសយដ្ឋាន',
  'No login account': 'មិនមានគណនីចូលប្រើ',
  'Delete Employee': 'លុបបុគ្គលិក',
  'No employees match these filters.': 'មិនមានបុគ្គលិកត្រូវនឹងតម្រងទាំងនេះ។',
  'Showing': 'បង្ហាញ',
  'to': 'ដល់',
  'of': 'នៃ',
  'entries': 'កំណត់ត្រា',
  'total': 'សរុប',
  'No records': 'មិនមានកំណត់ត្រា',
  'Adjust filters or date range.': 'កែតម្រូវតម្រង ឬជួរកាលបរិច្ឆេទ។',
  'No records found': 'រកមិនឃើញកំណត់ត្រា',
  'No data': 'មិនមានទិន្នន័យ',
  'No photo available.': 'មិនមានរូបថត។',
  'No employees found for this month.': 'រកមិនឃើញបុគ្គលិកសម្រាប់ខែនេះ។',
  'No employees match this work status.': 'មិនមានបុគ្គលិកត្រូវនឹងស្ថានភាពការងារនេះ។',
  'Department Summary': 'សង្ខេបតាមផ្នែក',
  'Present / Total': 'មានវត្តមាន / សរុប',
  'Total Records': 'កំណត់ត្រាសរុប',
  'Present Employees': 'បុគ្គលិកមានវត្តមាន',
  'Absent Employees': 'បុគ្គលិកអវត្តមាន',
  'Total Working Hours': 'ម៉ោងធ្វើការសរុប',
  'In selected period': 'ក្នុងរយៈពេលដែលបានជ្រើស',
  'records': 'កំណត់ត្រា',
  'Export Excel': 'នាំចេញ Excel',
  'Export PDF': 'នាំចេញ PDF',
  'Date From': 'ចាប់ពីថ្ងៃ',
  'Date To': 'ដល់ថ្ងៃ',
  'GPS Status': 'ស្ថានភាព GPS',
  'On Time': 'ទាន់ម៉ោង',
  'Photo': 'រូបថត',
  'Schedule': 'កាលវិភាគ',
  'Break Out': 'ចេញសម្រាក',
  'Break In': 'ចូលពីសម្រាក',
  'Deduction': 'ការកាត់ប្រាក់',
  'Overtime': 'ម៉ោងបន្ថែម',
  'Note:': 'កំណត់ចំណាំ៖',
  'Working hours is calculated based on Check In and Check Out.': 'ម៉ោងធ្វើការត្រូវបានគណនាផ្អែកលើម៉ោងចូល និងម៉ោងចេញ។',
  'Choose report language': 'ជ្រើសរើសភាសារបាយការណ៍',
  'Select the language for the printed monthly report.': 'ជ្រើសរើសភាសាសម្រាប់របាយការណ៍ប្រចាំខែដែលត្រូវបោះពុម្ព។',
  'Khmer Report': 'របាយការណ៍ខ្មែរ',
  'English Report': 'របាយការណ៍អង់គ្លេស',
  'Use English labels for the report': 'ប្រើស្លាកជាភាសាអង់គ្លេសសម្រាប់របាយការណ៍',
  'Select the language for the payroll print or Excel report.': 'ជ្រើសរើសភាសាសម្រាប់បោះពុម្ព ឬនាំចេញ Excel ប្រាក់ខែ។',
  'Payroll': 'ប្រាក់ខែ',
  'Paid': 'បានបង់',
  'Unpaid': 'មិនទាន់បង់',
  'Payment Status': 'ស្ថានភាពបង់ប្រាក់',
  'Amount': 'ចំនួនទឹកប្រាក់',
  'Bonus': 'ប្រាក់រង្វាន់',
  'Bonus Rules': 'ច្បាប់ប្រាក់រង្វាន់',
  'Pending Bonus Approvals': 'ប្រាក់រង្វាន់រង់ចាំអនុម័ត',
  'No pending bonuses.': 'មិនមានប្រាក់រង្វាន់រង់ចាំ។',
  'No bonus rules yet.': 'មិនទាន់មានច្បាប់ប្រាក់រង្វាន់។',
  'Late Rules': 'ច្បាប់ចូលយឺត',
  'Late Rule Settings': 'ការកំណត់ច្បាប់ចូលយឺត',
  'Automation Settings': 'ការកំណត់ស្វ័យប្រវត្តិ',
  'No rules yet. Click Add Rule.': 'មិនទាន់មានច្បាប់។ ចុចបន្ថែមច្បាប់។',
  'No schedules available.': 'មិនមានកាលវិភាគ។',
  'No Deduction': 'មិនកាត់ប្រាក់',
  'Include in Payroll': 'បញ្ចូលក្នុងប្រាក់ខែ',
  'Export deductions to payroll reports.': 'នាំចេញការកាត់ប្រាក់ទៅរបាយការណ៍ប្រាក់ខែ។',
  'Notify Employee': 'ជូនដំណឹងបុគ្គលិក',
  'Notify employee when late is recorded.': 'ជូនដំណឹងបុគ្គលិកពេលមានការចូលយឺត។',
  'Work Start Time': 'ម៉ោងចាប់ផ្តើមការងារ',
  'Grace Period': 'រយៈពេលអនុគ្រោះ',
  'Employees Late Today': 'បុគ្គលិកយឺតថ្ងៃនេះ',
  'Employee Check In': 'បុគ្គលិកចូលធ្វើការ',
  'Late Minutes Range': 'ចន្លោះនាទីយឺត',
  'Deduction Type': 'ប្រភេទកាត់ប្រាក់',
  'Deduction Amount': 'ចំនួនកាត់ប្រាក់',
  'Check In Settings': 'ការកំណត់ចូលធ្វើការ',
  'GPS Verification': 'ការផ្ទៀងផ្ទាត់ GPS',
  'Require employees to be within radius to check in.': 'តម្រូវឱ្យបុគ្គលិកនៅក្នុងរង្វង់ដើម្បីចូលធ្វើការ។',
  'Allow Early Check In': 'អនុញ្ញាតឱ្យចូលមុនម៉ោង',
  'Let employees check in before work start time.': 'អនុញ្ញាតឱ្យបុគ្គលិកចូលមុនម៉ោងចាប់ផ្តើមការងារ។',
  'Earliest Check In Time': 'ម៉ោងចូលមុនបំផុត',
  'Allow Outdoor Check In': 'អនុញ្ញាតចូលធ្វើការក្រៅ',
  'Let field staff check in from outside the office radius.': 'អនុញ្ញាតឱ្យបុគ្គលិកក្រៅចូលពីក្រៅរង្វង់ការិយាល័យ។',
  'Auto Detect Missing Check Out': 'រកឃើញការភ្លេចចេញដោយស្វ័យប្រវត្តិ',
  'Flag employees who forgot to check out at end of day.': 'សម្គាល់បុគ្គលិកដែលភ្លេចចេញនៅចុងថ្ងៃ។',
  'Check In Reminder': 'រំលឹកចូលធ្វើការ',
  'Check Out Reminder': 'រំលឹកចេញពីធ្វើការ',
  'Website Settings': 'ការកំណត់គេហទំព័រ',
  'General Settings': 'ការកំណត់ទូទៅ',
  'Company Name': 'ឈ្មោះក្រុមហ៊ុន',
  'Site Title': 'ចំណងជើងគេហទំព័រ',
  'Language': 'ភាសា',
  'Theme': 'រូបរាង',
  'Light': 'ភ្លឺ',
  'Dark': 'ងងឹត',
  'Thai': 'ថៃ',
  'Province': 'ខេត្ត',
  'Select province': 'ជ្រើសរើសខេត្ត',
  'Phone number is required.': 'ត្រូវការលេខទូរស័ព្ទ។',
  'Live location is required.': 'ត្រូវការទីតាំងផ្ទាល់។',
  'Getting Address…': 'កំពុងយកអាសយដ្ឋាន...',
  'Getting GPS…': 'កំពុងយក GPS...',
  'Retry GPS Location': 'ព្យាយាមយកទីតាំង GPS ម្តងទៀត',
  'Get Current Location': 'យកទីតាំងបច្ចុប្បន្ន',
  'Getting location...': 'កំពុងយកទីតាំង...',
  'Location required': 'ត្រូវការទីតាំង',
  'Location': 'ទីតាំង',
  'Map Record': 'កំណត់ត្រាផែនទី',
  'Start Place': 'ទីតាំងចាប់ផ្តើម',
  'End / Live Location': 'ទីតាំងបញ្ចប់ / ផ្ទាល់',
  'Total Duration': 'រយៈពេលសរុប',
  'Saved visit time': 'ពេលវេលាចុះជួបដែលបានរក្សាទុក',
  'No place visits found.': 'រកមិនឃើញការចុះទីតាំង។',
  'No meal records found.': 'រកមិនឃើញកំណត់ត្រាអាហារ។',
  'No hotel stays found.': 'រកមិនឃើញការស្នាក់សណ្ឋាគារ។',
  'Meal': 'អាហារ',
  'Breakfast': 'អាហារពេលព្រឹក',
  'Lunch': 'អាហារថ្ងៃត្រង់',
  'Dinner': 'អាហារពេលល្ងាច',
  'Select Meal Type': 'ជ្រើសរើសប្រភេទអាហារ',
  'Recorded': 'បានកត់ត្រា',
  'Store Photo': 'រូបថតហាង',
  'Selfie Photo': 'រូបថតសែលហ្វី',
  'Take a selfie with the customer': 'ថតសែលហ្វីជាមួយអតិថិជន',
  'Take a photo of the store': 'ថតរូបហាង',
  'Front camera': 'កាមេរ៉ាមុខ',
  'Rear camera': 'កាមេរ៉ាក្រោយ',
  'Choose Photo': 'ជ្រើសរើសរូបថត',
  'Position your face in the frame': 'ដាក់មុខរបស់អ្នកក្នុងស៊ុម',
  'Add to Home Screen': 'បន្ថែមទៅអេក្រង់ដើម',
  'Requests Overview': 'ទិដ្ឋភាពសំណើ',
  'Manage and track all employee requests in one place.': 'គ្រប់គ្រង និងតាមដានសំណើបុគ្គលិកទាំងអស់នៅកន្លែងតែមួយ។',
  'All Requests': 'សំណើទាំងអស់',
  'Pending Requests': 'សំណើរង់ចាំ',
  'Approved Requests': 'សំណើបានអនុម័ត',
  'Rejected Requests': 'សំណើបានបដិសេធ',
  'All Types': 'ប្រភេទទាំងអស់',
  'Date Range': 'ចន្លោះកាលបរិច្ឆេទ',
  'Apply Filter': 'អនុវត្តតម្រង',
  'Reset': 'កំណត់ឡើងវិញ',
  'Request': 'សំណើ',
  'Duration / Date': 'រយៈពេល / កាលបរិច្ឆេទ',
  'Requested On': 'បានស្នើនៅ',
  'No requests found.': 'រកមិនឃើញសំណើ។',
  'Loading…': 'កំពុងផ្ទុក...',
  'Request Details': 'ព័ត៌មានលម្អិតសំណើ',
  'Requested on': 'បានស្នើនៅ',
  'Date & Duration': 'កាលបរិច្ឆេទ និងរយៈពេល',
  'From': 'ចាប់ពី',
  'To': 'ដល់',
  'Approval Flow': 'ដំណើរការអនុម័ត',
  'Manager Approval': 'ការអនុម័តពីអ្នកគ្រប់គ្រង',
  'HR Approval': 'ការអនុម័តពី HR',
  'Edit Request': 'កែសំណើ',
  'Cancel Request': 'បោះបង់សំណើ',
  'Request updated.': 'បានកែប្រែសំណើ។',
  'Request cancelled.': 'បានបោះបង់សំណើ។',
  'request submitted successfully.': 'បានដាក់សំណើដោយជោគជ័យ។',
  'Please select the requested attendance time.': 'សូមជ្រើសរើសម៉ោងវត្តមានដែលស្នើ។',
  'Please select a date.': 'សូមជ្រើសរើសកាលបរិច្ឆេទ។',
  'Please select the requested check-in time.': 'សូមជ្រើសរើសម៉ោងចូលដែលបានស្នើ។',
  'Please select the requested check-out time.': 'សូមជ្រើសរើសម៉ោងចេញដែលបានស្នើ។',
  'Please select the time the employee will go to work.': 'សូមជ្រើសរើសម៉ោងដែលបុគ្គលិកនឹងទៅធ្វើការ។',
  'Please select the leave start date.': 'សូមជ្រើសរើសថ្ងៃចាប់ផ្តើមច្បាប់។',
  'Please select the expected return date.': 'សូមជ្រើសរើសថ្ងៃត្រឡប់មកវិញដែលរំពឹងទុក។',
  'Please select the start time.': 'សូមជ្រើសរើសម៉ោងចាប់ផ្តើម។',
  'Please select the end time.': 'សូមជ្រើសរើសម៉ោងបញ្ចប់។',
  'Please select a valid start time and end time.': 'សូមជ្រើសរើសម៉ោងចាប់ផ្តើម និងម៉ោងបញ្ចប់ឱ្យបានត្រឹមត្រូវ។',
  'Please select the departure time for the half-day request.': 'សូមជ្រើសរើសម៉ោងចាកចេញសម្រាប់សំណើកន្លះថ្ងៃ។',
  'Please select an expected return date after the final leave date.': 'សូមជ្រើសរើសថ្ងៃរំពឹងត្រឡប់ក្រោយថ្ងៃបញ្ចប់ច្បាប់។',
  'Please select the leave end date.': 'សូមជ្រើសរើសថ្ងៃបញ្ចប់ច្បាប់។',
  'Please fill request type, reason, and date.': 'សូមបំពេញប្រភេទសំណើ មូលហេតុ និងកាលបរិច្ឆេទ។',
  'Please complete all required fields.': 'សូមបំពេញព័ត៌មានដែលត្រូវការទាំងអស់។',
  'Salary deduction required': 'ត្រូវកាត់ប្រាក់ខែ',
  'This request is over the free allowance.': 'សំណើនេះលើសចំនួនអនុញ្ញាតឥតគិតថ្លៃ។',
  'will be deducted from the employee salary if HR approves it.': 'នឹងត្រូវកាត់ពីប្រាក់ខែបុគ្គលិក ប្រសិនបើ HR អនុម័ត។',
  'allowance has already been used for this': 'ចំនួនអនុញ្ញាតត្រូវបានប្រើរួចសម្រាប់',
  'must use': 'ត្រូវប្រើ',
  'duration.': 'រយៈពេល។',
  'cannot be more than': 'មិនអាចលើសពី',
  'hour(s).': 'ម៉ោង។',
  'Request approved.': 'បានអនុម័តសំណើ។',
  'Request rejected.': 'បានបដិសេធសំណើ។',
  'Request pending.': 'សំណើកំពុងរង់ចាំ។',
  'Please enter the reason why HR approves this request.': 'សូមបញ្ចូលមូលហេតុដែល HR អនុម័តសំណើនេះ។',
  'Please enter the reason why HR rejects this request.': 'សូមបញ្ចូលមូលហេតុដែល HR បដិសេធសំណើនេះ។',
  'Cancel request': 'បោះបង់សំណើ',
  'Request is allowed': 'សំណើត្រូវបានអនុញ្ញាត',
  'Request is declined': 'សំណើត្រូវបានបដិសេធ',
  'Sick / health reason': 'មូលហេតុឈឺ / សុខភាព',
  'Family reason': 'មូលហេតុគ្រួសារ',
  'Personal reason': 'មូលហេតុផ្ទាល់ខ្លួន',
  'Emergency': 'បន្ទាន់',
  'Other': 'ផ្សេងៗ',
  'Single Day': 'មួយថ្ងៃ',
  'Multiple Day': 'ច្រើនថ្ងៃ',
  'Hours': 'ម៉ោង',
  'Any Duration': 'រយៈពេលណាមួយ',
  'Request Duration': 'រយៈពេលសំណើ',
  'Departure Time': 'ម៉ោងចាកចេញ',
  'Go To Work Time': 'ម៉ោងទៅធ្វើការ',
  'Go To Work Time *': 'ម៉ោងទៅធ្វើការ *',
  'go to work': 'ទៅធ្វើការ',
  'Leave Start Date': 'ថ្ងៃចាប់ផ្តើមច្បាប់',
  'Leave End Date': 'ថ្ងៃបញ្ចប់ច្បាប់',
  'Expected Return Date': 'ថ្ងៃរំពឹងត្រឡប់មកវិញ',
  'Requested Check-In': 'ម៉ោងចូលដែលស្នើ',
  'Requested Check-Out': 'ម៉ោងចេញដែលស្នើ',
  'Requested Check-In Time': 'ម៉ោងចូលដែលស្នើ',
  'Requested Check-Out Time': 'ម៉ោងចេញដែលស្នើ',
  'Requested Check-In Time *': 'ម៉ោងចូលដែលស្នើ *',
  'Requested Check-Out Time *': 'ម៉ោងចេញដែលស្នើ *',
  'Start Time': 'ម៉ោងចាប់ផ្តើម',
  'Time': 'ម៉ោង',
  'Total Hours': 'ម៉ោងសរុប',
  'Total Days': 'ថ្ងៃសរុប',
  'Hour(s)': 'ម៉ោង',
  'Day(s)': 'ថ្ងៃ',
  'Date only': 'តែកាលបរិច្ឆេទ',
  'Request Status': 'ស្ថានភាពសំណើ',
  'Write reason...': 'សរសេរមូលហេតុ...',
  'Attachment': 'ឯកសារភ្ជាប់',
  'Attachments (Optional)': 'ឯកសារភ្ជាប់ (ស្រេចចិត្ត)',
  'Request Summary': 'សង្ខេបសំណើ',
  'Allowance': 'ចំនួនអនុញ្ញាត',
  'remaining this': 'នៅសល់ក្នុង',
  'Allowance limit reached': 'ដល់កំណត់ចំនួនអនុញ្ញាត',
  'Deduction:': 'កាត់ប្រាក់៖',
  'allowance request(s) remaining for this': 'សំណើអនុញ្ញាតនៅសល់សម្រាប់',
  'The free allowance for this': 'ចំនួនអនុញ្ញាតឥតគិតថ្លៃសម្រាប់',
  'has been used. This request can still be submitted, but a deduction of': 'ត្រូវបានប្រើរួចហើយ។ សំណើនេះនៅតែអាចដាក់ស្នើបាន ប៉ុន្តែនឹងមានការកាត់ប្រាក់',
  'will apply.': 'នឹងត្រូវបានអនុវត្ត។',
  'The request limit for this': 'កំណត់សំណើសម្រាប់',
  'has been reached. HR must configure a deduction amount before additional requests can be submitted.': 'បានដល់កំណត់ហើយ។ HR ត្រូវកំណត់ចំនួនកាត់ប្រាក់ មុនពេលអាចដាក់សំណើបន្ថែម។',
  'No request types set up yet. Go to': 'មិនទាន់មានប្រភេទសំណើ។ សូមទៅកាន់',
  'Permission Management → Permission Types': 'គ្រប់គ្រងសំណើ → ប្រភេទសំណើ',
  'Select request type...': 'ជ្រើសរើសប្រភេទសំណើ...',
  'limit reached': 'ដល់កំណត់',
  'left': 'នៅសល់',
  'per day': 'ក្នុងមួយថ្ងៃ',
  'per month': 'ក្នុងមួយខែ',
  'per year': 'ក្នុងមួយឆ្នាំ',
  'per day limit reached': 'ដល់កំណត់ក្នុងមួយថ្ងៃ',
  'per month limit reached': 'ដល់កំណត់ក្នុងមួយខែ',
  'per year limit reached': 'ដល់កំណត់ក្នុងមួយឆ្នាំ',
  'year': 'ឆ្នាំ',
  'Per Year': 'ក្នុងមួយឆ្នាំ',
  'deduction': 'កាត់ប្រាក់',
  'max': 'អតិបរមា',
  'Request approval to check in after the scheduled start time.': 'ស្នើសុំអនុម័តចូលធ្វើការបន្ទាប់ពីម៉ោងចាប់ផ្តើមកាលវិភាគ។',
  'Request approval to check out before the scheduled end time.': 'ស្នើសុំអនុម័តចេញពីធ្វើការមុនម៉ោងបញ្ចប់កាលវិភាគ។',
  'Request approval for planned leave or time away from work.': 'ស្នើសុំអនុម័តសម្រាប់ការឈប់សម្រាកដែលបានគ្រោង ឬពេលវេលាឆ្ងាយពីការងារ។',
  'Request correction for a missing check-in record.': 'ស្នើសុំកែតម្រូវកំណត់ត្រាចូលធ្វើការដែលបាត់។',
  'Request correction for a missing check-out record.': 'ស្នើសុំកែតម្រូវកំណត់ត្រាចេញពីធ្វើការដែលបាត់។',
  'Request approval for a personal absence or personal time.': 'ស្នើសុំអនុម័តសម្រាប់ការអវត្តមានផ្ទាល់ខ្លួន ឬពេលវេលាផ្ទាល់ខ្លួន។',
  'Provide the reason for the late check-in request...': 'បញ្ចូលមូលហេតុសម្រាប់សំណើចូលយឺត...',
  'Provide the reason for the early check-out request...': 'បញ្ចូលមូលហេតុសម្រាប់សំណើចេញមុនម៉ោង...',
  'Provide the reason for the day-off request...': 'បញ្ចូលមូលហេតុសម្រាប់សំណើឈប់សម្រាក...',
  'Explain why the check-in record is missing...': 'ពន្យល់មូលហេតុដែលកំណត់ត្រាចូលធ្វើការបាត់...',
  'Explain why the check-out record is missing...': 'ពន្យល់មូលហេតុដែលកំណត់ត្រាចេញពីធ្វើការបាត់...',
  'Provide the reason for the personal leave request...': 'បញ្ចូលមូលហេតុសម្រាប់សំណើច្បាប់ផ្ទាល់ខ្លួន...',
  'Late in': 'ចូលយឺត',
  'Early out': 'ចេញមុន',
  'Day off': 'ឈប់សម្រាក',
  'Missing in': 'ភ្លេចចូល',
  'Missing out': 'ភ្លេចចេញ',
  'Cover Person': 'អ្នកជំនួស',
  'No Cover': 'មិនមានអ្នកជំនួស',
  'Skip this if nobody needs to cover your work': 'រំលងចំណុចនេះ ប្រសិនបើមិនត្រូវការអ្នកជំនួសការងារ។',
  'Choose a cover person only if needed': 'ជ្រើសរើសអ្នកជំនួស ប្រសិនបើត្រូវការ',
  'Choose a cover person…': 'ជ្រើសរើសអ្នកជំនួស...',
  'Clear selection': 'សម្អាតជម្រើស',
  'Update request details and status.': 'កែប្រែព័ត៌មានលម្អិត និងស្ថានភាពសំណើ។',
  'Choose what you need, when you need it, then submit for approval.': 'ជ្រើសរើសអ្វីដែលអ្នកត្រូវការ និងពេលដែលត្រូវការ បន្ទាប់មកដាក់ស្នើសម្រាប់អនុម័ត។',
  'Close': 'បិទ',
})

function translate(language, label) {
  return translations[language]?.[label] || label
}

function translateText(language, text) {
  const dictionary = translations[language]
  if (!dictionary) return text

  const trimmed = String(text || '').trim()
  if (!trimmed) return text
  if (dictionary[trimmed]) return String(text).replace(trimmed, dictionary[trimmed])

  return Object.keys(dictionary)
    .sort((a, b) => b.length - a.length)
    .reduce((value, key) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const isPlainWords = /^[A-Za-z][A-Za-z\s-]*[A-Za-z]$/.test(key)
      const pattern = isPlainWords
        ? new RegExp(`(?<![A-Za-z])${escapedKey}(?![A-Za-z])`, 'g')
        : new RegExp(escapedKey, 'g')
      return value.replace(pattern, dictionary[key])
    }, String(text))
}

function normalizeLanguage(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'khmer' || normalized === 'ខ្មែរ' || normalized === 'km' || normalized === 'kh') return 'km'
  if (normalized === 'english' || normalized === 'en') return 'en'
  return 'en'
}

function sourceLabelForText(text) {
  const rawText = String(text || '')
  const normalized = rawText.trim()
  if (!normalized) return normalized

  for (const dictionary of Object.values(translations)) {
    const match = Object.entries(dictionary || {}).find(([, translated]) => translated === normalized)
    if (match) return rawText.replace(normalized, match[0])
  }

  return rawText
}

function applyNativeTranslations(language) {
  const dictionary = translations[language]

  document.documentElement.lang = language === 'km' ? 'km' : 'en'
  document.documentElement.classList.toggle('lang-km', language === 'km')

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT
      if (parent.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  nodes.forEach((node) => {
    if (!node.__originalText || node.nodeValue !== node.__translatedText) {
      node.__originalText = sourceLabelForText(node.nodeValue)
    }
    const original = node.__originalText
    const nextValue = translateText(language, original)
    node.__translatedText = nextValue
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue
  })

  document.querySelectorAll('input[placeholder], textarea[placeholder], [title], [aria-label]').forEach((element) => {
    ;['placeholder', 'title', 'aria-label'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return
      const key = `i18nOriginal${attribute.replace(/[^a-z]/gi, '')}`
      element.dataset[key] = sourceLabelForText(element.dataset[key] || element.getAttribute(attribute))
      const original = element.dataset[key]
      const nextValue = translateText(language, original)
      if (element.getAttribute(attribute) !== nextValue) element.setAttribute(attribute, nextValue)
    })
  })
}

function useNativeTranslations(language) {
  useEffect(() => {
    applyNativeTranslations(language)

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => applyNativeTranslations(language))
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])
}

function findTodayAttendance(rows = [], account) {
  const employeeId = account?.employee?.id ?? account?.employee_id
  const todayKey = localDateKey(new Date())

  return rows.find((row) => {
    const rowEmployeeId = row.employee_id ?? row.employee?.id
    const rowDate = (row.attendance_date || row.date || '').slice(0, 10) || localDateKey(new Date(row.check_in_at || row.created_at || ''))
    return String(rowEmployeeId || '') === String(employeeId || '') && rowDate === todayKey
  }) || null
}

function localDateKey(date) {
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const sidebarManageItems = [
  { label: 'Employees', target: 'Employees', icon: Users, permissions: ['employees.view'] },
  { label: 'Branches', target: 'Branches', icon: Building2, permissions: ['departments.manage'] },
  { label: 'Departments', target: 'Departments', icon: Building2, permissions: ['departments.view', 'departments.manage'] },
  { label: 'Positions', target: 'Positions', icon: BriefcaseBusiness, permissions: ['positions.view', 'positions.manage'] },
  { label: 'Outdoor Sales', target: 'Outdoor Sales', icon: MapPinned, permissions: ['sales.view', 'sales.manage'] },
  { label: 'Website Branding', target: 'Website Branding', icon: Image, permissions: ['settings.manage'] },
  { label: 'Roles & Permissions', target: 'Roles & Permissions', icon: Users, permissions: ['roles.manage', 'permissions.manage'] },
  { label: 'Settings', target: 'Settings', icon: SettingsIcon, permissions: ['settings.view', 'settings.security', 'settings.api', 'settings.manage', 'settings.schedules', 'roles.manage'] },
]

function GoogleMapsApp({ apiKey, initialBranding }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  })

  return <AppShell isLoaded={isLoaded} initialBranding={initialBranding} />
}

function AppShell({ isLoaded, initialBranding = {} }) {
  const [active, setActive] = useState(() => localStorage.getItem(ACTIVE_PAGE_KEY) || 'Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [permissionOpen, setPermissionOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [rolesOpen, setRolesOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('attendance_theme') === 'dark')
  const [language, setLanguage] = useState(() => normalizeLanguage(localStorage.getItem(LANGUAGE_KEY)))
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem('attendance_token')))
  const [attendanceAction, setAttendanceAction] = useState(null)
  const [pendingRequestType, setPendingRequestType] = useState(null)
  const [modal, setModal] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [payrollHistoryMonth, setPayrollHistoryMonth] = useState(null)
  const bootstrapRequestRef = useRef(null)
  const [data, setData] = useState({
    dashboard: null,
    todayAttendance: null,
    attendance: [],
    employees: [],
    visits: [],
    placeVisits: [],
    mealRecords: [],
    hotelStays: [],
    reports: [],
    notifications: [],
    appSettings: initialBranding,
    loading: false,
  })

  useNativeTranslations(language)

  const loadRealData = useCallback(async (account) => {
    setData((current) => ({ ...current, loading: true }))

    try {
      if (!bootstrapRequestRef.current) {
        bootstrapRequestRef.current = bootstrapService.load().finally(() => {
          bootstrapRequestRef.current = null
        })
      }

      const payload = await bootstrapRequestRef.current
      const liveToday = await attendanceService.today().catch(() => null)
      const attendanceRows = payload.attendance ?? []
      const todayAttendance = liveToday?.check_in_at
        ? liveToday
        : payload.todayAttendance?.check_in_at
        ? payload.todayAttendance
        : findTodayAttendance(attendanceRows, account)
      setData({
        dashboard: payload.dashboard ?? null,
        todayAttendance,
        attendance: attendanceRows,
        employees: payload.employees ?? [],
        visits: payload.visits ?? [],
        placeVisits: payload.placeVisits ?? [],
        mealRecords: payload.mealRecords ?? [],
        hotelStays: payload.hotelStays ?? [],
        reports: payload.reports ?? [],
        notifications: payload.notifications ?? [],
        appSettings: payload.appSettings ?? {},
        loading: false,
      })
    } catch (error) {
      setData((current) => ({ ...current, loading: false }))
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('attendance_token')) return

    let mounted = true

    authService
      .me()
      .then((account) => {
        if (!mounted) return
        setUser(account)
        loadRealData(account)
      })
      .catch(() => localStorage.removeItem('attendance_token'))
      .finally(() => {
        if (mounted) setAuthLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [loadRealData])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('attendance_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (user) {
      localStorage.setItem(ACTIVE_PAGE_KEY, active)
    }
  }, [active, user])

  useEffect(() => {
    applyDocumentBranding(data.appSettings || {})
  }, [data.appSettings?.company_icon_url, data.appSettings?.company_logo_url, data.appSettings?.company_name, data.appSettings?.site_title])

  useEffect(() => {
    if (!userMenuOpen && !languageMenuOpen) return

    const close = () => {
      setUserMenuOpen(false)
      setLanguageMenuOpen(false)
    }
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [languageMenuOpen, userMenuOpen])

  const handleLogin = (account) => {
    setUser(account)
    loadRealData(account)
  }

  const refreshUser = useCallback(async () => {
    const account = await authService.me()
    setUser(account)
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    localStorage.removeItem(ACTIVE_PAGE_KEY)
    setUser(null)
    setActive('Dashboard')
  }

  const toggleTheme = () => {
    setDark((value) => !value)
  }

  const changeLanguage = (nextLanguage) => {
    const normalizedLanguage = normalizeLanguage(nextLanguage)
    setLanguage(normalizedLanguage)
    localStorage.setItem(LANGUAGE_KEY, normalizedLanguage)
    setLanguageMenuOpen(false)
  }

  const openAttendanceAction = async (type) => {
    if (type === 'check-in') {
      try {
        const today = await attendanceService.today()
        setData((current) => ({ ...current, todayAttendance: today ?? null }))
        if (today?.check_in_at && !today?.check_out_at) {
          setAttendanceAction('check-out')
          return
        }
        if (today?.check_in_at && today?.check_out_at) {
          setAttendanceAction(null)
          return
        }
      } catch {
        // If refresh fails, keep the requested action and let the submit endpoint validate.
      }
    }

    setAttendanceAction(type)
  }

  const refreshTodayAttendance = useCallback(async () => {
    try {
      const today = await attendanceService.today()
      setData((current) => ({ ...current, todayAttendance: today?.check_in_at ? today : findTodayAttendance(current.attendance, user) }))
      return today?.check_in_at ? today : findTodayAttendance(data.attendance, user)
    } catch {
      const fallback = findTodayAttendance(data.attendance, user)
      if (fallback) setData((current) => ({ ...current, todayAttendance: fallback }))
      return fallback
    }
  }, [data.attendance, user])

  const openPermissionRequest = (type) => {
    setPendingRequestType(type)
    setActive('Permission Requests')
  }

  const openPayrollHistoryPage = (month) => {
    setPayrollHistoryMonth(month || null)
    setActive('Payroll History')
  }

  const props = {
    appData: data,
    isLoaded,
    refresh: () => loadRealData(user),
    user,
    onAttendanceAction: openAttendanceAction,
    openPermissionRequest,
    pendingRequestType,
    onClearPendingRequest: () => setPendingRequestType(null),
    setActive,
    openPayrollHistoryPage,
    setModal,
    setEditingEmployee,
    onLogout: handleLogout,
    onProfileUpdated: refreshUser,
    language,
    t: (label) => translate(language, label),
  }
  const filteredAttendanceSubItems = attendanceSubItems.filter((item) => canAccess(user, item.permissions))
  const isAttendanceExpanded = attendanceOpen || ATTENDANCE_TARGETS.has(active)
  const filteredPermissionMgmtSubItems = permissionMgmtSubItems.filter((item) => canAccess(user, item.permissions))
  const isPermissionExpanded = permissionOpen || PERMISSION_MGMT_TARGETS.has(active)
  const filteredReportSubItems = reportSubItems.filter((item) => canAccess(user, item.permissions))
  const isReportsExpanded = reportsOpen || REPORTS_TARGETS.has(active)
  const filteredRolePermissionSubItems = rolePermissionSubItems.filter((item) => canAccess(user, item.permissions))
  const isRolesExpanded = rolesOpen || ROLE_PERMISSION_TARGETS.has(active)
  const pages = {
    Dashboard: <DashboardPage {...props} />,
    'Check In / Out': <AttendancePage {...props} />,
    'Customer Visits': <CustomerVisitsPage user={user} appData={data} setModal={setModal} />,
    'Daily Reports': <ReportsPage {...props} />,
    'My Reports': <ReportsPage {...props} />,
    'Permission Requests': <PermissionRequestsPage {...props} />,
    'Route Map': <OutdoorSalesPage {...props} />,
    'Outdoor Check In': <AttendancePage {...props} />,
    'Outdoor Check Out': <AttendancePage {...props} />,
    Notifications: <NotificationsPage {...props} />,
    Profile: <ProfilePage {...props} />,
    'Website Branding': <BrandingPage {...props} />,
    Settings: <SecurityPage user={user} refresh={() => loadRealData(user)} />,
    'Help & Support': <SecurityPage user={user} refresh={() => loadRealData(user)} />,
    'Attendance History': <AttendanceHistoryPage {...props} viewMode="all" />,
    'Admin Attendance Reports': <AdminAttendanceReportsPage {...props} />,
    'My Attendance Reports': <MyAttendanceReportsPage {...props} />,
    'Employee Monthly Report': <EmployeeMonthlyReportPage {...props} />,
    'Monthly Report': <EmployeeMonthlyReportPage {...props} />,
    'Employee Dashboard': <EmployeeDashboardPage {...props} />,
    'Attendance Dashboard': <EmployeeDashboardPage {...props} />,
    'Payroll History': <PayrollHistoryPage {...props} initialMonth={payrollHistoryMonth} />,
    'Place Visit Report': <ActivityReportPage {...props} type="place" />,
    'Meal Report': <ActivityReportPage {...props} type="meal" />,
    'Hotel Report': <ActivityReportPage {...props} type="hotel" />,
    'Permission Types': <PermissionTypesPage />,
    Employees: <EmployeesPage {...props} />,
    Branches: <BranchesPage />,
    Departments: <DepartmentsPage />,
    Positions: <PositionsPage />,
    'Users & Roles': <UsersRolesPage initialTab="assign" />,
    'Roles & Permissions': <UsersRolesPage initialTab="assign" />,
    Roles: <UsersRolesPage initialTab="roles" />,
    Permissions: <UsersRolesPage initialTab="permissions" />,
    'IP Access': <UsersRolesPage initialTab="ip" />,
    'Outdoor Sales': <OutdoorSalesPage {...props} />,
    Reports: <ReportsPage {...props} />,
    Security: <SecurityPage refresh={() => loadRealData(user)} />,
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return <LoginPage dark={dark} onToggleDark={toggleTheme} onLogin={handleLogin} />

  const employee = user.employee
  const displayName = userDisplayName(user)
  const roleName = employee?.position?.name || user.role?.name || 'Employee'
  const pageTitle = active === 'Outdoor Sales' ? 'Outdoor Sales Tracking' : active
  const unreadCount = data.notifications.filter((item) => !item.read_at).length
  const mainSidebarItems = sidebarMainItems.filter((item) => canAccess(user, item.permissions))
  const manageSidebarItems = sidebarManageItems.filter((item) => canAccess(user, item.permissions))
  const canSeeNotifications = canAccess(user, ['notifications.view', 'notifications.manage'])
  const today = data.todayAttendance
  const companyName = data.appSettings?.company_name || 'SalesTrack'
  const companyLogoUrl = data.appSettings?.company_logo_url || ''

  return (
    <div className={clsx(dark && 'dark')}>
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto bg-[#071927] text-white shadow-xl transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0',
        )}>
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt={companyName} className="h-12 w-12 rounded-lg object-cover shadow-lg" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-950/25">
                  <Activity size={22} />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight">{companyName}</h1>
                <p className="text-xs text-slate-300">{translate(language, 'Employee Panel')}</p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-slate-300 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4 pb-5">
            {mainSidebarItems.map((item) => (
              <SidebarButton
                key={item.target}
                item={item}
                active={active}
                language={language}
                unreadCount={unreadCount}
                onClick={() => {
                  setActive(item.target)
                  setSidebarOpen(false)
                }}
              />
            ))}

            {filteredPermissionMgmtSubItems.length > 0 && (
              <SidebarAccordion
                label={translate(language, 'Permission Management')}
                icon={Hammer}
                isOpen={isPermissionExpanded}
                onToggle={() => setPermissionOpen((v) => !v)}
              >
                {filteredPermissionMgmtSubItems.map((subItem) => (
                  <SidebarGroupItem
                    key={subItem.target}
                    label={subItem.label}
                    language={language}
                    isActive={subItem.activeTargets.includes(active)}
                    onClick={() => {
                      setActive(subItem.target)
                      setPermissionOpen(true)
                      setSidebarOpen(false)
                    }}
                  />
                ))}
              </SidebarAccordion>
            )}

            {filteredReportSubItems.length > 0 && (
              <SidebarAccordion
                label={translate(language, 'Reports')}
                icon={FileText}
                isOpen={isReportsExpanded}
                onToggle={() => setReportsOpen((v) => !v)}
              >
                {filteredReportSubItems.map((subItem) => (
                  <SidebarGroupItem
                    key={subItem.target}
                    label={subItem.label}
                    language={language}
                    isActive={subItem.activeTargets.includes(active)}
                    onClick={() => {
                      setActive(subItem.target)
                      setReportsOpen(true)
                      setSidebarOpen(false)
                    }}
                  />
                ))}
              </SidebarAccordion>
            )}

            {filteredAttendanceSubItems.length > 0 && (
              <SidebarAccordion
                label={translate(language, 'Attendance')}
                icon={Clock}
                isOpen={isAttendanceExpanded}
                onToggle={() => setAttendanceOpen((v) => !v)}
              >
                {filteredAttendanceSubItems.map((item) => (
                  <SidebarGroupItem
                    key={item.label}
                    label={item.label}
                    language={language}
                    isActive={item.activeTargets.includes(active)}
                    onClick={() => {
                      if (item.requestType) {
                        openPermissionRequest(item.requestType)
                      } else {
                        setActive(item.target)
                      }
                      setSidebarOpen(false)
                    }}
                  />
                ))}
              </SidebarAccordion>
            )}

            {manageSidebarItems.length > 0 && <div className="my-4 border-t border-white/10" />}

            {manageSidebarItems.map((item) => (
              item.target === 'Roles & Permissions' && filteredRolePermissionSubItems.length > 0 ? (
                <SidebarAccordion
                  key={item.target}
                  label={translate(language, 'Roles & Permissions')}
                  icon={Users}
                  isOpen={isRolesExpanded}
                  onToggle={() => setRolesOpen((v) => !v)}
                >
                  {filteredRolePermissionSubItems.map((subItem) => (
                    <SidebarGroupItem
                      key={subItem.target}
                      label={subItem.label}
                      language={language}
                      isActive={subItem.activeTargets.includes(active)}
                      onClick={() => {
                        setActive(subItem.target)
                        setRolesOpen(true)
                        setSidebarOpen(false)
                      }}
                    />
                  ))}
                </SidebarAccordion>
              ) : (
                <SidebarButton
                  key={item.target}
                  item={item}
                  active={active}
                  language={language}
                  withChevron={false}
                  onClick={() => {
                    setActive(item.target)
                    setSidebarOpen(false)
                  }}
                />
              )
            ))}
          </nav>

          <div className="px-4 pb-5">
            <div className="rounded-lg bg-white/8 p-4 text-sm shadow-inner shadow-white/5">
              <p className="font-bold">{translate(language, "Today's Summary")}</p>
              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <SummaryRow label={translate(language, 'Check In')} value={formatTime(today?.check_in_at)} />
                <SummaryRow label={translate(language, 'Check Out')} value={formatTime(today?.check_out_at)} />
                <SummaryRow label={translate(language, 'Total Visits')} value={String(data.visits.length)} />
                <SummaryRow label={translate(language, 'Working Minutes')} value={today?.work_minutes ? `${today.work_minutes} min` : '-'} />
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className={clsx('transition-all duration-300', sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72')}>
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm shadow-slate-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button className="rounded-lg p-1.5 text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu size={19} />
                </button>
                <button className="hidden rounded-lg p-1.5 text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900 lg:block" onClick={() => setSidebarCollapsed((v) => !v)} title={translate(language, 'Toggle sidebar')}>
                  <Menu size={19} />
                </button>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-slate-950 dark:text-white">{translate(language, pageTitle)}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {canSeeNotifications && (
                  <button className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" onClick={() => setActive('Notifications')}>
                    <Bell size={17} />
                    {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
                  </button>
                )}
                <LanguageDropdown
                  language={language}
                  open={languageMenuOpen}
                  onToggle={(event) => {
                    event.stopPropagation()
                    setUserMenuOpen(false)
                    setLanguageMenuOpen((value) => !value)
                  }}
                  onChange={changeLanguage}
                />
                <button
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={toggleTheme}
                  type="button"
                  title={translate(language, dark ? 'Switch to light mode' : 'Switch to dark mode')}
                  aria-label={translate(language, dark ? 'Switch to light mode' : 'Switch to dark mode')}
                >
                  {dark ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <div className="relative hidden sm:block">
                  <button
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={(event) => {
                      event.stopPropagation()
                      setUserMenuOpen((value) => !value)
                    }}
                    type="button"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <UserAvatar name={displayName} photo={employee?.photo_url} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">{displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{roleName}</p>
                    </div>
                    <ChevronDown size={18} className={clsx('text-slate-500 transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-900"
                      onClick={(event) => event.stopPropagation()}
                      role="menu"
                    >
                      <div className="px-5 py-4">
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">{displayName}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{roleName}</p>
                      </div>
                      <div className="border-t border-slate-200 py-2 dark:border-slate-800">
                        <button
                          className="flex w-full items-center gap-4 px-5 py-3 text-left text-lg text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          onClick={() => {
                            setActive('Profile')
                            setUserMenuOpen(false)
                          }}
                          type="button"
                          role="menuitem"
                        >
                          <User size={22} />
                          Profile
                        </button>
                        <button
                          className="flex w-full items-center gap-4 px-5 py-3 text-left text-lg text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          onClick={handleLogout}
                          type="button"
                          role="menuitem"
                        >
                          <LogOut size={22} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-6 p-4 pb-24 sm:p-8 lg:pb-8">
            {data.loading && <FloatingSpinner message="Refreshing live data..." />}
            {pages[active]}
          </section>
          <MobileNav
            active={active}
            setActive={setActive}
            user={user}
            onAttendanceAction={openAttendanceAction}
            todayAttendance={data.todayAttendance}
            refreshTodayAttendance={refreshTodayAttendance}
          />
        </main>
      </div>

      {modal === 'employee' && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setModal(null)
            setEditingEmployee(null)
          }}
          onSaved={(options = {}) => {
            if (!options.keepOpen) {
              setModal(null)
              setEditingEmployee(null)
            }
            loadRealData(user)
          }}
        />
      )}
      {modal === 'visit' && <VisitModal onClose={() => setModal(null)} onSaved={() => { setModal(null); loadRealData(user) }} />}
      {modal === 'place-visit' && (
        <PlaceVisitModal
          activeVisit={(data.placeVisits || []).find((visit) => visit.status === 'open')}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadRealData(user) }}
        />
      )}
      {modal === 'meal' && (
        <MealModal
          mealRecords={data.mealRecords || []}
          onClose={() => setModal(null)}
          onSaved={(options = {}) => {
            if (!options.keepOpen) setModal(null)
            loadRealData(user)
          }}
        />
      )}
      {modal === 'hotel' && (
        <HotelModal
          activeStay={(data.hotelStays || []).find((stay) => String(stay.status).toLowerCase() === 'checked_in')}
          onClose={() => setModal(null)}
          onSaved={(options = {}) => {
            if (options.stay) {
              setData((current) => {
                const existing = current.hotelStays || []
                const nextHotelStays = existing.some((stay) => stay.id === options.stay.id)
                  ? existing.map((stay) => (stay.id === options.stay.id ? options.stay : stay))
                  : [options.stay, ...existing]

                return { ...current, hotelStays: nextHotelStays }
              })
            }
            if (!options.keepOpen) setModal(null)
            loadRealData(user)
          }}
        />
      )}
      {modal === 'report' && <ReportModal onClose={() => setModal(null)} onSaved={() => { setModal(null); loadRealData(user) }} />}
      {attendanceAction && (
        <AttendanceActionModal
          action={attendanceAction}
          user={user}
          onClose={() => setAttendanceAction(null)}
          openPermissionRequest={openPermissionRequest}
          onSaved={() => {
            setAttendanceAction(null)
            refreshTodayAttendance()
            loadRealData(user)
          }}
        />
      )}
    </div>
  )
}

function App({ initialBranding = {} }) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()

  if (!googleMapsApiKey) {
    return <AppShell isLoaded={false} initialBranding={initialBranding} />
  }

  return <GoogleMapsApp apiKey={googleMapsApiKey} initialBranding={initialBranding} />
}

function LanguageDropdown({ language, open, onToggle, onChange }) {
  const normalizedLanguage = SUPPORTED_LANGUAGES.has(language) ? language : normalizeLanguage(language)
  const current = normalizedLanguage === 'km'
    ? { flagClass: 'fi-kh', label: 'Khmer' }
    : { flagClass: 'fi-us', label: 'English' }

  return (
    <div className="relative" data-no-translate>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={clsx('fi', current.flagClass)} aria-hidden="true" />
        <span className="min-w-14 text-left">{current.label}</span>
        <ChevronDown size={15} className={clsx('text-slate-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-900"
          onClick={(event) => event.stopPropagation()}
          role="menu"
        >
          <LanguageOption active={normalizedLanguage === 'en'} flagClass="fi-us" label="English" shortLabel="En" onClick={() => onChange('en')} />
          <LanguageOption active={normalizedLanguage === 'km'} flagClass="fi-kh" label="Khmer" shortLabel="Kh" onClick={() => onChange('km')} />
        </div>
      )}
    </div>
  )
}

function LanguageOption({ active, flagClass, label, shortLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold transition',
        active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800',
      )}
      role="menuitem"
    >
      <span className="flex items-center gap-2">
        <span className={clsx('fi', flagClass)} aria-hidden="true" />
        {label}
      </span>
      <span className="text-xs text-slate-400">{shortLabel}</span>
    </button>
  )
}

function SidebarButton({ item, active, language = 'en', unreadCount = 0, withChevron = false, onClick }) {
  const isActive = active === item.target

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition',
        isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/25' : 'text-slate-200 hover:bg-white/10 hover:text-white',
      )}
      >
      <span className="flex items-center gap-3">
        <item.icon size={18} />
        {translate(language, item.label)}
      </span>
      {item.label === 'Notifications' && unreadCount > 0 ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-white">{unreadCount}</span>
      ) : withChevron ? (
        <ChevronDown size={15} className="text-slate-400" />
      ) : null}
    </button>
  )
}

function SidebarAccordion({ label, icon: Icon, isOpen, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </span>
        <ChevronDown size={15} className={clsx('text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="ml-7 mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

function SidebarGroupItem({ label, language = 'en', isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition',
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
      )}
      >
      <span className={clsx('h-2 w-2 shrink-0 rounded-full', isActive ? 'bg-emerald-400' : 'bg-slate-500')} />
      {translate(language, label)}
    </button>
  )
}

function UserAvatar({ name, photo, size = 'md' }) {
  const initialsText = String(name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const sizeClass = size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'

  return (
    <div className={clsx('relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-white ring-2 ring-white/10', sizeClass)}>
      {photo ? <img className="h-full w-full object-cover" src={photo} alt={name} /> : initialsText}
      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
    </div>
  )
}

export default App
