import { db, products } from "@acme/db";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import type {
  ListProductsInput,
  ListProductsResult,
  ProductsService,
} from "../products.types";

export class DbProductsService implements ProductsService {
  async listProducts(input: ListProductsInput): Promise<ListProductsResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    const filters = [];

    if (input.categoryId !== undefined) {
      filters.push(eq(products.categoryId, input.categoryId));
    }

    if (input.isAvailable !== undefined) {
      filters.push(eq(products.isAvailable, input.isAvailable));
    }

    if (input.search) {
      const searchPattern = `%${input.search}%`;
      filters.push(
        or(
          ilike(products.name, searchPattern),
          ilike(products.description, searchPattern)
        )
      );
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // 1. Get count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
    const total = Number(countResult?.count ?? 0);

    // 2. Get products
    const dbItems = await db
      .select()
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    // Map DB items to ProductDto
    const items = dbItems.map((item) => ({
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrls: item.imageUrls,
      isAvailable: item.isAvailable,
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
}

export const productsService = new DbProductsService();
