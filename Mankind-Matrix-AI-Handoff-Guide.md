# Mankind Matrix AI — Deployment, Operations & Support Handoff Guide

| Version | Last reviewed | Document owner | Status |
|---|---|---|---|
| 1.0 | 2026-11-08 | Deployment lead (Ranjith Kumar Cheruku) — confirm at handover | Handoff draft |

**How to read this guide.** *Verified* = observed on the live system during setup (November 2026). *Reported* = told to us by the team and not re-checked. **TBC** = To Be Confirmed (the owner is named in Section 12). No passwords, keys or tokens appear in this document — get them from the secure store described in Section 3.

## Quick start (one page)

| Item | Value |
|---|---|
| Website | https://mankindmatrixai.com (React, NameHero shared hosting) |
| API | https://api.mankindmatrixai.com (Nginx → Spring Boot on the VPS) |
| VPS login | `ssh -p 37980 root@165.140.71.212` — SSH is **not** on port 22 |
| Project folder on the VPS | `~/Mankind-backend` (Docker Compose) |
| Status | `cd ~/Mankind-backend && docker compose ps` → both containers `(healthy)` |
| Health | `curl -s https://api.mankindmatrixai.com/actuator/health` → `{"status":"UP",...}` |
| Logs | `docker compose logs --tail=100 mankind_services` |
| Deploy backend | Merge to `main` → GitHub Actions "Deploy backend to VPS" (can also be run by hand) |
| Deploy frontend | Merge to `master` → GitHub Actions "Deploy frontend to NameHero" (pipeline awaiting merge, see Section 4) |
| Never do | `docker system prune -a`; enabling a firewall without allowing port 37980; editing code directly on the VPS (it is overwritten at the next deploy); committing passwords to git |

## Section 1 — Project Overview

Mankind Matrix AI is an online store for AI and computing hardware (GPUs, AI accelerators, edge-AI kits). Visitors browse products, categories and reviews. Registered users can log in, add items to a cart, keep a wishlist, place orders and pay (Stripe). The API exposes products, categories, reviews, cart, wishlist, orders, payments, coupons, notifications, referrals and users.

| Layer | Technology | Where it runs |
|---|---|---|
| Frontend | React 19 (Create React App, react-scripts 5), built with Node 22 | NameHero Plus Cloud shared hosting (cPanel) |
| Backend | Java 17, Spring Boot, Maven — one application `mankind_services` (consolidated from microservices) | Docker on the NameHero Unmanaged Plus VPS |
| Authentication | Keycloak 26.0.5, realm `mankind`; the backend validates the JWT tokens | Docker on the same VPS |
| Database | MySQL on Aiven (external, TLS) | Aiven cloud |
| Reverse proxy / HTTPS | Nginx 1.24 + Let's Encrypt (Certbot) | VPS |
| DNS | GoDaddy | GoDaddy |
| Source / CI-CD | GitHub + GitHub Actions | GitHub |

**Links.** Frontend repository: https://github.com/Nikhilbansal777/mankind_matrix (branch `master`). Backend repository: https://github.com/Nikhilbansal777/Mankind-backend (branch `main`). Website: https://mankindmatrixai.com. API: https://api.mankindmatrixai.com (both `/products` and `/api/v1/products` work). The earlier address https://matrix-ai.mindstack-technologies.com is being retired (TBC whether already removed).

## Section 2 — Infrastructure & Architecture

```
 User browser
    │  HTTPS
    ├──► mankindmatrixai.com ──(GoDaddy DNS: A @ → 45.41.235.161)──► NameHero shared hosting
    │                                                                   React static files (cPanel)
    │
    └──► api.mankindmatrixai.com ─(GoDaddy DNS: A api → 165.140.71.212)─► NameHero VPS
              │ 443 (Let's Encrypt)
              ▼
           Nginx ──► mankind_services :8085 (Spring Boot) ──TLS──► Aiven MySQL
                              │
                              └──► Keycloak (Docker network name "keycloak", port 8080)

 GitHub ── Actions ──► SSH (port 37980) to the VPS      (backend)
        └─ Actions ──► FTPS (port 21) to NameHero         (frontend)
```

| Component | Hosting location | Purpose | Responsible (role) |
|---|---|---|---|
| React frontend | NameHero shared hosting, folder `/home6/mindstac/mankindmatrixai.com` | Website | Frontend owner |
| Spring Boot API | VPS, container `mankind_services` | Business logic, REST API | Backend owner |
| Keycloak | VPS, container `mankind-backend-keycloak-1` | Login, tokens | Backend / Keycloak owner |
| Nginx + Certbot | VPS | HTTPS entry point for the API | VPS owner |
| MySQL | Aiven (host `mankind-matrix-mankind-matrix.i.aivencloud.com`, port 26996, database `mankind_matrix_db`) | Application data (Keycloak also stores its data here) | DB owner |
| DNS | GoDaddy | Names → servers | DNS owner |
| CI/CD | GitHub Actions | Automatic deployment | CI/CD owner |

**Ports on the VPS (verified 2026-11-08)**

| Port | Service | Reachable from the internet? |
|---|---|---|
| 37980 | SSH | Yes (intended) |
| 80 / 443 | Nginx (HTTP redirect / HTTPS) | Yes (intended) |
| 8085 | Spring Boot app | **Yes — should be closed**; Nginx is the intended entry point |
| 8180 | Keycloak (maps to 8080 inside Docker) | **Yes — should be closed**; the admin console is exposed |

