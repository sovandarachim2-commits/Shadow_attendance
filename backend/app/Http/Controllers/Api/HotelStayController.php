<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HotelStay;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HotelStayController extends Controller
{
    public function __construct(private ImageUploadService $images) {}

    public function index(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage', 'reports.view_all');

        return HotelStay::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('check_in_at', $date))
            ->latest('check_in_at')
            ->limit($request->integer('limit', 50))
            ->get()
            ->map(fn (HotelStay $stay) => $this->appendUrls($stay));
    }

    public function checkIn(Request $request)
    {
        $employee = $request->user()->employee()->firstOrFail();

        if (HotelStay::where('employee_id', $employee->id)->where('status', 'checked_in')->exists()) {
            throw ValidationException::withMessages(['hotel' => 'You already have an active hotel stay.']);
        }

        $data = $request->validate([
            'car_km' => ['required', 'integer', 'min:0', 'max:9999999'],
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['required', 'image', 'max:4096'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $photoPath = $this->images->store($request->file('photo'), 'hotels/check-in');

        $stay = HotelStay::create([
            'employee_id' => $employee->id,
            'check_in_km' => $data['car_km'],
            'check_in_address' => $data['address'],
            'check_in_latitude' => $data['latitude'],
            'check_in_longitude' => $data['longitude'],
            'check_in_at' => now(),
            'check_in_photo_path' => $photoPath,
            'check_in_notes' => $data['notes'] ?? null,
            'status' => 'checked_in',
        ]);

        return $this->appendUrls($stay->fresh(['employee.department', 'employee.position']));
    }

    public function checkOut(Request $request, HotelStay $hotelStay)
    {
        if (
            ! $request->user()->hasAnyPermission('visits.manage', 'visits.update')
            && $hotelStay->employee_id !== $request->user()->employee_id
        ) {
            abort(403, 'You can only check out your own hotel stay.');
        }

        if ($hotelStay->status === 'completed') {
            throw ValidationException::withMessages(['hotel' => 'This hotel stay is already checked out.']);
        }

        $data = $request->validate([
            'car_km' => ['required', 'integer', 'min:'.$hotelStay->check_in_km, 'max:9999999'],
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['required', 'image', 'max:4096'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $photoPath = $this->images->store($request->file('photo'), 'hotels/check-out');

        $hotelStay->update([
            'check_out_km' => $data['car_km'],
            'total_km' => max(0, $data['car_km'] - $hotelStay->check_in_km),
            'check_out_address' => $data['address'],
            'check_out_latitude' => $data['latitude'],
            'check_out_longitude' => $data['longitude'],
            'check_out_at' => now(),
            'check_out_photo_path' => $photoPath,
            'check_out_notes' => $data['notes'] ?? null,
            'status' => 'completed',
        ]);

        return $this->appendUrls($hotelStay->fresh(['employee.department', 'employee.position']));
    }

    private function appendUrls(HotelStay $stay): HotelStay
    {
        $stay->check_in_photo_url = $this->images->url($stay->check_in_photo_path);
        $stay->check_out_photo_url = $this->images->url($stay->check_out_photo_path);

        return $stay;
    }
}
