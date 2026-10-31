<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Response;

class NormalizeSimpleApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Promote ?api_token=... to Authorization: Bearer ... for CORS simple requests
        if (! $request->headers->has('Authorization')) {
            $token = $request->query('api_token');
            if (is_string($token) && trim($token) !== '') {
                $request->headers->set('Authorization', 'Bearer '.trim($token));
            }
        }

        // 2. Decode JSON payloads sent with Content-Type: text/plain (CORS simple request)
        $contentType = strtolower((string) $request->headers->get('Content-Type', ''));
        if (str_starts_with($contentType, 'text/plain')) {
            $rawContent = $request->getContent();
            if (is_string($rawContent) && $rawContent !== '') {
                $decoded = json_decode($rawContent, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $request->merge($decoded);
                    $request->setJson(new ParameterBag($decoded));
                }
            }
        }

        // 3. Support method spoofing (_method=PUT|PATCH|DELETE) via query or decoded body on POST
        if ($request->isMethod('POST')) {
            $spoofedMethod = $request->query('_method') ?? $request->input('_method');
            if (is_string($spoofedMethod)) {
                $upper = strtoupper(trim($spoofedMethod));
                if (in_array($upper, ['PUT', 'PATCH', 'DELETE'], true)) {
                    $request->setMethod($upper);
                }
            }
        }

        $response = $next($request);

        // Ensure Access-Control-Allow-Credentials is always true on API responses
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        // Allow the hidden warmup iframe to complete without X-Frame-Options console warnings
        if ($request->query->has('_warmup')) {
            $response->headers->remove('X-Frame-Options');
        }

        return $response;
    }
}
