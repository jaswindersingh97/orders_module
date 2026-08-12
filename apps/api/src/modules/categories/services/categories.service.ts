import type {
  ListCategoriesInput,
  ListCategoriesResult,
} from "../categories.types";

export interface CategoriesService {
  listCategories(input: ListCategoriesInput): Promise<ListCategoriesResult>;
}
