import { index, integer, pgTable, serial, uniqueIndex } from "drizzle-orm/pg-core";
import { customers } from "../customers/customers.db";
import { products } from "../products/products.db";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull().default(1),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("cart_items_customer_product_unique").on(
      table.customerId,
      table.productId,
    ),
    index("cart_items_customer_id_idx").on(table.customerId),
  ],
);

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
