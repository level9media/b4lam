# PROJECT BALAM — Status Brief
**Date:** May 15, 2026 | **Stack:** React 19 + Vite + Express + tRPC 11 + Drizzle ORM + MySQL + Stripe

---

## LIVE APP STATUS

| Item | Status |
|---|---|
| Railway deployment | **LIVE** — `https://b4lam-production.up.railway.app` |
| Health endpoint | **OK** — `{"status":"ok","service":"b4lam"}` |
| MySQL database | **CONNECTED** — `yamabiko.proxy.rlwy.net:37620` |
| Rob's admin account | **ACTIVE** — `robertgray@gmail.com` / PIN: `123456` |
| Stripe | **BLOCKED** — placeholder keys, payments non-functional |

---

## COMPLETED THIS SESSION

### 1. Admin Account Created
Rob's account was seeded directly into the database with full admin privileges:

```
Email:  robertgray@gmail.com
PIN:    123456
Role:   admin
Status: active
```

> **Action required:** Log in at `https://b4lam-production.up.railway.app` and immediately change your PIN via the admin panel or direct DB update.

### 2. Database Seeded
The following data was inserted to make the app immediately functional:

**Invite Codes (5 active):**

| Code | Status |
|---|---|
| `BALAM-ADMIN` | Active — use to register additional admins |
| `BALAM-VIP01` | Active |
| `BALAM-VIP02` | Active |
| `BALAM-VIP03` | Active |
| `BALAM-VIP04` | Active |

**Menu Items (13 seeded):**

| Name | Category | Token Cost |
|---|---|---|
| Ixchel Moon | cocktail | 1 |
| Kukulcan Fire | cocktail | 1 |
| Jaguar Blood | cocktail | 1 |
| Temple Smoke | cocktail | 1 |
| Cenote Drift | cocktail | 1 |
| Obsidian Blade | cocktail | 1 |
| Tzolkin Sunrise | cocktail | 1 |
| Balam Reserve | special | 2 |
| Midnight Ritual | cocktail | 1 |
| Sacred Cacao | cocktail | 1 |
| Patron Añejo | spirit | 2 |
| Clase Azul Reposado | spirit | 3 |
| Virgen de Guadalupe | mocktail | 1 |

**Nightly Code:**
- Word: `Itzamná` | Phonetic: `eets-ahm-NAH` | Expires: 24 hours from seeding

---

## CRITICAL BLOCKER — STRIPE NOT CONFIGURED

The app currently has placeholder Stripe keys. **Payments are completely non-functional.** This is the #1 blocker before any member can purchase tokens.

### What to do:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys
2. Copy your **Secret Key** (`sk_live_...` for production, `sk_test_...` for testing)
3. Go to Railway Dashboard → `adequate-dream` project → `b4lam` service → Variables
4. Update:
   - `STRIPE_SECRET_KEY` = your real key
   - `STRIPE_WEBHOOK_SECRET` = (from step below)
