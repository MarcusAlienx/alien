import { useCart } from "@/contexts/CartContext";
import type { Product } from "@shared/types";
import { useState } from "react";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const sizes = (product.sizes as string[] | null) ?? [];
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);

  return (
    <div className="group relative ghost-border bg-[#1f1f1f] p-4 flex flex-col">
      {product.badge && (
        <div className="absolute top-6 right-6 z-10 bg-[#0a0a0a]/80 px-3 py-1 border border-border">
          <span className="font-sans text-[10px] text-alien-green tracking-widest uppercase">{product.badge}</span>
        </div>
      )}
      {!product.inStock && (
        <div className="absolute top-6 left-6 z-10 bg-destructive/20 px-3 py-1 border border-destructive/40">
          <span className="font-sans text-[10px] text-destructive tracking-widest uppercase">Agotado</span>
        </div>
      )}

      <Link href={`/producto/${product.slug}`} className="block h-56 bg-[#131313] mb-5 overflow-hidden relative">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] to-transparent opacity-60" />
      </Link>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <span className="font-sans text-xs text-psycho-purple-alt tracking-widest uppercase mb-2 block">
            {product.category.replace("_", " ")}
          </span>
          <Link href={`/producto/${product.slug}`}>
            <h3 className="font-display text-xl font-bold mb-2 hover:text-alien-green transition-colors">{product.name}</h3>
          </Link>
          <p className="font-sans text-foreground/50 text-sm line-clamp-2">{product.description}</p>
        </div>

        {sizes.length > 0 && (
          <div className="flex gap-2 mt-4">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-8 h-8 border text-xs font-sans flex items-center justify-center transition-colors ${
                  selectedSize === s
                    ? "border-alien-green bg-alien-green/10 text-alien-green"
                    : "border-border text-foreground/60 hover:border-foreground/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-lg text-alien-green font-bold">
            ${Number(product.priceMxn).toLocaleString("es-MX")} MXN
          </span>
          <button
            disabled={!product.inStock}
            onClick={() => addItem(product.id, { size: selectedSize })}
            className="bg-[#2a2a2a] hover:bg-alien-green hover:text-[#07210d] disabled:opacity-30 disabled:hover:bg-[#2a2a2a] w-11 h-11 flex items-center justify-center transition-colors"
            aria-label="Añadir a la bóveda"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
