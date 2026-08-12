import { Hono } from "hono";
import { productsService } from "../services/products.service";
import { productListQuerySchema } from "@acme/shared";

export const productsRoutes = new Hono();

productsRoutes.get("/", async (c) => {
  const queryParams = c.req.query();
  const parsed = productListQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const result = await productsService.listProducts(parsed.data);
  return c.json(result);
});
