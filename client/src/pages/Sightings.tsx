import { useAuth } from "@/_core/hooks/useAuth";
import { MapView } from "@/components/Map";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type SightingRow = {
  id: number;
  title: string;
  description: string | null;
  lat: string;
  lng: string;
  locationName: string | null;
  level: number;
  votes: number;
  status: string;
};

const LEVEL_COLORS: Record<number, string> = {
  1: "#6CBF71",
  2: "#6CBF71",
  3: "#FFB000",
  4: "#A020F0",
  5: "#FF3B6B",
};

export default function Sightings() {
  const { login } = useAuth();
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const sightingsQuery = trpc.sightings.list.useQuery(
    statusFilter === "all" ? undefined : { status: statusFilter },
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [level, setLevel] = useState(3);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const createMutation = trpc.sightings.create.useMutation({
    onSuccess: () => {
      utils.sightings.list.invalidate();
      utils.community.activity.invalidate();
      toast.success("Avistamiento reportado // +25 XP");
      setShowForm(false);
      setTitle("");
      setDescription("");
      setLocationName("");
      setCoords(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const voteMutation = trpc.sightings.vote.useMutation({
    onSuccess: () => utils.sightings.list.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const sightings = (sightingsQuery.data ?? []) as SightingRow[];

  // Render markers when map ready or data changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google) return;
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    sightings.forEach((s) => {
      const pin = document.createElement("div");
      const color = LEVEL_COLORS[s.level] ?? "#6CBF71";
      pin.innerHTML = `<div style="width:18px;height:18px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color};border:2px solid #0a0a0a;"></div>`;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: Number(s.lat), lng: Number(s.lng) },
        title: s.title,
        content: pin,
      });
      marker.addListener("click", () => {
        const info = new window.google.maps.InfoWindow({
          content: `<div style="color:#111;font-family:Inter,sans-serif;max-width:200px;"><strong>${s.title}</strong><br/>${s.locationName ?? ""} · Nivel ${s.level}<br/>${s.votes} votos</div>`,
        });
        info.open(mapRef.current!, marker);
      });
      markersRef.current.push(marker);
    });
  }, [mapReady, sightings]);

  // Click on map to set coords for new sighting
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const listener = mapRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!showForm) return;
      if (e.latLng) setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });
    return () => google.maps.event.removeListener(listener);
  }, [mapReady, showForm]);

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <SectionHeading eyebrow="Terminal i3Atlas" title="Mapa de" accent="Avistamientos" />
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast("Conéctate para reportar avistamientos", { action: { label: "Entrar", onClick: () => (login()) } });
              return;
            }
            setShowForm((v) => !v);
          }}
          className="btn-glow font-display font-bold uppercase tracking-wide px-6 py-3 text-sm flex items-center gap-2 self-start"
        >
          <span className="material-symbols-outlined text-sm">add_location_alt</span>
          Reportar UAP
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { v: "all", l: "Todos" },
          { v: "verified", l: "Verificados" },
          { v: "pending", l: "Pendientes" },
          { v: "debunked", l: "Desmentidos" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setStatusFilter(f.v)}
            className={`font-display uppercase text-xs tracking-widest px-4 py-2 border transition-all ${
              statusFilter === f.v ? "border-alien-green bg-alien-green/10 text-alien-green" : "border-border text-foreground/60 hover:border-foreground/40"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 ghost-border bg-[#0e0e0e] p-2 relative">
          <MapView
            initialCenter={{ lat: 23.6345, lng: -102.5528 }}
            initialZoom={5}
            className="h-[420px] md:h-[560px] grayscale-[0.3] contrast-110"
            onMapReady={(map) => {
              mapRef.current = map;
              setMapReady(true);
            }}
          />
          {showForm && (
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 glass-panel border border-alien-green/40 p-5 z-10">
              <h3 className="font-display uppercase text-sm text-alien-green mb-3">Nuevo Reporte</h3>
              <p className="text-[11px] text-foreground/50 mb-3">Haz clic en el mapa para fijar coordenadas.</p>
              <div className="flex flex-col gap-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del avistamiento" className="bg-[#0a0a0a] border border-border px-3 py-2 text-sm outline-none focus:border-alien-green" />
                <input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Ubicación (ciudad)" className="bg-[#0a0a0a] border border-border px-3 py-2 text-sm outline-none focus:border-alien-green" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" rows={2} className="bg-[#0a0a0a] border border-border px-3 py-2 text-sm outline-none focus:border-alien-green resize-none" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40">Nivel de señal: {level}</span>
                  <input type="range" min={1} max={5} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full accent-alien-green" />
                </div>
                <div className="text-[11px] text-foreground/50">
                  {coords ? `📍 ${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : "Sin coordenadas — clic en el mapa"}
                </div>
                <button
                  disabled={!title || !coords || createMutation.isPending}
                  onClick={() => coords && createMutation.mutate({ title, description, locationName, level, lat: coords.lat, lng: coords.lng })}
                  className="btn-glow font-display font-bold uppercase text-xs tracking-widest py-2 disabled:opacity-40"
                >
                  {createMutation.isPending ? "Transmitiendo..." : "Transmitir Reporte"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ghost-border bg-[#0e0e0e] p-5 max-h-[560px] overflow-y-auto">
          <h3 className="font-display uppercase text-sm text-foreground/70 mb-4">Reportes ({sightings.length})</h3>
          <div className="flex flex-col gap-3">
            {sightings.map((s) => (
              <div key={s.id} className="border border-border bg-[#131313] p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-bold text-sm">{s.title}</h4>
                  <span className="text-[9px] uppercase px-2 py-0.5 border tracking-widest" style={{ color: LEVEL_COLORS[s.level], borderColor: LEVEL_COLORS[s.level] }}>
                    Nv {s.level}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-1">{s.locationName}</p>
                {s.description && <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{s.description}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] uppercase tracking-widest ${s.status === "verified" ? "text-alien-green" : s.status === "debunked" ? "text-destructive" : "text-warning-amber"}`}>
                    {s.status}
                  </span>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) { toast("Conéctate para votar"); return; }
                      voteMutation.mutate({ sightingId: s.id });
                    }}
                    className="flex items-center gap-1 text-xs text-foreground/60 hover:text-alien-green"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_upward</span> {s.votes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
