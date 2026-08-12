import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "../categories/categories.db";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    imageUrls: jsonb("image_urls")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    isAvailable: boolean("is_available").notNull().default(true),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_is_available_idx").on(table.isAvailable),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
