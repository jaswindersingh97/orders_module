import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [uniqueIndex("categories_name_unique").on(table.name)],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
