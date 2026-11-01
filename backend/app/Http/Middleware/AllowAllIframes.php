<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowAllIframes
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        // Remove X-Frame-Options header to allow embedding in any iframe.
        $response->headers->remove('X-Frame-Options');
        return $response;
    }
}

