import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const productsQuery = trpc.products.list.useQuery(undefined);
  const activityQuery = trpc.community.activity.useQuery();
  const newsQuery = trpc.news.list.useQuery(undefined);

  const featured = (productsQuery.data ?? []).filter((p) => p.featured).slice(0, 3);
  const intel = (newsQuery.data ?? []).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?q=80&w=1920&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 scanlines opacity-40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 py-2 px-5 border border-alien-green/30 bg-alien-green/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-alien-green animate-pulse" />
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-alien-green">
              Transmisión Interceptada
            </span>
          </span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            <span className="block text-foreground drop-shadow-[0_0_15px_rgba(229,226,225,0.2)]">Believe in</span>
            <span className="block text-alien-green neon-text-green drop-shadow-[0_0_30px_rgba(108,191,113,0.5)]">
              the Vibe.
            </span>
          </h1>

          <p className="font-sans text-base md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
            Trasciende lo ordinario. Streetwear hiperespectral, parafernalia y artefactos tácticos
            para el underground cósmico de México.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/arsenal" className="btn-glow font-display font-bold uppercase tracking-widest text-sm px-10 py-4">
              Explorar Inventario
            </Link>
            <Link
              href="/transmisiones"
              className="ghost-border bg-transparent text-foreground font-display font-bold uppercase tracking-widest text-sm px-10 py-4 flex items-center justify-center hover:text-alien-green"
            >
              Ver Transmisión
            </Link>
          </div>
        </div>
      </section>

      {/* BENTO ARTEFACTOS */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto w-full relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-psycho-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <SectionHeading eyebrow="Categorías" title="Artefactos" accent="Cósmicos" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px] md:auto-rows-[360px]">
          <Link href="/arsenal?cat=apparel" className="group md:col-span-8 bg-[#1f1f1f] overflow-hidden relative ghost-border flex items-end p-8">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
            <div className="relative z-10 w-full flex justify-between items-end">
              <div>
                <span className="font-sans text-[10px] text-foreground/60 uppercase tracking-widest mb-2 block">Categoría 01</span>
                <h3 className="font-display text-3xl font-bold uppercase group-hover:text-alien-green transition-colors">Ropa</h3>
                <p className="font-sans text-sm text-foreground/70 mt-2 max-w-xs">Hoodies, playeras y prendas pesadas diseñadas para el vacío.</p>
              </div>
              <span className="material-symbols-outlined w-12 h-12 border border-border flex items-center justify-center group-hover:border-alien-green group-hover:text-alien-green transition-all">arrow_forward</span>
            </div>
          </Link>

          <Link href="/equipo" className="group md:col-span-4 bg-[#1f1f1f] overflow-hidden relative ghost-border flex flex-col justify-end p-8">
            <img src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
            <div className="relative z-10">
              <span className="font-sans text-[10px] text-foreground/60 uppercase tracking-widest mb-2 block">Categoría 02</span>
              <h3 className="font-display text-3xl font-bold uppercase group-hover:text-psycho-purple-alt transition-colors">Equipo</h3>
              <p className="font-sans text-sm text-foreground/70 mt-2">Grinders de precisión, conos y herramientas de alta vibración.</p>
            </div>
          </Link>

          <Link href="/transmisiones" className="group md:col-span-12 bg-[#2a2a2a] overflow-hidden relative ghost-border flex items-center p-8 md:p-12">
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop" alt="" className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-r from-[#2a2a2a] to-transparent z-10" />
            <div className="relative z-20 max-w-xl">
              <span className="font-sans text-[10px] text-alien-green uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-alien-green animate-pulse" /> Señal en Vivo
              </span>
              <h3 className="font-display text-3xl md:text-5xl font-black uppercase mb-4">La Frecuencia</h3>
              <p className="font-sans text-foreground/80 mb-6 max-w-md">Reportes del underground. Editoriales, resúmenes de festivales y transmisiones culturales.</p>
              <span className="inline-flex items-center text-sm font-bold font-display uppercase tracking-widest text-foreground group-hover:text-alien-green border-b border-border group-hover:border-alien-green pb-1 transition-colors">
                Leer Transmisiones
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 md:py-20 px-6 md:px-10 max-w-screen-2xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading eyebrow="Inventario Destacado" title="El" accent="Arsenal" />
          <Link href="/arsenal" className="hidden md:flex items-center gap-2 font-display uppercase text-sm tracking-wide text-foreground/70 hover:text-alien-green">
            Ver todo <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {productsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-96 bg-[#1a1a1a] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* RADAR + INTEL */}
      <section className="py-12 md:py-20 px-6 md:px-10 max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link href="/avistamientos" className="group relative ghost-border bg-[#0e0e0e] p-8 overflow-hidden lg:col-span-1 flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 scanlines opacity-30" />
          <div className="relative z-10">
            <span className="material-symbols-outlined text-alien-green text-4xl icon-fill animate-pulse">radar</span>
            <h3 className="font-display text-2xl font-bold uppercase mt-4">Terminal i3Atlas</h3>
            <p className="text-foreground/60 text-sm mt-2">Rastreo de anomalías cósmicas en tiempo real // Sector MX.</p>
          </div>
          <span className="relative z-10 font-display uppercase text-sm tracking-wide text-alien-green group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Abrir mapa <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </Link>

        <div className="lg:col-span-2 ghost-border bg-[#0e0e0e] p-8">
          <h3 className="font-display text-xl font-bold uppercase mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-psycho-purple-alt">sensors</span>
            Feed de Inteligencia
          </h3>
          <div className="flex flex-col divide-y divide-border">
            {(activityQuery.data ?? []).slice(0, 6).map((a) => (
              <div key={a.id} className="py-3 flex items-center gap-3 text-sm">
                <span className="text-alien-green font-display">{a.actorName}</span>
                <span className="text-foreground/60 flex-1 truncate">{a.message}</span>
              </div>
            ))}
            {(activityQuery.data ?? []).length === 0 && (
              <p className="text-foreground/40 text-sm py-3">Sin transmisiones todavía.</p>
            )}
          </div>
        </div>
      </section>

      {/* INTEL CARDS */}
      <section className="py-12 md:py-20 px-6 md:px-10 max-w-screen-2xl mx-auto w-full">
        <SectionHeading eyebrow="Desclasificado" title="Última" accent="Intel" className="mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {intel.map((post) => (
            <Link key={post.id} href={`/transmisiones/${post.slug}`} className="group ghost-border bg-[#1f1f1f] overflow-hidden flex flex-col">
              <div className="h-44 overflow-hidden">
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="font-sans text-[10px] uppercase tracking-widest text-psycho-purple-alt">{post.category.replace("_", " ")}</span>
                <h4 className="font-display font-bold group-hover:text-alien-green transition-colors">{post.title}</h4>
                <p className="text-foreground/50 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
