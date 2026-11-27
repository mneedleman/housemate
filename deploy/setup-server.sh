#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 24.04 Lightsail instance.
# Usage (on the server):  sudo bash setup-server.sh housemate.example.com
set -euo pipefail

APP_DOMAIN="${1:?usage: sudo bash setup-server.sh <your-domain>}"
APP_USER="${SUDO_USER:-ubuntu}"
BASE=/opt/housemate

echo "==> Installing Docker"
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
usermod -aG docker "$APP_USER"
apt-get install -y rsync

echo "==> Adding 2G swap (Rails + Postgres + image builds on a 2GB box)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> Enabling automatic security updates"
apt-get install -y unattended-upgrades
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Creating $BASE"
mkdir -p "$BASE/app" "$BASE/backups"
chown -R "$APP_USER:$APP_USER" "$BASE"

if [ ! -f "$BASE/.env" ]; then
  echo "==> Generating secrets in $BASE/.env"
  cat > "$BASE/.env" <<EOF
APP_DOMAIN=$APP_DOMAIN
POSTGRES_PASSWORD=$(openssl rand -hex 24)
SECRET_KEY_BASE=$(openssl rand -hex 64)
EOF
  chown "$APP_USER:$APP_USER" "$BASE/.env"
  chmod 600 "$BASE/.env"
else
  echo "==> $BASE/.env already exists, leaving it alone"
fi

echo "==> Installing weekly database backup (Sundays 03:00, keeps 4 weeks)"
cat > /etc/cron.d/housemate-backup <<EOF
0 3 * * 0 $APP_USER bash $BASE/app/deploy/backup.sh >> $BASE/backups/backup.log 2>&1
EOF

echo
echo "Done. Next: add the GitHub Actions deploy key to /home/$APP_USER/.ssh/authorized_keys"
echo "(see deploy/README.md), then push to master."
