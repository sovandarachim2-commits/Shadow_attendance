<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlaceVisit;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PlaceVisitController extends Controller
{
    public function __construct(private ImageUploadService $images) {}

    public function index(Request $request)
    {
        $canViewAll = $request->user()->hasAnyPermission('visits.view', 'visits.manage');

        $visits = PlaceVisit::query()
            ->with(['employee.department', 'employee.position'])
            ->when(! $canViewAll, fn ($query) => $query->where('employee_id', $request->user()->employee_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('started_at', $date))
            ->latest('started_at')
            ->limit($request->integer('limit', 50))
            ->get();

        return $visits->map(fn (PlaceVisit $visit) => $this->appendUrls($visit));
    }

    public function start(Request $request)
    {
        $employee = $request->user()->employee()->firstOrFail();

        $activeVisit = PlaceVisit::where('employee_id', $employee->id)
            ->where('status', 'open')
            ->latest('started_at')
            ->first();

        if ($activeVisit) {
            throw ValidationException::withMessages(['visit' => 'You already have an active place visit.']);
        }

        $data = $request->validate([
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['required', 'image', 'max:4096'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $photoPath = $this->images->store($request->file('photo'), 'visits/places/start');

        $visit = PlaceVisit::create([
            'employee_id' => $employee->id,
            'start_address' => $data['address'],
            'start_latitude' => $data['latitude'],
            'start_longitude' => $data['longitude'],
            'started_at' => now(),
            'start_photo_path' => $photoPath,
            'start_notes' => $data['notes'] ?? null,
            'status' => 'open',
        ]);

        return $this->appendUrls($visit->fresh());
    }

    public function end(Request $request, PlaceVisit $placeVisit)
    {
        if (
            ! $request->user()->hasAnyPermission('visits.manage', 'visits.update')
            && $placeVisit->employee_id !== $request->user()->employee_id
        ) {
            abort(403, 'You can only end your own place visits.');
        }

        if ($placeVisit->status === 'closed') {
            throw ValidationException::withMessages(['visit' => 'This place visit is already ended.']);
        }

        $data = $request->validate([
            'address' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['required', 'image', 'max:4096'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $photoPath = $this->images->store($request->file('photo'), 'visits/places/end');

        $placeVisit->update([
            'end_address' => $data['address'],
            'end_latitude' => $data['latitude'],
            'end_longitude' => $data['longitude'],
            'ended_at' => now(),
            'end_photo_path' => $photoPath,
            'end_notes' => $data['notes'] ?? null,
            'duration_minutes' => $placeVisit->started_at?->diffInMinutes(now()) ?? 0,
            'status' => 'closed',
        ]);

        return $this->appendUrls($placeVisit->fresh());
    }

    private function appendUrls(PlaceVisit $visit): PlaceVisit
    {
        $visit->start_photo_url = $visit->start_photo_path ? $this->images->url($visit->start_photo_path) : null;
        $visit->end_photo_url = $visit->end_photo_path ? $this->images->url($visit->end_photo_path) : null;
        $visit->map_url = ($visit->start_latitude && $visit->start_longitude)
            ? "https://maps.google.com/?q={$visit->start_latitude},{$visit->start_longitude}"
            : null;

        return $visit;
    }
}
