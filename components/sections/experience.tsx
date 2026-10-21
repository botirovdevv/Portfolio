import { ArrowUpRight, Building2 } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { experience } from "@/content/experience";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";

export function Experience({ dict, locale }: { dict: Dictionary["experience"]; locale: Locale }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="experience-title" kicker={dict.kicker} title={dict.title} />

        <ol className="relative space-y-4 pl-7 sm:pl-9">
          <span aria-hidden className="absolute bottom-6 left-[5px] top-6 w-px bg-gradient-to-b from-amber/60 via-line to-transparent sm:left-[7px]" />
          {experience.map((item, i) => (
            <Reveal as="li" key={`${item.period}-${item.org}`} delay={i * 90} className="relative">
              <span
                aria-hidden
                className={`absolute -left-7 top-8 size-[11px] rounded-full sm:-left-9 sm:size-[15px] ${
                  item.current ? "bg-amber shadow-[0_0_0_4px_#0e1013,0_0_18px_rgba(255,194,75,0.6)]" : "bg-line shadow-[0_0_0_4px_#0e1013]"
                }`}
              />
              <article className="card-surface card-hover rounded-[20px] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.03em] sm:text-xl">{item.role[locale]}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-muted">
                      <Building2 size={14} strokeWidth={1.8} />
                      {item.orgUrl ? (
                        <a href={item.orgUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:text-amber">
                          {item.org}
                          <ArrowUpRight size={12} />
                        </a>
                      ) : (
                        item.org
                      )}
                    </p>
                  </div>
                  <p className={`font-mono text-[12.5px] ${item.current ? "text-amber" : "text-muted-2"}`}>
                    {item.period.replace("now", dict.now)}
                  </p>
                </div>
                <p className="mt-4 max-w-[46rem] text-[15.5px] leading-relaxed text-fg-2">{item.text[locale]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <li key={t} className="tag-pill">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
