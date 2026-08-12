import type {
  CreateOrderInput,
  OrderDto,
  OrderListQuery,
  PaginatedResult,
  UpdateOrderStatusInput,
} from "@acme/shared";

export type ListOrdersInput = OrderListQuery;

export type ListOrdersResult = PaginatedResult<OrderDto>;

export interface GetOrderInput {
  orderId: number;
}

export type GetOrderResult = OrderDto | null;

export type CreateOrderServiceInput = CreateOrderInput;

export type CreateOrderResult = OrderDto;

export interface UpdateOrderStatusServiceInput {
  orderId: number;
  payload: UpdateOrderStatusInput;
}

export type UpdateOrderStatusResult = OrderDto;