The NameHero panel firewall is disabled and no operating-system firewall is enabled. Both are open security items (Section 12). **Warning:** the panel firewall's default input policy is DROP; enabling it without a rule for port 37980 locks you out.

**DNS records (GoDaddy, `mankindmatrixai.com`, verified):** `A @` → 45.41.235.161, `A api` → 165.140.71.212, `CNAME www` → `mankindmatrixai.com`. Leave the NS, SOA, `_domainconnect` and `_dmarc` records alone.

## Section 3 — Access & Prerequisites

| System | Needed for | Access granted by | Credential location |
|---|---|---|---|
| GitHub (both repos) | Code, pull requests, Actions, secrets | Repository admin | GitHub account with 2FA |
| NameHero client portal | VPS panel: reboot, backups, firewall, support tickets | NameHero account holder | Team password manager (TBC: vault name) |
| NameHero cPanel (`node403.namehero.net:2083`) | File Manager, SSL/TLS Status, Domains, FTP accounts | Account holder | Team password manager |
| VPS SSH | Deployments, logs, Docker | VPS owner | SSH keys / password manager |
| GoDaddy | DNS for `mankindmatrixai.com` | Domain owner | Team password manager |
| Aiven console | Database status, backups, allow-list | DB owner | Team password manager |
| Keycloak admin | Realm and users | Keycloak owner | Team password manager |
| Deployment secrets | CI/CD | Repo admin | GitHub → repo → Settings → Secrets and variables → Actions |

**GitHub secrets (names only).** Backend repo: `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`. Frontend repo: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`. Optional frontend variables: `FTP_TLS_VERIFY`, `SITE_URL`, `API_HOST`.

**Rules.** Store credentials only in the team password manager or GitHub secrets — never in chat, email, tickets or git. **Warning:** the backend repository contains a committed `.env` file with real settings, including database credentials, in a public repository. Treat those credentials as exposed and rotate them (Section 12).

**Local tools.** Git; VS Code; an SSH client (OpenSSH, or Git Bash on Windows); Node.js 22 + npm (frontend build); Docker (only to run the backend locally); Postman or Bruno; curl. On Windows PowerShell use `curl.exe`; on the server use `curl`.

## Section 4 — Frontend Deployment

**Facts (verified)**

| Item | Value |
|---|---|
| Repository / branch | `Nikhilbansal777/mankind_matrix`, branch `master` |
| Build | `npm ci` then `npm run build` (Node 22) → folder `build/` (16 files) |
| Destination | cPanel document root `/home6/mindstac/mankindmatrixai.com` (File Manager path `/mankindmatrixai.com`); domain added as an addon domain with its own folder, not the company site in `public_html` |
| Upload account | FTP account `deploy@mankindmatrixai.com`, restricted to that folder; explicit FTPS on port 21; host `node403.namehero.net` (the name cPanel displays, `ftp.mindstack-technologies.com`, does not resolve) |
| Routing rule | `public/.htaccess` is copied into the build and sends unknown paths to `index.html` (needed for `/login`, `/product/1`) |

**Environment variables.** They live in the repository `.env` and are **baked in at build time**, so editing a file on the server does nothing — rebuild and redeploy. Names: `REACT_APP_ENV`; `REACT_APP_DEV_*_SERVICE_URL` and `REACT_APP_PROD_*_SERVICE_URL` for PRODUCT, USER, AUTH, WISHLIST, CART, ORDER and COUPON (all now point to `https://api.mankindmatrixai.com/api/v1...`); `REACT_APP_API_TIMEOUT`, retry settings, and the public Stripe publishable key. `REACT_APP_ENV` is still `development`: in that mode product pages show built-in sample data if the API fails, which can hide an outage. Switching to `production` is a team decision (Section 12).

**Automatic deployment** (`.github/workflows/deploy-frontend.yml`). *Status: tested successfully in a fork (about two minutes end to end); pull request #67 awaits merge and the secrets must be added by a repo admin.* On every push to `master` it: installs and builds; checks the build contains `api.mankindmatrixai.com` and no old URLs; uploads over FTPS (new files first, `index.html` last); deletes only files an earlier pipeline run uploaded (tracked in `.deploy-manifest.txt` on the server); then checks the live site. Start it by hand from Actions → "Deploy frontend to NameHero" → Run workflow. Success looks like `Live site OK: serves main.<hash>.js and /login works`. If it fails, read the `::error::` line: wrong `FTP_HOST`/`FTP_USER`/`FTP_PASSWORD`; a certificate error (temporary fallback: repository variable `FTP_TLS_VERIFY` = `no`); or port 21 unreachable (NameHero firewall). After the first pipeline run, delete leftover hand-uploaded files once in cPanel (anything in `static/` not listed in `.deploy-manifest.txt`).

**Manual deployment (fallback)**

```
git clone https://github.com/Nikhilbansal777/mankind_matrix.git
cd mankind_matrix && git checkout master
npm ci
npm run build        # set CI=false so lint warnings do not fail the build
```

Zip the *contents* of `build/` (including the hidden `.htaccess`), upload the zip in cPanel File Manager to `/mankindmatrixai.com`, click Extract there, then delete the zip. Never delete `.well-known`, `cgi-bin`, `php.ini` or `.user.ini`.

