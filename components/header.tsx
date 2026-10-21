"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { Logo } from "./logo";
import { StatusTicker } from "./status-ticker";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  menu: Dictionary["menu"];
  ticker: Dictionary["ticker"];
};

const sectionIds = ["about", "skills", "experience", "projects", "blog", "contact"] as const;

export function Header({ locale, nav, menu, ticker }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const isHome = pathname === `/${locale}`;

  // Scroll-spy: highlight the section currently in view on the home page.
  useEffect(() => {
    if (!isHome) return;
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => window.scrollY < 300 && setActive("home");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const current = isHome ? active : pathname.includes("/blog") ? "blog" : pathname.includes("/projects") ? "projects" : "";

  const links = [
    { id: "home", href: `/${locale}`, label: nav.home },
    { id: "about", href: `/${locale}#about`, label: nav.about },
    { id: "skills", href: `/${locale}#skills`, label: nav.skills },
    { id: "experience", href: `/${locale}#experience`, label: nav.experience },
    { id: "projects", href: `/${locale}#projects`, label: nav.projects },
    { id: "blog", href: `/${locale}/blog`, label: nav.blog },
  ];

  const localeHref = (l: Locale) => pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${l}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-line-soft bg-bg-2/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
          <Logo href={`/${locale}`} onClick={() => setOpen(false)} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[14.5px]">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    aria-current={current === l.id ? "true" : undefined}
                    className={`transition-colors duration-200 ${
                      current === l.id ? "font-medium text-amber" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white/[0.02] p-1">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={localeHref(l)}
                  hrefLang={l}
                  aria-current={l === locale ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold uppercase transition-colors ${
                    l === locale ? "bg-amber text-amber-ink" : "text-muted hover:text-fg"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl text-fg-2 transition active:scale-95 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? menu.close : menu.open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <StatusTicker dict={ticker} />

      <nav
        id="mobile-nav"
        inert={!open}
        aria-label="Mobile"
        className={`fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto overscroll-contain bg-bg px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 transition-[opacity,transform] duration-300 lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul>
          {[...links, { id: "contact", href: `/${locale}#contact`, label: nav.contact }].map((l, i) => (
            <li key={l.id} className="border-b border-line-soft">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-baseline gap-4 py-5 font-display text-2xl font-bold tracking-tight ${
                  current === l.id ? "text-amber" : ""
                }`}
              >
                <span className="font-mono text-[11px] font-medium text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
