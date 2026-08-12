import type { CartItemDto, UpsertCartItemInput } from "@acme/shared";

export interface GetCartInput {
  customerId: number;
}

export type GetCartResult = CartItemDto[];

export type UpsertCartItemServiceInput = UpsertCartItemInput;

export type UpsertCartItemResult = CartItemDto;

export interface RemoveCartItemInput {
  cartItemId: number;
}
