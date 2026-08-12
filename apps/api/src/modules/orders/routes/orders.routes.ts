import { Hono } from "hono";
import { ordersService } from "../services/orders.service";
import { createOrderSchema, orderListQuerySchema, updateOrderStatusSchema } from "@acme/shared";

export const ordersRoutes = new Hono();

ordersRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  try {
    const result = await ordersService.createOrder(parsed.data);
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to place order" }, 400);
  }
});

ordersRoutes.get("/", async (c) => {
  const queryParams = c.req.query();
  const parsed = orderListQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const result = await ordersService.listOrders(parsed.data);
  return c.json(result);
});

ordersRoutes.get("/:id", async (c) => {
  const orderId = Number(c.req.param("id"));
  if (isNaN(orderId)) {
    return c.json({ error: "Invalid order ID" }, 400);
  }

  const result = await ordersService.getOrder({ orderId });
  if (!result) {
    return c.json({ error: "Order not found" }, 404);
  }

  return c.json(result);
});

ordersRoutes.patch("/:id/status", async (c) => {
  const orderId = Number(c.req.param("id"));
  if (isNaN(orderId)) {
    return c.json({ error: "Invalid order ID" }, 400);
  }

  const body = await c.req.json().catch(() => ({}));
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  try {
    const result = await ordersService.updateOrderStatus({
      orderId,
      payload: parsed.data,
    });
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to update order status" }, 400);
  }
});
