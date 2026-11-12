# Mankind Matrix AI — Deployment, Operations & Support Handoff Guide

| Version | Last reviewed | Document owner | Status |
|---|---|---|---|
| 1.1 | 2026-11-09 | Deployment lead (Ranjith Kumar Cheruku) — update at handover | Ready for handoff |

**Legend.** *Verified* = checked on the live system in November 2026. **TBC** = to be confirmed by the owner named in Section 12. This guide never contains passwords, keys or tokens — get them from the team password manager.

## Quick start

| What | How |
|---|---|
| Website | https://mankindmatrixai.com |
| API | https://api.mankindmatrixai.com |
| Is it healthy? | `curl -s https://api.mankindmatrixai.com/actuator/health` → `{"status":"UP",...}` |
| Log in to the server | `ssh -p 37980 root@165.140.71.212` (SSH is on port **37980**, not 22) |
| Project folder on the server | `~/Mankind-backend` |
| Container status | `cd ~/Mankind-backend && docker compose ps` → both `(healthy)` |
| App logs | `docker compose logs --tail=100 mankind_services` |
| Deploy the backend | Merge a pull request into `main` → GitHub Actions "Deploy backend to VPS" |
| Deploy the frontend | Merge into `master` → GitHub Actions "Deploy frontend to NameHero" (status in Section 4) |
| Never | run `docker system prune -a`; turn on a firewall without allowing port 37980; edit code on the server (the next deploy overwrites it); put passwords in git |

## 1. Project Overview

Mankind Matrix AI is an online store for AI and computing hardware. Visitors browse products and reviews; registered users log in, use a cart and wishlist, place orders and pay with Stripe.

| Layer | Technology | Runs on |
|---|---|---|
| Frontend | React 19 (Create React App), built with Node 22 | NameHero shared hosting (cPanel) |
| Backend | Java 17, Spring Boot, Maven — one application, `mankind_services` (merged from microservices) | Docker on the NameHero Unmanaged Plus VPS |
| Login | Keycloak 26.0.5 (realm `mankind`); the backend checks its JWT tokens | Docker on the same VPS |
| Database | MySQL on Aiven (outside NameHero) | Aiven cloud |
| HTTPS for the API | Nginx 1.24 + Let's Encrypt (Certbot) | The VPS |
| DNS / code / CI-CD | GoDaddy / GitHub / GitHub Actions | — |

| Link | Address |
|---|---|
| Frontend repository | https://github.com/Nikhilbansal777/mankind_matrix (branch `master`) |
| Backend repository | https://github.com/Nikhilbansal777/Mankind-backend (branch `main`) |
| Website | https://mankindmatrixai.com |
| API | https://api.mankindmatrixai.com (`/products` and `/api/v1/products` both work) |

The earlier address `matrix-ai.mindstack-technologies.com` is being retired (Section 12).

## 2. Infrastructure & Architecture

```
Browser ──HTTPS──► mankindmatrixai.com ──► NameHero shared hosting (React files)
   │
   └──HTTPS──► api.mankindmatrixai.com ──► VPS: Nginx ──► Spring Boot app :8085 ──► Aiven MySQL
                                                    └──► Keycloak (login), port 8080 inside Docker

GitHub Actions ──SSH──► VPS            (backend deployment)
GitHub Actions ──FTPS─► NameHero       (frontend deployment)
DNS for both names: GoDaddy
```

| Component | Where | Purpose | Responsible (role) |
|---|---|---|---|
| React site | NameHero shared hosting, folder `/home6/mindstac/mankindmatrixai.com` | Website | Frontend owner |
| Spring Boot API | VPS, container `mankind_services` | Business logic, REST API | Backend owner |
| Keycloak | VPS, container `mankind-backend-keycloak-1` | Login and tokens | Backend owner |
| Nginx + Certbot | VPS | HTTPS entry point for the API | VPS owner |
| MySQL | Aiven: host `mankind-matrix-mankind-matrix.i.aivencloud.com`, port 26996, database `mankind_matrix_db` | Application data (Keycloak uses the same database) | DB owner |
| DNS | GoDaddy: `A @` → 45.41.235.161 (hosting), `A api` → 165.140.71.212 (VPS), `CNAME www` | Names → servers | DNS owner |
| CI/CD | GitHub Actions | Automatic deployment | CI/CD owner |

