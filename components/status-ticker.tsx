"use client";

import { projects } from "@/content/projects";
import type { Dictionary } from "@/lib/i18n";

export function StatusTicker({ dict }: { dict: Dictionary["ticker"] }) {
  const items = [
    ...projects.map((p) => ({
      key: p.slug,
      text: `${p.url ? p.url.replace(/^https?:\/\//, "") : p.slug} — ${p.status === "live" ? dict.live : dict.dev}`,
      live: p.status === "live",
    })),
    { key: "study", text: dict.learning, live: true },
  ];

  return (
    <div className="border-b border-line-soft bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center gap-5 px-5 font-mono text-[11.5px] sm:px-8">
        <span className="shrink-0 font-semibold tracking-[0.14em] text-amber">{dict.label}</span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <ul className="flex w-max animate-ticker gap-10 whitespace-nowrap text-muted" aria-label={dict.label}>
            {[...items, ...items].map((it, i) => (
              <li key={`${it.key}-${i}`} aria-hidden={i >= items.length} className="flex items-center gap-2.5">
                <span className={`size-1.5 rounded-full ${it.live ? "bg-amber" : "bg-muted-2"}`} />
                {it.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
