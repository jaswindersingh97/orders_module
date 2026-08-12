import { z } from "zod";

export const orderStatuses = [
  "order_received",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const orderStatusSchema = z.enum(orderStatuses);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const paginatedResponseSchema = <TItem extends z.ZodType>(
  itemSchema: TItem,
) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });

export interface PaginatedResult<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const userDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
});

export const addressDtoSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  label: z.string().nullable(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const customerDtoSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  addresses: z.array(addressDtoSchema).optional(),
});

export const categoryDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const productDtoSchema = z.object({
  id: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  imageUrls: z.array(z.url()),
  isAvailable: z.boolean(),
});

export const productListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  isAvailable: z.coerce.boolean().optional(),
});

export const cartItemDtoSchema = z.object({
  id: z.number().int().positive(),
  customerId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  product: productDtoSchema.optional(),
});

export const upsertCartItemSchema = z.object({
  customerId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  customerId: z.number().int().positive(),
  addressId: z.number().int().positive(),
  items: z.array(createOrderItemSchema).min(1),
});

export const orderItemDtoSchema = z.object({
  id: z.number().int().positive(),
  orderId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.string(),
  subtotal: z.string(),
  product: productDtoSchema.optional(),
});

export const orderStatusEventDtoSchema = z.object({
  id: z.number().int().positive(),
  orderId: z.number().int().positive(),
  status: orderStatusSchema,
  createdAt: z.string(),
});

export const orderDtoSchema = z.object({
  id: z.number().int().positive(),
  customerId: z.number().int().positive(),
  addressId: z.number().int().positive(),
  status: orderStatusSchema,
  amount: z.string(),
  items: z.array(orderItemDtoSchema).optional(),
  statusEvents: z.array(orderStatusEventDtoSchema).optional(),
});

export const orderListQuerySchema = paginationQuerySchema.extend({
  customerId: z.coerce.number().int().positive().optional(),
  status: orderStatusSchema.optional(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type CustomerDto = z.infer<typeof customerDtoSchema>;
export type CategoryDto = z.infer<typeof categoryDtoSchema>;
export type ProductDto = z.infer<typeof productDtoSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type CartItemDto = z.infer<typeof cartItemDtoSchema>;
export type UpsertCartItemInput = z.infer<typeof upsertCartItemSchema>;
export type AddressDto = z.infer<typeof addressDtoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemDto = z.infer<typeof orderItemDtoSchema>;
export type OrderStatusEventDto = z.infer<typeof orderStatusEventDtoSchema>;
export type OrderDto = z.infer<typeof orderDtoSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
