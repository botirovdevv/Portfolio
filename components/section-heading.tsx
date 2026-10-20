import { Reveal } from "./ui/reveal";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  id,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  id: string;
}) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{kicker}</p>
      <h2 id={id} className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </Reveal>
  );
}
