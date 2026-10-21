import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { projects } from "@/content/projects";
import { ProjectVisual, StatusBadge } from "../project-visual";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";

export function Projects({ dict, locale }: { dict: Dictionary["projects"]; locale: Locale }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="projects-title" kicker={dict.kicker} title={dict.title} />

        <ul className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 100} className="h-full">
              <article className="card-surface card-hover group relative flex h-full flex-col overflow-hidden rounded-[20px]">
                <ProjectVisual
                  monogram={p.monogram}
                  icon={p.icon}
                  badge={<StatusBadge live={p.status === "live"} label={dict.status[p.status]} />}
                />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-bold tracking-[-0.035em] sm:text-[1.4rem]">
                      <Link href={`/${locale}/projects/${p.slug}`} className="after:absolute after:inset-0">
                        {p.name}
                      </Link>
                    </h3>
                    <span className="font-mono text-[12px] text-muted-2">{p.year}</span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.summary[locale]}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li key={s} className="tag-pill !text-[12px]">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                    <span className="inline-flex items-center gap-2 font-mono text-[13px] font-medium text-amber">
                      {dict.details}
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center gap-1.5 font-mono text-[12.5px] text-muted transition-colors hover:text-fg"
                      >
                        {p.url.replace(/^https?:\/\//, "")}
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
