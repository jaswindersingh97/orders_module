import { index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const addresses = pgTable(
  "addresses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    label: varchar("label", { length: 80 }),
    line1: text("line_1").notNull(),
    line2: text("line_2"),
    city: varchar("city", { length: 120 }).notNull(),
    state: varchar("state", { length: 120 }).notNull(),
    postalCode: varchar("postal_code", { length: 24 }).notNull(),
    country: varchar("country", { length: 80 }).notNull().default("India"),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [index("addresses_user_id_idx").on(table.userId)],
);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
