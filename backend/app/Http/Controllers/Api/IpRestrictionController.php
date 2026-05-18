<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\RoleIpAddress;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class IpRestrictionController extends Controller
{
    public function index()
    {
        return Role::with('ipAddresses')->get(['id', 'name', 'slug', 'description']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'role_id'    => ['required', 'exists:roles,id'],
            'ip_address' => ['required', 'string', 'max:64'],
            'label'      => ['nullable', 'string', 'max:120'],
        ]);

        $data['ip_address'] = trim($data['ip_address']);
        if (! $this->isValidIpRule($data['ip_address'])) {
            throw ValidationException::withMessages([
                'ip_address' => 'Enter a valid IP address or CIDR range, for example 192.168.110.127 or 192.168.110.0/24.',
            ]);
        }

        return RoleIpAddress::firstOrCreate(
            ['role_id' => $data['role_id'], 'ip_address' => $data['ip_address']],
            ['label'   => $data['label'] ?? null],
        );
    }

    private function isValidIpRule(string $rule): bool
    {
        if (filter_var($rule, FILTER_VALIDATE_IP)) {
            return true;
        }

        if (! str_contains($rule, '/')) {
            return false;
        }

        [$ip, $prefix] = explode('/', $rule, 2);
        if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return false;
        }

        if (! ctype_digit($prefix)) {
            return false;
        }

        $prefixLength = (int) $prefix;

        return $prefixLength >= 0 && $prefixLength <= 32;
    }

    public function destroy(RoleIpAddress $ipRestriction)
    {
        $ipRestriction->delete();

        return response()->noContent();
    }
}
