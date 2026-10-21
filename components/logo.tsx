import Link from "next/link";

// Minimal monogram: an "M" whose last stroke continues into a "B" bowl, in a thin amber frame.
export function Logo({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="logo group flex items-center gap-2.5" aria-label="Mustafo Botirov">
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        className="size-8 text-amber transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1.5" y="1.5" width="29" height="29" rx="8" className="opacity-40" />
        <path className="logo-mark" pathLength={1} d="M8 22V10l5 7 5-7v12M18 10h3.5a3 3 0 0 1 0 6H18m0 0h4a3 3 0 0 1 0 6h-4" />
      </svg>
      <span className="font-display text-[15px] font-bold tracking-tight">
        botirov<span className="text-amber">.</span>
      </span>
    </Link>
  );
}
