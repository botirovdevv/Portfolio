import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";
import type { Dictionary } from "@/lib/i18n";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

export function Footer({ dict, homeHref }: { dict: Dictionary["footer"]; homeHref: string }) {
  return (
    <footer className="relative overflow-hidden">
      <div
        aria-hidden
        className="text-outline pointer-events-none absolute -bottom-[0.22em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(3rem,15vw,14rem)] font-extrabold leading-none tracking-[-0.06em]"
      >
        mustafodev.
      </div>
      <div className="relative mx-auto max-w-[1200px] px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-8">
        <div className="flex flex-col gap-6 border-t border-line-soft pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo href={homeHref} />
            <p className="font-mono text-[12px] text-muted-2">
              © <Year /> {profile.name}
            </p>
          </div>
          <SocialLinks />
        </div>
        <p className="sr-only">{dict.rights}</p>
        <div className="h-16 sm:h-32" />
      </div>
    </footer>
  );
}

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
