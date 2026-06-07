import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { PRODUCT_CATEGORIES } from "@shared/const";
import { useMemo, useState } from "react";
import { useSearch } from "wouter";

export default function Arsenal() {
  const search = useSearch();
  const initialCat = useMemo(() => new URLSearchParams(search).get("cat") ?? "all", [search]);
  const [category, setCategory] = useState<string>(initialCat);

  const productsQuery = trpc.products.list.useQuery(
    category === "all" ? undefined : { category },
  );

  const products = productsQuery.data ?? [];

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto w-full py-12 md:py-16">
      <SectionHeading eyebrow="Suministro Terminal" title="El" accent="Arsenal" className="mb-4" />
      <p className="text-foreground/60 max-w-2xl mb-10">
        Equipamiento táctico verificado para el contacto. Envíos nacionales vía red de distribución
        cósmica.
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        <FilterChip label="Todo" active={category === "all"} onClick={() => setCategory("all")} />
        {PRODUCT_CATEGORIES.map((c) => (
          <FilterChip key={c.value} label={c.label} active={category === c.value} onClick={() => setCategory(c.value)} />
        ))}
      </div>

      {productsQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-[#1a1a1a] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center text-foreground/40">
          <span className="material-symbols-outlined text-5xl">inventory_2</span>
          <p className="mt-4">No hay artefactos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-display uppercase text-xs tracking-widest px-5 py-2.5 border transition-all ${
        active
          ? "border-alien-green bg-alien-green/10 text-alien-green glow-green-sm"
          : "border-border text-foreground/60 hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
