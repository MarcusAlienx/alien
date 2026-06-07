import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow, extended for the alien.mx ecosystem:
 * gamified XP/rank, 3-tier membership, and $ALIENX token balance.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Gamification + Web3 economy
  membershipTier: mysqlEnum("membershipTier", ["initiate", "abductee", "contactee"])
    .default("initiate")
    .notNull(),
  xp: int("xp").default(0).notNull(),
  tokenBalance: decimal("tokenBalance", { precision: 18, scale: 2 }).default("0").notNull(),
  walletAddress: varchar("walletAddress", { length: 64 }),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products (hybrid dropshipping). No physical stock — fulfilled via
 * amazon_asin / mercadolibre_id. Sizes stored as JSON array.
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", [
    "apparel",
    "accessories",
    "cosmic_gear",
    "cbd",
    "paraphernalia",
  ]).notNull(),
  description: text("description"),
  priceMxn: decimal("priceMxn", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("imageUrl"),
  badge: varchar("badge", { length: 60 }),
  inStock: boolean("inStock").default(true).notNull(),
  sizes: json("sizes").$type<string[]>(),
  amazonAsin: varchar("amazonAsin", { length: 32 }),
  mercadolibreId: varchar("mercadolibreId", { length: 48 }),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/** Persistent cart items per user. */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  size: varchar("size", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/** Orders + checkout (crypto payment grants 15% discount). */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  items: json("items").$type<
    { productId: number; name: string; priceMxn: string; quantity: number; size?: string | null }[]
  >(),
  subtotalMxn: decimal("subtotalMxn", { precision: 10, scale: 2 }).notNull(),
  discountMxn: decimal("discountMxn", { precision: 10, scale: 2 }).default("0").notNull(),
  totalMxn: decimal("totalMxn", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["card", "crypto"]).default("card").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "fulfilled", "cancelled"])
    .default("pending")
    .notNull(),
  shippingName: varchar("shippingName", { length: 160 }),
  shippingAddress: text("shippingAddress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/** UFO/UAP sightings reported on the interactive map. */
export const sightings = mysqlTable("sightings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  lat: decimal("lat", { precision: 10, scale: 6 }).notNull(),
  lng: decimal("lng", { precision: 10, scale: 6 }).notNull(),
  locationName: varchar("locationName", { length: 160 }),
  level: int("level").default(1).notNull(),
  votes: int("votes").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "verified", "debunked"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sighting = typeof sightings.$inferSelect;
export type InsertSighting = typeof sightings.$inferInsert;

/** Per-user vote tracking to prevent double voting. */
export const sightingVotes = mysqlTable("sightingVotes", {
  id: int("id").autoincrement().primaryKey(),
  sightingId: int("sightingId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SightingVote = typeof sightingVotes.$inferSelect;

/** Arcade 420 high scores (Crypto Crash UFO game). */
export const scores = mysqlTable("scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  game: varchar("game", { length: 48 }).default("crypto_crash").notNull(),
  score: int("score").notNull(),
  multiplier: decimal("multiplier", { precision: 8, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Score = typeof scores.$inferSelect;
export type InsertScore = typeof scores.$inferInsert;

/** News / blog articles (headless CMS managed by admins). */
export const newsPosts = mysqlTable("newsPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt"),
  body: text("body"),
  category: mysqlEnum("category", [
    "declassified",
    "editorial",
    "festival",
    "uap_alert",
    "culture",
  ]).default("editorial").notNull(),
  imageUrl: text("imageUrl"),
  authorName: varchar("authorName", { length: 120 }),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = typeof newsPosts.$inferInsert;

/** Community live activity feed (XP gains, posts, votes, drops). */
export const activityFeed = mysqlTable("activityFeed", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  actorName: varchar("actorName", { length: 120 }),
  type: mysqlEnum("type", ["xp", "sighting", "score", "order", "post", "system"])
    .default("system")
    .notNull(),
  message: varchar("message", { length: 280 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activityFeed.$inferSelect;
export type InsertActivity = typeof activityFeed.$inferInsert;
