import { relations } from "drizzle-orm";
import { cartItems } from "../cart/cart.db";
import { categories } from "../categories/categories.db";
import { orderItems } from "../orders/orders.db";
import { products } from "./products.db";

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));
