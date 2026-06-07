import { COOKIE_NAME } from "@shared/const";
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
