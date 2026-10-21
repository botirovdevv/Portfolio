import { Briefcase, CircleDot, Crosshair, GraduationCap, MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";

export function About({ dict }: { dict: Dictionary["about"] }) {
  const r = dict.rows;
  const rows = [
    { Icon: Briefcase, label: r.role, value: r.roleValue },
    { Icon: MapPin, label: r.location, value: r.locationValue },
    { Icon: GraduationCap, label: r.study, value: r.studyValue },
    { Icon: Crosshair, label: r.focus, value: r.focusValue },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_450px] lg:gap-16">
        <div>
          <SectionHeading id="about-title" kicker={dict.kicker} title={dict.title} />
          <Reveal className="max-w-[38rem] space-y-5 text-[17px] leading-[1.75] text-fg-2">
            <p>{dict.p1}</p>
            <p>{dict.p2}</p>
            <p className="text-muted">{dict.p3}</p>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:pt-16">
          <div className="card-surface rounded-[20px] p-7">
            <p className="label-mono">{dict.status}</p>
            <dl className="mt-4">
              {rows.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-line-soft py-4">
                  <dt className="flex items-center gap-3 text-[15px] text-muted">
                    <Icon size={16} strokeWidth={1.8} className="text-muted-2" />
                    {label}
                  </dt>
                  <dd className="text-right font-mono text-[14px] text-fg">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-4">
                <dt className="flex items-center gap-3 text-[15px] text-muted">
                  <CircleDot size={16} strokeWidth={1.8} className="text-muted-2" />
                  {r.state}
                </dt>
                <dd className="flex items-center gap-2 font-mono text-[14px] text-amber">
                  <span className="live-dot" />
                  {r.stateValue}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
