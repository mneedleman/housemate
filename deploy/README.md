# Deploying Housemate

Everything runs on one Lightsail instance with Docker Compose:

```
Internet ──► Caddy (web)  :80/:443, automatic HTTPS
               ├── /graphql, /up  → Rails (api) :3000
               └── everything else → React build (static, SPA fallback)
                                       Rails ──► Postgres (db), volume pg_data
```

Every push to `master` runs the API specs, Brakeman and the client typecheck/build in GitHub Actions.
The deploy job runs only if all of those pass. Pull requests get the checks but never deploy.

## One-time setup

### 1. Create the server
1. Lightsail console → **Create instance** → Linux/Unix → **OS Only: Ubuntu 24.04 LTS** → the **2 GB** plan.
2. **Networking** tab: attach a **static IP**. In the IPv4 firewall, add **HTTPS (443)**. HTTP (80) and SSH (22) are open by default.
3. **Snapshots** tab: turn on **automatic snapshots**.

### 2. Point your domain at it
Create an `A` record for your domain (e.g. `housemate.example.com`) pointing at the static IP.
Caddy can't get a certificate until this record resolves.

### 3. Run the setup script
From your Mac:
```bash
scp -i ~/Downloads/LightsailDefaultKey.pem deploy/setup-server.sh ubuntu@STATIC_IP:
ssh -i ~/Downloads/LightsailDefaultKey.pem ubuntu@STATIC_IP 'sudo bash setup-server.sh housemate.example.com'
```
This installs Docker, adds swap, turns on security updates, creates `/opt/housemate/.env` with generated
secrets, and schedules a weekly database backup. **Back up `/opt/housemate/.env` somewhere safe.**
If you lose `SECRET_KEY_BASE`, everyone gets logged out. If you lose `POSTGRES_PASSWORD`, you can't reach the database.

### 4. Create a deploy key for GitHub Actions
```bash
ssh-keygen -t ed25519 -f ~/.ssh/housemate-deploy -N "" -C "github-actions-deploy"
ssh -i ~/Downloads/LightsailDefaultKey.pem ubuntu@STATIC_IP "cat >> ~/.ssh/authorized_keys" < ~/.ssh/housemate-deploy.pub
ssh-keyscan STATIC_IP   # copy this output for DEPLOY_KNOWN_HOSTS
```

### 5. Add GitHub repo settings
Repo → **Settings → Secrets and variables → Actions**:

| Kind | Name | Value |
|---|---|---|
| Secret | `DEPLOY_HOST` | the static IP |
| Secret | `DEPLOY_SSH_KEY` | contents of `~/.ssh/housemate-deploy` (the private key) |
| Secret | `DEPLOY_KNOWN_HOSTS` | the `ssh-keyscan` output |
| Variable | `APP_DOMAIN` | `housemate.example.com` |
| Variable | `DEPLOY_USER` | optional, defaults to `ubuntu` |

Optionally, protect `master` (**Settings → Branches**) and require the "API tests" and "Client build" checks to pass before merging.

### 6. Deploy
Push to `master`. The first deploy builds every image on the server, which takes a few minutes. Then open `https://housemate.example.com`.

## Day to day

- **Deploy:** push to `master`.
- **Logs:** `ssh ubuntu@IP 'cd /opt/housemate/app && docker compose -f docker-compose.prod.yml logs -f api'`
- **Rails console:** `docker compose -f docker-compose.prod.yml --env-file ../.env exec api bin/rails console`
- **Backups:** `/opt/housemate/backups/` (weekly on Sundays, last 4 kept). Restore instructions are at the top of `backup.sh`.
  These live on the same disk as the database, so the Lightsail snapshots are what protect you if the instance itself is lost.
- **Failed deploy:** the workflow fails and GitHub emails you. If the new API container won't start,
  fix the problem and push again, or revert the bad commit and push.
