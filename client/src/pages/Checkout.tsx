import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CRYPTO_DISCOUNT_RATE } from "@shared/const";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function Checkout() {
  const { login } = useAuth();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const cartQuery = trpc.commerce.cart.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("crypto");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState(false);

  const checkoutMutation = trpc.commerce.checkout.useMutation({
    onSuccess: () => {
      utils.commerce.cart.invalidate();
      utils.community.activity.invalidate();
      setDone(true);
    },
    onError: (e) => toast.error(e.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-foreground/30">lock</span>
        <p className="text-foreground/60">Conéctate para finalizar tu transmisión de compra.</p>
        <a onClick={(e) => { e.preventDefault(); if(typeof login === "function") login(); }} href="#" className="btn-glow font-display font-bold px-6 py-3 uppercase tracking-wide">Conectar</a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-5 px-6">
        <span className="material-symbols-outlined text-6xl text-alien-green icon-fill neon-text-green">check_circle</span>
        <h1 className="font-display text-3xl font-black uppercase">Transmisión Confirmada</h1>
        <p className="text-foreground/60 max-w-md">Tu orden ha sido encriptada y enviada a la red de distribución cósmica. Ganaste +50 XP.</p>
        <div className="flex gap-4 mt-4">
          <Link href="/arsenal" className="ghost-border px-6 py-3 font-display uppercase text-sm tracking-wide hover:text-alien-green">Seguir explorando</Link>
          <Link href="/comunidad" className="btn-glow px-6 py-3 font-display font-bold uppercase text-sm tracking-wide">Ver mi perfil</Link>
        </div>
      </div>
    );
  }

  const items = cartQuery.data ?? [];
  const subtotal = items.reduce((s, r) => s + Number(r.product.priceMxn) * r.quantity, 0);
  const discount = paymentMethod === "crypto" ? subtotal * CRYPTO_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return (
    <div className="px-6 md:px-10 max-w-5xl mx-auto py-12 md:py-16">
      <h1 className="font-display text-4xl font-black uppercase tracking-tighter mb-10">Checkout</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center text-foreground/50">
          Tu bóveda está vacía. <Link href="/arsenal" className="text-alien-green underline">Explora el Arsenal</Link>.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="ghost-border bg-[#131313] p-6">
              <h2 className="font-display uppercase text-lg mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-alien-green">local_shipping</span> Destino
              </h2>
              <div className="flex flex-col gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del operador" className="bg-[#0a0a0a] border border-border px-4 py-3 font-sans focus:border-alien-green outline-none" />
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Coordenadas de entrega (dirección completa)" rows={3} className="bg-[#0a0a0a] border border-border px-4 py-3 font-sans focus:border-alien-green outline-none resize-none" />
              </div>
            </div>

            <div className="ghost-border bg-[#131313] p-6">
              <h2 className="font-display uppercase text-lg mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-psycho-purple-alt">payments</span> Método de Pago
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-5 border text-left transition-all ${paymentMethod === "crypto" ? "border-alien-green bg-alien-green/10 glow-green-sm" : "border-border hover:border-foreground/30"}`}
                >
                  <span className="material-symbols-outlined text-2xl text-alien-green">currency_bitcoin</span>
                  <div className="font-display font-bold mt-2">$ALIENX</div>
                  <div className="text-xs text-alien-green mt-1">-15% Descuento</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-5 border text-left transition-all ${paymentMethod === "card" ? "border-psycho-purple-alt bg-psycho-purple/10" : "border-border hover:border-foreground/30"}`}
                >
                  <span className="material-symbols-outlined text-2xl text-foreground/70">credit_card</span>
                  <div className="font-display font-bold mt-2">Tarjeta</div>
                  <div className="text-xs text-foreground/50 mt-1">Crédito / Débito</div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="ghost-border bg-[#0e0e0e] p-6 sticky top-24">
              <h2 className="font-display uppercase text-lg mb-5">Resumen</h2>
              <div className="flex flex-col gap-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((r) => (
                  <div key={r.id} className="flex justify-between text-sm">
                    <span className="text-foreground/70 truncate flex-1">{r.product.name} ×{r.quantity}</span>
                    <span className="font-display ml-2">${(Number(r.product.priceMxn) * r.quantity).toLocaleString("es-MX")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="font-display">${subtotal.toLocaleString("es-MX")}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-alien-green"><span>Descuento cripto</span><span className="font-display">-${discount.toLocaleString("es-MX")}</span></div>
                )}
                <div className="flex justify-between text-lg pt-2 border-t border-border mt-2">
                  <span className="font-display uppercase">Total</span>
                  <span className="font-display font-bold text-alien-green">${total.toLocaleString("es-MX")} MXN</span>
                </div>
              </div>
              <button
                disabled={!name || !address || checkoutMutation.isPending}
                onClick={() => checkoutMutation.mutate({ paymentMethod, shippingName: name, shippingAddress: address })}
                className="btn-glow w-full font-display font-bold uppercase tracking-widest py-4 mt-6 disabled:opacity-40"
              >
                {checkoutMutation.isPending ? "Encriptando..." : "Confirmar Orden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
