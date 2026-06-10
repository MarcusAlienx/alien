import { z } from "zod";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";
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
      // 1. Evaluate Sighting via LLM
      const result = await invokeLLM({
        messages: [{
          role: "system",
          content: "Eres un sistema de moderación de avistamientos para alien.mx, una plataforma de misterio y streetwear. Analiza el siguiente reporte y determina si es SPAM, NORMAL o ALTA_PRIORIDAD. Devuelve un objeto JSON con dos claves: 'status' ('spam', 'normal', 'alta_prioridad') y 'reason' (explicación breve)."
        }, {
          role: "user",
          content: `Título: ${input.title}\nDescripción: ${input.description}\nUbicación: ${input.locationName}`
        }],
        responseFormat: { type: "json_object" }
      });

      const content = result.choices[0]?.message?.content;
      let evalStatus = "normal";

      if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          if (parsed.status) {
            evalStatus = parsed.status.toLowerCase();
          }
        } catch (e) {
          console.error("Failed to parse LLM evaluation", e);
        }
      }

      if (evalStatus === "spam") {
        throw new Error("Reporte rechazado por el sistema automatizado.");
      }

      // 2. Insert into DB
      const dbStatus = evalStatus === "alta_prioridad" ? "verified" : "pending";

      await db.createSighting({
        userId: ctx.user.id,
        title: input.title,
        description: input.description ?? null,
        lat: String(input.lat),
        lng: String(input.lng),
        locationName: input.locationName ?? null,
        level: input.level,
        status: dbStatus as any
      });
      await db.addUserXp(ctx.user.id, 25);
      await db.logActivity({
        userId: ctx.user.id,
        actorName: ctx.user.name ?? "Testigo anónimo",
        type: "sighting",
        message: `reportó un avistamiento en ${input.locationName ?? "coordenadas desconocidas"} // +25 XP`,
      });

      if (evalStatus === "alta_prioridad") {
        await notifyOwner({
          title: "Avistamiento de Alta Prioridad",
          content: `Se ha detectado un avistamiento de alta prioridad: ${input.title} en ${input.locationName}`
        });
      }

      return { success: true, evaluatedStatus: evalStatus };
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
