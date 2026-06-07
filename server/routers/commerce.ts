import { CRYPTO_DISCOUNT_RATE } from "@shared/const";
import { z } from "zod";
import * as db from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const commerceRouter = router({
  cart: protectedProcedure.query(({ ctx }) => db.getCart(ctx.user.id)),

  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
        size: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.addToCart(ctx.user.id, input.productId, input.quantity, input.size ?? null);
      return { success: true };
    }),

  updateCartItem: protectedProcedure
    .input(z.object({ itemId: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.updateCartItem(ctx.user.id, input.itemId, input.quantity);
      return { success: true };
    }),

  removeCartItem: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.removeCartItem(ctx.user.id, input.itemId);
      return { success: true };
    }),

  checkout: protectedProcedure
    .input(
      z.object({
        paymentMethod: z.enum(["card", "crypto"]),
        shippingName: z.string().min(1),
        shippingAddress: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cart = await db.getCart(ctx.user.id);
      if (cart.length === 0) {
        throw new Error("El carrito está vacío");
      }

      const subtotal = cart.reduce(
        (sum, row) => sum + Number(row.product.priceMxn) * row.quantity,
        0,
      );
      const discount = input.paymentMethod === "crypto" ? subtotal * CRYPTO_DISCOUNT_RATE : 0;
      const total = subtotal - discount;

      const items = cart.map((row) => ({
        productId: row.product.id,
        name: row.product.name,
        priceMxn: String(row.product.priceMxn),
        quantity: row.quantity,
        size: row.size,
      }));

      await db.createOrder({
        userId: ctx.user.id,
        items,
        subtotalMxn: subtotal.toFixed(2),
        discountMxn: discount.toFixed(2),
        totalMxn: total.toFixed(2),
        paymentMethod: input.paymentMethod,
        status: "paid",
        shippingName: input.shippingName,
        shippingAddress: input.shippingAddress,
      });

      await db.clearCart(ctx.user.id);
      // Reward XP for completing a transaction.
      await db.addUserXp(ctx.user.id, 50);
      await db.logActivity({
        userId: ctx.user.id,
        actorName: ctx.user.name ?? "Operador anónimo",
        type: "order",
        message: `completó una orden de ${items.length} artículo(s) // +50 XP`,
      });

      return { success: true, subtotal, discount, total, paymentMethod: input.paymentMethod };
    }),

  myOrders: protectedProcedure.query(({ ctx }) => db.listUserOrders(ctx.user.id)),
});
