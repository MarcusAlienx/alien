import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

type CartContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  itemCount: number;
  addItem: (productId: number, opts?: { size?: string | null; quantity?: number }) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const cartQuery = trpc.commerce.cart.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const addMutation = trpc.commerce.addToCart.useMutation({
    onSuccess: () => {
      utils.commerce.cart.invalidate();
      toast.success("Artefacto añadido a la bóveda");
      setIsOpen(true);
    },
    onError: () => toast.error("No se pudo añadir el artefacto"),
  });

  const addItem = useCallback(
    (productId: number, opts?: { size?: string | null; quantity?: number }) => {
      if (!isAuthenticated) {
        toast("Inicia sesión para coleccionar artefactos", {
          action: { label: "Entrar", onClick: login },
        });
        return;
      }
      addMutation.mutate({
        productId,
        size: opts?.size ?? null,
        quantity: opts?.quantity ?? 1,
      });
    },
    [isAuthenticated, addMutation],
  );

  const itemCount = useMemo(
    () => (cartQuery.data ?? []).reduce((sum, row) => sum + row.quantity, 0),
    [cartQuery.data],
  );

  const value: CartContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
    itemCount,
    addItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
