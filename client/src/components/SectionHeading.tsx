export default function SectionHeading({
  eyebrow,
  title,
  accent,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-psycho-purple-alt flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-psycho-purple-alt animate-pulse" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter">
        {title} {accent && <span className="text-alien-green neon-text-green">{accent}</span>}
      </h2>
    </div>
  );
}
