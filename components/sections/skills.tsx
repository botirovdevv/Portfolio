import { Braces, Code2, Database, Palette, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { skills, type SkillGroup } from "@/content/skills";
import { SectionHeading } from "../section-heading";
import { BrandIcon } from "../ui/brand-icon";
import { Reveal } from "../ui/reveal";

const groupIcons: Record<SkillGroup, LucideIcon> = {
  frontend: Code2,
  language: Braces,
  backend: Database,
  styling: Palette,
};

export function Skills({ dict }: { dict: Dictionary["skills"] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-line-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="skills-title" kicker={dict.kicker} title={dict.title} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => {
            const Icon = groupIcons[g.group];
            return (
              <Reveal key={g.group} delay={i * 80} className="h-full">
                <div className="card-surface card-hover flex h-full flex-col rounded-[20px] p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="label-mono !text-muted">{dict.groups[g.group]}</h3>
                    <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-amber">
                      <Icon size={15} strokeWidth={2} />
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <li key={s.name} className="tag-pill">
                        {s.icon && <BrandIcon name={s.icon} colored size={13} />}
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
