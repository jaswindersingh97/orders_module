import { relations } from "drizzle-orm";
import { addresses } from "../addresses/addresses.db";
import { customers } from "../customers/customers.db";
import { users } from "./users.db";

export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  addresses: many(addresses),
}));
