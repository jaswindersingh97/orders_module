import { describe, expect, test } from "bun:test";
import { app } from "../../app";

describe("Orders API", () => {
  test("Order flow: Create order, retrieve order, list orders, and update order status", async () => {
    // 1. Get customer Bob Smith (ID: 2) and his address
    const custRes = await app.request("/customers/2");
    expect(custRes.status).toBe(200);
    const custBody = await custRes.json();
    expect(custBody.addresses.length).toBeGreaterThan(0);
    const addressId = custBody.addresses[0].id;
    const customerId = custBody.id;

    // 2. Get a valid product ID
    const prodRes = await app.request("/products");
    expect(prodRes.status).toBe(200);
    const prodBody = await prodRes.json();
    expect(prodBody.items.length).toBeGreaterThan(0);
    const product = prodBody.items[0];
    const productId = product.id;

    // 3. Place order
    const createRes = await app.request("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        addressId,
        items: [
          {
            productId,
            quantity: 3,
          },
        ],
      }),
    });
    expect(createRes.status).toBe(201);
    const order = await createRes.json();
    expect(order.customerId).toBe(customerId);
    expect(order.addressId).toBe(addressId);
    expect(order.status).toBe("order_received");
    
    // Verify amount matches pricing (price is a string representing numeric)
    const expectedAmount = (parseFloat(product.price) * 3).toFixed(2);
    expect(order.amount).toBe(expectedAmount);
    expect(order.items.length).toBe(1);
    expect(order.items[0].productId).toBe(productId);
    expect(order.items[0].quantity).toBe(3);
    expect(order.statusEvents.length).toBe(1);
    expect(order.statusEvents[0].status).toBe("order_received");

    // 4. Retrieve single order
    const getRes = await app.request(`/orders/${order.id}`);
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.id).toBe(order.id);
    expect(getBody.amount).toBe(expectedAmount);

    // 5. List orders for Bob
    const listRes = await app.request(`/orders?customerId=${customerId}`);
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();
    expect(listBody.items.length).toBeGreaterThan(0);
    expect(listBody.items.some((o: any) => o.id === order.id)).toBe(true);

    // 6. Update order status
    const updateRes = await app.request(`/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "preparing",
      }),
    });
    expect(updateRes.status).toBe(200);
    const updatedOrder = await updateRes.json();
    expect(updatedOrder.status).toBe("preparing");
    expect(updatedOrder.statusEvents.length).toBe(2);
    expect(updatedOrder.statusEvents[1].status).toBe("preparing");
  });

  test("POST /orders should fail with invalid schemas", async () => {
    const res = await app.request("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "not-a-number",
        addressId: 1,
        items: [],
      }),
    });
    expect(res.status).toBe(400);
  });
});
