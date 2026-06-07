import { z } from "zod";
import * as db from "../db";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../_core/trpc";
import { tierForXp } from "@shared/const";

const newsInput = z.object({
  slug: z.string().min(1).max(180),
  title: z.string().min(1).max(240),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  category: z.enum(["declassified", "editorial", "festival", "uap_alert", "culture"]),
  imageUrl: z.string().optional(),
  authorName: z.string().optional(),
  published: z.boolean().default(true),
});

export const newsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => db.listNews({ category: input?.category })),

  listAll: adminProcedure.query(() => db.listNews({ includeUnpublished: true })),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => db.getNewsBySlug(input.slug)),

  create: adminProcedure.input(newsInput).mutation(async ({ input }) => {
    await db.createNews(input as any);
    return { success: true };
  }),

  update: adminProcedure
    .input(newsInput.partial().extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await db.updateNews(id, rest as any);
      return { success: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteNews(input.id);
      return { success: true };
    }),
});

export const communityRouter = router({
  activity: publicProcedure.query(() => db.listActivity(20)),

  leaderboard: publicProcedure.query(() => db.getTopUsersByXp(10)),

  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    if (!user) return null;
    const tier = tierForXp(user.xp);
    const best = await db.getUserBestScore(ctx.user.id);
    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      tokenBalance: user.tokenBalance,
      walletAddress: user.walletAddress,
      membershipTier: user.membershipTier,
      tier,
      bestScore: best?.score ?? 0,
    };
  }),

  connectWallet: protectedProcedure
    .input(z.object({ walletAddress: z.string().min(20).max(64) }))
    .mutation(async ({ ctx, input }) => {
      await db.updateUserWallet(ctx.user.id, input.walletAddress);
      await db.addUserXp(ctx.user.id, 10);
      await db.logActivity({
        userId: ctx.user.id,
        actorName: ctx.user.name ?? "Operador",
        type: "system",
        message: `conectó una billetera Solana // +10 XP`,
      });
      return { success: true };
    }),
});
