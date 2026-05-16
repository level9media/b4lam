import {
  mysqlTable,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  bigint,
  mysqlEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─── Members ─────────────────────────────────────────────────────────────────
export const members = mysqlTable(
  "members",
  {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    pinHash: varchar("pin_hash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["member", "admin", "staff"]).notNull().default("member"),
    status: mysqlEnum("status", ["pending", "active", "suspended"]).notNull().default("pending"),
    tokenBalance: int("token_balance").notNull().default(0),
    invitedBy: int("invited_by"),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("email_idx").on(t.email),
  })
);

// ─── Invite Codes ─────────────────────────────────────────────────────────────
export const inviteCodes = mysqlTable(
  "invite_codes",
  {
    id: int("id").primaryKey().autoincrement(),
    code: varchar("code", { length: 64 }).notNull(),
    createdBy: int("created_by").notNull(),
    usedBy: int("used_by"),
    usedAt: timestamp("used_at"),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").notNull().default(true),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    codeIdx: uniqueIndex("code_idx").on(t.code),
  })
);

// ─── Token Packages ───────────────────────────────────────────────────────────
export const tokenPackages = mysqlTable("token_packages", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  tokenCount: int("token_count").notNull(),
  priceCents: int("price_cents").notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Token Transactions ───────────────────────────────────────────────────────
export const tokenTransactions = mysqlTable(
  "token_transactions",
  {
    id: int("id").primaryKey().autoincrement(),
    memberId: int("member_id").notNull(),
    type: mysqlEnum("type", ["purchase", "redemption", "refund", "admin_grant"]).notNull(),
    amount: int("amount").notNull(), // positive = credit, negative = debit
    balanceAfter: int("balance_after").notNull(),
    description: varchar("description", { length: 500 }),
    orderId: int("order_id"),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    memberIdx: index("member_idx").on(t.memberId),
  })
);

// ─── Menu Items ───────────────────────────────────────────────────────────────
export const menuItems = mysqlTable("menu_items", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  tokenCost: int("token_cost").notNull(),
  category: mysqlEnum("category", ["cocktail", "spirit", "mocktail", "special"]).notNull().default("cocktail"),
  ingredients: text("ingredients"), // JSON array string
  imageUrl: varchar("image_url", { length: 500 }),
  isAvailableTonight: boolean("is_available_tonight").notNull().default(true),
  isSpecial: boolean("is_special").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = mysqlTable(
  "orders",
  {
    id: int("id").primaryKey().autoincrement(),
    memberId: int("member_id").notNull(),
    menuItemId: int("menu_item_id").notNull(),
    quantity: int("quantity").notNull().default(1),
    tokenCost: int("token_cost").notNull(),
    status: mysqlEnum("status", ["pending", "preparing", "ready", "completed", "cancelled"]).notNull().default("pending"),
    notes: text("notes"),
    tableNumber: varchar("table_number", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => ({
    memberIdx: index("order_member_idx").on(t.memberId),
    statusIdx: index("order_status_idx").on(t.status),
  })
);

// ─── Nightly Codes ────────────────────────────────────────────────────────────
// Word-based Mayan entry codes (e.g. "Itzamná", "Kukulcán")
export const nightlyCodes = mysqlTable("nightly_codes", {
  id: int("id").primaryKey().autoincrement(),
  word: varchar("word", { length: 100 }).notNull(),
  phonetic: varchar("phonetic", { length: 255 }),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(), // Unix ms
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Reservations ─────────────────────────────────────────────────────────────
export const reservations = mysqlTable(
  "reservations",
  {
    id: int("id").primaryKey().autoincrement(),
    memberId: int("member_id").notNull(),
    partySize: int("party_size").notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    time: varchar("time", { length: 10 }).notNull(), // HH:MM
    notes: text("notes"),
    status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    memberIdx: index("res_member_idx").on(t.memberId),
  })
);

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const sessions = mysqlTable(
  "sessions",
  {
    id: int("id").primaryKey().autoincrement(),
    memberId: int("member_id").notNull(),
    token: varchar("token", { length: 512 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    tokenIdx: uniqueIndex("session_token_idx").on(t.token),
    memberIdx: index("session_member_idx").on(t.memberId),
  })
);

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type InviteCode = typeof inviteCodes.$inferSelect;
export type TokenPackage = typeof tokenPackages.$inferSelect;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NightlyCode = typeof nightlyCodes.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
