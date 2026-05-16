import { z } from "zod/v4";
import { router, publicProcedure, protectedProcedure } from "../trpc.js";
import { db, getMemberByEmail } from "../db.js";
import { members, inviteCodes, sessions } from "../../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { TRPCError } from "@trpc/server";

function generateToken(memberId: number): string {
  return jwt.sign({ memberId }, env.JWT_SECRET, { expiresIn: "30d" });
}

export const authRouter = router({
  // Validate an invite code before showing registration form
  validateInvite: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const invite = await db.query.inviteCodes.findFirst({
        where: (i, { eq, and }) =>
          and(eq(i.code, input.code.toUpperCase()), eq(i.isActive, true)),
      });

      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired invite code." });
      }

      if (invite.usedBy) {
        throw new TRPCError({ code: "CONFLICT", message: "This invite code has already been used." });
      }

      if (invite.expiresAt && new Date() > invite.expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This invite code has expired." });
      }

      return { valid: true, inviteId: invite.id };
    }),

  // Register a new member with invite code
  register: publicProcedure
    .input(
      z.object({
        inviteCode: z.string().min(1),
        name: z.string().min(2).max(100),
        email: z.string().email(),
        pin: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate invite code
      const invite = await db.query.inviteCodes.findFirst({
        where: (i, { eq, and }) =>
          and(eq(i.code, input.inviteCode.toUpperCase()), eq(i.isActive, true)),
      });

      if (!invite || invite.usedBy) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invalid or already used invite code." });
      }

      // Check email not already registered
      const existing = await getMemberByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered." });
      }

      // Hash PIN
      const pinHash = await bcrypt.hash(input.pin, 12);

      // Create member
      const [result] = await db.insert(members).values({
        email: input.email.toLowerCase(),
        name: input.name,
        pinHash,
        role: "member",
        status: "active",
        tokenBalance: 0,
        invitedBy: invite.createdBy,
      });

      const memberId = (result as any).insertId as number;

      // Mark invite as used
      await db
        .update(inviteCodes)
        .set({ usedBy: memberId, usedAt: new Date() })
        .where(eq(inviteCodes.id, invite.id));

      // Create session
      const token = generateToken(memberId);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await db.insert(sessions).values({ memberId, token, expiresAt });

      // Set cookie
      ctx.res.cookie("b4lam_session", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const member = await db.query.members.findFirst({
        where: (m, { eq }) => eq(m.id, memberId),
      });

      return { success: true, member };
    }),

  // Login with email + password (or legacy 6-digit PIN)
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        pin: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const member = await getMemberByEmail(input.email);

      if (!member) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials." });
      }

      if (member.status === "suspended") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Your membership has been suspended." });
      }

      if (member.status === "pending") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Your membership is pending approval." });
      }

      const validPin = await bcrypt.compare(input.pin, member.pinHash);
      if (!validPin) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials." });
      }

      // Create session
      const token = generateToken(member.id);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await db.insert(sessions).values({ memberId: member.id, token, expiresAt });

      ctx.res.cookie("b4lam_session", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return {
        success: true,
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          tokenBalance: member.tokenBalance,
        },
      };
    }),

  // Get current session member
  me: protectedProcedure.query(({ ctx }) => {
    const m = ctx.member;
    return {
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      tokenBalance: m.tokenBalance,
    };
  }),

  // Logout
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const token = ctx.req.cookies?.b4lam_session;
    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }
    ctx.res.clearCookie("b4lam_session");
    return { success: true };
  }),
});
