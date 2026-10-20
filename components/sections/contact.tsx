import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { SocialLinks } from "../social-links";
import { Reveal } from "../ui/reveal";
import { Telegram } from "../ui/icons";

export function Contact({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-accent-fill px-6 py-16 text-[#070b14] sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#070b14_1px,transparent_1px)] [background-size:18px_18px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full border-[40px] border-[#070b14]/10"
        />
        <p className="relative font-mono text-xs uppercase tracking-[0.2em] opacity-70">{dict.kicker}</p>
        <h2
          id="contact-title"
          className="relative mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl"
        >
          {dict.title}
        </h2>
        <p className="relative mt-5 max-w-xl text-lg opacity-80">{dict.text}</p>
        <div className="relative mt-10 flex flex-wrap items-center gap-4">
          <a
            href={profile.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#070b14] px-7 py-3.5 font-semibold text-[#facc15] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Telegram />
            {dict.cta}
          </a>
          <a href={`mailto:${profile.email}`} className="font-mono text-sm font-semibold underline underline-offset-4">
            {profile.email}
          </a>
        </div>
      </Reveal>
      <div className="mt-8 flex justify-center">
        <SocialLinks />
      </div>
    </section>
  );
}
