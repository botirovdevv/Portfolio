import { cacheLife } from "next/cache";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { SocialLinks } from "./social-links";

export function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © <Year /> {profile.name}. {dict.rights}
        </p>
        <SocialLinks />
        <p className="font-mono text-xs">
          {dict.built} <span className="text-accent">▲</span>
        </p>
      </div>
    </footer>
  );
}

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
