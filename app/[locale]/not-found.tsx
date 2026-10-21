import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Rendered inside the [locale] layout; text is bilingual since params aren't available here.
export default function NotFound() {
  return (
    <div className="noise relative grid min-h-[80svh] place-items-center overflow-hidden px-5 pt-28 text-center">
      <div aria-hidden className="bg-grid grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div>
        <p className="eyebrow justify-center">Error · 404</p>
        <p className="mt-6 font-display text-[clamp(6rem,20vw,12rem)] font-extrabold leading-none tracking-[-0.06em] text-amber">
          404
        </p>
        <h1 className="mt-4 font-display text-xl font-bold tracking-tight sm:text-2xl">
          Sahifa topilmadi · Page not found
        </h1>
        <Link href="/uz" className="btn-amber mt-9">
          <ArrowLeft size={17} />
          Bosh sahifa · Home
        </Link>
      </div>
    </div>
  );
}
