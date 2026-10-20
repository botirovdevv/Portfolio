"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { Close, Menu } from "./ui/icons";
import { ThemeToggle } from "./ui/theme-toggle";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  theme: Dictionary["theme"];
  menu: Dictionary["menu"];
};

export function Header({ locale, nav, theme, menu }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const otherLocale: Locale = locale === "uz" ? "en" : "uz";
  const switchHref = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${otherLocale}`);

  const links = [
    { href: `/${locale}#about`, label: nav.about },
    { href: `/${locale}#skills`, label: nav.skills },
    { href: `/${locale}#projects`, label: nav.projects },
    { href: `/${locale}/blog`, label: nav.blog },
    { href: `/${locale}#contact`, label: nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-accent-fill font-mono text-sm text-[#070b14] transition-transform group-hover:-rotate-6">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">
            {profile.shortName}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-elev/60 p-1 backdrop-blur">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-4 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchHref}
            hrefLang={otherLocale}
            className="grid h-10 min-w-10 place-items-center rounded-full border border-line px-3 font-mono text-xs uppercase text-muted transition hover:border-accent hover:text-accent"
          >
            {otherLocale}
          </Link>
          <ThemeToggle labels={theme} />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">{open ? menu.close : menu.open}</span>
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`md:hidden ${open ? "block" : "hidden"} h-[calc(100dvh-4rem)] border-t border-line bg-bg px-4 pt-6`}
      >
        <ul className="flex flex-col">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line py-5 font-display text-3xl font-bold"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