**Ports on the VPS.** Intended to be open: 37980 (SSH), 80 and 443 (Nginx). Also open today, and should be closed: 8085 (the app) and 8180 (Keycloak admin console). Docker publishes both and no firewall is configured (Section 12). **Warning:** the NameHero panel firewall blocks everything by default once enabled; add a rule for port 37980 first or you lock yourself out.

## 3. Access & Prerequisites

| System | Used for | Granted by |
|---|---|---|
| GitHub (both repositories) | Code, pull requests, Actions, secrets | Repository admin |
| NameHero portal | VPS panel: reboot, backups, firewall, support tickets | NameHero account holder |
| NameHero cPanel (`node403.namehero.net:2083`) | File Manager, SSL status, domains, FTP accounts | Account holder |
| VPS SSH | Deployments, logs, Docker | VPS owner |
| GoDaddy | DNS | Domain owner |
| Aiven console | Database status and backups | DB owner |
| Keycloak admin (port 8180) | Realm and users | Backend owner |

**Credentials.** Keep them only in the team password manager (TBC: which vault) or in GitHub secrets — never in chat, email, tickets or git. **Warning:** the backend repository contains a committed `.env` file with real settings, including database credentials, in a public repository. Treat them as exposed and rotate them (Section 12).

**GitHub secrets (names only).** Backend repository: `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`. Frontend repository: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`; optional variables `FTP_TLS_VERIFY`, `SITE_URL`, `API_HOST`.

**Tools on your computer.** Git, VS Code, an SSH client (Git Bash on Windows), Node.js 22 with npm, Postman or Bruno, curl. In Windows PowerShell type `curl.exe`; on the server type `curl`. Docker is needed only to run the backend locally.

## 4. Frontend Deployment

| Item | Value |
|---|---|
| Repository and branch | `Nikhilbansal777/mankind_matrix`, branch `master` |
| Build | `npm ci`, then `npm run build` → folder `build/` |
| Destination | cPanel folder `/mankindmatrixai.com` (full path `/home6/mindstac/mankindmatrixai.com`) — its own folder, separate from the company site |
| Upload account | FTP account `deploy@mankindmatrixai.com` (limited to that folder), explicit FTPS, port 21, host `node403.namehero.net` |

**Settings.** The API addresses are in the repository file `.env` (`REACT_APP_*_SERVICE_URL`, all pointing to `https://api.mankindmatrixai.com/api/v1...`). They are **baked in when the site is built**: changing a file on the server does nothing — change `.env`, rebuild, redeploy. `REACT_APP_ENV` is still `development`; in that mode product pages show built-in sample data if the API fails, which can hide an outage. Whether to switch to `production` is a team decision (Section 12).

**Normal deployment (pipeline).** Workflow `.github/workflows/deploy-frontend.yml` runs on every push to `master`: it builds, checks that the build points to `api.mankindmatrixai.com`, uploads over FTPS (new files first, `index.html` last), removes only files an earlier pipeline run uploaded, and finally checks the live site. Start it by hand with Actions → "Deploy frontend to NameHero" → Run workflow. Success ends with `Live site OK`. If it fails, read the `::error::` line of the failed step (wrong secret values, a certificate message, or port 21 unreachable). *Status:* tested successfully from a fork (about two minutes end to end); pull requests #66 (API addresses, `.htaccess`) and #67 (workflow) must be merged and the three FTP secrets added by a repository admin (TBC).

**Manual deployment (if the pipeline is unavailable)**

