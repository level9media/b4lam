import { z } from "zod/v4";
import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { members, tokenPackages, tokenTransactions } from "../../drizzle/schema.js";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { env } from "../env.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Token packages — defined here as the source of truth
export const PACKAGES = [
  { id: 1, name: "Initiate", tokenCount: 5, priceCents: 7500, description: "5 tokens — $15 each" },
  { id: 2, name: "Devotee", tokenCount: 15, priceCents: 20000, description: "15 tokens — $13.33 each" },
  { id: 3, name: "High Priest", tokenCount: 30, priceCents: 37500, description: "30 tokens — $12.50 each" },
];

export const tokensRouter = router({
  // Get current member's token balance and recent transactions
  getWallet: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await db.query.tokenTransactions.findMany({
      where: (t, { eq }) => eq(t.memberId, ctx.member.id),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit: 20,
    });

    return {
      balance: ctx.member.tokenBalance,
      transactions,
    };
  }),

  // Alias: get member's transactions directly (used by Wallet page)
  myTransactions: protectedProcedure
    .input(z.object({ limit: z.number().int().optional() }))
    .query(async ({ ctx, input }) => {
      return db.query.tokenTransactions.findMany({
        where: (t, { eq }) => eq(t.memberId, ctx.member.id),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: input.limit ?? 20,
      });
    }),

  // Get available token packages
  getPackages: protectedProcedure.query(async () => {
    return PACKAGES;
  }),

  // Create Stripe checkout session for token purchase
  createCheckout: protectedProcedure
    .input(z.object({ packageId: z.union([z.number().int(), z.string()]), origin: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Support both numeric IDs and string IDs like 'tokens_10'
      const pkgIdMap: Record<string, number> = {
        tokens_10: 1,
        tokens_25: 2,
        tokens_50: 3,
      };
      const numericId =
        typeof input.packageId === "string"
          ? pkgIdMap[input.packageId] ?? parseInt(input.packageId)
          : input.packageId;
      const pkg = PACKAGES.find((p) => p.id === numericId);
      if (!pkg) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Package not found." });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: ctx.member.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: pkg.priceCents,
              product_data: {
                name: `B4LAM Tokens — ${pkg.name} Pack (${pkg.tokenCount} tokens)`,
                description: pkg.description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          memberId: ctx.member.id.toString(),
          packageId: pkg.id.toString(),
          tokenCount: pkg.tokenCount.toString(),
        },
        client_reference_id: ctx.member.id.toString(),
        success_url: `${input.origin}/portal?tokens=success&pkg=${pkg.id}`,
        cancel_url: `${input.origin}/portal?tokens=cancelled`,
        allow_promotion_codes: true,
      });

      return { url: session.url, checkoutUrl: session.url };
    }),

  // Admin: grant tokens to a member
  adminGrant: adminProcedure
    .input(
      z.object({
        memberId: z.number().int(),
        amount: z.number().int().min(1).max(100),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await db.query.members.findFirst({
        where: (m, { eq }) => eq(m.id, input.memberId),
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found." });
      }

      const newBalance = member.tokenBalance + input.amount;

      await db
        .update(members)
        .set({ tokenBalance: newBalance })
        .where(eq(members.id, input.memberId));

      await db.insert(tokenTransactions).values({
        memberId: input.memberId,
        type: "admin_grant",
        amount: input.amount,
        balanceAfter: newBalance,
        description: input.reason || "Admin grant",
      });

      return { success: true, newBalance };
    }),

  // Get transaction history (admin)
  getHistory: adminProcedure
    .input(z.object({ memberId: z.number().int().optional() }))
    .query(async ({ input }) => {
      return db.query.tokenTransactions.findMany({
        where: input.memberId
          ? (t, { eq }) => eq(t.memberId, input.memberId!)
          : undefined,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: 100,
      });
    }),
});
