import { Braces } from "lucide-react";
import Link from "next/link";

export function Logo({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group flex items-center gap-2.5" aria-label="Mustafo Botirov">
      <span className="grid size-9 place-items-center rounded-[10px] border border-amber/40 bg-amber/10 text-amber transition-transform duration-300 group-hover:-rotate-6">
        <Braces size={18} strokeWidth={2.2} />
      </span>
      <span className="font-display text-[15px] font-bold tracking-tight">
        botirov<span className="text-amber">.</span>
      </span>
    </Link>
  );
}
