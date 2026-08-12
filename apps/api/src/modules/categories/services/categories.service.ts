import { db, categories } from "@acme/db";
import { sql } from "drizzle-orm";
import type {
  ListCategoriesInput,
  ListCategoriesResult,
  CategoriesService,
} from "../categories.types";

export class DbCategoriesService implements CategoriesService {
  async listCategories(input: ListCategoriesInput): Promise<ListCategoriesResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    // 1. Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories);
    const total = Number(countResult?.count ?? 0);

    // 2. Get paginated items
    const items = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .limit(limit)
      .offset(offset);

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

export const categoriesService = new DbCategoriesService();
