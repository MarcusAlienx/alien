import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { NEWS_CATEGORIES, PRODUCT_CATEGORIES } from "@shared/const";
import { useState } from "react";
import { toast } from "sonner";

type AdminTab = "dashboard" | "products" | "news" | "sightings" | "orders";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  if (loading) return <div className="py-32 text-center"><span className="material-symbols-outlined animate-spin text-4xl text-alien-green">refresh</span></div>;

  if (!isAuthenticated) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-foreground/30">lock</span>
        <p className="text-foreground/60">Acceso restringido. Conéctate primero.</p>
        <a href={getLoginUrl()} className="btn-glow font-display font-bold px-6 py-3 uppercase tracking-wide">Conectar</a>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-destructive">gpp_bad</span>
        <h2 className="font-display text-2xl uppercase">Acceso Denegado</h2>
        <p className="text-foreground/60">Nivel de autorización insuficiente. Se requiere rol ADMIN.</p>
      </div>
    );
  }

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "products", label: "Productos", icon: "inventory_2" },
    { id: "news", label: "Noticias", icon: "newspaper" },
    { id: "sightings", label: "Avistamientos", icon: "travel_explore" },
    { id: "orders", label: "Órdenes", icon: "shopping_bag" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-[#0a0a0a] flex md:flex-col gap-1 p-3 md:p-4 overflow-x-auto md:overflow-x-visible">
        <div className="hidden md:block font-display text-xs uppercase tracking-widest text-foreground/40 px-3 py-2 mb-2">
          Control Center
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2.5 font-display uppercase text-xs tracking-widest whitespace-nowrap transition-all ${
              tab === t.id
                ? "bg-alien-green/10 text-alien-green border border-alien-green/30"
                : "text-foreground/60 hover:text-foreground border border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "products" && <AdminProducts />}
        {tab === "news" && <AdminNews />}
        {tab === "sightings" && <AdminSightings />}
        {tab === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}

/* ─── Dashboard Stats ─────────────────────────────────────────────────────── */
function AdminDashboard() {
  const statsQuery = trpc.admin.stats.useQuery();
  const s = statsQuery.data;

  const stats = [
    { label: "Productos", value: s?.productCount ?? "—", icon: "inventory_2", color: "#6CBF71" },
    { label: "Órdenes", value: s?.orderCount ?? "—", icon: "shopping_bag", color: "#A020F0" },
    { label: "Avistamientos", value: s?.sightingCount ?? "—", icon: "travel_explore", color: "#FFB000" },
    { label: "Noticias", value: s?.newsCount ?? "—", icon: "newspaper", color: "#6CBF71" },
    { label: "Revenue MXN", value: s?.revenueMxn != null ? `$${Number(s.revenueMxn).toLocaleString("es-MX")}` : "—", icon: "payments", color: "#FFB000" },
    { label: "Pendientes", value: s?.pendingSightings ?? "—", icon: "pending", color: "#FF3B6B" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-black uppercase mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((st) => (
          <div key={st.label} className="ghost-border bg-[#0e0e0e] p-5">
            <span className="material-symbols-outlined text-2xl" style={{ color: st.color }}>{st.icon}</span>
            <div className="font-display text-3xl mt-2" style={{ color: st.color }}>{st.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Products CMS ────────────────────────────────────────────────────────── */
function AdminProducts() {
  const utils = trpc.useUtils();
  const listQuery = trpc.products.list.useQuery(undefined);
  const createMutation = trpc.products.create.useMutation({ onSuccess: () => { utils.products.list.invalidate(); toast.success("Producto creado"); resetForm(); } });
  const removeMutation = trpc.products.remove.useMutation({ onSuccess: () => { utils.products.list.invalidate(); toast.success("Eliminado"); } });

  const [form, setForm] = useState({ name: "", slug: "", category: "apparel", description: "", priceMxn: "", imageUrl: "", badge: "", inStock: true, featured: false });
  const resetForm = () => setForm({ name: "", slug: "", category: "apparel", description: "", priceMxn: "", imageUrl: "", badge: "", inStock: true, featured: false });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <h2 className="font-display text-2xl font-black uppercase mb-6">Gestión de Productos</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="ghost-border bg-[#0e0e0e] p-6">
          <h3 className="font-display uppercase text-sm mb-4 text-alien-green">Nuevo Producto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Nombre" value={form.name} onChange={(e) => set("name", e.target.value)} className="admin-input" />
            <input placeholder="Slug (url-amigable)" value={form.slug} onChange={(e) => set("slug", e.target.value)} className="admin-input" />
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
              {PRODUCT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input placeholder="Precio MXN" type="number" value={form.priceMxn} onChange={(e) => set("priceMxn", e.target.value)} className="admin-input" />
            <input placeholder="URL imagen" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="admin-input sm:col-span-2" />
            <input placeholder="Badge (NUEVO, SOLD OUT…)" value={form.badge} onChange={(e) => set("badge", e.target.value)} className="admin-input" />
            <textarea placeholder="Descripción" value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="admin-input sm:col-span-2 resize-none" />
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="accent-alien-green" /> En stock
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-alien-green" /> Destacado
            </label>
          </div>
          <button
            disabled={!form.name || !form.slug || !form.priceMxn || createMutation.isPending}
            onClick={() => createMutation.mutate({ ...form, priceMxn: form.priceMxn, inStock: form.inStock, featured: form.featured } as any)}
            className="btn-glow w-full font-display font-bold uppercase tracking-widest py-3 mt-4 disabled:opacity-40"
          >
            {createMutation.isPending ? "Creando..." : "Crear Producto"}
          </button>
        </div>

        <div className="ghost-border bg-[#0e0e0e] p-6 max-h-[600px] overflow-y-auto">
          <h3 className="font-display uppercase text-sm mb-4 text-foreground/60">Inventario ({listQuery.data?.length ?? 0})</h3>
          <div className="flex flex-col divide-y divide-border">
            {(listQuery.data ?? []).map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover opacity-80" />}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{p.name}</div>
                  <div className="text-xs text-foreground/40">${Number(p.priceMxn).toLocaleString("es-MX")} · {p.category}</div>
                </div>
                <button onClick={() => removeMutation.mutate({ id: p.id })} className="text-destructive hover:text-destructive/80">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── News CMS ────────────────────────────────────────────────────────────── */
function AdminNews() {
  const utils = trpc.useUtils();
  const listQuery = trpc.news.listAll.useQuery();
  const createMutation = trpc.news.create.useMutation({ onSuccess: () => { utils.news.listAll.invalidate(); toast.success("Artículo creado"); resetForm(); } });
  const removeMutation = trpc.news.remove.useMutation({ onSuccess: () => { utils.news.listAll.invalidate(); toast.success("Eliminado"); } });

  const autoGenerateMutation = trpc.news.autoGenerate.useMutation({
    onSuccess: (data) => {
      setForm((f) => ({
        ...f,
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        excerpt: data.excerpt,
        body: data.body,
        category: "uap_alert"
      }));
      toast.success("Señal interceptada (IA generada)");
    },
    onError: () => toast.error("Fallo en la comunicación con la IA"),
  });

  const [form, setForm] = useState({ title: "", slug: "", category: "editorial", excerpt: "", body: "", imageUrl: "", authorName: "", published: true });
  const resetForm = () => setForm({ title: "", slug: "", category: "editorial", excerpt: "", body: "", imageUrl: "", authorName: "", published: true });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <h2 className="font-display text-2xl font-black uppercase mb-6">Gestión de Noticias</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="ghost-border bg-[#0e0e0e] p-6">
          <h3 className="font-display uppercase text-sm mb-4 text-alien-green">Nuevo Artículo</h3>
          <div className="flex flex-col gap-3">
            <input placeholder="Título" value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input" />
            <input placeholder="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} className="admin-input" />
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
              {NEWS_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input placeholder="Autor" value={form.authorName} onChange={(e) => set("authorName", e.target.value)} className="admin-input" />
            <input placeholder="URL imagen" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="admin-input" />
            <textarea placeholder="Extracto" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="admin-input resize-none" />
            <textarea placeholder="Cuerpo (Markdown)" value={form.body} onChange={(e) => set("body", e.target.value)} rows={5} className="admin-input resize-none font-mono text-xs" />
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-alien-green" /> Publicado
            </label>
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.title || !form.slug || createMutation.isPending}
              onClick={() => createMutation.mutate(form as any)}
              className="btn-glow flex-1 font-display font-bold uppercase tracking-widest py-3 mt-4 disabled:opacity-40"
            >
              {createMutation.isPending ? "Publicando..." : "Publicar Artículo"}
            </button>
            <button
              disabled={autoGenerateMutation.isPending}
              onClick={() => autoGenerateMutation.mutate()}
              className="ghost-border flex-1 font-display font-bold uppercase tracking-widest py-3 mt-4 hover:text-alien-green disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              {autoGenerateMutation.isPending ? "Interceptando..." : "Interceptar Señal"}
            </button>
          </div>
        </div>

        <div className="ghost-border bg-[#0e0e0e] p-6 max-h-[600px] overflow-y-auto">
          <h3 className="font-display uppercase text-sm mb-4 text-foreground/60">Artículos ({listQuery.data?.length ?? 0})</h3>
          <div className="flex flex-col divide-y divide-border">
            {(listQuery.data ?? []).map((a) => (
              <div key={a.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{a.title}</div>
                  <div className="text-xs text-foreground/40">{a.category} · {a.published ? "Publicado" : "Borrador"}</div>
                </div>
                <button onClick={() => removeMutation.mutate({ id: a.id })} className="text-destructive hover:text-destructive/80">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sightings Moderation ────────────────────────────────────────────────── */
function AdminSightings() {
  const utils = trpc.useUtils();
  const listQuery = trpc.sightings.list.useQuery(undefined);
  const setStatusMutation = trpc.sightings.setStatus.useMutation({ onSuccess: () => { utils.sightings.list.invalidate(); toast.success("Estado actualizado"); } });
  const removeMutation = trpc.sightings.remove.useMutation({ onSuccess: () => { utils.sightings.list.invalidate(); toast.success("Eliminado"); } });

  return (
    <div>
      <h2 className="font-display text-2xl font-black uppercase mb-6">Moderación de Avistamientos</h2>
      <div className="ghost-border bg-[#0e0e0e] p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Título</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Ubicación</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Nivel</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Estado</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(listQuery.data ?? []).map((s) => (
              <tr key={s.id}>
                <td className="py-3 font-display">{s.title}</td>
                <td className="py-3 text-foreground/60">{s.locationName ?? "—"}</td>
                <td className="py-3">{s.level}</td>
                <td className="py-3">
                  <select
                    value={s.status}
                    onChange={(e) => setStatusMutation.mutate({ id: s.id, status: e.target.value as any })}
                    className="bg-[#131313] border border-border px-2 py-1 text-xs font-display outline-none"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="verified">Verificado</option>
                    <option value="debunked">Desmentido</option>
                  </select>
                </td>
                <td className="py-3">
                  <button onClick={() => removeMutation.mutate({ id: s.id })} className="text-destructive hover:text-destructive/80">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Orders ──────────────────────────────────────────────────────────────── */
function AdminOrders() {
  const ordersQuery = trpc.admin.orders.useQuery();

  return (
    <div>
      <h2 className="font-display text-2xl font-black uppercase mb-6">Órdenes</h2>
      <div className="ghost-border bg-[#0e0e0e] p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">#</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Usuario</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Total MXN</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Pago</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Estado</th>
              <th className="pb-3 font-display uppercase text-xs tracking-widest text-foreground/40">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(ordersQuery.data ?? []).map((o) => (
              <tr key={o.id}>
                <td className="py-3 font-display text-foreground/50">#{o.id}</td>
                <td className="py-3">{o.shippingName ?? "—"}</td>
                <td className="py-3 text-alien-green font-display">${Number(o.totalMxn).toLocaleString("es-MX")}</td>
                <td className="py-3 uppercase text-xs">{o.paymentMethod}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest border ${o.status === "fulfilled" ? "border-alien-green/40 text-alien-green" : "border-warning-amber/40 text-warning-amber"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 text-foreground/50 text-xs">{new Date(o.createdAt).toLocaleDateString("es-MX")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(ordersQuery.data ?? []).length === 0 && <p className="text-foreground/40 text-sm py-6 text-center">Sin órdenes registradas.</p>}
      </div>
    </div>
  );
}
