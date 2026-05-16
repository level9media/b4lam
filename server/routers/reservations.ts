import { z } from "zod/v4";
import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { reservations } from "../../drizzle/schema.js";
import { eq, desc } from "drizzle-orm";

export const reservationsRouter = router({
  // Member: create a reservation
  create: protectedProcedure
    .input(
      z.object({
        partySize: z.number().int().min(1).max(20),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^\d{2}:\d{2}$/),
        notes: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [result] = await db.insert(reservations).values({
        memberId: ctx.member.id,
        ...input,
        status: "pending",
      });
      return { id: (result as any).insertId, success: true };
    }),

  // Member: get own reservations
  myReservations: protectedProcedure.query(async ({ ctx }) => {
    return db.query.reservations.findMany({
      where: (r, { eq }) => eq(r.memberId, ctx.member.id),
      orderBy: (r, { desc }) => [desc(r.date)],
    });
  }),

  // Admin: get all reservations
  getAll: adminProcedure.query(async () => {
    return db.query.reservations.findMany({
      orderBy: (r, { desc }) => [desc(r.date)],
      with: {
        member: { columns: { id: true, name: true, email: true } },
      },
    });
  }),

  // Admin: get all reservations (alias)
  all: adminProcedure.query(async () => {
    return db.query.reservations.findMany({
      orderBy: (r, { desc }) => [desc(r.date)],
      with: {
        member: { columns: { id: true, name: true, email: true } },
      },
    });
  }),

  // Admin: update reservation status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(reservations)
        .set({ status: input.status })
        .where(eq(reservations.id, input.id));
      return { success: true };
    }),
});
