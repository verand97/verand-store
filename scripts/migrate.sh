#!/usr/bin/env bash
# Run database migrations & seeders for the Verand Store backend.
set -e
cd "$(dirname "$0")/../backend"
php artisan migrate --seed --force
echo "Migrations & seed complete."
