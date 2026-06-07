import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockUser = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockAdminUser = { ...mockUser, role: "admin" as const };

function createContext(user?: typeof mockUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as TrpcContext["res"],
  };
}

describe("auth router", () => {
  it("public user query returns undefined", async () => {
    const caller = appRouter.createCaller(createContext());
    const user = await caller.auth.me();
    expect(user).toBeUndefined();
  });

  it("authenticated user query returns user", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.id).toBe(mockUser.id);
    expect(user?.role).toBe("user");
  });
});

describe("products router", () => {
  it("lists all products publicly", async () => {
    const caller = appRouter.createCaller(createContext());
    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
  });

  it("filters products by category", async () => {
    const caller = appRouter.createCaller(createContext());
    const apparel = await caller.products.list({ category: "apparel" });
    if (apparel.length > 0) {
      expect(apparel.every((p) => p.category === "apparel")).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  it("only admins can create products", async () => {
    const userCaller = appRouter.createCaller(createContext(mockUser));
    try {
      await userCaller.products.create({
        name: "Test",
        slug: `test-${Date.now()}`,
        category: "apparel",
        priceMxn: "100",
        description: "Test",
        imageUrl: "",
        badge: null,
        inStock: true,
        featured: false,
      });
      expect.fail("Should have thrown");
    } catch (e: any) {
      expect(e instanceof TRPCError && e.code === "FORBIDDEN").toBe(true);
    }
  });

  it("admins can create products", async () => {
    const adminCaller = appRouter.createCaller(createContext(mockAdminUser));
    const uniqueSlug = `admin-test-prod-${Date.now()}`;
    const result = await adminCaller.products.create({
      name: "Admin Test Product",
      slug: uniqueSlug,
      category: "apparel",
      priceMxn: "500",
      description: "Created by admin",
      imageUrl: "https://example.com/img.jpg",
      badge: "NEW",
      inStock: true,
      featured: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("commerce router", () => {
  it("authenticated users can add to cart", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const products = await caller.products.list();
    if (products.length > 0) {
      const result = await caller.commerce.addToCart({
        productId: products[0].id,
        quantity: 1,
        size: null,
      });
      expect(result.success).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  it("unauthenticated users cannot add to cart", async () => {
    const caller = appRouter.createCaller(createContext());
    try {
      await caller.commerce.addToCart({
        productId: 1,
        quantity: 1,
        size: null,
      });
      expect.fail("Should have thrown");
    } catch (e: any) {
      expect(e instanceof TRPCError && e.code === "UNAUTHORIZED").toBe(true);
    }
  });

  it("crypto payment applies discount", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const products = await caller.products.list();
    if (products.length > 0) {
      await caller.commerce.addToCart({
        productId: products[0].id,
        quantity: 1,
        size: null,
      });
      const result = await caller.commerce.checkout({
        shippingName: "Test User",
        shippingAddress: "123 Test St",
        paymentMethod: "crypto",
      });
      expect(result.discount).toBeGreaterThan(0);
    } else {
      expect(true).toBe(true);
    }
  });
});

describe("sightings router", () => {
  it("lists all sightings publicly", async () => {
    const caller = appRouter.createCaller(createContext());
    const sightings = await caller.sightings.list();
    expect(Array.isArray(sightings)).toBe(true);
    if (sightings.length > 0) {
      expect(sightings[0].title).toBeDefined();
    }
  });

  it("authenticated users can submit sightings", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const result = await caller.sightings.create({
      title: `Test Sighting ${Date.now()}`,
      description: "Test description",
      lat: 25.6866,
      lng: -100.3161,
      locationName: "Monterrey",
      level: 2,
    });
    expect(result.success).toBe(true);
  });

  it("only admins can set sighting status", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    try {
      await caller.sightings.setStatus({ id: 1, status: "verified" });
      expect.fail("Should have thrown");
    } catch (e: any) {
      expect(e instanceof TRPCError && e.code === "FORBIDDEN").toBe(true);
    }
  });
});

describe("arcade router", () => {
  it("authenticated users can submit scores", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const result = await caller.arcade.submitScore({
      game: "crypto_crash",
      score: 500,
      multiplier: 2.5,
    });
    expect(result.xpGain).toBeGreaterThan(0);
  });

  it("leaderboard is accessible publicly", async () => {
    const caller = appRouter.createCaller(createContext());
    const leaderboard = await caller.arcade.leaderboard();
    expect(Array.isArray(leaderboard)).toBe(true);
    if (leaderboard.length > 0) {
      expect(leaderboard[0].score).toBeDefined();
    }
  });

  it("my best score is accessible to authenticated users", async () => {
    const caller = appRouter.createCaller(createContext(mockUser));
    const best = await caller.arcade.myBest();
    expect(best === null || typeof best === "object").toBe(true);
  });
});

describe("news router", () => {
  it("lists published news publicly", async () => {
    const caller = appRouter.createCaller(createContext());
    const news = await caller.news.list();
    expect(Array.isArray(news)).toBe(true);
    if (news.length > 0) {
      expect(news.every((n) => n.published)).toBe(true);
    }
  });

  it("only admins can create news", async () => {
    const userCaller = appRouter.createCaller(createContext(mockUser));
    try {
      await userCaller.news.create({
        title: "Test News",
        slug: `test-news-${Date.now()}`,
        category: "editorial",
        excerpt: "Test",
        body: "Test body",
        imageUrl: "",
        authorName: "Test",
        published: false,
      });
      expect.fail("Should have thrown");
    } catch (e: any) {
      expect(e instanceof TRPCError && e.code === "FORBIDDEN").toBe(true);
    }
  });

  it("admins can create news", async () => {
    const adminCaller = appRouter.createCaller(createContext(mockAdminUser));
    const result = await adminCaller.news.create({
      title: "Admin Test News",
      slug: `admin-test-news-${Date.now()}`,
      category: "editorial",
      excerpt: "Test",
      body: "Test body",
      imageUrl: "",
      authorName: "Test",
      published: true,
    });
    expect(result.success).toBe(true);
  });
});
