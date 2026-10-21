import type { ReactNode } from "react";

/** Top block for inner pages (blog index, post, project). */
export function PageShell({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className="noise relative overflow-hidden">
      <div aria-hidden className="bg-grid grid-fade pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-24 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,194,75,0.09),transparent_62%)]"
      />
      <div className={`mx-auto px-5 pb-24 pt-[150px] sm:px-8 sm:pt-[172px] ${narrow ? "max-w-[760px]" : "max-w-[1200px]"}`}>
        {children}
      </div>
    </div>
  );
}