1. `git clone https://github.com/Nikhilbansal777/mankind_matrix.git && cd mankind_matrix && git checkout master`
2. `npm ci`
3. `npm run build` (set `CI=false` so warnings do not stop the build)
4. Zip the **contents** of `build/`, including the hidden `.htaccess`.
5. In cPanel File Manager open `/mankindmatrixai.com`, upload the zip, click Extract, then delete the zip. Never delete `.well-known`, `cgi-bin`, `php.ini` or `.user.ini`.

**Verify**

```
nslookup mankindmatrixai.com 8.8.8.8        # expect 45.41.235.161
curl -sI https://mankindmatrixai.com        # expect HTTP/2 200
```

Then: open the site in a private window (Ctrl+F5); view the page source and check that `main.<hash>.js` matches the pipeline log; open `/login` directly (not a 404); log in; open a product page. In cPanel → SSL/TLS Status the domain must show a valid certificate, not "Self-signed" — if it does, click Run AutoSSL or ask NameHero support.

**Rollback.** Revert the bad commit on `master` (`git revert <commit>`) and merge; the pipeline redeploys in about three minutes. Manually: re-upload the last good build zip (always keep one).

## 5. Backend Deployment

### 5.1 Normal deployment (pipeline)

Merge a pull request into `main`. Workflow "Deploy backend to VPS" then logs in over SSH, pulls `main`, runs `docker compose up -d --build` (only changed containers are replaced; Keycloak normally keeps running), and waits up to about 3 minutes for `/actuator/health` to report UP. If it does not, it restores the previous commit and marks the run failed. The API is unavailable for about 35 seconds during the swap. You can also run it from Actions → Run workflow (it deploys `main` only).

*Evidence:* tested against the real VPS from a fork — a run took 58 seconds, a re-run with no change restarted nothing, and runs queued one at a time. *TBC:* that the merged workflow in the main repository is the final version, that its four secrets exist there, and that its first run there succeeded.

To read a deployment log on the server: `tail -n 30 $(ls -t /tmp/mankind-deploy-*.log | head -1)` — a last line `__DEPLOY_EXIT__=0` means success. (If that file does not exist, read the GitHub Actions log instead.)

### 5.2 Manual deployment (only if GitHub is unavailable)

```
cd ~/Mankind-backend
git fetch origin main && git checkout -f -B main origin/main
docker compose up -d --build
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8085/actuator/health    # 200 after about a minute
```

**Warning:** the pipeline resets this folder to `main`, so anything edited by hand on the server is lost at the next deployment. Make changes through pull requests.

### 5.3 Rollback

*Automatic:* a failed health check during a pipeline deployment restores the previous commit. *Manual:*

```
cd ~/Mankind-backend
git log --oneline -5                 # find the last good commit
git checkout -f <good-commit>
docker compose up -d --build
```

Then check Section 6 and revert the bad change on `main` through a pull request — otherwise the next deployment redeploys it.

### 5.4 Things you must know

- **Settings** are in the repository file `.env` (values from the secure store): `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` and other `DB_*` options (Aiven); `KEYCLOAK_ISSUER_URL`; `ADMIN_USERNAME`/`ADMIN_PASSWORD` (Keycloak admin); `STRIPE_SECRET_KEY`, `MAIL_*`, `SMS_*`. The `*_SERVICE_URL` values must stay `http://127.0.0.1:8085` — the application calls itself, never a public address.
- **Database.** Aiven requires TLS; confirm the `DB_USE_SSL` setting matches (TBC). Health output `"db":{"status":"UP"` proves the connection (verified). From the VPS the app connected without any Aiven allow-list change; ask the DB owner whether one exists. Keycloak keeps its data in the same database.
- **Keycloak is in development mode** (`start-dev`) with a default admin account and a public admin port — not production-ready (Section 12).
- **Token issuer rule (the most common cause of 401s).** The backend accepts a token only if its issuer equals `KEYCLOAK_ISSUER_URL` + `/realms/mankind`. Tokens carry `http://localhost:8080/...`, so `KEYCLOAK_ISSUER_URL=http://localhost:8080`. If Keycloak's hostname or port changes, update this variable or all logged-in calls fail.

