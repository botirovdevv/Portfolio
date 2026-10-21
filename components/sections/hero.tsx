import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { allSkills } from "@/content/skills";
import { PhotoCard } from "../ui/photo-card";

export function Hero({ dict, locale }: { dict: Dictionary["hero"]; locale: Locale }) {
  const stats = [
    { value: `${profile.yearsOfExperience}+`, label: dict.stats.years, accent: true },
    { value: String(projects.length), label: dict.stats.projects },
    { value: `${allSkills.length}`, label: dict.stats.stack },
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="noise relative overflow-hidden pb-20 pt-[152px] sm:pb-24 sm:pt-[176px]"
    >
      <div aria-hidden className="bg-grid grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-20 -z-10 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,194,75,0.11),transparent_62%)]"
      />

      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-amber/30 bg-amber/[0.06] px-4 py-2 font-mono text-[12.5px] font-medium text-amber">
            <span className="live-dot" />
            {dict.badge}
          </p>

          <h1 id="hero-title" className="mt-8">
            <span className="block font-display text-[clamp(3.1rem,1.2rem+8.4vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.055em]">
              {profile.lastName}
            </span>
            <span className="mt-1 block font-display text-[clamp(1.9rem,1rem+3.6vw,3.3rem)] font-light leading-none tracking-[-0.04em] text-muted">
              {profile.firstName}
            </span>
            <span className="sr-only"> — {dict.role}</span>
          </h1>

          <p className="mt-8 whitespace-pre-line font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.04em]">
            {dict.tagline}
          </p>
          <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-muted">{dict.intro}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}#projects`} className="btn-amber group">
              {dict.ctaProjects}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href={`/${locale}#contact`} className="btn-ghost">
              {dict.ctaContact}
            </Link>
            <a href={profile.telegramChannel} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Send size={16} className="text-amber" />
              {dict.ctaChannel}
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line-soft pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="label-mono mt-2">{s.label}</dt>
                <dd
                  className={`font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] sm:text-5xl ${
                    s.accent ? "text-amber" : ""
                  }`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <PhotoCard
          photo={profile.photo}
          name={profile.name}
          initials={profile.initials}
          chip={dict.photoChip}
          basedIn={dict.basedIn}
          location={dict.location}
        />
      </div>
    </section>
  );
}
