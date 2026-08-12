import { relations } from "drizzle-orm";
import { products } from "../products/products.db";
import { categories } from "./categories.db";

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
