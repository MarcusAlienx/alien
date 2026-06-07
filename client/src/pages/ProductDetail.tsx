import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useParams } from "wouter";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const productQuery = trpc.products.bySlug.useQuery({ slug: slug! });
  const product = productQuery.data;
  const sizes = (product?.sizes as string[] | null) ?? [];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (productQuery.isLoading) {
    return (
      <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-[#1a1a1a] animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-[#1a1a1a] animate-pulse" />
          <div className="h-24 bg-[#1a1a1a] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="text-foreground/50">Artefacto no encontrado.</p>
        <Link href="/arsenal" className="text-alien-green underline mt-4 inline-block">Volver al Arsenal</Link>
      </div>
    );
  }

  const effectiveSize = selectedSize ?? sizes[0] ?? null;

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-10 md:py-16">
      <Link href="/arsenal" className="inline-flex items-center gap-2 text-foreground/50 hover:text-alien-green mb-8 font-display uppercase text-xs tracking-widest">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al Arsenal
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        <div className="relative ghost-border bg-[#131313] overflow-hidden aspect-square">
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          {product.badge && (
            <div className="absolute top-5 left-5 bg-[#0a0a0a]/80 px-3 py-1 border border-alien-green/40">
              <span className="font-sans text-[10px] text-alien-green tracking-widest uppercase">{product.badge}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-sans text-xs text-psycho-purple-alt tracking-widest uppercase mb-3">
            {product.category.replace("_", " ")}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-3xl text-alien-green font-bold neon-text-green">
              ${Number(product.priceMxn).toLocaleString("es-MX")} MXN
            </span>
            <span className={`px-3 py-1 text-[10px] font-sans uppercase tracking-widest border ${product.inStock ? "border-alien-green/40 text-alien-green" : "border-destructive/40 text-destructive"}`}>
              {product.inStock ? "En Stock" : "Agotado"}
            </span>
          </div>

          <p className="font-sans text-foreground/70 leading-relaxed mb-8">{product.description}</p>

          {sizes.length > 0 && (
            <div className="mb-8">
              <span className="font-display uppercase text-xs tracking-widest text-foreground/60 mb-3 block">Talla</span>
              <div className="flex gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 border font-display transition-all ${
                      effectiveSize === s ? "border-alien-green bg-alien-green/10 text-alien-green" : "border-border text-foreground/60 hover:border-foreground/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={!product.inStock}
            onClick={() => addItem(product.id, { size: effectiveSize })}
            className="btn-glow font-display font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            Añadir a la Bóveda
          </button>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="ghost-border bg-[#131313] p-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/40 block mb-1">Distribución</span>
              <span className="font-display text-foreground/80">Red Cósmica MX</span>
            </div>
            <div className="ghost-border bg-[#131313] p-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/40 block mb-1">Pago $ALIENX</span>
              <span className="font-display text-psycho-purple-alt">-15% Descuento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
