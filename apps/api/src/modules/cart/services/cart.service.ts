import type {
  GetCartInput,
  GetCartResult,
  RemoveCartItemInput,
  UpsertCartItemResult,
  UpsertCartItemServiceInput,
} from "../cart.types";

export interface CartService {
  getCart(input: GetCartInput): Promise<GetCartResult>;
  upsertCartItem(
    input: UpsertCartItemServiceInput,
  ): Promise<UpsertCartItemResult>;
  removeCartItem(input: RemoveCartItemInput): Promise<void>;
}
