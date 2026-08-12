import { relations } from "drizzle-orm";
import { cartItems } from "../cart/cart.db";
import { orders } from "../orders/orders.db";
import { users } from "../users/users.db";
import { customers } from "./customers.db";

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
  orders: many(orders),
}));
