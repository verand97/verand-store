#!/usr/bin/env bash
# Back up the Verand Store MySQL database.
set -e
STAMP=$(date +%Y%m%d_%H%M%S)
OUT="backup_verand_store_${STAMP}.sql"
mysqldump -u "${DB_USERNAME:-root}" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "${DB_DATABASE:-verand_store}" > "$OUT"
echo "Backup written to $OUT"
