import Link from "next/link";
import { Suspense } from "react";
import { getAnalytics, type AnalyticsReport, type DayStats } from "@/lib/analytics";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-session";

const RANGES = [7, 30, 90] as const;

const deviceLabels: Record<string, string> = { mobile: "Telefon", tablet: "Planshet", desktop: "Kompyuter" };
const countryNames = new Intl.DisplayNames(["uz"], { type: "region" });
const nf = new Intl.NumberFormat("uz-UZ");

function countryLabel(code: string) {
  if (code === "??") return "Noma'lum";
  try {
    return `${countryNames.of(code) ?? code} (${code})`;
  } catch {
    return code;
  }
}

export default function AnalyticsPage({ searchParams }: PageProps<"/admin/analytics">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-amber font-mono text-sm font-bold text-amber-ink">
            MB
          </span>
          <h1 className="font-display text-2xl font-bold">Analitika</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-line px-4 py-2 text-sm hover:border-amber">
          ← Postlar
        </Link>
      </header>

      <Suspense fallback={<p className="mt-10 text-muted">Yuklanmoqda…</p>}>
        <Report searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Report({ searchParams }: { searchParams: PageProps<"/admin/analytics">["searchParams"] }) {
  await requireAdmin();
  const { d } = await searchParams;
  const range = RANGES.find((r) => String(r) === d) ?? 30;

  if (!isFirebaseConfigured()) {
    return (
      <p className="mt-6 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
        Firebase sozlanmagan — analitika ma&apos;lumotlari Firestore&apos;da saqlanadi.
      </p>
    );
  }

  const report = await getAnalytics(range);
  const today = report.days.at(-1);

  return (
    <>
      <nav aria-label="Davr" className="mt-8 flex gap-2">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={`/admin/analytics?d=${r}`}
            aria-current={r === range ? "page" : undefined}
            className={
              r === range
                ? "rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-amber-ink"
                : "rounded-full border border-line px-4 py-1.5 text-sm text-muted hover:text-fg"
            }
          >
            {r} kun
          </Link>
        ))}
      </nav>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Ko'rishlar" value={report.totals.views} />
        <Stat label="Tashrifchilar" value={report.totals.visitors} hint="kunlik noyob" />
        <Stat label="Bugun ko'rishlar" value={today?.views ?? 0} />
        <Stat label="Bugun tashrifchilar" value={today?.visitors ?? 0} />
      </dl>

      <DailyChart days={report.days} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TopList title="Sahifalar" rows={report.paths} format={(p) => p} link />
        <TopList title="Manbalar" rows={report.referrers} format={(r) => (r === "direct" ? "To'g'ridan-to'g'ri" : r)} />
        <TopList title="Davlatlar" rows={report.countries} format={countryLabel} />
        <TopList title="Qurilmalar" rows={report.devices} format={(k) => deviceLabels[k] ?? k} />
        <TopList title="Brauzerlar" rows={report.browsers} format={(b) => b} />
      </div>

      <p className="mt-8 text-xs text-muted-2">
        Cookie ishlatilmaydi. Botlar va admin sifatida kirgan holdagi tashriflar hisobga olinmaydi. Vaqt — Toshkent.
      </p>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{nf.format(value)}</dd>
      {hint && <dd className="mt-0.5 text-xs text-muted-2">{hint}</dd>}
    </div>
  );
}

function shortDate(date: string) {
  const [, m, d] = date.split("-");
  return `${d}.${m}`;
}

function DailyChart({ days }: { days: DayStats[] }) {
  const max = Math.max(1, ...days.map((d) => d.views));
  const labelEvery = Math.ceil(days.length / 7);

  return (
    <section className="mt-6 rounded-[20px] border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-semibold">Kunlik ko&apos;rishlar</h2>
        <p className="font-mono text-xs text-muted">eng ko&apos;p: {nf.format(max)}</p>
      </div>
      <div className="mt-5 flex h-44 items-end gap-[2px] border-b border-line" role="img" aria-label="Kunlik ko'rishlar grafigi">
        {days.map((d) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-[4px] bg-amber/80 transition-colors group-hover:bg-amber"
              style={{ height: d.views ? `max(${(d.views / max) * 100}%, 2px)` : 0 }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs shadow-lg group-hover:block">
              <p className="font-mono text-muted">{shortDate(d.date)}</p>
              <p>
                <span className="font-semibold tabular-nums">{nf.format(d.views)}</span> ko&apos;rish ·{" "}
                <span className="font-semibold tabular-nums">{nf.format(d.visitors)}</span> tashrifchi
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[2px] font-mono text-[10px] text-muted-2">
        {days.map((d, i) => (
          <span key={d.date} className="flex-1 overflow-visible whitespace-nowrap">
            {(days.length - 1 - i) % labelEvery === 0 ? shortDate(d.date) : ""}
          </span>
        ))}
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted hover:text-fg">Jadval ko&apos;rinishi</summary>
        <table className="mt-3 w-full font-mono text-xs">
          <thead className="text-left text-muted">
            <tr>
              <th className="py-1 font-normal">Sana</th>
              <th className="py-1 text-right font-normal">Ko&apos;rishlar</th>
              <th className="py-1 text-right font-normal">Tashrifchilar</th>
            </tr>
          </thead>
          <tbody>
            {[...days].reverse().map((d) => (
              <tr key={d.date} className="border-t border-line-soft">
                <td className="py-1">{d.date}</td>
                <td className="py-1 text-right tabular-nums">{d.views}</td>
                <td className="py-1 text-right tabular-nums">{d.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

function TopList({
  title,
  rows,
  format,
  link,
}: {
  title: string;
  rows: AnalyticsReport["paths"];
  format: (key: string) => string;
  link?: boolean;
}) {
  const max = Math.max(1, ...rows.map(([, n]) => n));
  return (
    <section className="rounded-[20px] border border-line bg-surface p-5">
      <h2 className="font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Hali ma&apos;lumot yo&apos;q</p>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {rows.map(([key, n]) => (
            <li key={key} className="relative flex items-center justify-between gap-3 px-2 py-1 text-sm">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-md bg-amber/10"
                style={{ width: `${(n / max) * 100}%` }}
              />
              {link ? (
                <a href={key} target="_blank" rel="noreferrer" className="relative truncate font-mono text-xs hover:text-amber">
                  {format(key)}
                </a>
              ) : (
                <span className="relative truncate">{format(key)}</span>
              )}
              <span className="relative font-mono text-xs tabular-nums text-muted">{nf.format(n)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
