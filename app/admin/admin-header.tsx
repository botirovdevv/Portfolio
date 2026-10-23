import { ArrowUpRight, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { logout } from "./actions";

export type AdminSection = "posts" | "analytics" | "editor";

export function AdminHeader({ active }: { active: AdminSection }) {
  return (
    <header className="admin-bar">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/admin" className="press flex items-center gap-2.5 rounded-xl" aria-label="Admin bosh sahifasi">
          <span className="grid size-9 place-items-center rounded-[11px] bg-amber font-mono text-[13px] font-bold text-amber-ink shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]">
            MB
          </span>
          <span className="hidden font-semibold tracking-tight sm:block">Admin</span>
        </Link>

        <nav aria-label="Bo'limlar" className="segmented ml-auto sm:ml-4">
          <Link href="/admin" aria-current={active === "posts" ? "page" : undefined} className="press">
            Postlar
          </Link>
          <Link href="/admin/analytics" aria-current={active === "analytics" ? "page" : undefined} className="press">
            Analitika
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:ml-auto">
          <Link
            href="/en"
            target="_blank"
            className="press btn-quiet hidden size-9 sm:inline-flex"
            aria-label="Saytni ochish"
            title="Saytni ochish"
          >
            <ArrowUpRight className="size-4" />
          </Link>
          {active !== "editor" && (
            <Link href="/admin/new" className="press btn-primary h-9 px-3.5 text-sm sm:px-4" aria-label="Yangi post">
              <Plus className="size-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Yangi post</span>
            </Link>
          )}
          <form action={logout}>
            <button className="press btn-quiet size-9" aria-label="Chiqish" title="Chiqish">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
