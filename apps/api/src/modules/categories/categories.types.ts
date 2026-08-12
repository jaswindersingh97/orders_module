import type {
  CategoryDto,
  PaginatedResult,
  PaginationQuery,
} from "@acme/shared";

export type ListCategoriesInput = PaginationQuery;

export type ListCategoriesResult = PaginatedResult<CategoryDto>;
