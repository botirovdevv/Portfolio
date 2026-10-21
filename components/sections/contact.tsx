import { ArrowRight, Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { Reveal } from "../ui/reveal";

export function Contact({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line-soft">
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-24 sm:px-8 sm:pt-32">
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">{dict.kicker}</p>
            <h2
              id="contact-title"
              className="mt-5 whitespace-pre-line font-display text-[clamp(2.4rem,1.2rem+5vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.055em]"
            >
              {dict.title}
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">{dict.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <a href={`mailto:${profile.email}`} className="btn-amber group">
              {profile.email}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Send size={16} className="text-amber" />
              Telegram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
