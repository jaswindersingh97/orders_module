import { db, customers, users, addresses } from "@acme/db";
import { eq, inArray, sql } from "drizzle-orm";
import type {
  ListCustomersInput,
  ListCustomersResult,
  GetCustomerInput,
  GetCustomerResult,
  CustomersService,
} from "../customers.types";
import type { AddressDto } from "@acme/shared";

export class DbCustomersService implements CustomersService {
  async listCustomers(input: ListCustomersInput): Promise<ListCustomersResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    // 1. Get count of customers
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers);
    const total = Number(countResult?.count ?? 0);

    // 2. Get customer rows joined with user details
    const dbCustomers = await db
      .select({
        id: customers.id,
        userId: customers.userId,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(customers)
      .innerJoin(users, eq(customers.userId, users.id))
      .limit(limit)
      .offset(offset);

    // 3. Fetch addresses for all fetched customers
    const userIds = dbCustomers.map((c) => c.userId);
    const dbAddresses = userIds.length > 0
      ? await db.select().from(addresses).where(inArray(addresses.userId, userIds))
      : [];

    // Map and group addresses by userId
    const addressMap = new Map<number, AddressDto[]>();
    for (const addr of dbAddresses) {
      const list = addressMap.get(addr.userId) ?? [];
      list.push({
        id: addr.id,
        userId: addr.userId,
        label: addr.label,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      });
      addressMap.set(addr.userId, list);
    }

    const items = dbCustomers.map((c) => ({
      id: c.id,
      userId: c.userId,
      name: c.name,
      email: c.email,
      phoneNumber: c.phoneNumber,
      addresses: addressMap.get(c.userId) ?? [],
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getCustomer(input: GetCustomerInput): Promise<GetCustomerResult> {
    // 1. Fetch customer joined with user details
    const [dbCustomer] = await db
      .select({
        id: customers.id,
        userId: customers.userId,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(customers)
      .innerJoin(users, eq(customers.userId, users.id))
      .where(eq(customers.id, input.customerId));

    if (!dbCustomer) {
      return null;
    }

    // 2. Fetch addresses for this customer's user
    const dbAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, dbCustomer.userId));

    const formattedAddresses: AddressDto[] = dbAddresses.map((addr) => ({
      id: addr.id,
      userId: addr.userId,
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));

    return {
      id: dbCustomer.id,
      userId: dbCustomer.userId,
      name: dbCustomer.name,
      email: dbCustomer.email,
      phoneNumber: dbCustomer.phoneNumber,
      addresses: formattedAddresses,
    };
  }
}

export const customersService = new DbCustomersService();
