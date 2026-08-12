import type {
  CreateOrderResult,
  CreateOrderServiceInput,
  GetOrderInput,
  GetOrderResult,
  ListOrdersInput,
  ListOrdersResult,
  UpdateOrderStatusResult,
  UpdateOrderStatusServiceInput,
} from "../orders.types";

export interface OrdersService {
  listOrders(input: ListOrdersInput): Promise<ListOrdersResult>;
  getOrder(input: GetOrderInput): Promise<GetOrderResult>;
  createOrder(input: CreateOrderServiceInput): Promise<CreateOrderResult>;
  updateOrderStatus(
    input: UpdateOrderStatusServiceInput,
  ): Promise<UpdateOrderStatusResult>;
}
