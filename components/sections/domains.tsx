import { Globe, LayoutDashboard, LayoutTemplate, Smartphone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

const icons = [Globe, Smartphone, LayoutTemplate, LayoutDashboard];

export function Domains({ dict }: { dict: Dictionary["domains"] }) {
  return (
    <div className="border-y border-line-soft bg-bg-2/60">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="label-mono">{dict.label}</p>
        <ul className="flex flex-wrap items-center gap-x-9 gap-y-3">
          {dict.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item} className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-muted-2 sm:text-xl">
                <Icon size={18} strokeWidth={1.8} className="text-amber/70" />
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
