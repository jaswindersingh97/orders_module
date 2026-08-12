import { relations } from "drizzle-orm";
import { customers } from "../customers/customers.db";
import { products } from "../products/products.db";
import { cartItems } from "./cart.db";

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  customer: one(customers, {
    fields: [cartItems.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