**SSL and DNS verification**

```
nslookup mankindmatrixai.com 8.8.8.8            # expect 45.41.235.161
curl -sI https://mankindmatrixai.com            # expect HTTP/2 200
```

In cPanel → SSL/TLS Status, `mankindmatrixai.com` must show a valid AutoSSL certificate, not "Self-signed". If it is self-signed although DNS is correct, run AutoSSL or ask NameHero support (they installed it for us in November 2026).

**Smoke tests.** Open the site in a private window and press Ctrl+F5; view the page source and confirm `main.<hash>.js` matches the pipeline log; open `/login` directly (must not be a 404); log in; open a product page with reviews; the browser console shows no red errors.

**Rollback.** Pipeline: run `git revert <bad-commit>` on `master` and merge; the pipeline redeploys the previous state in about three minutes. Manual: re-upload the last known-good build zip (always keep one).

## Section 5 — Backend Deployment

### 5.1 Initial server setup (done once — this is also the rebuild procedure after a VPS failure)

1. **Log in.** `ssh -p 37980 root@165.140.71.212`. NameHero's web console (noVNC) did not work, and SSH is on port 37980, not 22 (given by NameHero support).
2. **Add swap** so Docker builds do not run out of memory (the VPS has about 7.6 GB RAM):

```
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

3. **Install Docker.** If apt says "dpkg was interrupted", run `dpkg --configure -a` first. Then `curl -fsSL https://get.docker.com | sh`. Check `docker --version` and `docker compose version` (installed: Docker 29.9.2, Compose v5.6.1).
4. **Get the code.** `git clone https://github.com/Nikhilbansal777/Mankind-backend.git ~/Mankind-backend && cd ~/Mankind-backend`.
5. **Configuration.** Settings are in the repository `.env` (names below; values come from the secure store): `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` and the other `DB_*` options (Aiven); `KEYCLOAK_ISSUER_URL` (currently `http://localhost:8080` — see 5.5); `KEYCLOAK_URL`; `ADMIN_USERNAME` / `ADMIN_PASSWORD` (Keycloak admin); `STRIPE_SECRET_KEY`, `MAIL_*`, `SMS_*`; and the `*_SERVICE_URL` values, which must stay `http://127.0.0.1:8085` because the application calls itself — never put public URLs there. `docker-compose.yml` sets `SPRING_PROFILES_ACTIVE=prod`.
6. **Start.** `docker compose up -d --build` (first build about 2 minutes), then `docker compose ps`. Containers: `mankind_services` (port 8085) and `mankind-backend-keycloak-1` (port 8180 → 8080).
7. **Nginx and HTTPS.**

```
apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/api.mankindmatrixai.com`:

```
server {
    listen 80;
    server_name api.mankindmatrixai.com;
    client_max_body_size 10m;
    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```
