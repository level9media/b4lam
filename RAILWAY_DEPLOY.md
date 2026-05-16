# B4LAM — Railway Deployment Guide

## Overview

B4LAM is a full-stack Node.js app (React + Express + MySQL). This guide covers everything you need to get it live on Railway in under 30 minutes.

---

## Step 1 — Push Code to GitHub

Railway deploys from GitHub. First, push this project to a private repo.

```bash
cd /path/to/b4lam
git init
git add .
git commit -m "Initial B4LAM commit"
gh repo create b4lam --private --source=. --push
```

Or if you already have a repo:

```bash
git remote add origin https://github.com/YOUR_USERNAME/b4lam.git
git push -u origin main
```

---

## Step 2 — Create Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your `b4lam` repository
5. Railway will auto-detect the `Dockerfile` and start building

---

## Step 3 — Add MySQL Database

B4LAM requires MySQL (not Postgres). Railway has a built-in MySQL plugin:

1. In your Railway project, click **+ New Service**
2. Select **Database → MySQL**
3. Once provisioned, click the MySQL service and go to **Variables**
4. Copy the `MYSQL_URL` value — you'll use it as `DATABASE_URL` in the next step

---

## Step 4 — Set Environment Variables

In your Railway app service, go to **Variables** and add each of these:

### Required

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `mysql://user:pass@host:port/dbname` | From Railway MySQL service |
| `JWT_SECRET` | Generate a random 64-char string | Use: `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe Webhook settings |
| `NODE_ENV` | `production` | Required |
| `PORT` | `3000` | Railway uses this automatically |

### Optional (for email notifications)

| Variable | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | From [resend.com](https://resend.com) — for future email features |

### Generate JWT_SECRET

Run this in your terminal to generate a secure secret:

```bash
openssl rand -hex 32
```

---

## Step 5 — Run Database Migrations

After your first deploy, you need to push the schema to MySQL.

**Option A — Railway CLI (recommended):**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run pnpm db:push
```

**Option B — Add a one-time startup command:**

Temporarily change the `CMD` in `Dockerfile` to:

```dockerfile
CMD ["sh", "-c", "node -e \"require('./dist/index.js')\" || node dist/index.js"]
```

Actually, the cleanest approach is to run it via Railway CLI as shown in Option A.

---

## Step 6 — Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set URL to: `https://YOUR-RAILWAY-DOMAIN.railway.app/api/stripe/webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret** (`whsec_...`)
6. Add it as `STRIPE_WEBHOOK_SECRET` in Railway Variables

---

## Step 7 — Set Custom Domain (Optional)

1. In Railway, go to your service → **Settings → Domains**
2. Add your custom domain (e.g., `b4lam.com`)
3. Update your DNS with the CNAME Railway provides
4. SSL is automatic

---

## Step 8 — Create First Admin Account

After the app is live:

1. Visit your site and click the sigil 5 times to reveal the invite form
2. Create an invite code via the database directly (first time only):

```sql
INSERT INTO invite_codes (code, created_by, max_uses, uses, is_active)
VALUES ('FOUNDING', 1, 1, 0, 1);
```

Wait — for the very first admin, use the Railway MySQL console:

```sql
-- First, register via the site using invite code 'FOUNDING'
-- Then promote yourself to admin:
UPDATE members SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Environment Summary

```
DATABASE_URL=mysql://...          ← Railway MySQL
JWT_SECRET=<64-char-hex>          ← Generate with openssl
STRIPE_SECRET_KEY=sk_...          ← Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...   ← Stripe Webhook
NODE_ENV=production
PORT=3000
```

---

## Health Check

Railway will ping `/api/health` to verify the service is running. You can also check it manually:

```
https://YOUR-DOMAIN.railway.app/api/health
```

Expected response:
```json
{ "status": "ok", "service": "b4lam", "timestamp": "..." }
```

---

## Troubleshooting

**Build fails:** Check that `pnpm-lock.yaml` is committed to git.

**Database connection error:** Verify `DATABASE_URL` is set correctly and the MySQL service is running.

**Stripe webhooks not working:** Ensure `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard exactly.

**White screen / 404:** The static files are served from `dist/public/`. Make sure the build completed successfully in Railway's build logs.
