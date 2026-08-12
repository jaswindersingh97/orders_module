import { db, cartItems, products } from "@acme/db";
import { eq, and } from "drizzle-orm";
import type {
  GetCartInput,
  GetCartResult,
  UpsertCartItemServiceInput,
  UpsertCartItemResult,
  RemoveCartItemInput,
  CartService,
} from "../cart.types";

export class DbCartService implements CartService {
  async getCart(input: GetCartInput): Promise<GetCartResult> {
    const items = await db
      .select({
        id: cartItems.id,
        customerId: cartItems.customerId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
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
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.customerId, input.customerId));

    return items;
  }

  async upsertCartItem(
    input: UpsertCartItemServiceInput,
  ): Promise<UpsertCartItemResult> {
    const { customerId, productId, quantity } = input;

    // Perform upsert (on conflict of customerId and productId, update the quantity)
    const [inserted] = await db
      .insert(cartItems)
      .values({
        customerId,
        productId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.customerId, cartItems.productId],
        set: { quantity },
      })
      .returning();

    // Fetch the product details to include in response
    const [productDetails] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    return {
      id: inserted.id,
      customerId: inserted.customerId,
      productId: inserted.productId,
      quantity: inserted.quantity,
      product: productDetails
        ? {
            id: productDetails.id,
            categoryId: productDetails.categoryId,
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.price,
            imageUrls: productDetails.imageUrls,
            isAvailable: productDetails.isAvailable,
          }
        : undefined,
    };
  }

  async removeCartItem(input: RemoveCartItemInput): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
  }
}

export const cartService = new DbCartService();
