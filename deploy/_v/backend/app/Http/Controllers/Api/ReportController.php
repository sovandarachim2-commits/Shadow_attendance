<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    private function canViewAllReports(Request $request): bool
    {
        return $request->user()->hasAnyPermission('reports.view_all', 'reports.view_own');
    }

    public function index(Request $request)
    {
        return Report::with('employee')
            ->when(! $this->canViewAllReports($request), fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('report_date', $date))
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest('report_date')
            ->paginate($request->integer('per_page', 20));
    }

    public function store(Request $request)
    {
        $employee = $request->user()->employee()->firstOrFail();
        $data = $request->validate([
            'report_date' => ['required', 'date'],
            'type' => ['required', 'in:daily,weekly,monthly,visit'],
            'title' => ['required', 'string', 'max:180'],
            'content' => ['required', 'string'],
            'metrics' => ['nullable', 'array'],
        ]);

        return Report::create([...$data, 'employee_id' => $employee->id, 'submitted_at' => now()]);
    }

    public function export(Request $request)
    {
        $rows = Report::query()
            ->with('employee')
            ->when(! $this->canViewAllReports($request), fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('report_date', $date))
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest('report_date')
            ->limit(500)
            ->get();

        $escape = fn ($value) => '"'.str_replace('"', '""', (string) $value).'"';

        $csv = "date,employee,type,title,orders_collected,status,content\n".$rows->map(fn ($row) => implode(',', [
            $escape($row->report_date?->toDateString()),
            $escape(trim(($row->employee?->first_name ?? '').' '.($row->employee?->last_name ?? ''))),
            $escape($row->type),
            $escape($row->title),
            $escape($row->metrics['orders_collected'] ?? 0),
            $escape($row->status),
            $escape($row->content),
        ]))->implode("\n");

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendance-reports.csv"',
        ]);
    }
}
