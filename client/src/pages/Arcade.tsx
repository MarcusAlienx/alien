import { useAuth } from "@/_core/hooks/useAuth";
import SectionHeading from "@/components/SectionHeading";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type GameState = "idle" | "running" | "cashed" | "crashed";

export default function Arcade() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const leaderboardQuery = trpc.arcade.leaderboard.useQuery();
  const myBestQuery = trpc.arcade.myBest.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  const submitMutation = trpc.arcade.submitScore.useMutation({
    onSuccess: () => {
      utils.arcade.leaderboard.invalidate();
      utils.arcade.myBest.invalidate();
      utils.community.activity.invalidate();
    },
  });

  const [state, setState] = useState<GameState>("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(100);
  const [crashAt, setCrashAt] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  function startGame() {
    if (!isAuthenticated) {
      toast("Conéctate para jugar", { action: { label: "Entrar", onClick: () => (window.location.href = getLoginUrl()) } });
      return;
    }
    // Cosmic RNG: distribution heavy under 3x, occasional moon shots
    const r = Math.random();
    const crash = r < 0.5 ? 1 + r * 2 : r < 0.9 ? 2 + (r - 0.5) * 6 : 5 + (r - 0.9) * 50;
    setCrashAt(Number(crash.toFixed(2)));
    setMultiplier(1.0);
    setState("running");
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const m = Math.exp(elapsed * 0.55); // exponential growth
      if (m >= crash) {
        setMultiplier(crash);
        setState("crashed");
        return;
      }
      setMultiplier(Number(m.toFixed(2)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function cashOut() {
    if (state !== "running") return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const score = Math.floor(bet * multiplier);
    setState("cashed");
    submitMutation.mutate({ game: "crypto_crash", score, multiplier });
    toast.success(`+${score} pts // x${multiplier.toFixed(2)}`);
  }

  function reset() {
    setState("idle");
    setMultiplier(1.0);
  }

  const leaderboard = leaderboardQuery.data ?? [];

  return (
    <div className="px-6 md:px-10 max-w-screen-2xl mx-auto py-12 md:py-16">
      <SectionHeading eyebrow="Arcade 420" title="UFO" accent="Ascend" className="mb-3" />
      <p className="text-foreground/60 max-w-2xl mb-10">
        El OVNI despega y el multiplicador crece. Retira antes del crash o pierde la apuesta.
        Cada punto = 0.1 XP cósmico.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GAME */}
        <div className="lg:col-span-2 ghost-border bg-[#0e0e0e] relative overflow-hidden min-h-[420px] flex flex-col">
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-psycho-purple/10 via-transparent to-alien-green/10 pointer-events-none" />

          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div
              className="text-7xl md:text-9xl font-display font-black tabular-nums transition-colors"
              style={{
                color: state === "crashed" ? "#FF3B6B" : state === "cashed" ? "#FFB000" : "#6CBF71",
                textShadow: state === "crashed" ? "0 0 30px #FF3B6B" : state === "cashed" ? "0 0 30px #FFB000" : "0 0 30px #6CBF71",
              }}
            >
              x{multiplier.toFixed(2)}
            </div>
            <span
              className="material-symbols-outlined text-7xl mt-4 transition-transform"
              style={{
                color: state === "crashed" ? "#FF3B6B" : "#A020F0",
                transform: state === "running" ? `translateY(-${Math.min(80, multiplier * 8)}px) rotate(-${Math.min(45, multiplier * 4)}deg)` : "translateY(0)",
              }}
            >
              {state === "crashed" ? "explosion" : "rocket_launch"}
            </span>
            {state === "idle" && <p className="mt-6 text-foreground/50 text-sm">Lanza el OVNI cuando estés listo.</p>}
            {state === "crashed" && <p className="mt-6 text-destructive font-display uppercase tracking-widest">Crash en x{crashAt.toFixed(2)}</p>}
            {state === "cashed" && <p className="mt-6 text-warning-amber font-display uppercase tracking-widest">Aterrizaje seguro</p>}
          </div>

          <div className="border-t border-border p-5 flex flex-col sm:flex-row gap-3 items-center bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-foreground/50">Apuesta</span>
              <input type="number" value={bet} onChange={(e) => setBet(Math.max(1, Number(e.target.value)))} disabled={state === "running"} className="bg-[#131313] border border-border px-3 py-2 w-24 text-sm font-display outline-none focus:border-alien-green" />
            </div>
            {state === "idle" && <button onClick={startGame} className="btn-glow flex-1 font-display font-bold uppercase tracking-widest py-3">Lanzar OVNI</button>}
            {state === "running" && <button onClick={cashOut} className="flex-1 font-display font-bold uppercase tracking-widest py-3 bg-warning-amber text-[#1f1500] glow-amber">Retirar x{multiplier.toFixed(2)}</button>}
            {(state === "crashed" || state === "cashed") && <button onClick={reset} className="ghost-border flex-1 font-display font-bold uppercase tracking-widest py-3 hover:text-alien-green">Otra ronda</button>}
          </div>
        </div>

        {/* SIDE */}
        <div className="flex flex-col gap-6">
          <div className="ghost-border bg-[#0e0e0e] p-5">
            <h3 className="font-display uppercase text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-alien-green">person</span>
              Tu Mejor
            </h3>
            <div className="font-display text-4xl text-alien-green neon-text-green">
              {myBestQuery.data?.score ?? 0}
            </div>
            <p className="text-xs text-foreground/40 mt-1">puntos en Crypto Crash</p>
          </div>

          <div className="ghost-border bg-[#0e0e0e] p-5">
            <h3 className="font-display uppercase text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-warning-amber">leaderboard</span>
              Top Pilotos
            </h3>
            <div className="flex flex-col divide-y divide-border">
              {leaderboard.map((r, i) => (
                <div key={r.id} className="py-2 flex items-center gap-3 text-sm">
                  <span className={`font-display w-5 ${i === 0 ? "text-warning-amber" : "text-foreground/40"}`}>{i + 1}</span>
                  <span className="flex-1 truncate">{r.userName ?? "Anónimo"}</span>
                  <span className="font-display text-alien-green">{r.score}</span>
                </div>
              ))}
              {leaderboard.length === 0 && <p className="text-foreground/40 text-xs py-3">Sin scores aún.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
