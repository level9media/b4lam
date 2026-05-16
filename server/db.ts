import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";
import { relations } from "drizzle-orm";
import { env } from "./env.js";

// ─── Relations ─────────────────────────────────────────────────────────────────
const membersRelations = relations(schema.members, ({ many }) => ({
  orders: many(schema.orders),
  reservations: many(schema.reservations),
  transactions: many(schema.tokenTransactions),
  sessions: many(schema.sessions),
}));

const ordersRelations = relations(schema.orders, ({ one }) => ({
  member: one(schema.members, {
    fields: [schema.orders.memberId],
    references: [schema.members.id],
  }),
  menuItem: one(schema.menuItems, {
    fields: [schema.orders.menuItemId],
    references: [schema.menuItems.id],
  }),
}));

const reservationsRelations = relations(schema.reservations, ({ one }) => ({
  member: one(schema.members, {
    fields: [schema.reservations.memberId],
    references: [schema.members.id],
  }),
}));

const tokenTransactionsRelations = relations(schema.tokenTransactions, ({ one }) => ({
  member: one(schema.members, {
    fields: [schema.tokenTransactions.memberId],
    references: [schema.members.id],
  }),
}));

const sessionsRelations = relations(schema.sessions, ({ one }) => ({
  member: one(schema.members, {
    fields: [schema.sessions.memberId],
    references: [schema.members.id],
  }),
}));

const inviteCodesRelations = relations(schema.inviteCodes, ({ one }) => ({
  usedByMember: one(schema.members, {
    fields: [schema.inviteCodes.usedBy],
    references: [schema.members.id],
  }),
}));

const schemaWithRelations = {
  ...schema,
  membersRelations,
  ordersRelations,
  reservationsRelations,
  tokenTransactionsRelations,
  sessionsRelations,
  inviteCodesRelations,
};

// Create a connection pool
const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema: schemaWithRelations, mode: "default" });

// ─── Member helpers ────────────────────────────────────────────────────────────
export async function getMemberById(id: number) {
  return db.query.members.findFirst({
    where: (m, { eq }) => eq(m.id, id),
  });
}

export async function getMemberByEmail(email: string) {
  return db.query.members.findFirst({
    where: (m, { eq }) => eq(m.email, email.toLowerCase()),
  });
}

// ─── Menu helpers ──────────────────────────────────────────────────────────────
export async function getActiveMenuItems() {
  return db.query.menuItems.findMany({
    where: (m, { eq }) => eq(m.isActive, true),
    orderBy: (m, { asc }) => [asc(m.sortOrder), asc(m.name)],
  });
}

// ─── Order helpers ─────────────────────────────────────────────────────────────
export async function getPendingOrders() {
  return db.query.orders.findMany({
    where: (o, { inArray }) => inArray(o.status, ["pending", "preparing"]),
    with: {
      member: true,
      menuItem: true,
    },
    orderBy: (o, { asc }) => [asc(o.createdAt)],
  });
}
