import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const SUBCATS = [
  { value: "all", label: "Todo" },
  { value: "accessories", label: "Accesorios" },
  { value: "cosmic_gear", label: "Equipo Cósmico" },
  { value: "paraphernalia", label: "Parafernalia" },
  { value: "cbd", label: "CBD" },
];

export default function Equipo() {
  const [cat, setCat] = useState("all");
  const all = trpc.products.list.useQuery(undefined);

  const items = (all.data ?? []).filter((p) =>
    cat === "all"
      ? ["accessories", "cosmic_gear", "paraphernalia", "cbd"].includes(p.category)
      : p.category === cat,
  );

  return (
    <div>
      <section className="relative py-20 px-6 md:px-10 border-b border-border overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-30" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-psycho-purple/15 rounded-full blur-[120px]" />
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <SectionHeading eyebrow="Equipo Cósmico" title="El Uniforme del" accent="Vacío" />
          <p className="text-foreground/60 max-w-2xl mt-4">
            Herramientas de precisión y accesorios de alta vibración. Cada artefacto está diseñado
            para resonar con frecuencias del espacio profundo.
          </p>
        </div>
      </section>

      <div className="px-6 md:px-10 max-w-screen-2xl mx-auto w-full py-12">
        <div className="flex flex-wrap gap-3 mb-10">
          {SUBCATS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`font-display uppercase text-xs tracking-widest px-5 py-2.5 border transition-all ${
                cat === c.value
                  ? "border-psycho-purple-alt bg-psycho-purple/10 text-psycho-purple-alt glow-purple"
                  : "border-border text-foreground/60 hover:border-foreground/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {all.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-96 bg-[#1a1a1a] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
