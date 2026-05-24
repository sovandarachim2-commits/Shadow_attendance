#!/bin/bash
# Run ON Hostinger after uploading/extracting the zip.
# Usage: bash deploy/hostinger-ssh.sh

set -e
SITE=lightgoldenrodyellow-mantis-338653.hostingersite.com
ROOT=~/domains/${SITE}/public_html
BACKEND="${ROOT}/backend"

echo "==> Site root: ${ROOT}"
cd "${ROOT}"

if [ ! -f .env ]; then
  cp deploy/.env.hostinger .env
  echo "Created .env from template — edit it: nano .env"
fi

cd "${BACKEND}"
composer install --no-dev --optimize-autoloader
php artisan storage:link
php artisan migrate --path=database/migrations/2026_05_20_000001_add_telegram_chat_id_to_employees_table.php --force || true
php artisan config:clear
php artisan config:cache
php artisan route:cache
chmod -R 775 storage bootstrap/cache

echo ""
echo "Done. Test: curl -sS https://${SITE}/up"
echo "Images: set ATTENDANCE_IMAGES_DISK=public in .env if R2 TLS fails"
