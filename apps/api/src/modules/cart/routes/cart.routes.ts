import { Hono } from "hono";
import { cartService } from "../services/cart.service";
import { upsertCartItemSchema } from "@acme/shared";

export const cartRoutes = new Hono();

cartRoutes.get("/:customerId", async (c) => {
  const customerId = Number(c.req.param("customerId"));
  if (isNaN(customerId)) {
    return c.json({ error: "Invalid customer ID" }, 400);
  }

  const result = await cartService.getCart({ customerId });
  return c.json(result);
});

cartRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = upsertCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const result = await cartService.upsertCartItem(parsed.data);
  return c.json(result);
});

cartRoutes.delete("/:cartItemId", async (c) => {
  const cartItemId = Number(c.req.param("cartItemId"));
  if (isNaN(cartItemId)) {
    return c.json({ error: "Invalid cart item ID" }, 400);
  }

  await cartService.removeCartItem({ cartItemId });
  return c.json({ success: true });
});
