import { relations } from "drizzle-orm";
import { addresses } from "../addresses/addresses.db";
import { customers } from "../customers/customers.db";
import { products } from "../products/products.db";
import { orderItems, orders, orderStatusEvents } from "./orders.db";

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  statusEvents: many(orderStatusEvents),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderStatusEventsRelations = relations(
  orderStatusEvents,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusEvents.orderId],
      references: [orders.id],
    }),
  }),
);
