import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { NEWS_CATEGORIES } from "@shared/const";
import { useState } from "react";
import { Link } from "wouter";

export default function News() {
  const [cat, setCat] = useState("all");
  const newsQuery = trpc.news.list.useQuery(cat === "all" ? undefined : { category: cat });
  const posts = newsQuery.data ?? [];

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-12 md:py-16">
      <SectionHeading eyebrow="Transmisiones" title="La" accent="Frecuencia" className="mb-4" />
      <p className="text-foreground/60 max-w-2xl mb-10">
        Reportes desde el underground. Editoriales, alertas UAP y archivos desclasificados.
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        <button onClick={() => setCat("all")} className={`font-display uppercase text-xs tracking-widest px-5 py-2.5 border ${cat === "all" ? "border-alien-green bg-alien-green/10 text-alien-green" : "border-border text-foreground/60 hover:border-foreground/40"}`}>Todo</button>
        {NEWS_CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setCat(c.value)} className={`font-display uppercase text-xs tracking-widest px-5 py-2.5 border ${cat === c.value ? "border-alien-green bg-alien-green/10 text-alien-green" : "border-border text-foreground/60 hover:border-foreground/40"}`}>{c.label}</button>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-foreground/40 py-12 text-center">Sin transmisiones en este canal.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.id} href={`/transmisiones/${p.slug}`} className="ghost-border bg-[#1f1f1f] overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-grow">
                <span className="font-sans text-[10px] uppercase tracking-widest text-psycho-purple-alt">{p.category.replace("_", " ")}</span>
                <h3 className="font-display font-bold text-lg group-hover:text-alien-green transition-colors">{p.title}</h3>
                <p className="text-foreground/50 text-sm line-clamp-3 flex-grow">{p.excerpt}</p>
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 mt-2">{p.authorName}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
