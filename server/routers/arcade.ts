import { z } from "zod";
import * as db from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const arcadeRouter = router({
  leaderboard: publicProcedure
    .input(z.object({ game: z.string().default("crypto_crash") }).optional())
    .query(({ input }) => db.getLeaderboard(input?.game ?? "crypto_crash", 10)),

  submitScore: protectedProcedure
    .input(
      z.object({
        game: z.string().default("crypto_crash"),
        score: z.number().min(0).max(1_000_000),
        multiplier: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.saveScore({
        userId: ctx.user.id,
        game: input.game,
        score: input.score,
        multiplier: input.multiplier != null ? String(input.multiplier) : null,
      });
      // Reward 1 XP per 10 points, capped.
      const xpGain = Math.min(100, Math.floor(input.score / 10));
      if (xpGain > 0) await db.addUserXp(ctx.user.id, xpGain);
      await db.logActivity({
        userId: ctx.user.id,
        actorName: ctx.user.name ?? "Piloto anónimo",
        type: "score",
        message: `aterrizó ${input.score} pts en el Arcade 420 // +${xpGain} XP`,
      });
      return { success: true, xpGain };
    }),

  myBest: protectedProcedure
    .input(z.object({ game: z.string().default("crypto_crash") }).optional())
    .query(({ ctx, input }) => db.getUserBestScore(ctx.user.id, input?.game ?? "crypto_crash")),
});
