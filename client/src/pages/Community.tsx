import { useAuth } from "@/_core/hooks/useAuth";
import SectionHeading from "@/components/SectionHeading";
import { trpc } from "@/lib/trpc";
import { MEMBERSHIP_TIERS } from "@shared/const";

export default function Community() {
  const { login } = useAuth();
  const { isAuthenticated, user } = useAuth();
  const profileQuery = trpc.community.profile.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const leaderboardQuery = trpc.community.leaderboard.useQuery();
  const activityQuery = trpc.community.activity.useQuery();

  const profile = profileQuery.data;

  // Determine progress toward next tier
  let nextTier = null as (typeof MEMBERSHIP_TIERS)[number] | null;
  let progress = 100;
  if (profile) {
    const idx = MEMBERSHIP_TIERS.findIndex((t) => t.value === profile.tier.value);
    nextTier = MEMBERSHIP_TIERS[idx + 1] ?? null;
    if (nextTier) {
      const span = nextTier.minXp - profile.tier.minXp;
      progress = Math.min(100, Math.round(((profile.xp - profile.tier.minXp) / span) * 100));
    }
  }

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-12 md:py-16">
      <SectionHeading eyebrow="Underground Cósmico" title="Community" accent="Space" className="mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE CARD */}
        <div className="lg:col-span-1">
          {!isAuthenticated ? (
            <div className="ghost-border bg-[#0e0e0e] p-8 flex flex-col items-center text-center gap-4">
              <span className="material-symbols-outlined text-5xl text-foreground/30">badge</span>
              <p className="text-foreground/60 text-sm">Conéctate para activar tu perfil de operador y ganar XP.</p>
              <a onClick={(e) => { e.preventDefault(); if(typeof login === "function") login(); }} href="#" className="btn-glow font-display font-bold px-6 py-3 uppercase tracking-wide text-sm">Activar Perfil</a>
            </div>
          ) : profile ? (
            <div className="ghost-border bg-[#0e0e0e] p-8 relative overflow-hidden">
              <div className="absolute inset-0 scanlines opacity-20" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-4" style={{ borderColor: profile.tier.color }}>
                  <span className="material-symbols-outlined text-5xl" style={{ color: profile.tier.color }}>person</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">{profile.name ?? "Operador"}</h3>
                <span className="font-sans uppercase text-xs tracking-[0.2em] mt-1" style={{ color: profile.tier.color }}>
                  {profile.tier.label}
                </span>

                <div className="w-full mt-6">
                  <div className="flex justify-between text-xs text-foreground/50 mb-1">
                    <span>{profile.xp} XP</span>
                    {nextTier ? <span>{nextTier.minXp} XP → {nextTier.label}</span> : <span>Rango Máximo</span>}
                  </div>
                  <div className="w-full h-2 bg-[#1a1a1a] overflow-hidden">
                    <div className="h-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: profile.tier.color, boxShadow: `0 0 12px ${profile.tier.color}` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <div className="bg-[#131313] border border-border p-4">
                    <span className="font-display text-2xl text-alien-green block">{profile.tokenBalance}</span>
                    <span className="text-[10px] uppercase tracking-widest text-foreground/40">$ALIENX</span>
                  </div>
                  <div className="bg-[#131313] border border-border p-4">
                    <span className="font-display text-2xl text-psycho-purple-alt block">{profile.bestScore}</span>
                    <span className="text-[10px] uppercase tracking-widest text-foreground/40">Mejor Score</span>
                  </div>
                </div>

                {profile.walletAddress ? (
                  <div className="mt-4 w-full bg-[#131313] border border-alien-green/30 p-3 text-xs font-mono text-alien-green truncate">
                    {profile.walletAddress}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-foreground/40">Conecta tu billetera en el Radar Web3 para +10 XP.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="ghost-border bg-[#0e0e0e] p-8 h-72 animate-pulse" />
          )}
        </div>

        {/* LEADERBOARD + FEED */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="ghost-border bg-[#0e0e0e] p-6">
            <h3 className="font-display text-lg uppercase mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-warning-amber">leaderboard</span>
              Ranking de Operadores
            </h3>
            <div className="flex flex-col divide-y divide-border">
              {(leaderboardQuery.data ?? []).map((u, i) => (
                <div key={u.id} className="py-3 flex items-center gap-4">
                  <span className={`font-display text-lg w-6 ${i === 0 ? "text-warning-amber" : i < 3 ? "text-alien-green" : "text-foreground/40"}`}>{i + 1}</span>
                  <span className="flex-1 font-display">{u.name ?? "Anónimo"}</span>
                  <span className="font-sans text-xs uppercase tracking-widest" style={{ color: u.membershipTier === "contactee" ? "#FFB000" : u.membershipTier === "abductee" ? "#A020F0" : "#6CBF71" }}>
                    {u.membershipTier}
                  </span>
                  <span className="font-display text-alien-green">{u.xp} XP</span>
                </div>
              ))}
              {(leaderboardQuery.data ?? []).length === 0 && <p className="text-foreground/40 text-sm py-3">Sin operadores rankeados aún.</p>}
            </div>
          </div>

          <div className="ghost-border bg-[#0e0e0e] p-6">
            <h3 className="font-display text-lg uppercase mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-alien-green">sensors</span>
              Transmisión en Vivo
            </h3>
            <div className="flex flex-col divide-y divide-border max-h-80 overflow-y-auto">
              {(activityQuery.data ?? []).map((a) => (
                <div key={a.id} className="py-3 flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-sm text-psycho-purple-alt mt-0.5">
                    {a.type === "score" ? "stadia_controller" : a.type === "sighting" ? "travel_explore" : a.type === "order" ? "shopping_bag" : "bolt"}
                  </span>
                  <div>
                    <span className="text-alien-green font-display">{a.actorName}</span>{" "}
                    <span className="text-foreground/70">{a.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
