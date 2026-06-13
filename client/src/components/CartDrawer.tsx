import { useAuth } from "@/_core/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { CRYPTO_DISCOUNT_RATE } from "@shared/const";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { login } = useAuth();
  const { isOpen, close } = useCart();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const cartQuery = trpc.commerce.cart.useQuery(undefined, {
    enabled: isAuthenticated && isOpen,
    retry: false,
  });

  const updateMutation = trpc.commerce.updateCartItem.useMutation({
    onSuccess: () => utils.commerce.cart.invalidate(),
  });
  const removeMutation = trpc.commerce.removeCartItem.useMutation({
    onSuccess: () => utils.commerce.cart.invalidate(),
  });

  const items = cartQuery.data ?? [];
  const subtotal = items.reduce((s, r) => s + Number(r.product.priceMxn) * r.quantity, 0);
  const cryptoDiscount = subtotal * CRYPTO_DISCOUNT_RATE;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent
        side="right"
        className="bg-[#0e0e0e] border-l border-psycho-purple/30 w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display uppercase tracking-tight text-alien-green flex items-center gap-2">
            <span className="material-symbols-outlined">security</span>
            La Bóveda
          </SheetTitle>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="material-symbols-outlined text-5xl text-foreground/30">lock</span>
            <p className="text-foreground/60 text-sm">Conéctate para acceder a tu bóveda de artefactos.</p>
            <a onClick={(e) => { e.preventDefault(); if(typeof login === "function") login(); }} href="#" className="btn-glow font-display font-bold px-6 py-2 text-sm uppercase tracking-wide">
              Conectar
            </a>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="material-symbols-outlined text-5xl text-foreground/20">satellite_alt</span>
            <p className="text-foreground/50 text-sm">Tu bóveda está vacía. El vacío espera.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.map((row) => (
                <div key={row.id} className="flex gap-4 ghost-border p-3 bg-[#131313]">
                  <div className="w-20 h-20 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {row.product.imageUrl && (
                      <img src={row.product.imageUrl} alt={row.product.name} className="w-full h-full object-cover opacity-90" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold truncate">{row.product.name}</h4>
                    {row.size && <span className="text-[10px] text-foreground/50 uppercase tracking-widest">Talla {row.size}</span>}
                    <p className="text-alien-green font-display text-sm mt-1">${Number(row.product.priceMxn).toLocaleString("es-MX")} MXN</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-7 h-7 border border-border flex items-center justify-center hover:border-alien-green text-foreground/70"
                        onClick={() => updateMutation.mutate({ itemId: row.id, quantity: row.quantity - 1 })}
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-display text-sm w-6 text-center">{row.quantity}</span>
                      <button
                        className="w-7 h-7 border border-border flex items-center justify-center hover:border-alien-green text-foreground/70"
                        onClick={() => updateMutation.mutate({ itemId: row.id, quantity: row.quantity + 1 })}
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                      <button
                        className="ml-auto text-foreground/40 hover:text-destructive"
                        onClick={() => removeMutation.mutate({ itemId: row.id })}
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5 flex flex-col gap-3 bg-[#0a0a0a]">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-display">${subtotal.toLocaleString("es-MX")} MXN</span>
              </div>
              <div className="flex justify-between text-sm text-psycho-purple-alt">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">currency_bitcoin</span>
                  Con $ALIENX (-15%)
                </span>
                <span className="font-display">${(subtotal - cryptoDiscount).toLocaleString("es-MX")} MXN</span>
              </div>
              <button
                className="btn-glow font-display font-bold uppercase tracking-wide py-3 mt-2 flex items-center justify-center gap-2"
                onClick={() => {
                  close();
                  navigate("/checkout");
                }}
              >
                Iniciar Checkout
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