### 5.5 One-time server setup (only needed to rebuild a lost VPS)

1. **Log in:** `ssh -p 37980 root@165.140.71.212`. NameHero's web console does not work; the SSH port came from NameHero support.
2. **Add swap** (the VPS has about 7.6 GB RAM):

```
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

3. **Install Docker.** If apt reports "dpkg was interrupted", run `dpkg --configure -a` first. Then `curl -fsSL https://get.docker.com | sh` and check `docker --version` and `docker compose version`.
4. **Get the code:** `git clone https://github.com/Nikhilbansal777/Mankind-backend.git ~/Mankind-backend && cd ~/Mankind-backend`
5. **Start:** `docker compose up -d --build` (first build about 2 minutes), then `docker compose ps`. Containers: `mankind_services` (port 8085) and `mankind-backend-keycloak-1` (port 8180).
6. **Nginx and HTTPS.** `apt install -y nginx certbot python3-certbot-nginx`, then create `/etc/nginx/sites-available/api.mankindmatrixai.com`:

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

```
ln -s /etc/nginx/sites-available/api.mankindmatrixai.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
certbot --nginx -d api.mankindmatrixai.com --agree-tos -m <team-email> --no-eff-email --redirect
```

7. **DNS.** In GoDaddy set `A api` → the VPS IP (165.140.71.212).
8. **Deployment key for GitHub.** `ssh-keygen -t ed25519 -f ~/.ssh/gh_deploy -N "" -C "github-actions-deploy"`; append `~/.ssh/gh_deploy.pub` to `~/.ssh/authorized_keys`; paste the private key into the GitHub secret `VPS_SSH_KEY`; then `shred -u ~/.ssh/gh_deploy`.
9. **Check** with Section 6. Verified outcome of step 6: certificate issued (expires 2027-01-29) with automatic renewal.

## 6. Application Verification

| # | Check | Command or action | Expected |
|---|---|---|---|
| 1 | Website over HTTPS | `curl -sI https://mankindmatrixai.com` | `HTTP/2 200` |
| 2 | Direct page address | `curl -s -o /dev/null -w "%{http_code}\n" https://mankindmatrixai.com/login` | `200` |
| 3 | API and health | `curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health` | `200` (verified) |
| 4 | Database | `curl -s https://api.mankindmatrixai.com/actuator/health` | contains `"db":{"status":"UP"` (verified) |
| 5 | Product API | `curl -s "https://api.mankindmatrixai.com/api/v1/products?size=1"` | `200`, JSON with `content` (verified; 49 products at test time) |
| 6 | Login service | `curl -s -X POST https://api.mankindmatrixai.com/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"nouser","password":"wrong"}'` | `{"status":401,"message":"Invalid username or password",...}` (verified). A 500 or empty reply means Keycloak is down |
| 7 | Browser allowed (CORS) | `curl -s -i -H "Origin: https://mankindmatrixai.com" "https://api.mankindmatrixai.com/api/v1/products?size=1"` | `200` and `Access-Control-Allow-Origin: https://mankindmatrixai.com` |
| 8 | Real user flow | Logged out: product page with reviews ("Hidden user"). Logged in: reviews with names, Add to Cart, cart page, remove the item | All work (verified) |

Other public API routes (`/api/v1/categories`, `/suppliers`, `/inventory/1`, `/reviews/product/1`) return 200 (verified). `/products/1` and `/products/featured` exist in the code and are public but were not run separately — run them once (TBC). Test items in a cart reserve stock in the shared database: always remove them.

**Health endpoint access.** `/actuator/health` is public and shows component details, including database status. Restricting it from the public in Nginx is recommended; the deployment script checks `localhost:8085` directly, so it would not be affected (decision TBC).

## 7. Daily Operations & Maintenance

**Check status** (run on the server in `~/Mankind-backend`):

```
docker compose ps
curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health
uptime && free -h && df -h /
docker stats --no-stream
```

