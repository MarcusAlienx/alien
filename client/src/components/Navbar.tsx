import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { href: "/arsenal", label: "Arsenal" },
  { href: "/equipo", label: "Equipo" },
  { href: "/avistamientos", label: "Mapa" },
  { href: "/radar", label: "Web3" },
  { href: "/arcade", label: "Arcade" },
  { href: "/comunidad", label: "Space" },
  { href: "/transmisiones", label: "News" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-psycho-purple/20 shadow-[0_0_24px_rgba(108,191,113,0.08)]">
      <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="material-symbols-outlined text-alien-green text-3xl icon-fill group-hover:rotate-90 transition-transform duration-500">
            blur_on
          </span>
          <span className="font-display text-xl md:text-2xl font-bold tracking-tighter text-alien-green uppercase neon-text-green">
            ALIEN.MX
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const active = location === l.href || location.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "font-display text-sm tracking-tight uppercase transition-colors",
                  active
                    ? "text-psycho-purple-alt font-bold border-b-2 border-psycho-purple-alt pb-1"
                    : "text-foreground/80 hover:text-alien-green",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={open}
            className="relative w-10 h-10 flex items-center justify-center text-foreground/80 hover:text-alien-green transition-colors"
            aria-label="Abrir bóveda"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-alien-green text-[#07210d] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full glow-green-sm">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="font-display text-xs uppercase tracking-wide text-warning-amber hover:text-warning-amber/80 transition-colors"
                >
                  CMS
                </Link>
              )}
              <Link
                href="/comunidad"
                className="font-display text-xs uppercase tracking-wide text-foreground/70 hover:text-alien-green"
              >
                {user?.name?.split(" ")[0] ?? "Operador"}
              </Link>
              <button
                onClick={() => logout()}
                className="font-display text-xs uppercase tracking-wide text-foreground/40 hover:text-destructive transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="hidden md:flex btn-glow font-display font-bold px-5 py-2 text-sm uppercase tracking-wide items-center"
            >
              Conectar
            </a>
          )}

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass-panel border-t border-psycho-purple/20 px-5 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-display uppercase tracking-tight text-foreground/80 hover:text-alien-green py-1"
            >
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="font-display uppercase text-warning-amber py-1">
                  Panel CMS
                </Link>
              )}
              <button onClick={() => logout()} className="text-left font-display uppercase text-destructive py-1">
                Cerrar sesión
              </button>
            </>
          ) : (
            <a href={getLoginUrl()} className="btn-glow font-display font-bold px-5 py-2 text-sm uppercase tracking-wide text-center">
              Conectar
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
