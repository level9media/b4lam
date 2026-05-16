import { z } from "zod/v4";
import { router, protectedProcedure, staffProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { orders, members, tokenTransactions } from "../../drizzle/schema.js";
import { eq, and, inArray, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const ordersRouter = router({
  // Member: place a drink order
  place: protectedProcedure
    .input(
      z.object({
        menuItemId: z.number().int(),
        quantity: z.number().int().min(1).max(5).default(1),
        notes: z.string().max(500).optional(),
        tableNumber: z.string().max(50).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get menu item
      const item = await db.query.menuItems.findFirst({
        where: (m, { eq, and }) =>
          and(eq(m.id, input.menuItemId), eq(m.isActive, true), eq(m.isAvailableTonight, true)),
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Item not available tonight." });
      }

      const totalCost = item.tokenCost * input.quantity;

      // Check balance
      if (ctx.member.tokenBalance < totalCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Insufficient tokens. Need ${totalCost}, have ${ctx.member.tokenBalance}.`,
        });
      }

      // Deduct tokens
      const newBalance = ctx.member.tokenBalance - totalCost;
      await db
        .update(members)
        .set({ tokenBalance: newBalance })
        .where(eq(members.id, ctx.member.id));

      // Create order
      const [result] = await db.insert(orders).values({
        memberId: ctx.member.id,
        menuItemId: input.menuItemId,
        quantity: input.quantity,
        tokenCost: totalCost,
        status: "pending",
        notes: input.notes,
        tableNumber: input.tableNumber,
      });

      const orderId = (result as any).insertId as number;

      // Record transaction
      await db.insert(tokenTransactions).values({
        memberId: ctx.member.id,
        type: "redemption",
        amount: -totalCost,
        balanceAfter: newBalance,
        description: `Order #${orderId}: ${item.name} x${input.quantity}`,
        orderId,
      });

      return { success: true, orderId, newBalance };
    }),

  // Member: get own orders
  myOrders: protectedProcedure
    .input(z.object({ limit: z.number().int().default(10) }))
    .query(async ({ ctx, input }) => {
      const raw = await db.query.orders.findMany({
        where: (o, { eq }) => eq(o.memberId, ctx.member.id),
        orderBy: (o, { desc }) => [desc(o.createdAt)],
        limit: input.limit,
        with: {
          menuItem: { columns: { id: true, name: true } },
        },
      });

      return raw.map((o) => ({
        id: o.id,
        status: o.status,
        tokenCost: o.tokenCost,
        tableNumber: o.tableNumber,
        notes: o.notes,
        createdAt: o.createdAt.getTime(),
        items: [{ name: (o.menuItem as any)?.name ?? "Unknown", quantity: o.quantity }],
      }));
    }),

  // Staff/Admin: get active order queue
  getQueue: staffProcedure.query(async () => {
    return db.query.orders.findMany({
      where: (o, { inArray }) => inArray(o.status, ["pending", "preparing"]),
      orderBy: (o, { asc }) => [asc(o.createdAt)],
      with: {
        member: {
          columns: { id: true, name: true },
        },
        menuItem: {
          columns: { id: true, name: true, tokenCost: true },
        },
      },
    });
  }),

  // Staff/Admin: get all orders (alias used by admin + staff views)
  all: staffProcedure.query(async () => {
    const rawOrders = await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      limit: 100,
      with: {
        member: { columns: { id: true, name: true } },
        menuItem: { columns: { id: true, name: true, tokenCost: true } },
      },
    });

    return rawOrders.map((o) => ({
      id: o.id,
      status: o.status,
      tokenCost: o.tokenCost,
      tableNumber: o.tableNumber,
      notes: o.notes,
      createdAt: o.createdAt.getTime(),
      member: o.member ? { id: o.member.id, name: o.member.name } : null,
      items: [{ name: (o.menuItem as any)?.name ?? "Unknown", quantity: o.quantity }],
    }));
  }),

  // Staff/Admin: update order status
  updateStatus: staffProcedure
    .input(
      z.object({
        orderId: z.number().int(),
        status: z.enum(["preparing", "ready", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const order = await db.query.orders.findFirst({
        where: (o, { eq }) => eq(o.id, input.orderId),
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      // If cancelling, refund tokens
      if (input.status === "cancelled" && order.status !== "cancelled") {
        const member = await db.query.members.findFirst({
          where: (m, { eq }) => eq(m.id, order.memberId),
        });

        if (member) {
          const newBalance = member.tokenBalance + order.tokenCost;
          await db
            .update(members)
            .set({ tokenBalance: newBalance })
            .where(eq(members.id, order.memberId));

          await db.insert(tokenTransactions).values({
            memberId: order.memberId,
            type: "refund",
            amount: order.tokenCost,
            balanceAfter: newBalance,
            description: `Refund for cancelled order #${order.id}`,
            orderId: order.id,
          });
        }
      }

      await db
        .update(orders)
        .set({ status: input.status as any })
        .where(eq(orders.id, input.orderId));

      return { success: true };
    }),

  // Admin: get all orders with filters
  getAllOrders: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]).optional(),
        limit: z.number().int().default(50),
      })
    )
    .query(async ({ input }) => {
      return db.query.orders.findMany({
        where: input.status ? (o, { eq }) => eq(o.status, input.status!) : undefined,
        orderBy: (o, { desc }) => [desc(o.createdAt)],
        limit: input.limit,
        with: {
          member: { columns: { id: true, name: true } },
          menuItem: { columns: { id: true, name: true, tokenCost: true } },
        },
      });
    }),
});
