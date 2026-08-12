import type { ListProductsInput, ListProductsResult } from "../products.types";

export interface ProductsService {
  listProducts(input: ListProductsInput): Promise<ListProductsResult>;
}
