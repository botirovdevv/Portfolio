import type { Dictionary } from "@/lib/i18n";
import { skills } from "@/content/skills";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";

export function Skills({ dict }: { dict: Dictionary["skills"] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative border-y border-line bg-elev/40">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <SectionHeading id="skills-title" kicker={dict.kicker} title={dict.title} subtitle={dict.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 90} className="spotlight rounded-3xl border border-line bg-bg p-7">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">{dict.groups[g.group]}</h3>
                <span className="font-mono text-xs text-muted">{String(g.items.length).padStart(2, "0")}</span>
              </div>
              <ul className="flex flex-wrap gap-2.5">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line bg-elev px-4 py-2 font-mono text-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_6px_24px_-8px_var(--glow)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
