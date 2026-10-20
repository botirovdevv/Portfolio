import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { allSkills } from "@/content/skills";
import { ArrowRight, ArrowUpRight } from "../ui/icons";

export function Hero({ dict, locale }: { dict: Dictionary["hero"]; locale: Locale }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-36">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_65%)] blur-2xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-elev/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {dict.badge}
          </p>

          <h1
            id="hero-title"
            className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]"
          >
            Mustafo
            <br />
            <span className="relative inline-block">
              Botirov
              <span
                aria-hidden
                className="absolute -right-6 bottom-3 size-4 rounded-full bg-accent-fill sm:-right-8 sm:size-5"
              />
            </span>
            <span className="sr-only"> — {dict.role}</span>
          </h1>

          <p className="mt-6 font-mono text-sm text-accent sm:text-base" aria-hidden>
            <span className="text-muted">~/</span>
            {dict.role.toLowerCase().replace(/\s+/g, "-")}
            <span className="text-muted"> $ </span>
            <span className="animate-blink">▍</span>
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{dict.intro}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${locale}#projects`}
              className="group inline-flex items-center gap-2 rounded-full bg-accent-fill px-6 py-3 font-semibold text-[#070b14] shadow-[0_8px_30px_-8px_var(--glow)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_rgba(250,204,21,0.55)]"
            >
              {dict.ctaProjects}
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold transition hover:border-accent hover:text-accent"
            >
              {dict.ctaContact}
              <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <CodeCard />
      </div>

      <SkillMarquee />
    </section>
  );
}

function CodeCard() {
  const k = "text-[#c792ea]";
  const s = "text-accent";
  const v = "text-sky-400";
  const n = "text-orange-400";
  const c = "text-muted";
  return (
    <div className="relative animate-float">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_70%_30%,var(--glow),transparent_60%)]"
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-elev shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted">mustafo.ts</span>
        </div>
        <pre
          className="overflow-x-auto p-5 font-mono text-[13px] leading-7 sm:text-sm"
          aria-label="Developer profile as code"
        >
          <code>
            <span className={c}>{"// hello, world"}</span>
            {"\n"}
            <span className={k}>const</span> <span className={v}>developer</span> = {"{"}
            {"\n  "}name: <span className={s}>&quot;{profile.name}&quot;</span>,
            {"\n  "}role: <span className={s}>&quot;Frontend Developer&quot;</span>,
            {"\n  "}experience: <span className={n}>{profile.yearsOfExperience}</span>,
            {"\n  "}study: <span className={s}>&quot;Software Engineering&quot;</span>,
            {"\n  "}stack: [<span className={s}>&quot;React&quot;</span>,{" "}
            <span className={s}>&quot;Next.js&quot;</span>, <span className={s}>&quot;TS&quot;</span>],
            {"\n  "}coffee: <span className={n}>Infinity</span>,
            {"\n"}
            {"};"}
            {"\n\n"}
            <span className={k}>export default</span> <span className={v}>developer</span>;
          </code>
        </pre>
      </div>
    </div>
  );
}

function SkillMarquee() {
  const row = [...allSkills, ...allSkills];
  return (
    <div className="relative mt-20 overflow-hidden border-y border-line bg-elev/40 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] sm:mt-28">
      <ul
        aria-hidden
        className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl font-semibold text-muted sm:text-2xl"
      >
        {row.map((s, i) => (
          <li key={i} className="flex items-center gap-10">
            {s}
            <span className="text-accent">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
