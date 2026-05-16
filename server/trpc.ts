import { initTRPC, TRPCError } from "@trpc/server";
import { type Request, type Response } from "express";
import superjson from "superjson";
import jwt from "jsonwebtoken";
import { getMemberById } from "./db.js";
import { env } from "./env.js";
import type { Member } from "../drizzle/schema.js";

export type Context = {
  req: Request;
  res: Response;
  member: Member | null;
};

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  let member: Member | null = null;

  try {
    const token = req.cookies?.b4lam_session || req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const payload = jwt.verify(token, env.JWT_SECRET) as { memberId: number };
      const found = await getMemberById(payload.memberId);
      if (found && found.status === "active") {
        member = found;
      }
    }
  } catch {
    // Invalid or expired token — treat as unauthenticated
  }

  return { req, res, member };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.member) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in." });
  }
  return next({ ctx: { ...ctx, member: ctx.member } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.member.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  }
  return next({ ctx });
});

export const staffProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.member.role !== "admin" && ctx.member.role !== "staff") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Staff access required." });
  }
  return next({ ctx });
});
