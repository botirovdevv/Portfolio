"use client";

import { Moon, Sun } from "./icons";

export function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
    >
      <span className="sr-only dark:hidden">{labels.dark}</span>
      <span className="sr-only hidden dark:inline">{labels.light}</span>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </button>
  );
}
