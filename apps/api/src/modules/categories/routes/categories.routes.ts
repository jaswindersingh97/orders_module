import { Hono } from "hono";
import { categoriesService } from "../services/categories.service";
import { paginationQuerySchema } from "@acme/shared";

export const categoriesRoutes = new Hono();

categoriesRoutes.get("/", async (c) => {
  const queryParams = c.req.query();
  const parsed = paginationQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const result = await categoriesService.listCategories(parsed.data);
  return c.json(result);
});
