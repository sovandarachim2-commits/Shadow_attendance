<?php

namespace App\Services;

use Illuminate\Http\Request;

class DeviceDetectorService
{
    /**
     * Detect device, OS, and browser from an HTTP Request.
     *
     * @return array{
     *     device: string,
     *     os: string,
     *     browser: string,
     *     summary: string
     * }
     */
    public static function detect(Request $request): array
    {
        $ua = (string) $request->userAgent();
        $headers = [
            'sec-ch-ua-model'            => $request->header('sec-ch-ua-model'),
            'sec-ch-ua-platform'         => $request->header('sec-ch-ua-platform'),
            'sec-ch-ua-platform-version' => $request->header('sec-ch-ua-platform-version'),
            'sec-ch-ua-mobile'           => $request->header('sec-ch-ua-mobile'),
        ];

        return self::detectFromUserAgent($ua, $headers);
    }

    /**
     * Detect device, OS, and browser from a User-Agent string and optional Client Hints.
     *
     * @param  array<string, ?string>  $hints
     * @return array{
     *     device: string,
     *     os: string,
     *     browser: string,
     *     summary: string
     * }
     */
    public static function detectFromUserAgent(?string $ua, array $hints = []): array
    {
        $ua = trim((string) $ua);
        if ($ua === '') {
            return [
                'device'  => 'Unknown Device',
                'os'      => 'Unknown OS',
                'browser' => 'Unknown Browser',
                'summary' => 'Unknown Device',
            ];
        }

        $device  = self::detectDevice($ua, $hints);
        $os      = self::detectOs($ua, $hints);
        $browser = self::detectBrowser($ua);

        return [
            'device'  => $device,
            'os'      => $os,
            'browser' => $browser,
            'summary' => "{$device} • {$os} • {$browser}",
        ];
    }

    /**
     * Detect device model & type.
     *
     * @param  array<string, ?string>  $hints
     */
    private static function detectDevice(string $ua, array $hints): string
    {
        $chModel = trim(trim((string) ($hints['sec-ch-ua-model'] ?? '')), '"\'');

        // 1. iPhone
        if (preg_match('/\biPhone\b/i', $ua)) {
            // Standard browser User-Agent strings do not reliably reveal exact iPhone models.
            // If Client Hints or custom headers reveal it, use it; otherwise display explicit fallback.
            if ($chModel !== '' && stripos($chModel, 'iPhone') !== false) {
                return $chModel;
            }
            return 'iPhone (model unavailable)';
        }

        // 2. iPad
        if (preg_match('/\biPad\b/i', $ua)) {
            if ($chModel !== '') {
                return "iPad ({$chModel})";
            }
            return 'iPad';
        }

        // 3. Android devices
        if (preg_match('/\bAndroid\b/i', $ua)) {
            $isTablet = ! preg_match('/\bMobile\b/i', $ua)
                || preg_match('/\b(Tablet|SM-T|SM-X|Nexus 7|Nexus 9|Nexus 10|Tab)\b/i', $ua);

            $deviceType = $isTablet ? 'Android Tablet' : 'Android Phone';

            // Check Client Hints model first
            if ($chModel !== '') {
                $cleanModel = self::formatAndroidModel($chModel);
                return "{$deviceType} ({$cleanModel})";
            }

            // Extract model from Android User-Agent string
            // Typical format: "Android [ver]; [locale]; [Model] Build/..." or "Android [ver]; [Model])"
            if (preg_match('/;\s*([A-Za-z0-9_\-\s\+]+?)\s+Build\//i', $ua, $matches)) {
                $model = trim($matches[1]);
                // Filter out generic phrases like 'wv' or 'en-us'
                if (! preg_match('/^(wv|mobile|[a-z]{2}-[a-z]{2})$/i', $model) && strlen($model) >= 2) {
                    $cleanModel = self::formatAndroidModel($model);
                    return "{$deviceType} ({$cleanModel})";
                }
            } elseif (preg_match('/Android\s+[\d\.]+;\s*([^;)]+)\)/i', $ua, $matches)) {
                $model = trim($matches[1]);
                if (! preg_match('/^(wv|mobile|[a-z]{2}-[a-z]{2})$/i', $model) && strlen($model) >= 2) {
                    $cleanModel = self::formatAndroidModel($model);
                    return "{$deviceType} ({$cleanModel})";
                }
            }

            return "{$deviceType} (model unavailable)";
        }

        // 4. Windows PC
        if (preg_match('/Windows\s*NT/i', $ua) || preg_match('/\bWindows\b/i', $ua)) {
            return 'Windows PC';
        }

        // 5. Mac
        if (preg_match('/\bMacintosh\b/i', $ua) || (preg_match('/\bMac OS X\b/i', $ua) && ! preg_match('/iPhone|iPad|iPod/i', $ua))) {
            return 'Mac';
        }

        // 6. Linux PC
        if (preg_match('/\bLinux\b/i', $ua) || preg_match('/\bX11\b/i', $ua)) {
            return 'Linux PC';
        }

        return 'Unknown Device';
    }