Look further if a container is not `(healthy)`, health is not 200, swap stays above 50%, or disk passes 80% (`docker image prune -f` is safe; it removes only unused images).

| Task | Command |
|---|---|
| App logs | `docker compose logs --tail=100 mankind_services` |
| Errors in the last hour | `docker compose logs --since 1h mankind_services \| grep -E "ERROR\|Exception"` (empty = good) |
| Keycloak logs | `docker compose logs --tail=100 keycloak` |
| Restart the app | `docker compose restart mankind_services` |
| Restart Keycloak | `docker compose restart keycloak` (allow 60 seconds) |
| Apply a changed setting | `docker compose up -d --force-recreate mankind_services` |

**Restart an unhealthy service safely.** (1) Confirm the problem with `docker compose ps`, the health check and the logs — do not restart blindly. (2) Tell the team; expect 35–60 seconds of downtime. (3) Restart the service. (4) Wait for `(healthy)`, then run checks 3–6 in Section 6. (5) If it fails again, stop restarting, read the logs and escalate. Never run `docker compose down` or `docker system prune -a` without the backend owner's approval.

**SSL expiry.** API: `certbot certificates` (renews automatically about 30 days before expiry; test with `certbot renew --dry-run`). Website: cPanel → SSL/TLS Status.

**Updates.** Application changes go through pull requests only. OS updates: `apt update && apt list --upgradable`; apply in an approved maintenance window, reboot, and check both containers return (`restart: unless-stopped` is set).

**Aiven.** Watch the health `db` status and the Aiven console (service state, alerts, maintenance).

**Escalate** (Section 11) when the site is down more than 10 minutes after a restart, the database is unreachable, data loss or exposed credentials are suspected, or a deployment fails twice.

| When | Check |
|---|---|
| Daily | Site and health return 200; all containers healthy; no failed GitHub Actions runs |
| Weekly | Error scan in logs; RAM, swap and disk trend; Aiven alerts; number of pending OS updates |
| Monthly | `certbot renew --dry-run`; OS updates in a window; review who has access (GitHub, NameHero, GoDaddy, Aiven); confirm backups exist |

## 8. Common Issues, Challenges & Resolutions

**A. Problems met and fixed during the VPS deployment (verified, November 2026)**

