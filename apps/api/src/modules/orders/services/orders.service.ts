import {
  db,
  orders,
  orderItems,
  orderStatusEvents,
  products,
  cartItems,
  addresses,
  customers
} from "@acme/db";
import { eq, and, sql, inArray } from "drizzle-orm";
import type {
  ListOrdersInput,
  ListOrdersResult,
  GetOrderInput,
  GetOrderResult,
  CreateOrderServiceInput,
  CreateOrderResult,
  UpdateOrderStatusServiceInput,
  UpdateOrderStatusResult,
  OrdersService,
} from "../orders.types";
import type { OrderDto, OrderItemDto, OrderStatusEventDto } from "@acme/shared";

export class DbOrdersService implements OrdersService {
  private async getOrderDetails(orderId: number): Promise<OrderDto | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) return null;

    const dbItems = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        subtotal: orderItems.subtotal,
        product: {
          id: products.id,
          categoryId: products.categoryId,
          name: products.name,
          description: products.description,
          price: products.price,
          imageUrls: products.imageUrls,
          isAvailable: products.isAvailable,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const dbEvents = await db
      .select()
      .from(orderStatusEvents)
      .where(eq(orderStatusEvents.orderId, orderId))
      .orderBy(orderStatusEvents.createdAt);

    return {
      id: order.id,
      customerId: order.customerId,
      addressId: order.addressId,
      status: order.status,
      amount: order.amount,
      items: dbItems,
      statusEvents: dbEvents.map((evt) => ({
        id: evt.id,
        orderId: evt.orderId,
        status: evt.status,
        createdAt: evt.createdAt.toISOString(),
      })),
    };
  }

  async listOrders(input: ListOrdersInput): Promise<ListOrdersResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    const filters = [];
    if (input.customerId !== undefined) {
      filters.push(eq(orders.customerId, input.customerId));
    }
    if (input.status !== undefined) {
      filters.push(eq(orders.status, input.status));
    }
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // 1. Get count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);
    const total = Number(countResult?.count ?? 0);

    // 2. Get orders
    const dbOrders = await db
      .select()
      .from(orders)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`orders.created_at DESC`);

    // 3. Hydrate orders with items and status events if there are orders
    const items: OrderDto[] = [];
    for (const order of dbOrders) {
      const details = await this.getOrderDetails(order.id);
      if (details) {
        items.push(details);
      }
    }

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getOrder(input: GetOrderInput): Promise<GetOrderResult> {
    return this.getOrderDetails(input.orderId);
  }

  async createOrder(input: CreateOrderServiceInput): Promise<CreateOrderResult> {
    const { customerId, addressId, items: requestItems } = input;

    // 1. Verify customer exists
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    // 2. Verify address exists
    const [address] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, addressId));
    if (!address) {
      throw new Error(`Address with ID ${addressId} not found`);
    }

    // 3. Fetch products to get prices and calculate totals
    const productIds = requestItems.map((item) => item.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let totalAmount = 0;
    const orderItemsToInsert: {
      productId: number;
      quantity: number;
      unitPrice: string;
      subtotal: string;
    }[] = [];

    for (const reqItem of requestItems) {
      const prod = productMap.get(reqItem.productId);
      if (!prod) {
        throw new Error(`Product with ID ${reqItem.productId} not found`);
      }
      if (!prod.isAvailable) {
        throw new Error(`Product ${prod.name} is currently not available`);
      }

      const unitPriceNum = parseFloat(prod.price);
      const subtotalNum = unitPriceNum * reqItem.quantity;
      totalAmount += subtotalNum;

      orderItemsToInsert.push({
        productId: reqItem.productId,
        quantity: reqItem.quantity,
        unitPrice: prod.price,
        subtotal: subtotalNum.toFixed(2),
      });
    }

    // 4. Perform transaction
    const createdOrder = await db.transaction(async (tx) => {
      // a. Insert order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId,
          addressId,
          status: "order_received",
          amount: totalAmount.toFixed(2),
        })
        .returning();

      // b. Insert order items
      await tx.insert(orderItems).values(
        orderItemsToInsert.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        }))
      );

      // c. Insert initial order status event
      await tx.insert(orderStatusEvents).values({
        orderId: order.id,
        status: "order_received",
      });

      // d. Clear customer cart items
      await tx.delete(cartItems).where(eq(cartItems.customerId, customerId));

      return order;
    });

    const result = await this.getOrderDetails(createdOrder.id);
    if (!result) {
      throw new Error("Failed to retrieve created order details");
    }
    return result;
  }

  async updateOrderStatus(
    input: UpdateOrderStatusServiceInput,
  ): Promise<UpdateOrderStatusResult> {
    const { orderId, payload } = input;

    const [updatedOrder] = await db
      .update(orders)
      .set({ status: payload.status })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Insert order status event
    await db.insert(orderStatusEvents).values({
      orderId,
      status: payload.status,
    });

    const result = await this.getOrderDetails(orderId);
    if (!result) {
      throw new Error("Failed to retrieve updated order details");
    }
    return result;
  }
}

export const ordersService = new DbOrdersService();
