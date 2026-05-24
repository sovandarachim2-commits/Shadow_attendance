<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerVisit;
use App\Models\GpsLocation;
use App\Services\ImageUploadService;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CustomerVisitController extends Controller
{
    public function __construct(
        private ImageUploadService $images,
        private TelegramNotificationService $telegram,
    ) {}

    public function index(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage');

        $paginated = CustomerVisit::with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($q) => $q->where('employee_id', $request->user()->employee_id))
            ->when($canViewAll && $request->employee_id, fn ($q, $id) => $q->where('employee_id', $id))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('check_in_at', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('check_in_at', '<=', $d))
            ->when($request->date, fn ($q, $d) => $q->whereDate('check_in_at', $d))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->customer_name, fn ($q, $n) => $q->where('customer_name', 'like', "%{$n}%"))
            ->when($request->province, fn ($q, $p) => $q->where('province', 'like', "%{$p}%"))
            ->latest('check_in_at')
            ->paginate($request->integer('per_page', 15));

        $paginated->through(function ($visit) {
            $visit->selfie_url      = $visit->selfie_path      ? $this->images->url($visit->selfie_path)      : null;
            $visit->store_photo_url = $visit->store_photo_path ? $this->images->url($visit->store_photo_path) : null;
            $visit->map_url         = ($visit->latitude && $visit->longitude)
                ? "https://maps.google.com/?q={$visit->latitude},{$visit->longitude}"
                : null;
            return $visit;
        });

        return $paginated;
    }

    public function provinces(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage');

        return CustomerVisit::query()
            ->when(! $canViewAll, fn ($q) => $q->where('employee_id', $request->user()->employee_id))
            ->whereNotNull('province')
            ->where('province', '!=', '')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');
    }

    public function summary(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage');

        $base = CustomerVisit::query()
            ->when(! $canViewAll, fn ($q) => $q->where('employee_id', $request->user()->employee_id))
            ->when($canViewAll && $request->employee_id, fn ($q, $id) => $q->where('employee_id', $id))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('check_in_at', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('check_in_at', '<=', $d))
            ->when($request->customer_name, fn ($q, $n) => $q->where('customer_name', 'like', "%{$n}%"))
            ->when($request->province, fn ($q, $p) => $q->where('province', 'like', "%{$p}%"));

        return response()->json([
            'total'            => (clone $base)->count(),
            'completed'        => (clone $base)->where('status', 'closed')->count(),
            'open'             => (clone $base)->where('status', 'open')->count(),
            'unique_customers' => (clone $base)->distinct()->count('customer_name'),
            'active_staff'     => (clone $base)->distinct()->count('employee_id'),
        ]);
    }

    public function store(Request $request)
    {
        $employee = $request->user()->employee()->firstOrFail();
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:160'],
            'store_name'    => ['nullable', 'string', 'max:160'],
            'contact_person' => ['nullable', 'string', 'max:120'],
            'phone'         => ['required', 'string', 'max:40'],
            'address'       => ['required', 'string', 'max:2000'],
            'province'      => ['nullable', 'string', 'max:120'],
            'latitude'      => ['required', 'numeric', 'between:-90,90'],
            'longitude'     => ['required', 'numeric', 'between:-180,180'],
            'selfie'        => ['required', 'image', 'max:4096'],
            'store_photo'   => ['required', 'image', 'max:4096'],
            'notes'         => ['nullable', 'string', 'max:2000'],
        ]);

        $selfiePath     = $this->images->store($request->file('selfie'), 'visits/selfies');
        $storePhotoPath = $this->images->store($request->file('store_photo'), 'visits/stores');

        $visit = CustomerVisit::create([
            ...$data,
            'employee_id'      => $employee->id,
            'check_in_at'      => now(),
            'selfie_path'      => $selfiePath,
            'store_photo_path' => $storePhotoPath,
        ]);

        GpsLocation::create([
            'employee_id'       => $employee->id,
            'customer_visit_id' => $visit->id,
            'latitude'          => $data['latitude'],
            'longitude'         => $data['longitude'],
            'recorded_at'       => now(),
            'source'            => 'customer_visit',
        ]);

        $this->sendVisitNotification($visit, $employee, $selfiePath, $storePhotoPath);

        return $visit;
    }

    public function update(Request $request, CustomerVisit $customerVisit)
    {
        if (
            ! $request->user()->hasAnyPermission('visits.manage', 'visits.update')
            && $customerVisit->employee_id !== $request->user()->employee_id
        ) {
            abort(403, 'You can only edit your own customer visits.');
        }

        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:160'],
            'store_name'    => ['nullable', 'string', 'max:160'],
            'phone'         => ['required', 'string', 'max:40'],
            'address'       => ['required', 'string', 'max:2000'],
            'province'      => ['nullable', 'string', 'max:120'],
            'notes'         => ['nullable', 'string', 'max:2000'],
        ]);

        $customerVisit->update($data);

        return $customerVisit->fresh(['employee.department', 'employee.position']);
    }

    public function checkout(Request $request, CustomerVisit $customerVisit)
    {
        if (
            ! $request->user()->hasAnyPermission('visits.manage', 'visits.update')
            && $customerVisit->employee_id !== $request->user()->employee_id
        ) {
            abort(403, 'You can only check out your own customer visits.');
        }

        if ($customerVisit->status === 'closed') {
            throw ValidationException::withMessages(['visit' => 'This customer visit is already checked out.']);
        }

        $customerVisit->update([
            'check_out_at'     => now(),
            'duration_minutes' => $customerVisit->check_in_at?->diffInMinutes(now()) ?? 0,
            'status'           => 'closed',
        ]);

        return $customerVisit->fresh();
    }

    private function sendVisitNotification(CustomerVisit $visit, $employee, ?string $selfiePath, ?string $storePhotoPath = null): void
    {
        try {
            $selfieUrl     = $selfiePath     ? $this->images->url($selfiePath)     : null;
            $storePhotoUrl = $storePhotoPath ? $this->images->url($storePhotoPath) : null;

            $sellerName   = e($employee->full_name ?? $employee->name ?? 'Unknown');
            $employeeCode = e($employee->employee_code ?? '—');
            $mapUrl       = ($visit->latitude && $visit->longitude)
                ? "https://maps.google.com/?q={$visit->latitude},{$visit->longitude}"
                : null;

            $addressBlock = e($visit->address ?? '—');
            if ($visit->province) {
                $addressBlock .= "\n📌 " . e($visit->province);
            }

            $visitTime = $visit->check_in_at->format('d/m/Y H:i');

            $message = "🏪 <b>CUSTOMER VISIT COMPLETED</b>\n\n"
                . "👤 Seller: <b>{$sellerName}</b>\n"
                . "🆔 Employee ID: <b>{$employeeCode}</b>\n\n"
                . "🧑 Customer: <b>" . e($visit->customer_name) . "</b>\n"
                . "📞 Phone: " . e($visit->phone ?? '—') . "\n"
                . "🏬 Store: " . e($visit->store_name ?: '—') . "\n\n"
                . "📍 Address:\n{$addressBlock}\n\n"
                . ($mapUrl        ? "🛰 <a href=\"{$mapUrl}\">Open Map</a>\n"               : '')
                . ($selfieUrl     ? "🤳 <a href=\"{$selfieUrl}\">View Selfie</a>\n"         : '')
                . ($storePhotoUrl ? "🏬 <a href=\"{$storePhotoUrl}\">View Store Photo</a>\n" : '')
                . "\n🕒 {$visitTime}  ✅ Visit Completed";

            $this->telegram->sendVisitTextMessage(
                message:       $message,
                selfieUrl:     $selfieUrl,
                storePhotoUrl: $storePhotoUrl,
                visitId:       $visit->id,
                employeeId:    $employee->id,
                eventKeys:     'outdoor_visit',
            );
        } catch (\Throwable) {
            // Notification failure must not block the API response
        }
    }
}
