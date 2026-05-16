import { z } from "zod/v4";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc.js";
import { db, getActiveMenuItems } from "../db.js";
import { menuItems } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const menuRouter = router({
  // Public: get tonight's menu (active items)
  getTonight: publicProcedure.query(async () => {
    return getActiveMenuItems();
  }),

  // Member: get full menu
  getAll: protectedProcedure.query(async () => {
    return db.query.menuItems.findMany({
      where: (m, { eq }) => eq(m.isActive, true),
      orderBy: (m, { asc }) => [asc(m.sortOrder), asc(m.name)],
    });
  }),

  // Admin: create menu item
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        tokenCost: z.number().int().min(1).max(20),
        category: z.enum(["cocktail", "spirit", "mocktail", "special"]),
        ingredients: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        isAvailableTonight: z.boolean().default(true),
        isSpecial: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const [result] = await db.insert(menuItems).values({
        ...input,
        ingredients: input.ingredients ? JSON.stringify(input.ingredients) : null,
        isActive: true,
      });
      return { id: (result as any).insertId };
    }),

  // Admin: update menu item
  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        tokenCost: z.number().int().min(1).max(20).optional(),
        category: z.enum(["cocktail", "spirit", "mocktail", "special"]).optional(),
        ingredients: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        isAvailableTonight: z.boolean().optional(),
        isSpecial: z.boolean().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ingredients, ...rest } = input;
      await db
        .update(menuItems)
        .set({
          ...rest,
          ...(ingredients !== undefined ? { ingredients: JSON.stringify(ingredients) } : {}),
        })
        .where(eq(menuItems.id, id));
      return { success: true };
    }),

  // Admin: toggle availability for tonight
  toggleAvailability: adminProcedure
    .input(z.object({ id: z.number().int(), available: z.boolean() }))
    .mutation(async ({ input }) => {
      await db
        .update(menuItems)
        .set({ isAvailableTonight: input.available })
        .where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  // Member: get active menu items (alias for getAll)
  getActive: protectedProcedure.query(async () => {
    return db.query.menuItems.findMany({
      where: (m, { eq }) => eq(m.isActive, true),
      orderBy: (m, { asc }) => [asc(m.sortOrder), asc(m.name)],
    });
  }),

  // Admin: delete a menu item
  delete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await db.update(menuItems).set({ isActive: false }).where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  // Admin: toggle active status
  toggleActive: adminProcedure
    .input(z.object({ id: z.number().int(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.update(menuItems).set({ isActive: input.isActive }).where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  // Admin: set all items as available (reset for new night)
  resetNightlyAvailability: adminProcedure.mutation(async () => {
    await db.update(menuItems).set({ isAvailableTonight: true }).where(eq(menuItems.isActive, true));
    return { success: true };
  }),
});
