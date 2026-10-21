import Link from "next/link";
import { Suspense } from "react";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { listPostsUncached } from "@/lib/posts";
import { isTelegramConfigured } from "@/lib/telegram";
import { requireAdmin } from "@/lib/admin-session";
import { DeleteButton } from "./delete-button";
import { logout } from "./actions";

const messages: Record<string, string> = {
  created: "Post saytga va Telegram kanalga joylandi ✓",
  updated: "Post yangilandi ✓",
  deleted: "Post o'chirildi ✓",
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-amber font-mono text-sm font-bold text-amber-ink">
            MB
          </span>
          <h1 className="font-display text-2xl font-bold">Blog boshqaruvi</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/uz/blog" className="rounded-full border border-line px-4 py-2 text-sm hover:border-amber">
            Saytni ko&apos;rish
          </Link>
          <Link
            href="/admin/new"
            className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-amber-ink hover:brightness-110"
          >
            + Yangi post
          </Link>
          <form action={logout}>
            <button className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-fg">Chiqish</button>
          </form>
        </div>
      </header>

      <Suspense fallback={<p className="mt-10 text-muted">Yuklanmoqda…</p>}>
        <Flash searchParams={searchParams} />
        <PostList />
      </Suspense>
    </div>
  );
}

async function Flash({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const { ok } = await searchParams;
  const msg = typeof ok === "string" ? messages[ok] : undefined;
  if (!msg) return null;
  return <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{msg}</p>;
}

async function PostList() {
  await requireAdmin();

  const warnings = [
    !isFirebaseConfigured() && "Firebase sozlanmagan — .env.local faylida FIREBASE_* qiymatlarini kiriting.",
    !isTelegramConfigured() && "Telegram bot sozlanmagan — postlar faqat saytga joylanadi.",
  ].filter(Boolean) as string[];

  const posts = isFirebaseConfigured() ? await listPostsUncached() : [];

  return (
    <>
      {warnings.map((w) => (
        <p key={w} className="mt-6 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          {w}
        </p>
      ))}

      {posts.length === 0 ? (
        <p className="mt-10 rounded-[20px] border border-dashed border-line p-10 text-center text-muted">
          Hali postlar yo&apos;q. Birinchisini yozing yoki botga xabar yuboring.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  /{p.slug} · {new Date(p.createdAt).toLocaleDateString("uz-UZ")} ·{" "}
                  {p.source === "telegram" ? "Telegram bot" : "Sayt"}
                  {p.channelMessageId ? " · kanalda ✓" : " · kanalda yo'q"}
                </p>
              </div>
              <Link href={`/uz/blog/${p.slug}`} className="text-sm text-muted hover:text-amber">
                Ko&apos;rish
              </Link>
              <Link href={`/admin/edit/${p.id}`} className="text-sm text-amber hover:underline">
                Tahrirlash
              </Link>
              <DeleteButton id={p.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
