import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#2a2a2a] bg-[#0a0a0a] relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <span
            className="font-display text-4xl font-black"
            style={{ WebkitTextStroke: "1px #6CBF71", color: "transparent" }}
          >
            ALIEN.MX
          </span>
          <p className="mt-4 text-foreground/50 text-xs max-w-xs leading-relaxed">
            Transmitiendo desde el Underground Cósmico. Equipamiento táctico, parafernalia y
            artefactos para el contacto.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-display uppercase text-xs tracking-widest text-alien-green mb-1">Tienda</span>
            <Link href="/arsenal" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Arsenal</Link>
            <Link href="/equipo" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Equipo Cósmico</Link>
            <Link href="/transmisiones" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Transmisiones</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-display uppercase text-xs tracking-widest text-psycho-purple-alt mb-1">Espacio</span>
            <Link href="/avistamientos" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Mapa UAP</Link>
            <Link href="/radar" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Web3 Radar</Link>
            <Link href="/arcade" className="text-foreground/40 hover:text-foreground text-sm transition-colors">Arcade 420</Link>
          </div>
        </div>

        <div className="flex flex-col justify-end items-start md:items-end gap-2">
          <div className="flex gap-4">
            {["Terminal", "Encryption", "Sat-Link", "Privacy"].map((t) => (
              <a key={t} href="#" className="font-display uppercase tracking-[0.2em] text-[10px] text-[#40493e] hover:text-psycho-purple-alt transition-colors">
                {t}
              </a>
            ))}
          </div>
          <p className="text-foreground/30 text-[10px] tracking-[0.2em] uppercase mt-4">
            © 2026 ALIEN.MX // INTELLIGENCE CENTER
          </p>
        </div>
      </div>
    </footer>
  );
}
