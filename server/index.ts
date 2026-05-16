import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./trpc.js";
import Stripe from "stripe";
import { db } from "./db.js";
import { members, tokenTransactions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { env } from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── Stripe Webhook (raw body BEFORE express.json) ──────────────────────────
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig as string,
          env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type}`);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const memberId = parseInt(session.metadata?.memberId || "0");
        const tokenCount = parseInt(session.metadata?.tokenCount || "0");

        if (memberId && tokenCount) {
          const member = await db.query.members.findFirst({
            where: (m, { eq }) => eq(m.id, memberId),
          });

          if (member) {
            const newBalance = member.tokenBalance + tokenCount;

            await db
              .update(members)
              .set({ tokenBalance: newBalance })
              .where(eq(members.id, memberId));

            await db.insert(tokenTransactions).values({
              memberId,
              type: "purchase",
              amount: tokenCount,
              balanceAfter: newBalance,
              description: `Purchased ${tokenCount} tokens via Stripe`,
              stripePaymentIntentId: session.payment_intent as string,
            });

            console.log(`[Stripe Webhook] Credited ${tokenCount} tokens to member ${memberId}`);
          }
        }
      }

      res.json({ received: true });
    }
  );

  // ─── Middleware ──────────────────────────────────────────────────────────────
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // ─── Health Check ─────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "b4lam", timestamp: new Date().toISOString() });
  });

  // ─── tRPC ────────────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── Static Files ────────────────────────────────────────────────────────────
  // In production (Railway): dist/index.js is in dist/, static files are in dist/public/
  // In development: server/index.ts is in server/, static files are in dist/public/
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = parseInt(process.env.PORT as string) || 3002;

  server.listen(port, () => {
    console.log(`B4LAM server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
