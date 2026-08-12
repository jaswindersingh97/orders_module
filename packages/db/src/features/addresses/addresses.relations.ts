import { relations } from "drizzle-orm";
import { orders } from "../orders/orders.db";
import { users } from "../users/users.db";
import { addresses } from "./addresses.db";

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));
