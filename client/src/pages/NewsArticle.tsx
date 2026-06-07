import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { Link, useParams } from "wouter";

export default function NewsArticle() {
  const { slug } = useParams();
  const articleQuery = trpc.news.bySlug.useQuery({ slug: slug! });
  const article = articleQuery.data;

  if (articleQuery.isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="h-72 bg-[#1a1a1a] animate-pulse mb-8" />
        <div className="h-10 w-2/3 bg-[#1a1a1a] animate-pulse mb-4" />
        <div className="h-32 bg-[#1a1a1a] animate-pulse" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-32 text-center">
        <p className="text-foreground/50">Transmisión no encontrada.</p>
        <Link href="/transmisiones" className="text-alien-green underline mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <Link href="/transmisiones" className="inline-flex items-center gap-2 text-foreground/50 hover:text-alien-green mb-6 font-display uppercase text-xs tracking-widest">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al Feed
      </Link>

      <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-psycho-purple-alt block mb-3">
        {article.category.replace("_", " ")}
      </span>
      <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
        {article.title}
      </h1>
      <p className="text-foreground/60 mb-8">Por <span className="text-alien-green">{article.authorName ?? "Redacción ALIEN.MX"}</span></p>

      {article.imageUrl && (
        <div className="ghost-border overflow-hidden mb-10">
          <img src={article.imageUrl} alt={article.title} className="w-full h-auto" />
        </div>
      )}

      <div className="prose prose-invert max-w-none font-sans text-foreground/85 leading-relaxed">
        <Streamdown>{article.body ?? article.excerpt ?? ""}</Streamdown>
      </div>
    </article>
  );
}