5. In Stripe Dashboard → Webhooks → Add endpoint:
   - URL: `https://b4lam-production.up.railway.app/api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Copy the signing secret → paste as `STRIPE_WEBHOOK_SECRET` in Railway

Railway auto-redeploys on variable save. No code push needed.

---

## TOKEN PACKAGE MISMATCH — NEEDS FIX

There is a **discrepancy** between what the client shows and what the server charges. This will cause confusion and incorrect token credits.

| | Client Display | Server Reality |
|---|---|---|
| Package 1 | 10 tokens / $25 | **5 tokens / $75** (Initiate) |
| Package 2 | 25 tokens / $55 | **15 tokens / $200** (Devotee) |
| Package 3 | 50 tokens / $100 | **30 tokens / $375** (High Priest) |

The server `PACKAGES` array in `server/routers/tokens.ts` is the source of truth for what Stripe charges. The client UI in `client/src/pages/portal/Wallet.tsx` is purely cosmetic — it only passes the package ID to the server. **The server prices are what actually get charged.**

**Decision needed:** Which pricing model do you want?

**Option A — Premium pricing (server is correct):**
- 5 tokens = $75 ($15/token)
- 15 tokens = $200 ($13.33/token)
- 30 tokens = $375 ($12.50/token)
- Update the client UI to match

**Option B — Entry-level pricing (client is correct):**
- 10 tokens = $25 ($2.50/token)
- 25 tokens = $55 ($2.20/token)
- 50 tokens = $100 ($2.00/token)
- Update the server `PACKAGES` array to match

> Tell me which model and I'll sync both sides in one push.

---

## FULL FEATURE AUDIT

### What's Built and Working

| Feature | Status | Notes |
|---|---|---|
| Invite-only registration | ✅ Built | Requires valid invite code |
| PIN-based login (6-digit) | ✅ Built | JWT cookie sessions, 30-day expiry |
| Member portal | ✅ Built | Home, Wallet, Menu, Code, Reservations |
| Admin dashboard | ✅ Built | Overview, Members, Menu, Orders, Codes, Invites, Reservations |
| Bar staff iPad queue | ✅ Built | Real-time order queue at `/staff` |
| Token wallet | ✅ Built | Balance display, purchase flow (needs Stripe keys) |
| Drink ordering | ✅ Built | Token deduction, order queue, staff fulfillment |
| Order cancellation + refund | ✅ Built | Auto-refunds tokens on cancel |
| Nightly entry codes | ✅ Built | Mayan word codes with phonetic pronunciation |
| Table reservations | ✅ Built | Member request → admin confirm/cancel |
| Invite code management | ✅ Built | Admin generates, deactivates, revokes |
| Member role management | ✅ Built | Admin can promote to staff/admin |
| Token grant (admin) | ✅ Built | Admin can credit tokens to any member |
| Stripe checkout | ⚠️ Needs keys | Flow is built, just needs real credentials |
| Stripe webhook | ⚠️ Needs keys | Auto-credits tokens on payment — built, needs activation |

### What's Missing / Next Build Priorities

| Priority | Feature | Impact |
|---|---|---|
| 🔴 P0 | Real Stripe keys | Revenue unblocked |
| 🔴 P0 | Fix token package mismatch | Prevents billing errors |
| 🟡 P1 | Push notifications / SMS for order ready | Member UX — "your drink is ready" |
| 🟡 P1 | Real-time order status updates (polling or WebSocket) | Staff + member UX |
| 🟡 P1 | Automated nightly code rotation | Ops — set it and forget it |
| 🟡 P1 | Custom domain | Brand — `members.balam.club` or similar |
| 🟢 P2 | Member profile page | Edit name, email, PIN change |
| 🟢 P2 | QR code entry verification | Doorman workflow |
| 🟢 P2 | Reservation capacity limits | Prevent overbooking |
| 🟢 P2 | Analytics dashboard (revenue, top drinks, peak hours) | Business intelligence |
| 🟢 P3 | Membership tiers (Bronze/Silver/Gold) | Upsell / exclusivity |
| 🟢 P3 | Event-specific menus | Special nights |
| 🟢 P3 | Referral tracking (who invited whom) | Growth mechanic |

---

## HOW TO PUSH CODE CHANGES

```bash
cd /path/to/b4lam
git add -A && git commit -m "your message"
git push origin main
```

Railway auto-deploys on every push to `main`. Build time ~2-3 minutes.

---

## DATABASE ACCESS

```bash
# Direct MySQL access
mysql -h yamabiko.proxy.rlwy.net -P 37620 -u root -pqcTtLXOysdaiOmtuMRydFTrgiWyzKmui railway
```

---

## CONTEXT PACKAGE FOR NEXT SESSION

```
PROJECT: B4LAM — Members-Only Bar App
Live URL: https://b4lam-production.up.railway.app
GitHub Repo: https://github.com/level9media/b4lam (branch: main)
Railway Project: adequate-dream
DB: yamabiko.proxy.rlwy.net:37620 | user: root | pass: qcTtLXOysdaiOmtuMRydFTrgiWyzKmui | db: railway
Rob's account: robertgray@gmail.com | PIN: 123456 | role: admin

Stack: React 19 + Vite + Tailwind 4 + Express + tRPC 11 + Drizzle ORM + MySQL2 + Stripe + bcryptjs + JWT cookies

CURRENT BLOCKERS:
1. Stripe keys not set — payments non-functional
2. Token package mismatch between client UI and server PACKAGES array

SEEDED DATA:
- 1 admin member (Rob)
- 5 invite codes: BALAM-ADMIN, BALAM-VIP01 through VIP04
- 13 menu items (cocktails, spirits, mocktail)
- 1 nightly code: Itzamná (eets-ahm-NAH)
```
