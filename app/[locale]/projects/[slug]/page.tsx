import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Layers, MessageCircle, UserRound } from "lucide-react";
import { PageShell } from "@/components/page-hero";
import { ProjectVisual, StatusBadge } from "@/components/project-visual";
import { BrandIcon } from "@/components/ui/brand-icon";
import { getProject, projects } from "@/content/projects";
import { profile, siteUrl } from "@/content/profile";
import { getDictionary, isLocale } from "@/lib/i18n";
import { alternates, JsonLd, openGraph } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  return {
    title: project.name,
    description: project.summary[locale],
    alternates: alternates(locale, `/projects/${slug}`),
    openGraph: openGraph(locale, {
      title: `${project.name} — ${profile.name}`,
      description: project.summary[locale],
      path: `/projects/${slug}`,
    }),
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) notFound();
  const dict = getDictionary(locale).projects;
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description[locale],
    url: project.url ?? `${siteUrl}/${locale}/projects/${slug}`,
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    creator: { "@id": `${siteUrl}/#person`, "@type": "Person", name: profile.name },
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <Link
        href={`/${locale}#projects`}
        className="group inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-amber"
      >
        <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
        {dict.back}
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_440px] lg:items-start">
        <div>
          <p className="eyebrow">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,1.4rem+5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.055em]">
            {project.name}
          </h1>
          <p className="mt-7 max-w-[40rem] text-[18px] leading-relaxed text-fg-2">{project.description[locale]}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-amber group">
                {dict.visit}
                <ExternalLink size={16} />
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <BrandIcon name="github" size={16} />
                GitHub
              </a>
            )}
            <Link href={`/${locale}#contact`} className="btn-ghost">
              <MessageCircle size={16} className="text-amber" />
              {getDictionary(locale).hero.ctaContact}
            </Link>
          </div>
        </div>

        <div className="card-surface overflow-hidden rounded-[22px]">
          <ProjectVisual
            large
            monogram={project.monogram}
            icon={project.icon}
            badge={<StatusBadge live={project.status === "live"} label={dict.status[project.status]} />}
          />
          <dl className="divide-y divide-line-soft px-6">
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-2.5 text-[15px] text-muted">
                <UserRound size={15} className="text-muted-2" />
                {dict.role}
              </dt>
              <dd className="font-mono text-[14px]">{project.role[locale]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-2.5 text-[15px] text-muted">
                <CalendarDays size={15} className="text-muted-2" />
                {dict.year}
              </dt>
              <dd className="font-mono text-[14px]">{project.year}</dd>
            </div>
            <div className="py-4">
              <dt className="flex items-center gap-2.5 text-[15px] text-muted">
                <Layers size={15} className="text-muted-2" />
                {dict.stack}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="tag-pill !text-[12px]">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Link
        href={`/${locale}/projects/${next.slug}`}
        className="card-surface card-hover group mt-20 flex items-center justify-between gap-6 rounded-[20px] p-6 sm:p-8"
      >
        <span>
          <span className="label-mono">{dict.next}</span>
          <span className="mt-2 block font-display text-2xl font-bold tracking-[-0.04em] transition-colors group-hover:text-amber sm:text-3xl">
            {next.name}
          </span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-amber transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight size={20} />
        </span>
      </Link>
    </PageShell>
  );
}