ln -s /etc/nginx/sites-available/api.mankindmatrixai.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
certbot --nginx -d api.mankindmatrixai.com --agree-tos -m <team-email> --no-eff-email --redirect
```

Verified outcome: certificate issued (expires 2027-01-29) and a renewal timer installed.

8. **DNS.** In GoDaddy add `A api` → 165.140.71.212 (done).
9. **CI/CD key.** `ssh-keygen -t ed25519 -f ~/.ssh/gh_deploy -N "" -C "github-actions-deploy"`; append `~/.ssh/gh_deploy.pub` to `~/.ssh/authorized_keys`; paste the private key into the GitHub secret `VPS_SSH_KEY`; then `shred -u ~/.ssh/gh_deploy`.

### 5.2 Routine deployment (the normal way)

Merge a pull request into `main`. GitHub Actions workflow "Deploy backend to VPS" (`.github/workflows/deploy-backend.yml`) then: connects over SSH; uploads a deploy script and starts it detached under a lock (so cancelling the GitHub job does not interrupt a deployment already started, and two deployments never overlap); fetches `main`; runs `docker compose up -d --build` (only changed containers are recreated — Keycloak normally keeps running); waits up to about three minutes for `/actuator/health` to report UP; if it does not, restores the previous commit, rebuilds it and marks the run failed. Expect about 35 seconds of downtime while the app container is swapped. You can also start it from Actions → Run workflow (it only deploys `main`).

*Evidence:* tested against the real VPS from a fork — success in 58 seconds; a re-run with no changes restarted nothing; consecutive runs queued one at a time; runs from other branches were skipped. Failure and rollback paths were tested only in simulation. *TBC:* that the merged workflow in the main repository is this version (look for the step named "Deploy on the VPS (the deployment keeps running…)"), that its four secrets exist there, and that its first run there succeeded.

**Where to read a deployment log on the VPS:** `tail -n 30 $(ls -t /tmp/mankind-deploy-*.log | head -1)`. A last line `__DEPLOY_EXIT__=0` means success.

**Manual deployment (only if GitHub is unavailable)**

```
cd ~/Mankind-backend
git fetch origin main && git checkout -f -B main origin/main
docker compose up -d --build
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8085/actuator/health    # 200 after about a minute
```

**Warning:** the pipeline resets the folder to `main`, so anything edited by hand on the server is lost at the next deployment. Make changes through pull requests.

### 5.3 Everyday container commands (run in `~/Mankind-backend`)

| Task | Command |
|---|---|
| Status | `docker compose ps` |
| App logs | `docker compose logs --tail=100 mankind_services` |
| Keycloak logs | `docker compose logs --tail=100 keycloak` |
| Follow logs live | `docker compose logs -f --tail=50 mankind_services` (Ctrl+C to stop) |
| Restart the app | `docker compose restart mankind_services` |
| Apply a config change | `docker compose up -d --force-recreate mankind_services` |
| Restart Keycloak | `docker compose restart keycloak` (allow about 60 seconds) |

The app container has a 1.5 GB memory limit (Java heap max 1 GB) and takes 30–60 seconds to start; the Compose health check allows up to 120 seconds.

### 5.4 Aiven MySQL

Connection settings are the `DB_*` variables above; Aiven requires TLS. *TBC:* confirm that the TLS-related values in `.env` (for example `DB_USE_SSL`) match Aiven's requirement. Verify connectivity with the health endpoint (`"db":{"status":"UP"`, verified). Keycloak stores its data in the same Aiven database. From the VPS the application connected without any allow-list change (verified 2026-11-08); ask the DB owner whether an IP allow-list exists.

### 5.5 Keycloak — production configuration

*Today (verified):* Keycloak runs in development mode (`start-dev --import-realm`), the admin console is reachable on port 8180, and the admin account still uses the default credential from `.env`. This is not production-grade. *Target (TBC, backend owner):* run in production mode with a real hostname and HTTPS, strong admin credentials, port 8180 closed to the internet, and `KEYCLOAK_ISSUER_URL` updated to match.

**Rule that causes most login problems:** the backend accepts a token only if its issuer (`iss`) equals `KEYCLOAK_ISSUER_URL` + `/realms/mankind`. Tokens issued through the internal address carry `http://localhost:8080/...`, so `KEYCLOAK_ISSUER_URL=http://localhost:8080`. If Keycloak's hostname or port ever changes, update this variable, or every protected call returns 401 (diagnosis in Section 8, B7). The file `keycloak/mankind-realm.json` is imported only when the realm does not exist yet (Keycloak's default behaviour), so editing it does not change the live realm.

### 5.6 Backend rollback

*Automatic:* if the health check fails during a pipeline deployment, the previous commit is restored and rebuilt. *Manual:*

```
cd ~/Mankind-backend
git log --oneline -5                 # find the last good commit
git checkout -f <good-commit>
docker compose up -d --build
```

Verify with Section 6, then revert the bad change on `main` through a pull request — otherwise the next pipeline deployment redeploys it.

## Section 6 — Application Verification

| # | Check | Command or action | Expected result |
|---|---|---|---|
| 1 | Frontend over HTTPS | `curl -sI https://mankindmatrixai.com` | `HTTP/2 200`; padlock in the browser |
| 2 | SPA routing | `curl -s -o /dev/null -w "%{http_code}\n" https://mankindmatrixai.com/login` | `200` |
| 3 | Backend and health | `curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health` | `200` (verified) |
| 4 | Aiven connectivity | `curl -s https://api.mankindmatrixai.com/actuator/health` | JSON contains `"db":{"status":"UP"` (verified) |
| 5 | Product API | `curl -s "https://api.mankindmatrixai.com/api/v1/products?size=1"` | `200`, JSON with `content` (verified; 49 products at test time) |
| 6 | Other public APIs | `/api/v1/categories`, `/api/v1/suppliers`, `/api/v1/inventory/1`, `/api/v1/reviews/product/1` | `200` each (verified) |
| 7 | Keycloak path | `curl -s -X POST https://api.mankindmatrixai.com/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"nouser","password":"wrong"}'` | `{"status":401,"message":"Invalid username or password",...}` (verified). A 500 or empty reply means Keycloak is down |
| 8 | CORS | `curl -s -i -H "Origin: https://mankindmatrixai.com" "https://api.mankindmatrixai.com/api/v1/products?size=1"` | `200` and `Access-Control-Allow-Origin: https://mankindmatrixai.com` |
| 9 | Frontend ↔ backend | Open the site, press F12 → Console | No red errors; product pages show real data |
| 10 | Critical workflows | Logged in: login, reviews with usernames, Add to Cart, cart page, remove the item, Recently Viewed. Anonymous: reviews show "Hidden user"; Add to Cart asks you to log in | All work (verified Nov 2026) |

The routes `GET /products?page=0&size=5`, `/products/1` and `/products/featured` exist in the code (the frontend calls them) and are public; the same endpoint was verified with `size=1`, but these exact variants were not run separately — run each once (TBC). Test items added to a cart reserve stock in the shared database, so always remove them.

**Health endpoint access.** `/actuator/**` is currently public and returns component details, including database status. Recommended: restrict `/actuator` for the public in Nginx and monitor from inside. The deployment script checks `localhost:8085` directly, so it would not be affected. Decision TBC.

## Section 7 — Daily Operations & Maintenance

**Check status**

```
docker compose ps
curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health
uptime && free -h && df -h /
docker stats --no-stream
```

Investigate if: a container is not `(healthy)`; health is not 200; swap use stays above 50%; disk use passes 80% (`docker image prune -f` is safe — it removes only unused images).

**Review logs.** `docker compose logs --since 1h mankind_services | grep -E "ERROR|Exception"` — an empty result is good.

**Restart an unhealthy service safely**

1. Confirm it is really unhealthy (`docker compose ps`, health check, logs). Do not restart blindly.
2. Tell the team — expect 35–60 seconds of downtime.
3. `docker compose restart mankind_services` (or `keycloak`).
4. Wait for `(healthy)`, then run checks 3–7 from Section 6.
5. If it fails again, do not keep restarting: read the logs and escalate.

Never run `docker compose down` or `docker system prune -a` without the backend owner's approval.

**Aiven.** Watch the health `db` status and the Aiven console (service state, alerts, maintenance windows).

**SSL expiry.** Backend: `certbot certificates` (renews automatically about 30 days before expiry; test with `certbot renew --dry-run`). Also: `echo | openssl s_client -servername api.mankindmatrixai.com -connect api.mankindmatrixai.com:443 2>/dev/null | openssl x509 -noout -enddate`. Frontend: cPanel → SSL/TLS Status.

**Updates.** Application changes only through pull requests. OS updates: `apt update && apt list --upgradable`; apply in an approved maintenance window, then reboot and check that both containers come back (`restart: unless-stopped` is set; Nginx is enabled).

**Escalate** when: the site is down for more than 10 minutes after a restart; the database is unreachable; data loss or credential exposure is suspected; or a deployment fails twice (Section 11).

| When | Task |
|---|---|
| Daily | Site and health return 200; `docker compose ps` all healthy; failed GitHub Actions runs |
| Weekly | Error scan in logs; RAM, swap and disk trend; Aiven alerts; number of pending OS updates |
| Monthly | `certbot renew --dry-run`; apply OS updates in a window; review who has access (GitHub, NameHero, GoDaddy, Aiven); confirm backups exist and rotate credentials per policy |

## Section 8 — Common Issues, Challenges & Resolutions

Issues 1–9 come from the team's earlier local development and planning (**Reported** — not re-verified by us). Section 8B lists incidents we met and fixed while deploying to the VPS (**Verified**). Nothing is marked permanently resolved unless evidence says so.

### 8A — Earlier local development and planning (Reported)

**Issue 1 — Docker Desktop not starting (local Mac only; not relevant to the VPS)**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| The `docker` command exists but fails with Docker API / "cannot connect to the daemon" errors | Docker Engine was not running; Docker Desktop background processes were stuck | Quit Docker Desktop, wait 30 seconds, start it again. If processes stay stuck, restart the Mac — this resolved it. Diagnose with `docker version` (a Server section must appear) and `docker context ls` | `docker run --rm hello-world` works; `docker compose ps` works |

**Issue 2 — Duplicate Spring Boot beans after the monolith conversion**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| The app fails to start; errors name duplicate beans: `GlobalExceptionHandler`, `CurrentUserService`, `RoleVerificationService`, `PaymentService` | Each former microservice had classes with the same short name. Spring builds bean names from class names, so after merging everything into one application, two classes claimed one name | Applied locally by the team: unique bean names and exception-handler advice limited to its own package. These fixes must be confirmed in the approved branch (TBC). Diagnose: `docker compose logs --tail=200 mankind_services \| grep -E "ConflictingBeanDefinition\|APPLICATION FAILED"` | App starts and health is UP. The deployed `main` is healthy, so the conflict is not present there (verified) |

**Issue 3 — Spring Boot startup failure during component scanning**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| The container exits during startup | `ConflictingBeanDefinitionException` found in the logs (same cause as Issue 2) | Read the first `Caused by` line in the log and fix the named class. After the Issue 2 fixes the app started | `docker compose ps` shows `(healthy)` |

**Issue 4 — Hibernate lazy-loading failure on products**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| `/products` returned HTTP 500; log: `LazyInitializationException` for `Product.images` | A lazily loaded collection was read after the database session had closed. The app sets `open-in-view: false`, so no session stays open while results are mapped | `@Transactional(readOnly = true)` added to the product service read methods (team fix; confirm in the approved branch — TBC). Diagnose: `docker compose logs --since 5m mankind_services \| grep LazyInitializationException` | `/products` returns 200. The same pattern appeared for users later (8B, B6) |

**Issue 5 — Aiven MySQL connection warnings**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| HikariCP warnings that a connection failed validation or was closed after idle periods | *Likely, not proven:* an idle connection is closed by the database or the network before the pool retires it. Recovery was observed (later health checks were UP); a permanent fix is **not** confirmed | Diagnose: `docker compose logs --since 1h mankind_services \| grep -iE "hikari\|validation\|communications link"`; check the health `db` status; compare `DB_HIKARI_MAX_LIFETIME` and `DB_HIKARI_IDLE_TIMEOUT` in `.env` with Aiven's idle timeout (TBC) — the max lifetime should be shorter than the server's; check the Aiven console for maintenance events | Health `db` stays UP and no new warnings for 24 hours |

**Issue 6 — Keycloak health and configuration**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| Keycloak shows `starting` / `unhealthy`, or logins fail | Earlier local configuration had health-check concerns (Reported). Keycloak runs with `start-dev` and a default admin account — not production-ready | `docker compose ps`; `docker compose logs --tail=100 keycloak`; `curl -s http://localhost:8180/realms/mankind/.well-known/openid-configuration \| head -c 300` (JSON expected). Production hardening: Section 5.5 and 12 | Container `(healthy)` and the command returns JSON; a login works in the browser |

**Issue 7 — Hosting limitations**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| The backend could not run on the existing hosting | NameHero shared hosting serves static files and PHP; it cannot run a long-running Java/Docker application | A separate NameHero Unmanaged Plus VPS was selected; the frontend stays on shared hosting | `docker compose ps` on the VPS is healthy and the site loads from shared hosting (verified) |

**Issue 8 — External database connectivity**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| Health `db` is DOWN; timeouts, "connection refused" or "access denied" | Aiven runs outside NameHero. It needs outbound access from the VPS, a matching allow-list (if enabled), correct credentials and TLS settings, and a running database | From the VPS: `timeout 5 bash -c 'echo > /dev/tcp/mankind-matrix-mankind-matrix.i.aivencloud.com/26996' && echo reachable`. In the Aiven console: service running, and VPS IP 165.140.71.212 allowed if IP restriction is on. Check the `DB_*` values and TLS flags (TBC). Note: from the VPS the app connected without any allow-list change (verified 2026-11-08) | `"db":{"status":"UP"` in the health output |

**Issue 9 — Frontend/backend integration (general checklist; confirmed incidents are in 8B)**

| Symptom | Root cause or likely cause | Resolution or diagnostic steps | Verification |
|---|---|---|---|
| Browser error "Cannot connect to product service at …" | The build contains a wrong or `localhost` API URL (URLs are baked in at build time) | Check `REACT_APP_*_SERVICE_URL` in `.env`, rebuild, redeploy. Search the live bundle: `curl -s https://mankindmatrixai.com/static/js/main.<hash>.js \| grep -o "api.mankindmatrixai.com"` | Network tab shows calls to `https://api.mankindmatrixai.com/api/v1/...` |
| Red CORS error in the console; API answers 403 for the site | The site's origin is not in the allowed list in `MankindSecurityConfig.java` | Add the origin (code change + deploy); test with Section 6 check 8 | `Access-Control-Allow-Origin` header returned |
| Browser blocks calls ("mixed content") | An HTTPS page calling a plain `http://` API | Use only `https://api.mankindmatrixai.com` | Calls succeed over HTTPS |
| Logged-in actions fail with 401 | Token issuer mismatch, expired token, or Keycloak down | See Section 5.5 and 8B, B7 | Add to Cart works after login |
| Site or API unreachable by name | DNS record wrong or not yet propagated | `nslookup api.mankindmatrixai.com 8.8.8.8` → 165.140.71.212; `nslookup mankindmatrixai.com 8.8.8.8` → 45.41.235.161 | Names resolve to the expected IPs |

### 8B — Found and fixed during the VPS deployment (Verified, November 2026)

| # | Symptom | Cause | Resolution | Verification |
|---|---|---|---|---|
| B1 | SSH "connection refused" or timeout on port 22; NameHero console shows `{"errors":["Invalid API Endpoint"]}` | SSH listens on port 37980; the web console was not working on this VPS | `ssh -p 37980 root@165.140.71.212`; for panel problems open a NameHero ticket | Login prompt appears |
| B2 | Docker install fails: "dpkg was interrupted" | A package operation on the fresh image was left unfinished | `dpkg --configure -a`, then rerun the Docker install | `docker --version` works |
| B3 | Site calls fail; API returns 403 to the browser | The site's origin was missing from the CORS list | Origins `https://mankindmatrixai.com` and `https://www.mankindmatrixai.com` added in `MankindSecurityConfig.java` (PR #19, merged). The old Mindstack origin was removed | Section 6 check 8 |
| B4 | `/api/v1/categories`, `suppliers`, `inventory`, `reviews` return 401 (without the prefix they return 200) | `ApiV1PathRewriteFilter` had no rule for these paths, so the `/api/v1` prefix stayed and the request missed the public security rules | Fallback rule added: any other `/api/v1/...` path loses the prefix | `for p in categories suppliers inventory/1 reviews/product/1; do curl -s -o /dev/null -w "$p %{http_code}\n" https://api.mankindmatrixai.com/api/v1/$p; done` → all 200 |
| B5 | Reviews fail with HTTP 500 for logged-out visitors ("Authentication failed — please provide a valid JWT token") | `MankindFeignErrorDecoder` turns an internal 401 into a custom `AccessDeniedException`, which `ReviewService` did not catch | Exception added to the catch in `ReviewService`; anonymous visitors see reviews as "Hidden user" | `/api/v1/reviews/product/1` → 200 |
| B6 | Logged-in Add to Cart and reviews fail with 500; log shows `LazyInitializationException … User.customAttributes` on `/users/me` and `/users/batch` | Lazy collection read after the session closed (`open-in-view: false`) | `@Transactional(readOnly = true)` on `UserService.getUserById`, `getAllUsers`, `getUsersByIds`. A temporary override `SPRING_JPA_OPEN_IN_VIEW=true` was used while testing and later removed | Log in → Add to Cart works. Diagnose: `docker compose logs --since 5m mankind_services \| grep -E "LazyInitialization\|ERROR"` |
| B7 | Logged-in calls return 401 although login works | Issuer mismatch — see 5.5 | Set `KEYCLOAK_ISSUER_URL=http://localhost:8080` and recreate the app. Compare what Keycloak reports internally: `docker exec mankind_services wget -qO- http://keycloak:8080/realms/mankind/.well-known/openid-configuration \| grep -o '"issuer":"[^"]*"'` — it must equal the variable | Logged-in Add to Cart works |
| B8 | Opening the API URL in Chrome shows an XML error | The address bar asks for XML/HTML and some field names contain spaces (e.g. "Boost Clock") | Harmless. Use Postman/Bruno or `curl -H "Accept: application/json"`. The website is not affected | JSON appears in Postman |
| B9 | Site showed sample products or "Cannot connect to product service at http://localhost:8085" | Deployed build used `localhost` URLs; in `development` mode failed API calls fall back to built-in sample data | Rebuilt with the production API URLs (PR #66); see Section 4 | Network tab shows `api.mankindmatrixai.com` calls |
| B10 | Opening `/login` or `/product/1` directly gives 404 (LiteSpeed page) | The hosting had no rule to send unknown paths to `index.html` | `public/.htaccess` rewrite rule, shipped with every build | `curl -s -o /dev/null -w "%{http_code}\n" https://mankindmatrixai.com/login` → 200 |
| B11 | Browser "Your connection is not private" on the new domain | cPanel created a self-signed certificate; AutoSSL had not run after the DNS change | NameHero support ran AutoSSL | cPanel → SSL/TLS Status shows a valid certificate |
| B12 | GitHub Actions: first run failed right after adding a workflow; frontend upload hung 18 minutes | Secrets were not set yet; the first frontend script used `lftp` without time limits and the wrong FTP host | Secrets added; script rewritten with `curl`, hard time limits and a connection check; FTP host `node403.namehero.net` | Frontend run ends with `Live site OK` |
| B13 | `GET /recently-viewed` returns 500 for logged-out requests | The endpoint needs a user but is listed as public in the security rules | Not fixed — no user impact (the site calls it only when logged in); a proper 401 is the intended behaviour | Open item for developers |

## Section 9 — Troubleshooting Quick Reference

| Problem | First command or check | Next action | Escalate to |
|---|---|---|---|
| Website unavailable | `curl -sI https://mankindmatrixai.com \| head -1` | If not 200: in cPanel File Manager confirm `index.html` and `.htaccess` exist in `/mankindmatrixai.com`; check SSL/TLS Status; re-run the frontend pipeline | Frontend owner → NameHero support |
| Backend unavailable | `curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health` | 502/504: `docker compose ps` and logs. No answer at all: `systemctl status nginx`; check the VPS state in the NameHero portal | Backend owner / VPS owner |
| Container stopped | `docker compose ps -a` | `docker compose up -d`; read the exit reason with `docker compose logs --tail=200 <service>`; check memory with `free -h` | Backend owner |
| HTTP 404 | Which address? A website path → `.htaccess` present? An API path → check the route (both `/products` and `/api/v1/products` exist) | Website: re-deploy; API: `nginx -t`, then the route name | Frontend / backend owner |
| HTTP 500 | `docker compose logs --since 5m mankind_services \| grep -E "ERROR\|Caused by\|Exception"` | Match the exception to Section 8 (lazy loading, JWT/Keycloak, database) | Backend owner |
| Database connection failure | Health output `db` status; the `/dev/tcp` test in Issue 8 | Check the Aiven console, credentials and allow-list | DB owner |
| Keycloak login failure | `docker compose ps` (Keycloak healthy?); the wrong-password login test (Section 6, check 7) | 500/empty reply: `docker compose restart keycloak` and wait 60 seconds; 401 on logged-in calls: check the issuer (B7) | Backend / Keycloak owner |
| SSL certificate error | API: `certbot certificates`. Website: cPanel → SSL/TLS Status | API: `certbot renew --dry-run`, then `systemctl reload nginx`. Website: Run AutoSSL or ask NameHero | VPS owner / NameHero support |
| High CPU or RAM | `uptime`, `free -h`, `docker stats --no-stream`, `df -h /` | Find the container; restart the app container; look for error loops in logs; consider a VPS upgrade | VPS owner → NameHero |
| Deployment failure | GitHub Actions run → failed step; on the VPS `tail -n 40 $(ls -t /tmp/mankind-deploy-*.log \| head -1)` | Read the error; the backend rolls back automatically if unhealthy; fix and re-run | CI/CD owner |

## Section 10 — Backup, Recovery & Rollback

No backup is assumed to exist unless confirmed below.

| What | Why | Where / how | Owner | Status |
|---|---|---|---|---|
| Aiven MySQL | All business data and Keycloak's data | Aiven console → backups (automatic per Aiven plan) | DB owner | Retention and a restore test: TBC |
| VPS configuration | Rebuild after a failure | `.env` (also in git), `/etc/nginx/sites-available/api.mankindmatrixai.com`, `/etc/letsencrypt/` (certificates can be re-issued), `~/.ssh/authorized_keys` — keep copies in secure storage | VPS owner | TBC |
| VPS snapshot | Fast recovery | The NameHero portal offers Backups / Backup Schedules for the VPS | VPS owner | Whether any schedule is configured: TBC |
| Docker volumes | — | None defined: the app is stateless and Keycloak's data is in Aiven. The realm import file `keycloak/mankind-realm.json` is in git | — | Verified from `docker-compose.yml` |
| Frontend | Rollback | Source of truth is git `master`; also keep the last good build zip | Frontend owner | NameHero account backups: TBC |
| DNS records | Rebuild | Record list in Section 2; export from GoDaddy | DNS owner | TBC |

**Rollback.** Frontend: Section 4. Backend: Section 5.6. Database: there is no automatic rollback — restoring Aiven data needs DB-owner approval.

**Recovery after a VPS failure.** (1) Repeat Section 5.1 on a new or restored VPS (about one hour). (2) If the IP changed, update the GoDaddy `A api` record and, if Aiven restricts IPs, add the new IP there; re-add the deploy key. The pipeline uses the host name from the `VPS_HOST` secret, so update it if that is an IP. (3) Run the Section 6 checks.

**Validate a restore.** Health shows `db` UP; the product list loads; login works; Add to Cart works (remove the test item afterwards).

## Section 11 — Ownership, Support & Escalation

| Area | Primary (role) | Backup (role) | Contact |
|---|---|---|---|
| Frontend | Frontend developer | Backend developer | TBC |
| Backend | Backend developer | Tech lead | TBC |
| VPS / Linux | DevOps engineer | Backend developer | TBC |
| Keycloak | Backend developer | DevOps engineer | TBC |
| Aiven MySQL | Database owner | Tech lead | TBC |
| DNS (GoDaddy) | Domain owner | DevOps engineer | TBC |
| CI/CD (GitHub Actions) | DevOps engineer | Repo admin | TBC |
| Security | Tech lead | DevOps engineer | TBC |
| Backups | DevOps engineer | Database owner | TBC |
| Production incidents | On-call engineer (rotation TBC) | Tech lead | TBC |

**Minimum handoff details.** Name the account holders for NameHero, GoDaddy and Aiven; the GitHub repository admins (currently the `Nikhilbansal777` account and one further admin collaborator); where the password manager vault is; the escalation order (support engineer → area owner → tech lead); and who may approve production changes, OS reboots and credential rotation.

## Section 12 — Open Items & Final Handoff Checklist

| # | Open item | Why it matters | Owner (role) |
|---|---|---|---|
| 1 | Backend pipeline: confirm PR #20 is merged, the four secrets exist in `Nikhilbansal777/Mankind-backend`, the first run there is green, and the workflow has the detached-deploy step | Automatic deployment is not proven in the main repo | CI/CD owner |
| 2 | Frontend: merge PR #66, then PR #67; add `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`; finish the remaining pipeline tests (re-run, code change, cancel); delete leftover hand-uploaded files once | The frontend pipeline is tested only in a fork | Repo admin / frontend owner |
| 3 | Retire the old Mindstack frontend: remove the `matrix-ai` subdomain in cPanel and its GoDaddy record (the CORS entry is already removed) | Avoid a second, unmaintained copy of the site | Frontend owner / DNS owner |
| 4 | **Security (critical):** change the Keycloak admin credential and close port 8180; rotate the Aiven database password and take `.env` out of git (use secrets); close port 8085; enable a firewall that keeps 37980, 80 and 443; disable SSH password login and avoid daily root use; restrict public `/actuator` | Credentials are exposed in a public repo; admin and API ports are open to the internet | Tech lead / DevOps |
| 5 | OS updates (about 41 packages) and a kernel update waiting for a reboot — upgrade was deliberately skipped during setup | Security patches pending | DevOps (maintenance window) |
| 6 | Keycloak production mode and a real hostname (the `localhost:8080` issuer is a workaround) | Current setup is development-mode | Backend owner |
| 7 | Monitoring and alerting: none configured. Add an external uptime check for the site and `/actuator/health`, with alert email | Outages are noticed only by users today | DevOps |
| 8 | Backups: confirm Aiven backup retention, a VPS backup schedule, and run a restore test | No backup is verified | DB owner / DevOps |
| 9 | Confirm the Certbot contact email is a monitored mailbox | Renewal warnings | VPS owner |
| 10 | Branches and versions: record the backend `main` and frontend `master` commits that are live (backend `main` includes the merge of PR #19, commit `9389a29`); tag a release | Rollback needs a known good version | Tech lead |
| 11 | Product decisions: `REACT_APP_ENV` development vs production; anonymous `recently-viewed` 500 (B13); two "Test Notification" buttons visible on every page (development leftovers) | Quality and clarity | Frontend / backend owner |
| 12 | Production environment variables: sign-off list — Stripe, mail and SMS configured? `DB_USE_SSL` value? | Payments and notifications may not work | Backend owner |
| 13 | Final smoke-test sign-off (Section 6) on the final domains | Handoff acceptance | Support lead |

**Ready-to-support checklist (new support engineer)**

- [ ] I can log in to GitHub, NameHero (portal and cPanel), GoDaddy, Aiven and the VPS (`ssh -p 37980`)
- [ ] I know where credentials live and that none belong in chat, tickets or git
- [ ] I ran the Section 6 checks and understand each result
- [ ] I can read logs and restart a service safely (Section 7)
- [ ] I can trigger and read a backend and a frontend deployment (Sections 4 and 5)
- [ ] I know how to roll back both (Sections 4, 5.6 and 10)
- [ ] I have read Section 8 and can find the symptom I am seeing
- [ ] I know who to escalate to for each area (Section 11)
- [ ] I have read the open items, especially the security items (Section 12)
