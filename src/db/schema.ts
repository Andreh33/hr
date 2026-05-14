import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  date: text("date").notNull(),    // ISO yyyy-mm-dd
  time: text("time").notNull(),    // HH:mm 24h
  people: integer("people").notNull(),
  notes: text("notes"),
  source: text("source").default("web"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const appInstallClicks = sqliteTable("app_install_clicks", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),   // "shown" | "accepted" | "dismissed"
  ua: text("ua"),
  platform: text("platform"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type AppInstallClick = typeof appInstallClicks.$inferSelect;
export type NewAppInstallClick = typeof appInstallClicks.$inferInsert;
