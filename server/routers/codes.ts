import { z } from "zod/v4";
import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { nightlyCodes } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export const codesRouter = router({
  // Member: get tonight's active code
  tonight: protectedProcedure.query(async () => {
    const now = Date.now();
    const code = await db.query.nightlyCodes.findFirst({
      where: (c, { and, eq, gt }) => and(eq(c.isActive, true), gt(c.expiresAt, now)),
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    if (!code) return null;

    return {
      id: code.id,
      word: code.word,
      phonetic: code.phonetic,
      expiresAt: code.expiresAt,
    };
  }),

  // Admin: set a new nightly code (deactivates existing ones)
  set: adminProcedure
    .input(
      z.object({
        word: z.string().min(1).max(100),
        phonetic: z.string().max(255).optional(),
        expiresAt: z.number().int(), // Unix ms
      })
    )
    .mutation(async ({ input }) => {
      // Deactivate all existing active codes
      await db
        .update(nightlyCodes)
        .set({ isActive: false })
        .where(eq(nightlyCodes.isActive, true));

      const [result] = await db.insert(nightlyCodes).values({
        word: input.word,
        phonetic: input.phonetic ?? null,
        expiresAt: input.expiresAt,
        isActive: true,
      });

      return { success: true, id: (result as any).insertId };
    }),

  // Admin: deactivate a specific code
  deactivate: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await db
        .update(nightlyCodes)
        .set({ isActive: false })
        .where(eq(nightlyCodes.id, input.id));

      return { success: true };
    }),

  // Admin: list recent codes
  list: adminProcedure.query(async () => {
    return db.query.nightlyCodes.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
      limit: 30,
    });
  }),
});
