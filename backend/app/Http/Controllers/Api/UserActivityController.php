<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserActivityController extends Controller
{
    /**
     * Get paginated audit logs with search and filtering.
     */
    public function index(Request $request)
    {
        $query = UserActivity::with(['user.role', 'user.employee.position', 'user.employee.department'])
            ->latest('id');

        $this->applyFilters($query, $request);

        $perPage = min(max((int) $request->input('per_page', 15), 5), 100);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Get real KPI summary statistics for today.
     */
    public function summary()
    {
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();

        $todayQuery = UserActivity::whereBetween('created_at', [$todayStart, $todayEnd]);

        $totalToday = (clone $todayQuery)->count();

        $activeUsersToday = (clone $todayQuery)
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        $successfulLogins = (clone $todayQuery)
            ->where('action', 'login')
            ->where('status', 'success')
            ->count();

        $failedLogins = (clone $todayQuery)
            ->where('action', 'failed_login')
            ->count();

        $securityEvents = (clone $todayQuery)
            ->where(function ($q) {
                $q->whereIn('status', ['failed', 'warning'])
                  ->orWhereIn('action', ['failed_login', 'role_changed', 'permission_changed']);
            })
            ->count();

        return response()->json([
            'total_today'         => $totalToday,
            'active_users_today'  => $activeUsersToday,
            'successful_logins'   => $successfulLogins,
            'failed_logins'       => $failedLogins,
            'security_events'     => $securityEvents,
        ]);
    }

    /**
     * Show detailed activity record.
     */
    public function show($id)
    {
        $activity = UserActivity::with(['user.role', 'user.employee.department', 'user.employee.position'])
            ->findOrFail($id);

        return response()->json($activity);
    }

    /**
     * Export audit logs to CSV according to active filters.
     */
    public function export(Request $request): StreamedResponse
    {
        $query = UserActivity::with(['user.role'])->latest('id');
        $this->applyFilters($query, $request);

        $filename = 'user_activities_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'ID',
                'Date & Time',
                'User',
                'Email',
                'Role',
                'Module',
                'Action',
                'Description',
                'Status',
                'IP Address',
                'User Agent',
            ]);

            $query->chunk(200, function ($activities) use ($handle) {
                foreach ($activities as $act) {
                    fputcsv($handle, [
                        $act->id,
                        $act->created_at?->format('Y-m-d H:i:s') ?? '-',
                        $act->user?->name ?? 'System',
                        $act->user?->email ?? '-',
                        $act->user?->role?->name ?? '-',
                        $act->module,
                        $act->action,
                        $act->description,
                        $act->status,
                        $act->ip_address ?? '-',
                        $act->user_agent ?? '-',
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Apply common query filters.
     */
    private function applyFilters($query, Request $request): void
    {
        if ($search = trim((string) $request->input('search'))) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($role = trim((string) $request->input('role'))) {
            $query->whereHas('user.role', function ($rq) use ($role) {
                $rq->where('slug', $role);
            });
        }

        if ($module = trim((string) $request->input('module'))) {
            $query->where('module', $module);
        }

        if ($action = trim((string) $request->input('action'))) {
            $query->where('action', $action);
        }

        if ($status = trim((string) $request->input('status'))) {
            $query->where('status', $status);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->where('created_at', '>=', $dateFrom . ' 00:00:00');
        }

        if ($dateTo = $request->input('date_to')) {
            $query->where('created_at', '<=', $dateTo . ' 23:59:59');
        }
    }
}

