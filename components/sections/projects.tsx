import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { projects } from "@/content/projects";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";
import { ArrowUpRight } from "../ui/icons";

export function Projects({ dict, locale }: { dict: Dictionary["projects"]; locale: Locale }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading id="projects-title" kicker={dict.kicker} title={dict.title} subtitle={dict.subtitle} />

      <ol className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={(i % 2) * 120}>
            <article className="spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-elev p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/60 sm:p-9">
              <span
                aria-hidden
                className="text-stroke pointer-events-none absolute -right-2 -top-6 font-display text-[8rem] font-bold leading-none transition group-hover:[-webkit-text-stroke-color:var(--accent)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <p className="font-mono text-xs text-muted">{p.year}</p>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                <Link href={`/${locale}/projects/${p.slug}`} className="after:absolute after:inset-0">
                  {p.name}
                </Link>
              </h3>
              <p className="mt-3 max-w-md text-muted">{p.summary[locale]}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-muted">
                    {s}
                  </li>
                ))}
              </ul>

              <div className="relative mt-auto flex flex-wrap items-center gap-5 pt-8 text-sm font-semibold">
                <span className="inline-flex items-center gap-1.5 text-accent">
                  {dict.details}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 text-muted underline-offset-4 hover:text-fg hover:underline"
                  >
                    {p.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
