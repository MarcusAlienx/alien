import * as db from "../db";
import { adminProcedure, router } from "../_core/trpc";

export const adminRouter = router({
  orders: adminProcedure.query(() => db.listAllOrders()),

  stats: adminProcedure.query(async () => {
    const [products, news, sightings, orders] = await Promise.all([
      db.listProducts(),
      db.listNews({ includeUnpublished: true }),
      db.listSightings(),
      db.listAllOrders(),
    ]);
    const revenue = orders.reduce((sum, o) => sum + Number(o.totalMxn), 0);
    return {
      productCount: products.length,
      newsCount: news.length,
      sightingCount: sightings.length,
      orderCount: orders.length,
      revenueMxn: revenue,
      pendingSightings: sightings.filter((s) => s.status === "pending").length,
    };
  }),
});
