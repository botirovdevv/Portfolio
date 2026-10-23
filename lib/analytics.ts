import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebase-admin";

// Privacy-friendly, cookie-less analytics: one aggregate document per day
// (Tashkent time), so a 90-day report costs at most 90 reads.

const COLLECTION = "analytics_daily";
const TIME_ZONE = "Asia/Tashkent";

export type Device = "mobile" | "tablet" | "desktop";

export type ViewEvent = {
  path: string;
  referrer: string; // hostname or campaign source, "" for direct
  country: string; // ISO code, "" if unknown
  device: Device;
  browser: string;
  newVisitor: boolean;
};

type Counts = Record<string, number>;

export type DayStats = {
  date: string; // YYYY-MM-DD
  views: number;
  visitors: number;
};

export type AnalyticsReport = {
  days: DayStats[];
  totals: { views: number; visitors: number };
  paths: [string, number][];
  referrers: [string, number][];
  countries: [string, number][];
  devices: [string, number][];
  browsers: [string, number][];
};

export function dayKey(date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

// Firestore map keys are safe with set(merge), but dots/slashes read badly in the
// console and "__" prefixes are reserved — encode the few awkward characters.
const encodeKey = (key: string) => key.replace(/%/g, "%25").replace(/\./g, "%2E").replace(/^__/, "%5F%5F") || "(none)";
const decodeKey = (key: string) => key.replace(/%2E/g, ".").replace(/%5F/g, "_").replace(/%25/g, "%");

export async function recordView(event: ViewEvent) {
  const inc = FieldValue.increment(1);
  await getDb()
    .collection(COLLECTION)
    .doc(dayKey())
    .set(
      {
        views: inc,
        ...(event.newVisitor && { visitors: inc }),
        paths: { [encodeKey(event.path)]: inc },
        referrers: { [encodeKey(event.referrer || "direct")]: inc },
        countries: { [encodeKey(event.country || "??")]: inc },
        devices: { [event.device]: inc },
        browsers: { [encodeKey(event.browser || "Other")]: inc },
      },
      { merge: true },
    );
}

function merge(into: Counts, from: unknown) {
  if (!from || typeof from !== "object") return;
  for (const [k, v] of Object.entries(from as Counts)) {
    const key = decodeKey(k);
    into[key] = (into[key] ?? 0) + (Number(v) || 0);
  }
}

const sorted = (c: Counts, limit = 10) =>
  Object.entries(c)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

export async function getAnalytics(rangeDays: number): Promise<AnalyticsReport> {
  const keys: string[] = [];
  const now = Date.now();
  for (let i = rangeDays - 1; i >= 0; i--) keys.push(dayKey(new Date(now - i * 86_400_000)));

  const col = getDb().collection(COLLECTION);
  const snaps = await getDb().getAll(...keys.map((k) => col.doc(k)));

  const paths: Counts = {};
  const referrers: Counts = {};
  const countries: Counts = {};
  const devices: Counts = {};
  const browsers: Counts = {};
  const days: DayStats[] = [];

  snaps.forEach((snap, i) => {
    const d = snap.data() ?? {};
    days.push({ date: keys[i], views: d.views ?? 0, visitors: d.visitors ?? 0 });
    merge(paths, d.paths);
    merge(referrers, d.referrers);
    merge(countries, d.countries);
    merge(devices, d.devices);
    merge(browsers, d.browsers);
  });

  return {
    days,
    totals: {
      views: days.reduce((s, d) => s + d.views, 0),
      visitors: days.reduce((s, d) => s + d.visitors, 0),
    },
    paths: sorted(paths, 15),
    referrers: sorted(referrers),
    countries: sorted(countries),
    devices: sorted(devices),
    browsers: sorted(browsers),
  };
}
