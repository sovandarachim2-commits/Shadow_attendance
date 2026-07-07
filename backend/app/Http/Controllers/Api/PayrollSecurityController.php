<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PayrollSecurityService;
use Illuminate\Http\Request;

class PayrollSecurityController extends Controller
{
    public function status(Request $request, PayrollSecurityService $security)
    {
        return response()->json($security->status($request));
    }

    public function unlock(Request $request, PayrollSecurityService $security)
    {
        $data = $request->validate([
            'pin' => ['required', 'string', 'max:100'],
        ]);

        return response()->json($security->unlock($request, $data['pin']));
    }

    public function update(Request $request, PayrollSecurityService $security)
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'unlock_minutes' => ['required', 'integer', 'min:1', 'max:480'],
            'pin' => ['nullable', 'string', 'min:4', 'max:100'],
        ]);

        return response()->json($security->updateSettings(
            $request,
            (bool) $data['enabled'],
            (int) $data['unlock_minutes'],
            $data['pin'] ?? null,
        ));
    }
}