    /**
     * Detect Operating System and version.
     *
     * @param  array<string, ?string>  $hints
     */
    private static function detectOs(string $ua, array $hints): string
    {
        // 1. iOS / iPadOS
        if (preg_match('/(iPhone|iPad|iPod)\s+OS\s+([0-9_]+)/i', $ua, $matches)) {
            $version = str_replace('_', '.', $matches[2]);
            $name = strtolower($matches[1]) === 'ipad' ? 'iPadOS' : 'iOS';
            return "{$name} {$version}";
        }
        if (preg_match('/OS\s+([0-9_]+)\s+like\s+Mac\s+OS\s+X/i', $ua, $matches)) {
            $version = str_replace('_', '.', $matches[1]);
            $isIpad = (bool) preg_match('/iPad/i', $ua);
            $name = $isIpad ? 'iPadOS' : 'iOS';
            return "{$name} {$version}";
        }

        // 2. Android
        if (preg_match('/Android\s*([0-9\.]+)?/i', $ua, $matches)) {
            $version = isset($matches[1]) && trim($matches[1]) !== '' ? trim($matches[1]) : '';
            if ($version !== '') {
                return "Android {$version}";
            }

            $chVer = trim(trim((string) ($hints['sec-ch-ua-platform-version'] ?? '')), '"\'');
            if ($chVer !== '') {
                return "Android {$chVer}";
            }

            return 'Android';
        }

        // 3. Windows
        if (preg_match('/Windows\s*NT\s*([0-9\.]+)/i', $ua, $matches)) {
            $nt = $matches[1];
            $chVer = trim(trim((string) ($hints['sec-ch-ua-platform-version'] ?? '')), '"\'');
            $majorChVer = (int) explode('.', $chVer)[0];

            return match ($nt) {
                '10.0'  => ($majorChVer >= 13) ? 'Windows 11' : 'Windows 10/11',
                '6.3'   => 'Windows 8.1',
                '6.2'   => 'Windows 8',
                '6.1'   => 'Windows 7',
                '6.0'   => 'Windows Vista',
                '5.2'   => 'Windows XP x64',
                '5.1'   => 'Windows XP',
                default => "Windows NT {$nt}",
            };
        }
        if (preg_match('/Windows/i', $ua)) {
            return 'Windows';
        }

        // 4. macOS
        if (preg_match('/Mac\s*OS\s*X\s*([0-9_\.]+)/i', $ua, $matches)) {
            $version = str_replace('_', '.', $matches[1]);
            $friendly = self::macOsCodeName($version);
            return $friendly ? "macOS {$version} ({$friendly})" : "macOS {$version}";
        }
        if (preg_match('/Macintosh/i', $ua)) {
            return 'macOS';
        }

        // 5. Linux
        if (preg_match('/Ubuntu/i', $ua)) return 'Linux (Ubuntu)';
        if (preg_match('/Debian/i', $ua)) return 'Linux (Debian)';
        if (preg_match('/Fedora/i', $ua)) return 'Linux (Fedora)';
        if (preg_match('/Arch/i', $ua))   return 'Linux (Arch)';
        if (preg_match('/CentOS/i', $ua)) return 'Linux (CentOS)';
        if (preg_match('/Linux/i', $ua))  return 'Linux';

        return 'Unknown OS';
    }

