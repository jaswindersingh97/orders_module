import { index, integer, numeric, pgEnum, pgTable, serial } from "drizzle-orm/pg-core";
import { addresses } from "../addresses/addresses.db";
import { customers } from "../customers/customers.db";
import { products } from "../products/products.db";
import { users } from "../users/users.db";
import { auditUserColumns, timestamps } from "../../shared/audit";

export const orderStatusEnum = pgEnum("order_status", [
  "order_received",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id),
    addressId: integer("address_id")
      .notNull()
      .references(() => addresses.id),
    status: orderStatusEnum("status").notNull().default("order_received"),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [
    index("orders_customer_id_idx").on(table.customerId),
    index("orders_status_idx").on(table.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
  ],
);

export const orderStatusEvents = pgTable(
  "order_status_events",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    status: orderStatusEnum("status").notNull(),
    ...auditUserColumns(() => users.id),
    ...timestamps,
  },
  (table) => [index("order_status_events_order_id_idx").on(table.orderId)],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderStatusEvent = typeof orderStatusEvents.$inferSelect;
export type NewOrderStatusEvent = typeof orderStatusEvents.$inferInsert;
