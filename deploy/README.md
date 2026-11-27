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

### 6. Set up email (Amazon SES)
Invitation emails are sent through Amazon SES. **The app won't start without these settings**, so finish this
step before deploying a version that includes invitations. If you deploy too early, the deploy fails and the
previous version keeps running.

Do everything in the **same region as the server**. The examples use `us-west-2` (Oregon).

1. **Verify the domain.** In the SES console, go to **Identities → Create identity → Domain**, enter
   `housemate.info`, and keep **Easy DKIM (RSA 2048-bit)** selected. SES shows three `CNAME` records. Add them
   in Cloudflare with the proxy set to **DNS only** (grey cloud). The identity shows **Verified**, usually within
   an hour.
2. **Add a DMARC record** in Cloudflare so receivers trust the DKIM signatures. Start in monitoring mode:
   `TXT` record `_dmarc` with value `v=DMARC1; p=none;`
3. **Create SMTP credentials.** Go to **SMTP settings → Create SMTP credentials**. This creates an IAM user that
   can only send email. Copy the **SMTP username and password**: AWS shows the password only once.
4. **Request production access.** New SES accounts start in a sandbox where you can only send to addresses you've
   verified. Go to **Account dashboard → Request production access**: choose *Transactional*, give the site URL,
   and describe the use, for example "Invitation emails sent when a user invites a specific person to their
   household. Low volume; no marketing." Approval usually takes about a day. Until then, verify your own email
   under **Identities** so you can test.
5. **Add the settings to the server:**
   ```bash
   ssh -i ~/.ssh/lightsail-housemate.pem ubuntu@STATIC_IP
   cat >> /opt/housemate/.env <<'EOF'
   MAIL_FROM=Housemate <no-reply@housemate.info>
   SMTP_USERNAME=<SMTP username from step 3>
   SMTP_PASSWORD=<SMTP password from step 3>
   EOF
   ```
   `MAIL_FROM` must be an address on the verified domain; no mailbox is needed. If the server isn't in
   `us-west-2`, also add `SMTP_ADDRESS=email-smtp.<region>.amazonaws.com`.

Lightsail blocks outgoing port 25 but not 587, which is the port the app uses.

### 7. Deploy
Push to `master`. The first deploy builds every image on the server, which takes a few minutes. Then open `https://housemate.example.com`.

## Day to day

- **Deploy:** push to `master`.
- **Logs:** `ssh ubuntu@IP 'cd /opt/housemate/app && docker compose -f docker-compose.prod.yml logs -f api'`
- **Rails console:** `docker compose -f docker-compose.prod.yml --env-file ../.env exec api bin/rails console`
- **Backups:** `/opt/housemate/backups/` (weekly on Sundays, last 4 kept). Restore instructions are at the top of `backup.sh`.
  These live on the same disk as the database, so the Lightsail snapshots are what protect you if the instance itself is lost.
- **Failed deploy:** the workflow fails and GitHub emails you. If the new API container won't start,
  fix the problem and push again, or revert the bad commit and push.
- **Email problems:** emails send in the background, so a failure shows up in the API logs rather than in the app:
  `docker compose -f docker-compose.prod.yml logs api | grep -iE "mail|smtp"`. The SES console's
  **Account dashboard** shows sending, bounce and complaint rates. Keep bounces under 5%, or SES pauses sending.
- **Trying email locally:** the dev stack (`docker compose up`) sends all email to Mailpit. Read it at http://localhost:8025.
