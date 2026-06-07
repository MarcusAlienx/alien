import { useAuth } from "@/_core/hooks/useAuth";
import SectionHeading from "@/components/SectionHeading";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRUTH_DEADLINE_ISO } from "@shared/const";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const NFT_DROPS = [
  { name: "GREYS Genesis", supply: 420, status: "MINT VIVO", img: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=800&auto=format&fit=crop" },
  { name: "Esfera de Buga", supply: 1111, status: "PRÓXIMAMENTE", img: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?q=80&w=800&auto=format&fit=crop" },
  { name: "Pase Underground", supply: 2222, status: "AGOTADO", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop" },
];

const TOKEN_NEWS = [
  { title: "$ALIENX rompe resistencia clave en Solana", change: "+24.8%", color: "#6CBF71" },
  { title: "Pentagono filtra 17 documentos UAP nuevos", change: "ARCHIVO", color: "#A020F0" },
  { title: "Polymarket abre mercado: Verdad antes de 2027", change: "62% SI", color: "#FFB000" },
];

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function Web3Radar() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const profileQuery = trpc.community.profile.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const [walletInput, setWalletInput] = useState("");

  const connectMutation = trpc.community.connectWallet.useMutation({
    onSuccess: () => {
      utils.community.profile.invalidate();
      utils.community.activity.invalidate();
      toast.success("Billetera conectada // +10 XP");
      setWalletInput("");
    },
    onError: (e) => toast.error(e.message),
  });

  const c = useCountdown(TRUTH_DEADLINE_ISO);
  const truthOdds = useMemo(() => 62, []); // Mock Polymarket odds

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-12 md:py-16">
      <SectionHeading eyebrow="Sector Web3" title="Radar de la" accent="Verdad" className="mb-10" />

      {/* COUNTDOWN HERO */}
      <div className="ghost-border bg-gradient-to-br from-[#1a0a2a] via-[#0a0a0a] to-[#0a1a14] p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-psycho-purple/20 rounded-full blur-[120px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-warning-amber flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-warning-amber animate-pulse" />
              Polymarket // Mercado abierto
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter">
              ¿Verdad oficial antes del <span className="text-alien-green neon-text-green">01.01.2027</span>?
            </h2>
            <p className="text-foreground/60 mt-4 max-w-md">
              Apuestas descentralizadas sobre el momento exacto de la primera desclasificación
              gubernamental masiva. Timer en vivo desde la red.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <span className="text-foreground/50 text-xs uppercase tracking-widest">Probabilidad SÍ</span>
                <div className="font-display text-4xl text-alien-green neon-text-green">{truthOdds}%</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <span className="text-foreground/50 text-xs uppercase tracking-widest">Volumen total</span>
                <div className="font-display text-4xl text-foreground">$420K</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[{ l: "Días", v: c.days }, { l: "Horas", v: c.hours }, { l: "Min", v: c.mins }, { l: "Seg", v: c.secs }].map((b) => (
              <div key={b.l} className="ghost-border bg-[#0a0a0a]/80 p-4 text-center">
                <span className="font-display text-3xl md:text-5xl text-alien-green neon-text-green tabular-nums">
                  {String(b.v).padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{b.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WALLET + NFT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="ghost-border bg-[#0e0e0e] p-6 lg:col-span-1 flex flex-col gap-4">
          <h3 className="font-display uppercase text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-alien-green">account_balance_wallet</span>
            Wallet $ALIENX
          </h3>
          {!isAuthenticated ? (
            <a href={getLoginUrl()} className="btn-glow font-display font-bold uppercase text-xs tracking-widest py-3 mt-2 text-center">
              Conectar para activar
            </a>
          ) : profileQuery.data?.walletAddress ? (
            <>
              <div className="bg-[#131313] border border-alien-green/30 p-3 text-xs font-mono text-alien-green truncate">
                {profileQuery.data.walletAddress}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#131313] border border-border p-3">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40">Balance</span>
                  <div className="font-display text-2xl text-alien-green">{profileQuery.data.tokenBalance}</div>
                </div>
                <div className="bg-[#131313] border border-border p-3">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40">Nivel</span>
                  <div className="font-display text-2xl text-psycho-purple-alt">{profileQuery.data.tier.label}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <input
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="Dirección Solana..."
                className="bg-[#0a0a0a] border border-border px-3 py-2 text-sm font-mono outline-none focus:border-alien-green"
              />
              <button
                disabled={walletInput.length < 20 || connectMutation.isPending}
                onClick={() => connectMutation.mutate({ walletAddress: walletInput })}
                className="btn-glow font-display font-bold uppercase text-xs tracking-widest py-3 disabled:opacity-40"
              >
                {connectMutation.isPending ? "Conectando..." : "Conectar Wallet"}
              </button>
              <p className="text-[10px] text-foreground/40">Recompensa: +10 XP. Demo de wallet — no transmite firma real.</p>
            </>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NFT_DROPS.map((nft) => (
            <div key={nft.name} className="ghost-border bg-[#0e0e0e] overflow-hidden flex flex-col">
              <div className="aspect-square bg-[#131313] overflow-hidden relative">
                <img src={nft.img} alt={nft.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 px-2 py-1 border border-alien-green/30">
                  <span className="text-[10px] uppercase tracking-widest text-alien-green">{nft.status}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-display font-bold uppercase">{nft.name}</h4>
                <p className="text-xs text-foreground/50 mt-1">Supply: {nft.supply}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOKEN NEWS FEED */}
      <div className="ghost-border bg-[#0e0e0e] p-6">
        <h3 className="font-display uppercase text-lg mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-warning-amber">currency_bitcoin</span>
          Token Feed // Cripto-Anomalías
        </h3>
        <div className="flex flex-col divide-y divide-border">
          {TOKEN_NEWS.map((t) => (
            <div key={t.title} className="py-3 flex items-center justify-between gap-4">
              <span className="font-sans text-foreground/80 flex-1">{t.title}</span>
              <span className="font-display text-sm" style={{ color: t.color }}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
