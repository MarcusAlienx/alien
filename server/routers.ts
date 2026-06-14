import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { sdk } from "./_core/sdk";
import "./storage"; // init firebase app
import { getAuth } from "firebase-admin/auth";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { productsRouter } from "./routers/products";
import { commerceRouter } from "./routers/commerce";
import { sightingsRouter } from "./routers/sightings";
import { arcadeRouter } from "./routers/arcade";
import { newsRouter, communityRouter } from "./routers/content";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    syncFirebaseUser: publicProcedure
      .input(
        z.object({
          token: z.string(),
          email: z.string().nullable().optional(),
          name: z.string().nullable().optional(),
          avatarUrl: z.string().nullable().optional()
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Securely Verify Firebase Auth Token

        const decodedToken = await getAuth().verifyIdToken(input.token);
        const uid = decodedToken.uid;

        await db.upsertUser({
          openId: uid,
          name: input.name || decodedToken.name || null,
          email: input.email || decodedToken.email || null,
          loginMethod: "google",
          avatarUrl: input.avatarUrl || decodedToken.picture || null,
          lastSignedIn: new Date()
        });

        // Simulating the session for compatibility with existing context checking
        const sessionToken = await sdk.createSessionToken(uid, {
          name: input.name || decodedToken.name || "",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return { success: true };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: productsRouter,
  commerce: commerceRouter,
  sightings: sightingsRouter,
  arcade: arcadeRouter,
  news: newsRouter,
  community: communityRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
