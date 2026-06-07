import { z } from "zod";
import * as db from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const productInput = z.object({
  slug: z.string().min(1).max(160),
  name: z.string().min(1).max(200),
  category: z.enum(["apparel", "accessories", "cosmic_gear", "cbd", "paraphernalia"]),
  description: z.string().optional(),
  priceMxn: z.string(),
  imageUrl: z.string().optional(),
  badge: z.string().optional(),
  inStock: z.boolean().default(true),
  sizes: z.array(z.string()).optional(),
  amazonAsin: z.string().optional(),
  mercadolibreId: z.string().optional(),
  featured: z.boolean().default(false),
});

export const productsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => db.listProducts(input?.category)),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => db.getProductBySlug(input.slug)),

  create: adminProcedure.input(productInput).mutation(async ({ input }) => {
    await db.createProduct(input as any);
    return { success: true };
  }),

  update: adminProcedure
    .input(productInput.partial().extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await db.updateProduct(id, rest as any);
      return { success: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteProduct(input.id);
      return { success: true };
    }),
});
