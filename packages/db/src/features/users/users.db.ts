import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../shared/audit";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 24 }).notNull(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