    /**
     * Detect browser and major version.
     */
    private static function detectBrowser(string $ua): string
    {
        // Samsung Internet
        if (preg_match('/SamsungBrowser\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Samsung Internet {$ver}";
        }

        // Microsoft Edge
        if (preg_match('/(?:Edg|EdgA|EdgiOS)\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Edge {$ver}";
        }

        // Opera
        if (preg_match('/(?:OPR|OPT|Opera)\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Opera {$ver}";
        }

        // Brave
        if (preg_match('/\bBrave\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Brave {$ver}";
        }

        // UC Browser
        if (preg_match('/UCBrowser\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "UC Browser {$ver}";
        }

        // Chrome / Chromium (must check after Edge, Opera, Samsung, Brave)
        if (preg_match('/(?:Chrome|CriOS)\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Chrome {$ver}";
        }

        // Firefox
        if (preg_match('/(?:Firefox|FxiOS)\/([0-9\.]+)/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Firefox {$ver}";
        }

        // Safari (must check after Chrome and others)
        if (preg_match('/Version\/([0-9\.]+)\s+.*Safari/i', $ua, $matches)) {
            $ver = self::majorMinor($matches[1]);
            return "Safari {$ver}";
        }
        if (preg_match('/Safari/i', $ua)) {
            return 'Safari';
        }

        return 'Unknown Browser';
    }

    /**
     * Clean and format Android hardware models into common friendly names.
     */
    private static function formatAndroidModel(string $raw): string
    {
        $raw = trim($raw);

        // Samsung Galaxy series
        if (preg_match('/^SM-S928/i', $raw)) return "Galaxy S24 Ultra ({$raw})";
        if (preg_match('/^SM-S926/i', $raw)) return "Galaxy S24+ ({$raw})";
        if (preg_match('/^SM-S921/i', $raw)) return "Galaxy S24 ({$raw})";
        if (preg_match('/^SM-S918/i', $raw)) return "Galaxy S23 Ultra ({$raw})";
        if (preg_match('/^SM-S916/i', $raw)) return "Galaxy S23+ ({$raw})";
        if (preg_match('/^SM-S911/i', $raw)) return "Galaxy S23 ({$raw})";
        if (preg_match('/^SM-S908/i', $raw)) return "Galaxy S22 Ultra ({$raw})";
        if (preg_match('/^SM-S906/i', $raw)) return "Galaxy S22+ ({$raw})";
        if (preg_match('/^SM-S901/i', $raw)) return "Galaxy S22 ({$raw})";
        if (preg_match('/^SM-G998/i', $raw)) return "Galaxy S21 Ultra ({$raw})";
        if (preg_match('/^SM-A546/i', $raw)) return "Galaxy A54 ({$raw})";
        if (preg_match('/^SM-A536/i', $raw)) return "Galaxy A53 ({$raw})";
        if (preg_match('/^SM-A525/i', $raw)) return "Galaxy A52 ({$raw})";

        return $raw;
    }

    /**
     * Friendly macOS release name from version string.
     */
    private static function macOsCodeName(string $version): ?string
    {
        $parts = explode('.', $version);
        $major = (int) ($parts[0] ?? 0);
        $minor = (int) ($parts[1] ?? 0);

        if ($major === 15) return 'Sequoia';
        if ($major === 14) return 'Sonoma';
        if ($major === 13) return 'Ventura';
        if ($major === 12) return 'Monterey';
        if ($major === 11) return 'Big Sur';

        if ($major === 10) {
            return match ($minor) {
                15 => 'Catalina',
                14 => 'Mojave',
                13 => 'High Sierra',
                12 => 'Sierra',
                11 => 'El Capitan',
                10 => 'Yosemite',
                default => null,
            };
        }

        return null;
    }

    /**
     * Reduce version string to Major.Minor (e.g. 125.0.6422.80 -> 125.0).
     */
    private static function majorMinor(string $version): string
    {
        $parts = explode('.', $version);
        if (count($parts) >= 2) {
            return $parts[0] . '.' . $parts[1];
        }
        return $parts[0] ?? $version;
    }
}
