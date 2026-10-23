import { CalendarDays, Eye, TriangleAlert, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getAnalytics, type AnalyticsReport, type DayStats } from "@/lib/analytics";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-session";
import { AdminHeader } from "../admin-header";

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
    <>
      <AdminHeader active="analytics" />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <Suspense fallback={<ReportSkeleton />}>
          <Report searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

function ReportSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="group-card h-28 animate-pulse" />
        ))}
      </div>
      <div className="group-card mt-4 h-72 animate-pulse" />
    </div>
  );
}

async function Report({ searchParams }: { searchParams: PageProps<"/admin/analytics">["searchParams"] }) {
  await requireAdmin();
  const { d } = await searchParams;
  const range = RANGES.find((r) => String(r) === d) ?? 30;

  if (!isFirebaseConfigured()) {
    return (
      <p role="alert" className="flex items-start gap-2.5 rounded-2xl border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        Firebase sozlanmagan — analitika ma&apos;lumotlari Firestore&apos;da saqlanadi.
      </p>
    );
  }

  const report = await getAnalytics(range);
  const today = report.days.at(-1);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">Analitika</h1>
        <nav aria-label="Davr" className="segmented">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/analytics?d=${r}`}
              aria-current={r === range ? "page" : undefined}
              className="press tabular-nums"
              scroll={false}
            >
              {r} kun
            </Link>
          ))}
        </nav>
      </div>

      <dl className="materialize mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<Eye className="size-4" />} label="Ko'rishlar" value={report.totals.views} hint={`${range} kunda`} accent />
        <Stat icon={<Users className="size-4" />} label="Tashrifchilar" value={report.totals.visitors} hint="kunlik noyob" />
        <Stat icon={<CalendarDays className="size-4" />} label="Bugun" value={today?.views ?? 0} hint="ko'rishlar" />
        <Stat icon={<CalendarDays className="size-4" />} label="Bugun" value={today?.visitors ?? 0} hint="tashrifchilar" />
      </dl>

      <DailyChart key={range} days={report.days} />

      <div className="materialize-late mt-4 grid gap-4 md:grid-cols-2">
        <TopList title="Sahifalar" rows={report.paths} format={(p) => p} link />
        <TopList title="Manbalar" rows={report.referrers} format={(r) => (r === "direct" ? "To'g'ridan-to'g'ri" : r)} />
        <TopList title="Davlatlar" rows={report.countries} format={countryLabel} />
        <TopList title="Qurilmalar" rows={report.devices} format={(k) => deviceLabels[k] ?? k} />
        <TopList title="Brauzerlar" rows={report.browsers} format={(b) => b} />
      </div>

      <p className="mt-8 px-1 text-xs text-muted-2">
        Cookie ishlatilmaydi. Botlar va admin sifatida kirgan holdagi tashriflar hisobga olinmaydi. Vaqt — Toshkent.
      </p>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="group-card p-5">
      <dt className="flex items-center gap-2 text-sm text-muted">
        <span className={`grid size-7 place-items-center rounded-lg ${accent ? "bg-amber/15 text-amber" : "bg-white/[0.06]"}`}>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-3 font-display text-3xl font-bold leading-none tabular-nums tracking-tight">{nf.format(value)}</dd>
      {hint && <dd className="mt-1.5 text-xs text-muted-2">{hint}</dd>}
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
  const stagger = 360 / days.length;

  return (
    <section className="group-card materialize mt-4 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-semibold tracking-tight">Kunlik ko&apos;rishlar</h2>
        <p className="font-mono text-xs text-muted">eng ko&apos;p: {nf.format(max)}</p>
      </div>
      <div className="relative mt-6 h-48">
        {/* Recessive grid: halfway and top. */}
        <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dashed border-white/[0.06]" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/[0.06]" />
        <div className="relative flex h-full items-end gap-[2px] border-b border-white/10" role="img" aria-label="Kunlik ko'rishlar grafigi">
          {days.map((d, i) => (
            <div key={d.date} className="group relative flex h-full flex-1 items-end">
              <div
                className="bar w-full rounded-t-[4px] bg-gradient-to-t from-amber/60 to-amber transition-[filter,opacity] group-hover:brightness-110"
                style={{
                  height: d.views ? `max(${(d.views / max) * 100}%, 3px)` : 0,
                  animationDelay: `${Math.round(i * stagger)}ms`,
                }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-surface-2/90 px-3 py-2 text-xs shadow-[0_12px_32px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md group-hover:block">
                <p className="font-mono text-muted">{shortDate(d.date)}</p>
                <p className="mt-0.5">
                  <span className="font-semibold tabular-nums">{nf.format(d.views)}</span> ko&apos;rish ·{" "}
                  <span className="font-semibold tabular-nums">{nf.format(d.visitors)}</span> tashrifchi
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-[2px] font-mono text-[10px] text-muted-2">
        {days.map((d, i) => (
          <span key={d.date} className="flex-1 overflow-visible whitespace-nowrap">
            {(days.length - 1 - i) % labelEvery === 0 ? shortDate(d.date) : ""}
          </span>
        ))}
      </div>

      <details className="mt-5 text-sm">
        <summary className="press inline-flex cursor-pointer select-none rounded-full px-3 py-1.5 text-muted hover:bg-white/[0.06] hover:text-fg">
          Jadval ko&apos;rinishi
        </summary>
        <table className="mt-3 w-full font-mono text-xs">
          <thead className="text-left text-muted">
            <tr>
              <th className="py-1.5 font-normal">Sana</th>
              <th className="py-1.5 text-right font-normal">Ko&apos;rishlar</th>
              <th className="py-1.5 text-right font-normal">Tashrifchilar</th>
            </tr>
          </thead>
          <tbody>
            {[...days].reverse().map((d) => (
              <tr key={d.date} className="border-t border-white/[0.06]">
                <td className="py-1.5">{d.date}</td>
                <td className="py-1.5 text-right tabular-nums">{d.views}</td>
                <td className="py-1.5 text-right tabular-nums">{d.visitors}</td>
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
    <section className="group-card p-5">
      <h2 className="font-semibold tracking-tight">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Hali ma&apos;lumot yo&apos;q</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {rows.map(([key, n]) => (
            <li key={key} className="relative flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-sm">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-lg bg-amber/[0.09]"
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
