import { index, integer, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  accessKeyHash: text("access_key_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("eur"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  provider: varchar("provider", { length: 20 }).notNull().default("demo"),
  providerRef: text("provider_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const phones = pgTable("phones", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  number: varchar("number", { length: 20 }).notNull().unique(),
  model: varchar("model", { length: 60 }).notNull().default("Alter One"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  // Fin du pass. Null = pas de date de fin (numéros créés avant l'ajout de cette colonne).
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phoneId: uuid("phone_id")
      .notNull()
      .references(() => phones.id, { onDelete: "cascade" }),
    sender: varchar("sender", { length: 60 }).notNull(),
    body: text("body").notNull(),
    code: varchar("code", { length: 16 }),
    appSlug: varchar("app_slug", { length: 60 }),
    // Date de "livraison" : peut être dans le futur pour simuler le délai d'acheminement d'un SMS
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (t) => [index("messages_phone_created_idx").on(t.phoneId, t.createdAt)],
);

export const sessions = pgTable("sessions", {
  token: varchar("token", { length: 128 }).primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  appSlug: varchar("app_slug", { length: 60 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
