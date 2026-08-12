import { describe, expect, test } from "bun:test";
import { app } from "../../app";

describe("Cart API", () => {
  const customerId = 1; // Alice Johnson

  test("GET /cart/:customerId should return list of cart items", async () => {
    const res = await app.request(`/cart/${customerId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /cart should add/upsert an item, and DELETE should remove it", async () => {
    // 1. Fetch available products to get a valid product ID
    const prodRes = await app.request("/products");
    expect(prodRes.status).toBe(200);
    const prodBody = await prodRes.json();
    expect(prodBody.items.length).toBeGreaterThan(0);
    const productId = prodBody.items[0].id;

    // 2. Add item to cart
    const addRes = await app.request("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        productId,
        quantity: 2,
      }),
    });
    expect(addRes.status).toBe(200);
    const addBody = await addRes.json();
    expect(addBody.customerId).toBe(customerId);
    expect(addBody.productId).toBe(productId);
    expect(addBody.quantity).toBe(2);
    expect(addBody).toHaveProperty("product");

    // 3. Verify it is returned in the cart list
    const listRes = await app.request(`/cart/${customerId}`);
    const listBody = await listRes.json();
    const cartItem = listBody.find((item: any) => item.productId === productId);
    expect(cartItem).toBeDefined();
    expect(cartItem.quantity).toBe(2);

    // 4. Remove from cart
    const deleteRes = await app.request(`/cart/${cartItem.id}`, {
      method: "DELETE",
    });
    expect(deleteRes.status).toBe(200);

    // 5. Verify it is no longer in the cart list
    const postDeleteRes = await app.request(`/cart/${customerId}`);
    const postDeleteBody = await postDeleteRes.json();
    const deletedItem = postDeleteBody.find((item: any) => item.productId === productId);
    expect(deletedItem).toBeUndefined();
  });

  test("POST /cart should fail with invalid input values", async () => {
    const res = await app.request("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: -1, // invalid id
        productId: "abc", // invalid type
        quantity: 0, // must be positive
      }),
    });
    expect(res.status).toBe(400);
  });
});
