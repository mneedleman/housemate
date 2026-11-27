#!/usr/bin/env bash
# Dumps the production database to /opt/housemate/backups and keeps 4 weeks.
# Installed as a weekly cron job by setup-server.sh. Restore with:
#   gunzip -c FILE.sql.gz | docker compose -f docker-compose.prod.yml --env-file ../.env exec -T db psql -U postgres housemate_production
set -euo pipefail

BASE=/opt/housemate
cd "$BASE/app"

FILE="$BASE/backups/housemate-$(date +%Y%m%d-%H%M%S).sql.gz"
docker compose -f docker-compose.prod.yml --env-file ../.env exec -T db \
  pg_dump -U postgres --clean --if-exists housemate_production | gzip > "$FILE"

find "$BASE/backups" -name 'housemate-*.sql.gz' -mtime +28 -delete
echo "$(date) backup ok: $FILE ($(du -h "$FILE" | cut -f1))"