| Symptom | Cause | Fix or check | Verify |
|---|---|---|---|
| **Cannot reach the server:** SSH refused or timed out; NameHero console shows `Invalid API Endpoint` | SSH listens on port 37980; the web console does not work on this VPS | `ssh -p 37980 root@165.140.71.212`; otherwise open a NameHero ticket | Login prompt appears |
| **Docker install stops:** "dpkg was interrupted" | Unfinished package operation on the fresh server | `dpkg --configure -a`, then rerun the install | `docker --version` works |
| **Browser calls fail; API answers 403** | The site's address is missing from the allowed origins in `MankindSecurityConfig.java` | Add the origin and deploy (done for `mankindmatrixai.com` and `www`, PR #19) | Section 6 check 7 |
| **`/api/v1/...` returns 401** (categories, suppliers, inventory, reviews) | `ApiV1PathRewriteFilter` had no rule for them, so they missed the public security rules | A fallback rule now removes the `/api/v1` prefix (PR #19) | `curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/api/v1/categories` → 200 |
| **Reviews give 500 when logged out** | An internal 401 became a custom `AccessDeniedException` that `ReviewService` did not catch | Catch added (PR #19); visitors see "Hidden user" | `/api/v1/reviews/product/1` → 200 |
| **500 on products, or on cart/profile/reviews when logged in;** log shows `LazyInitializationException` | A lazy collection is read after the database session closed (`open-in-view` is off) | `@Transactional(readOnly = true)` on the read methods (users fixed in PR #19; products reported fixed earlier — confirm in the code, TBC) | Add to Cart works. Diagnose: `docker compose logs --since 5m mankind_services \| grep -E "LazyInitialization\|ERROR"` |
| **Logged-in calls return 401 although login works** | Token issuer mismatch (Section 5.4) | Set `KEYCLOAK_ISSUER_URL=http://localhost:8080` and recreate the app. Compare with: `docker exec mankind_services wget -qO- http://keycloak:8080/realms/mankind/.well-known/openid-configuration \| grep -o '"issuer":"[^"]*"'` | Add to Cart works |
| **Chrome shows an XML error** when the API address is opened | The browser asks for XML and some field names contain spaces | Harmless. Use Postman/Bruno or `curl -H "Accept: application/json"` | JSON appears |
| **Site says "Cannot connect to product service" or shows sample products** | The build has `localhost` URLs (baked in at build time); in `development` mode failed calls fall back to sample data | Fix `.env`, rebuild, redeploy (PR #66) | Network tab shows calls to `api.mankindmatrixai.com` |
| **Opening `/login` or `/product/1` directly gives 404** | Nothing on the hosting sends unknown paths to `index.html` | `public/.htaccess` ships with every build | `curl -s -o /dev/null -w "%{http_code}\n" https://mankindmatrixai.com/login` → 200 |
| **"Your connection is not private"** on the new domain | cPanel made a self-signed certificate; AutoSSL had not run after DNS changed | NameHero support ran AutoSSL; if it recurs, run AutoSSL in cPanel | cPanel → SSL/TLS Status shows a valid certificate |
| **GitHub Actions run fails** (right after adding a workflow, or the upload hangs) | Secrets not set, or a wrong FTP host (`node403.namehero.net` works; `ftp.mindstack-technologies.com` does not resolve) | Add the secrets; read the `::error::` line of the failed step | Frontend ends with "Live site OK"; backend ends with exit 0 |
| **`GET /recently-viewed` gives 500 when logged out** | It needs a logged-in user but is listed as public | Not fixed; no user impact (the site only calls it when logged in) | Open item for developers |

**B. Earlier local-development and planning issues (reported by the team; not re-verified)**

| Symptom | Cause | Fix or check | Verify |
|---|---|---|---|
| **Docker Desktop will not start** (Mac, local only): `docker` exists but the Engine or API is unreachable | Engine not running; Docker Desktop background processes stuck | Quit Docker Desktop, wait 30 seconds, start it; if stuck, restart the Mac (this resolved it). Check `docker version` shows a Server section | `docker run --rm hello-world` works |
| **App will not start after the monolith conversion:** duplicate beans (`GlobalExceptionHandler`, `CurrentUserService`, `RoleVerificationService`, `PaymentService`); `ConflictingBeanDefinitionException` during component scanning | The former microservices had classes with the same short name; after merging, Spring found two beans with one name | The team applied unique bean names and package-scoped exception-handler advice locally; confirm they are in the approved branch (TBC). Diagnose: `docker compose logs --tail=200 mankind_services \| grep -E "ConflictingBeanDefinition\|APPLICATION FAILED"` | App healthy (the deployed `main` is healthy — verified) |
| **Aiven connection warnings:** HikariCP reports failed validation after idle periods | *Likely, not proven:* idle connections are closed by the database or network before the pool retires them. Recovery was observed; a permanent fix is **not** confirmed | `docker compose logs --since 1h mankind_services \| grep -iE "hikari\|validation"`; compare `DB_HIKARI_MAX_LIFETIME` and `DB_HIKARI_IDLE_TIMEOUT` in `.env` with Aiven's idle timeout (TBC); check the Aiven console for maintenance | Health `db` stays UP for 24 hours with no new warnings |
| **Keycloak unhealthy or logins fail** | Earlier local health-check concerns. Today it runs in development mode with a default admin account | `docker compose ps`; `docker compose logs --tail=100 keycloak`; `curl -s http://localhost:8180/realms/mankind/.well-known/openid-configuration \| head -c 300` (JSON expected) | `(healthy)` and a login works |
| **Backend cannot run on shared hosting** | Shared hosting cannot run a long-lived Java/Docker application | A separate NameHero VPS was chosen; the frontend stays on shared hosting | Both parts are live |
| **Database unreachable:** health `db` DOWN; timeout or "access denied" | Aiven is external: needs outbound access, a matching allow-list (if enabled), correct credentials and TLS, and a running database | From the VPS: `timeout 5 bash -c 'echo > /dev/tcp/mankind-matrix-mankind-matrix.i.aivencloud.com/26996' && echo reachable`; check the Aiven console (service running; VPS IP 165.140.71.212 allowed if restricted) and the `DB_*` values | `"db":{"status":"UP"` |
| **Frontend ↔ backend problems:** wrong API URL, CORS, HTTPS, login redirects, DNS | See part A (CORS, `/api/v1`, issuer, `localhost` build). Also use only `https://` API addresses | `nslookup api.mankindmatrixai.com 8.8.8.8` → 165.140.71.212; `nslookup mankindmatrixai.com 8.8.8.8` → 45.41.235.161 | Browser console has no red errors |

## 9. Troubleshooting Quick Reference

| Problem | First check | Next action | Escalate to |
|---|---|---|---|
| Website unavailable | `curl -sI https://mankindmatrixai.com` | Not 200: in cPanel check `index.html` and `.htaccess` exist in `/mankindmatrixai.com`; check SSL status; re-run the frontend pipeline | Frontend owner → NameHero support |
| Backend unavailable | `curl -s -o /dev/null -w "%{http_code}\n" https://api.mankindmatrixai.com/actuator/health` | 502/504: `docker compose ps` and logs. No answer at all: `systemctl status nginx`; check the VPS state in the NameHero portal | Backend / VPS owner |
| Container stopped | `docker compose ps -a` | `docker compose up -d`; read why it stopped: `docker compose logs --tail=200 <service>`; check memory with `free -h` | Backend owner |
| HTTP 404 | Website path or API path? | Website: confirm `.htaccess` and redeploy. API: check the route (`/products` and `/api/v1/products` both exist); `nginx -t` | Frontend / backend owner |
| HTTP 500 | `docker compose logs --since 5m mankind_services \| grep -E "ERROR\|Caused by\|Exception"` | Match the error to Section 8 (lazy loading, login token, database) | Backend owner |
| Database failure | Health output `db` status | Run the `/dev/tcp` test in Section 8B; check the Aiven console, credentials and allow-list | DB owner |
| Keycloak login failure | `docker compose ps`; the wrong-password test (Section 6, check 6) | 500 or empty reply: restart Keycloak and wait 60 seconds. 401 on logged-in calls: check the issuer (Section 5.4) | Backend owner |
| SSL certificate error | API: `certbot certificates`. Website: cPanel → SSL/TLS Status | API: `certbot renew --dry-run` then `systemctl reload nginx`. Website: Run AutoSSL or ask NameHero | VPS owner / NameHero support |
| High CPU or RAM | `uptime`, `free -h`, `docker stats --no-stream`, `df -h /` | Find the busy container; restart it; look for error loops; consider a VPS upgrade | VPS owner |
| Deployment failure | GitHub Actions run → the failed step; on the VPS the deployment log (Section 5.1) | Read the error; the backend rolls back by itself if unhealthy; fix and re-run | CI/CD owner |

## 10. Backup, Recovery & Rollback

No backup is assumed to exist unless confirmed here.

| What | Where | Owner | Status |
|---|---|---|---|
| Aiven MySQL (all data, including Keycloak) | Aiven console → backups | DB owner | Retention and a restore test: TBC |
| VPS settings: `.env`, `/etc/nginx/sites-available/api.mankindmatrixai.com`, `/etc/letsencrypt/`, `~/.ssh/authorized_keys` | Keep copies in secure storage; the NameHero portal offers VPS Backups and schedules | VPS owner | TBC |
| Docker volumes | None defined: the app keeps no local data and Keycloak's data is in Aiven | — | Verified in `docker-compose.yml` |
| Frontend | Git `master` is the source; keep the last good build zip | Frontend owner | NameHero account backups: TBC |

**Rollback:** frontend — Section 4; backend — Section 5.3; database — no automatic rollback; restoring Aiven data needs the DB owner's approval.

**Recovery after VPS failure.** (1) Repeat Section 5.5 on a new or restored VPS (about one hour). (2) If the IP changed, update the GoDaddy `A api` record, the `VPS_HOST` secret if it holds the IP, and the Aiven allow-list if one exists. (3) Run all checks in Section 6.

**Confirm a restore worked:** health shows `db` UP, the product list loads, login works, Add to Cart works (remove the test item).

## 11. Ownership, Support & Escalation

| Area | Primary (role) | Backup (role) | Contact |
|---|---|---|---|
| Frontend | Frontend developer | Backend developer | TBC |
| Backend and Keycloak | Backend developer | Tech lead | TBC |
| VPS / Linux and backups | DevOps engineer | Backend developer | TBC |
| Aiven MySQL | Database owner | Tech lead | TBC |
| DNS (GoDaddy) | Domain owner | DevOps engineer | TBC |
| CI/CD and security | DevOps engineer / Tech lead | Repository admin | TBC |
| Production incidents | On-call engineer (rotation TBC) | Tech lead | TBC |

**Escalation order:** support engineer → area owner → tech lead. Production changes, reboots and credential rotation need the tech lead's approval. Record who holds the NameHero, GoDaddy and Aiven accounts and who the GitHub repository admins are (TBC).

## 12. Open Items & Final Handoff Checklist

| # | Open item | Owner (role) |
|---|---|---|
| 1 | **Security, first:** rotate the Aiven database password and take `.env` out of git (use secrets); change the Keycloak admin credential; close ports 8085 and 8180; set up a firewall that keeps 37980, 80 and 443; restrict public `/actuator` | Tech lead / DevOps |
| 2 | Backend pipeline: confirm PR #20 is merged, its four secrets exist in the main repository, and its first run there is green | CI/CD owner |
| 3 | Frontend pipeline: merge PR #66 then #67, add the three FTP secrets, finish the remaining pipeline tests, and delete leftover hand-uploaded files once in cPanel | Repo admin / frontend owner |
| 4 | Retire the old Mindstack site: remove the `matrix-ai` subdomain in cPanel and its GoDaddy record | Frontend / DNS owner |
| 5 | OS updates (about 41 packages) and a kernel update waiting for a reboot — deliberately skipped during setup | DevOps (maintenance window) |
| 6 | Keycloak production mode with a real hostname (the `localhost:8080` issuer is a workaround) | Backend owner |
| 7 | Monitoring: none configured. Add an external uptime check for the site and `/actuator/health` with alert email | DevOps |
| 8 | Backups: confirm Aiven retention, set a VPS backup schedule, and run a restore test | DB owner / DevOps |
| 9 | Record the live versions (backend `main` includes the merge of PR #19, commit `9389a29`; frontend `master` commit TBC) and tag a release | Tech lead |
| 10 | Decide: `REACT_APP_ENV` development vs production; fix the anonymous `recently-viewed` 500; remove the two "Test Notification" buttons shown on every page; confirm Stripe, mail and SMS settings and `DB_USE_SSL`; confirm the Certbot contact email is monitored | Frontend / backend owner |
| 11 | Final smoke-test sign-off (Section 6) on the final addresses | Support lead |

**Am I ready to support the application?**

- [ ] I can log in to GitHub, NameHero (portal and cPanel), GoDaddy, Aiven and the VPS (`ssh -p 37980`)
- [ ] I know where credentials live and that none belong in chat, tickets or git
- [ ] I ran the Section 6 checks and understand each result
- [ ] I can read logs and restart a service safely (Section 7)
- [ ] I can start and read a backend and a frontend deployment, and roll both back (Sections 4, 5, 10)
- [ ] I know where to look first for a problem (Sections 8 and 9) and whom to escalate to (Section 11)
- [ ] I have read the open items, especially security (Section 12)
