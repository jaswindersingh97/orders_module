import { Hono } from "hono";
import { customersService } from "../services/customers.service";
import { paginationQuerySchema } from "@acme/shared";

export const customersRoutes = new Hono();

customersRoutes.get("/", async (c) => {
  const queryParams = c.req.query();
  const parsed = paginationQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const result = await customersService.listCustomers(parsed.data);
  return c.json(result);
});

customersRoutes.get("/:id", async (c) => {
  const customerId = Number(c.req.param("id"));
  if (isNaN(customerId)) {
    return c.json({ error: "Invalid customer ID" }, 400);
  }

  const result = await customersService.getCustomer({ customerId });
  if (!result) {
    return c.json({ error: "Customer not found" }, 404);
  }

  return c.json(result);
});
