import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  ...auditUserColumns(() => users.id),
  ...timestamps,
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
