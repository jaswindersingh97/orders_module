import { db } from "./client";
import {
  users,
  customers,
  addresses,
  categories,
  products,
  cartItems,
  orders,
  orderItems,
  orderStatusEvents
} from "./schema";

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data in reverse order of relationships
  console.log("Clearing existing data...");
  await db.delete(cartItems);
  await db.delete(orderStatusEvents);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(addresses);
  await db.delete(customers);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  // 2. Insert Users
  console.log("Seeding users...");
  const seededUsers = await db.insert(users).values([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      phoneNumber: "+1555019901",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      phoneNumber: "+1555019902",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      phoneNumber: "+1555019903",
    },
    {
      name: "System Admin",
      email: "admin@example.com",
      phoneNumber: "+1555019999",
    }
  ]).returning();

  const aliceUser = seededUsers.find((u) => u.email === "alice@example.com")!;
  const bobUser = seededUsers.find((u) => u.email === "bob@example.com")!;
  const charlieUser = seededUsers.find((u) => u.email === "charlie@example.com")!;

  // 3. Insert Customers (Alice, Bob, Charlie are customers)
  console.log("Seeding customers...");
  const seededCustomers = await db.insert(customers).values([
    { userId: aliceUser.id },
    { userId: bobUser.id },
    { userId: charlieUser.id }
  ]).returning();

  // 4. Insert Addresses for customers
  console.log("Seeding addresses...");
  await db.insert(addresses).values([
    {
      userId: aliceUser.id,
      label: "Home",
      line1: "123 Maple Avenue",
      line2: "Apt 3B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    {
      userId: aliceUser.id,
      label: "Office",
      line1: "500 5th Avenue",
      line2: "Floor 42",
      city: "New York",
      state: "NY",
      postalCode: "10110",
      country: "USA",
    },
    {
      userId: bobUser.id,
      label: "Home",
      line1: "456 Oak Road",
      line2: null,
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "USA",
    },
    {
      userId: charlieUser.id,
      label: "Home",
      line1: "789 Pine Street",
      line2: "Suite 100",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA",
    }
  ]);

  // 5. Insert Categories
  console.log("Seeding categories...");
  const seededCategories = await db.insert(categories).values([
    { name: "Pizza" },
    { name: "Burgers" },
    { name: "Sides" },
    { name: "Beverages" },
    { name: "Desserts" }
  ]).returning();

  const pizzaCat = seededCategories.find((c) => c.name === "Pizza")!;
  const burgerCat = seededCategories.find((c) => c.name === "Burgers")!;
  const sidesCat = seededCategories.find((c) => c.name === "Sides")!;
  const drinksCat = seededCategories.find((c) => c.name === "Beverages")!;
  const dessertCat = seededCategories.find((c) => c.name === "Desserts")!;

  // 6. Insert Products
  console.log("Seeding products...");
  await db.insert(products).values([
    // Pizza
    {
      categoryId: pizzaCat.id,
      name: "Margherita Pizza",
      description: "Classic pizza topped with premium mozzarella, sliced plum tomatoes, fresh basil, and extra virgin olive oil.",
      price: "12.99",
      imageUrls: ["https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    {
      categoryId: pizzaCat.id,
      name: "Pepperoni Feast",
      description: "Loaded with crispy cup-and-char pepperoni slices, fresh mozzarella cheese, and our signature zesty marinara sauce.",
      price: "14.99",
      imageUrls: ["https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    // Burgers
    {
      categoryId: burgerCat.id,
      name: "Classic Cheeseburger",
      description: "A flame-grilled 100% beef patty, sharp cheddar cheese, butter lettuce, tomato, pickles, and house burger spread on a toasted brioche bun.",
      price: "9.99",
      imageUrls: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    {
      categoryId: burgerCat.id,
      name: "Bacon BBQ Smokehouse Burger",
      description: "Thick-cut applewood smoked bacon, cheddar, crispy onion rings, and a rich, smoky barbecue sauce on a toasted bun.",
      price: "11.99",
      imageUrls: ["https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    // Sides
    {
      categoryId: sidesCat.id,
      name: "Gourmet French Fries",
      description: "Golden-brown potato fries, lightly tossed in sea salt and rosemary, served hot with a side of garlic aioli.",
      price: "3.99",
      imageUrls: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    {
      categoryId: sidesCat.id,
      name: "Garlic Breadsticks",
      description: "Warm, soft breadsticks brushed with melted garlic butter and parmesan cheese, served with warm marinara dipping sauce.",
      price: "5.49",
      imageUrls: ["https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    // Beverages
    {
      categoryId: drinksCat.id,
      name: "Ice-Cold Coca-Cola",
      description: "Refreshing, fizzy 500ml classic Coca-Cola served in a chilled glass with ice.",
      price: "1.99",
      imageUrls: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    {
      categoryId: drinksCat.id,
      name: "Freshly Squeezed Lemonade",
      description: "Bright and sweet housemade lemonade crafted from fresh lemons and pure cane sugar, served over crushed ice.",
      price: "2.99",
      imageUrls: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    },
    // Desserts
    {
      categoryId: dessertCat.id,
      name: "Fudgy Lava Brownie",
      description: "Decadent, warm chocolate brownie with a rich liquid chocolate center, topped with a dusting of powdered sugar.",
      price: "4.99",
      imageUrls: ["https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=80"],
      isAvailable: true,
    }
  ]);

  console.log("Seeding completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  });
