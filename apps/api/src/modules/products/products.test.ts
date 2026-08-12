import { describe, expect, test } from "bun:test";
import { app } from "../../app";

describe("Products API", () => {
  test("GET /products should return a list of products", async () => {
    const res = await app.request("/products");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("totalPages");
    expect(Array.isArray(body.items)).toBe(true);

    if (body.items.length > 0) {
      const product = body.items[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("imageUrls");
      expect(product).toHaveProperty("isAvailable");
    }
  });

  test("GET /products with category filter should work", async () => {
    // First fetch categories
    const catRes = await app.request("/categories");
    expect(catRes.status).toBe(200);
    const catBody = await catRes.json();
    
    if (catBody.items.length > 0) {
      const catId = catBody.items[0].id;
      const res = await app.request(`/products?categoryId=${catId}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.items.every((item: any) => item.categoryId === catId)).toBe(true);
    }
  });

  test("GET /products with search query should filter products", async () => {
    const res = await app.request("/products?search=Margherita");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items.every((item: any) => 
      item.name.toLowerCase().includes("margherita") || 
      item.description.toLowerCase().includes("margherita")
    )).toBe(true);
  });
});
