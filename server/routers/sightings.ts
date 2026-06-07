import { z } from "zod";
import * as db from "../db";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const sightingsRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => db.listSightings(input?.status)),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        description: z.string().optional(),
        lat: z.number(),
        lng: z.number(),
        locationName: z.string().optional(),
        level: z.number().min(1).max(5).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.createSighting({
        userId: ctx.user.id,
        title: input.title,
        description: input.description ?? null,
        lat: String(input.lat),
        lng: String(input.lng),
        locationName: input.locationName ?? null,
        level: input.level,
      });
      await db.addUserXp(ctx.user.id, 25);
      await db.logActivity({
        userId: ctx.user.id,
        actorName: ctx.user.name ?? "Testigo anónimo",
        type: "sighting",
        message: `reportó un avistamiento en ${input.locationName ?? "coordenadas desconocidas"} // +25 XP`,
      });
      return { success: true };
    }),

  vote: protectedProcedure
    .input(z.object({ sightingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.voteSighting(input.sightingId, ctx.user.id);
      return result;
    }),

  setStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["pending", "verified", "debunked"]) }))
    .mutation(async ({ input }) => {
      await db.updateSightingStatus(input.id, input.status);
      return { success: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteSighting(input.id);
      return { success: true };
    }),
});
