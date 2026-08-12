import { integer, timestamp } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const auditUserColumns = (userId: () => AnyPgColumn) => ({
  createdBy: integer("created_by").references(userId),
  updatedBy: integer("updated_by").references(userId),
  deletedBy: integer("deleted_by").references(userId),
});
