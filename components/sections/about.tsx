import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { allSkills } from "@/content/skills";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";
import { GraduationCap, MapPin, Spark } from "../ui/icons";

export function About({ dict }: { dict: Dictionary["about"] }) {
  const stats = [
    { value: `${profile.yearsOfExperience}+`, label: dict.stats.years },
    { value: `${projects.length}+`, label: dict.stats.projects },
    { value: `${allSkills.length}`, label: dict.stats.stack },
  ];
  const cards = [
    { Icon: GraduationCap, label: dict.cards.study, value: dict.cards.studyValue, sub: dict.cards.studySub },
    { Icon: MapPin, label: dict.cards.location, value: dict.cards.locationValue },
    { Icon: Spark, label: dict.cards.focus, value: dict.cards.focusValue },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading id="about-title" kicker={dict.kicker} title={dict.title} />

      <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-3">
        <Reveal className="spotlight rounded-3xl border border-line bg-elev p-7 sm:p-9 lg:col-span-2 lg:row-span-3">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p className="text-fg">{dict.p1}</p>
            <p>{dict.p2}</p>
            <p>{dict.p3}</p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-4xl font-bold text-accent sm:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {cards.map(({ Icon, label, value, sub }, i) => (
          <Reveal
            key={label}
            delay={100 * (i + 1)}
            className="spotlight group rounded-3xl border border-line bg-elev p-6 transition hover:border-accent/50"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-fill/15 text-accent transition group-hover:bg-accent-fill group-hover:text-[#070b14]">
                <Icon />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
                <p className="mt-1.5 font-display text-lg font-semibold">{value}</p>
                {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
