import { BrainCircuit, GraduationCap, HeartPulse, Landmark, Wallet, type LucideIcon } from "lucide-react";
import type { ProjectIcon } from "@/content/projects";

export const projectIcons: Record<ProjectIcon, LucideIcon> = {
  education: GraduationCap,
  government: Landmark,
  health: HeartPulse,
  finance: Wallet,
  ai: BrainCircuit,
};

/** Banner used on project cards and the project page: monogram + domain icon. */
export function ProjectVisual({
  monogram,
  icon,
  badge,
  large = false,
}: {
  monogram: string;
  icon: ProjectIcon;
  badge?: React.ReactNode;
  large?: boolean;
}) {
  const Icon = projectIcons[icon];
  return (
    <div
      className={`relative grid place-items-center overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#26282c_0%,#16181b_100%)] ${
        large ? "h-56 sm:h-72" : "h-40"
      }`}
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]" />
      <Icon
        aria-hidden
        strokeWidth={1}
        className={`absolute text-white/[0.05] ${large ? "-bottom-10 -right-6 size-64" : "-bottom-8 -right-4 size-40"}`}
      />
      <span
        className={`relative font-display font-extrabold leading-none tracking-[-0.05em] text-amber ${
          large ? "text-7xl sm:text-8xl" : "text-[3.4rem]"
        }`}
      >
        {monogram}
      </span>
      <span className="absolute left-4 top-4 grid size-8 place-items-center rounded-lg border border-white/10 bg-black/30 text-amber backdrop-blur">
        <Icon size={15} strokeWidth={2} />
      </span>
      {badge && <div className="absolute right-4 top-4">{badge}</div>}
    </div>
  );
}

export function StatusBadge({ live, label }: { live: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted backdrop-blur">
      <span className={`size-1.5 rounded-full ${live ? "bg-amber" : "bg-muted-2"}`} />
      {label}
    </span>
  );
}
