"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

type Props = {
  photo: string | null;
  name: string;
  initials: string;
  chip: string;
  basedIn: string;
  location: string;
};

// Subtle pointer tilt; only on precise hover-capable pointers.
export function PhotoCard({ photo, name, initials, chip, basedIn, location }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:ml-auto">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,194,75,0.16),transparent_65%)] blur-2xl"
      />
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/10 bg-surface shadow-[inset_0_1px_rgba(255,255,255,0.14),0_40px_80px_-40px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
      >
        {photo ? (
          <Image src={photo} alt={name} fill priority sizes="340px" className="object-cover" />
        ) : (
          <Placeholder initials={initials} />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* corner brackets */}
        <span aria-hidden className="absolute left-4 top-4 size-9 border-l-2 border-t-2 border-amber/90" />
        <span aria-hidden className="absolute bottom-4 right-4 size-9 border-b-2 border-r-2 border-amber/90" />

        <span className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 font-mono text-[11px] font-semibold text-amber backdrop-blur-md">
          <span className="live-dot" />
          LIVE
        </span>
        <span className="absolute bottom-5 right-16 whitespace-nowrap rounded-full border border-white/10 bg-black/45 px-3.5 py-1.5 font-mono text-[11px] text-fg-2 backdrop-blur-md">
          {chip}
        </span>
      </div>

      <div className="card-surface absolute -bottom-6 -left-4 rounded-2xl px-4 py-3 sm:-left-8">
        <p className="label-mono flex items-center gap-1.5">
          <MapPin size={11} className="text-amber" />
          {basedIn}
        </p>
        <p className="mt-1 font-display text-[15px] font-bold tracking-tight">{location}</p>
      </div>
    </div>
  );
}

function Placeholder({ initials }: { initials: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_80%_at_70%_10%,#2a2010_0%,#121316_45%,#0b0c0e_100%)]">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-[7.5rem] font-black leading-none tracking-[-0.06em] text-amber drop-shadow-[0_10px_40px_rgba(255,194,75,0.35)]">
          {initials}
        </span>
      </div>
      <div aria-hidden className="absolute inset-x-8 top-[64%] space-y-2 font-mono text-[11px] text-muted-2">
        <p>
          <span className="text-amber">const</span> stack = [&quot;react&quot;, &quot;next&quot;];
        </p>
        <p>
          <span className="text-amber">export default</span> mustafo;
        </p>
      </div>
    </div>
  );
}
