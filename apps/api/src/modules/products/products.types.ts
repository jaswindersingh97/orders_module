import type {
  PaginatedResult,
  ProductDto,
  ProductListQuery,
} from "@acme/shared";

export type ListProductsInput = ProductListQuery;

export type ListProductsResult = PaginatedResult<ProductDto>;
