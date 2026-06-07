import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  activityFeed,
  cartItems,
  InsertActivity,
  InsertNewsPost,
  InsertOrder,
  InsertProduct,
  InsertScore,
  InsertSighting,
  InsertUser,
  newsPosts,
  orders,
  products,
  scores,
  sightings,
  sightingVotes,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/* ----------------------------- Users ----------------------------- */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function addUserXp(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ xp: sql`${users.xp} + ${amount}` })
    .where(eq(users.id, userId));
}

export async function updateUserWallet(userId: number, walletAddress: string | null) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ walletAddress }).where(eq(users.id, userId));
}

export async function getTopUsersByXp(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.xp)).limit(limit);
}

/* --------------------------- Products ----------------------------- */

export async function listProducts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db
      .select()
      .from(products)
      .where(eq(products.category, category as any))
      .orderBy(desc(products.featured), desc(products.createdAt));
  }
  return db.select().from(products).orderBy(desc(products.featured), desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const res = await db.insert(products).values(data);
  return res;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(products).where(eq(products.id, id));
}

/* ----------------------------- Cart ------------------------------- */

export async function getCart(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      size: cartItems.size,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(desc(cartItems.createdAt));
}

export async function addToCart(
  userId: number,
  productId: number,
  quantity: number,
  size?: string | null,
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        size ? eq(cartItems.size, size) : sql`${cartItems.size} IS NULL`,
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ userId, productId, quantity, size: size ?? null });
  }
}

export async function updateCartItem(userId: number, itemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  if (quantity <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
  } else {
    await db
      .update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
  }
}

export async function removeCartItem(userId: number, itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

/* ---------------------------- Orders ------------------------------ */

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const res = await db.insert(orders).values(data);
  return res;
}

export async function listUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function listAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
}

/* --------------------------- Sightings ---------------------------- */

export async function listSightings(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db
      .select()
      .from(sightings)
      .where(eq(sightings.status, status as any))
      .orderBy(desc(sightings.createdAt));
  }
  return db.select().from(sightings).orderBy(desc(sightings.createdAt));
}

export async function createSighting(data: InsertSighting) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const res = await db.insert(sightings).values(data);
  return res;
}

export async function voteSighting(sightingId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const existing = await db
    .select()
    .from(sightingVotes)
    .where(and(eq(sightingVotes.sightingId, sightingId), eq(sightingVotes.userId, userId)))
    .limit(1);
  if (existing.length > 0) {
    return { alreadyVoted: true };
  }
  await db.insert(sightingVotes).values({ sightingId, userId });
  await db
    .update(sightings)
    .set({ votes: sql`${sightings.votes} + 1` })
    .where(eq(sightings.id, sightingId));
  return { alreadyVoted: false };
}

export async function updateSightingStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(sightings)
    .set({ status: status as any })
    .where(eq(sightings.id, id));
}

export async function deleteSighting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(sightings).where(eq(sightings.id, id));
}

/* ----------------------------- Scores ----------------------------- */

export async function saveScore(data: InsertScore) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(scores).values(data);
}

export async function getLeaderboard(game = "crypto_crash", limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: scores.id,
      score: scores.score,
      multiplier: scores.multiplier,
      createdAt: scores.createdAt,
      userName: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(scores)
    .innerJoin(users, eq(scores.userId, users.id))
    .where(eq(scores.game, game))
    .orderBy(desc(scores.score))
    .limit(limit);
}

export async function getUserBestScore(userId: number, game = "crypto_crash") {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .orderBy(desc(scores.score))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/* ------------------------------ News ------------------------------ */

export async function listNews(opts?: { category?: string; includeUnpublished?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (!opts?.includeUnpublished) conditions.push(eq(newsPosts.published, true));
  if (opts?.category) conditions.push(eq(newsPosts.category, opts.category as any));
  const query = db.select().from(newsPosts).orderBy(desc(newsPosts.createdAt));
  if (conditions.length > 0) {
    return query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
  }
  return query;
}

export async function getNewsBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(newsPosts).where(eq(newsPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNews(data: InsertNewsPost) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(newsPosts).values(data);
}

export async function updateNews(id: number, data: Partial<InsertNewsPost>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(newsPosts).set(data).where(eq(newsPosts.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(newsPosts).where(eq(newsPosts.id, id));
}

/* --------------------------- Activity ----------------------------- */

export async function logActivity(data: InsertActivity) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityFeed).values(data);
}

export async function listActivity(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityFeed).orderBy(desc(activityFeed.createdAt)).limit(limit);
}
