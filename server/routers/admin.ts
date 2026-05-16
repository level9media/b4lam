import { z } from "zod/v4";
import { router, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { members, inviteCodes, tokenTransactions, orders, reservations } from "../../drizzle/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const adminRouter = router({
  // Get all members
  getMembers: adminProcedure.query(async () => {
    return db.query.members.findMany({
      orderBy: (m, { desc }) => [desc(m.createdAt)],
      columns: {
        pinHash: false,
      },
    });
  }),

  // Update member status
  updateMemberStatus: adminProcedure
    .input(
      z.object({
        memberId: z.number().int(),
        status: z.enum(["pending", "active", "suspended"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(members)
        .set({ status: input.status })
        .where(eq(members.id, input.memberId));
      return { success: true };
    }),

  // Update member role
  updateMemberRole: adminProcedure
    .input(
      z.object({
        memberId: z.number().int(),
        role: z.enum(["member", "admin", "staff"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(members)
        .set({ role: input.role })
        .where(eq(members.id, input.memberId));
      return { success: true };
    }),

  // Generate invite codes
  generateInvites: adminProcedure
    .input(
      z.object({
        count: z.number().int().min(1).max(50).default(1),
        expiresInDays: z.number().int().min(1).max(365).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const codes: string[] = [];
      const expiresAt = input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : null;

      for (let i = 0; i < input.count; i++) {
        const code = nanoid(10).toUpperCase();
        await db.insert(inviteCodes).values({
          code,
          createdBy: ctx.member.id,
          expiresAt: expiresAt || undefined,
          isActive: true,
        });
        codes.push(code);
      }

      return { codes };
    }),

  // Get all invite codes
  getInvites: adminProcedure.query(async () => {
    return db.query.inviteCodes.findMany({
      orderBy: (i, { desc }) => [desc(i.createdAt)],
      limit: 100,
    });
  }),

  // Deactivate an invite code
  deactivateInvite: adminProcedure
    .input(z.object({ inviteId: z.number().int() }))
    .mutation(async ({ input }) => {
      await db
        .update(inviteCodes)
        .set({ isActive: false })
        .where(eq(inviteCodes.id, input.inviteId));
      return { success: true };
    }),

  // Revoke invite (alias with revokedAt timestamp)
  revokeInvite: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await db
        .update(inviteCodes)
        .set({ isActive: false, revokedAt: new Date() })
        .where(eq(inviteCodes.id, input.id));
      return { success: true };
    }),

  // Adjust member token balance
  adjustTokens: adminProcedure
    .input(
      z.object({
        memberId: z.number().int(),
        amount: z.number().int(),
        reason: z.string().optional(),
        description: z.string().optional(), // alias for reason
      })
    )
    .mutation(async ({ input }) => {
      const member = await db.query.members.findFirst({
        where: (m, { eq }) => eq(m.id, input.memberId),
      });
      if (!member) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found." });

      const newBalance = Math.max(0, member.tokenBalance + input.amount);
      await db.update(members).set({ tokenBalance: newBalance }).where(eq(members.id, input.memberId));

      const note = input.reason || input.description || `Admin adjustment: ${input.amount > 0 ? "+" : ""}${input.amount}`;

      await db.insert(tokenTransactions).values({
        memberId: input.memberId,
        type: input.amount > 0 ? "admin_grant" : "redemption",
        amount: input.amount,
        balanceAfter: newBalance,
        description: note,
      });

      return { success: true, newBalance };
    }),

  // Get revenue stats (alias used by AdminOverview)
  stats: adminProcedure.query(async () => {
    const totalMembersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(members);

    const activeMembersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(members)
      .where(eq(members.status, "active"));

    const completedOrdersResult = await db
      .select({ count: sql<number>`count(*)`, tokens: sql<number>`coalesce(sum(token_cost), 0)` })
      .from(orders)
      .where(eq(orders.status, "completed"));

    const openOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(sql`status IN ('pending', 'preparing')`);

    const purchasesResult = await db
      .select({ tokens: sql<number>`coalesce(sum(amount), 0)` })
      .from(tokenTransactions)
      .where(eq(tokenTransactions.type, "purchase"));

    const pendingReservationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservations)
      .where(eq(reservations.status, "pending"));

    const unusedInvitesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(inviteCodes)
      .where(sql`is_active = 1 AND used_by IS NULL`);

    const recentOrdersResult = await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      limit: 5,
      with: {
        member: { columns: { id: true, name: true } },
        menuItem: { columns: { id: true, name: true } },
      },
    });

    return {
      totalMembers: Number(totalMembersResult[0]?.count || 0),
      activeMembers: Number(activeMembersResult[0]?.count || 0),
      completedOrders: Number(completedOrdersResult[0]?.count || 0),
      openOrders: Number(openOrdersResult[0]?.count || 0),
      totalTokensSold: Number(purchasesResult[0]?.tokens || 0),
      totalTokensSpent: Number(completedOrdersResult[0]?.tokens || 0),
      pendingReservations: Number(pendingReservationsResult[0]?.count || 0),
      unusedInvites: Number(unusedInvitesResult[0]?.count || 0),
      recentOrders: recentOrdersResult.map((o) => ({
        id: o.id,
        status: o.status,
        tokenCost: o.tokenCost,
        tableNumber: o.tableNumber,
        createdAt: o.createdAt.getTime(),
        member: o.member ? { id: o.member.id, name: o.member.name } : null,
        items: [{ name: (o.menuItem as any)?.name ?? "Unknown", quantity: o.quantity }],
      })),
    };
  }),

  // Get revenue stats
  getStats: adminProcedure.query(async () => {
    const totalMembers = await db
      .select({ count: sql<number>`count(*)` })
      .from(members)
      .where(eq(members.status, "active"));

    const totalOrders = await db
      .select({ count: sql<number>`count(*)`, tokens: sql<number>`sum(token_cost)` })
      .from(orders)
      .where(eq(orders.status, "completed"));

    const totalPurchases = await db
      .select({ count: sql<number>`count(*)`, tokens: sql<number>`sum(amount)` })
      .from(tokenTransactions)
      .where(eq(tokenTransactions.type, "purchase"));

    return {
      activeMembers: Number(totalMembers[0]?.count || 0),
      completedOrders: Number(totalOrders[0]?.count || 0),
      tokensRedeemed: Number(totalOrders[0]?.tokens || 0),
      tokensPurchased: Number(totalPurchases[0]?.tokens || 0),
    };
  }),
});
