import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthResponseSchema, type HealthResponse } from "@acme/shared";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());

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
