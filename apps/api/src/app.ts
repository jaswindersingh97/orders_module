import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthResponseSchema, type HealthResponse } from "@acme/shared";
import { productsRoutes } from "./modules/products";
import { categoriesRoutes } from "./modules/categories";
import { cartRoutes } from "./modules/cart";
import { ordersRoutes } from "./modules/orders";
import { customersRoutes } from "./modules/customers";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/products", productsRoutes);
app.route("/categories", categoriesRoutes);
app.route("/cart", cartRoutes);
app.route("/orders", ordersRoutes);
app.route("/customers", customersRoutes);

app.get("/health", (c) => {
  const payload: HealthResponse = {
    ok: true,
    service: "api",
    timestamp: new Date().toISOString(),
  };

  return c.json(healthResponseSchema.parse(payload));
});

app.get("/", (c) => {
  return c.json({
    message: "API is running",
  });
});
