import { after, userAgent, type NextRequest } from "next/server";
import { recordView, type Device } from "@/lib/analytics";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { isLocale } from "@/lib/i18n";

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch/i;
const PATH_RE = /^\/[\w\-/%]{0,200}$/;

// Receives page-view beacons from <Analytics /> (components/analytics.tsx).
export async function POST(request: NextRequest) {
  const ua = userAgent(request);
  if (!isFirebaseConfigured() || ua.isBot || BOT_RE.test(ua.ua) || !ua.ua) {
    return new Response(null, { status: 204 });
  }

  // The owner's own visits would skew the numbers.
  if (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    return new Response(null, { status: 204 });
  }

  let body: { path?: unknown; referrer?: unknown; source?: unknown; newVisitor?: unknown };
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.replace(/\/+$/, "") || "/" : "";
  if (!PATH_RE.test(path) || !isLocale(path.split("/")[1] ?? "")) {
    return new Response(null, { status: 400 });
  }

  const device: Device =
    ua.device.type === "mobile" ? "mobile" : ua.device.type === "tablet" ? "tablet" : "desktop";

  after(() =>
    recordView({
      path,
      referrer: referrerOf(body.source, body.referrer, request.nextUrl.hostname),
      country: (request.headers.get("x-vercel-ip-country") ?? "").slice(0, 2).toUpperCase(),
      device,
      browser: (ua.browser.name ?? "").slice(0, 40),
      newVisitor: body.newVisitor === true,
    }).catch((err) => console.error("[analytics] failed to record view", err)),
  );

  return new Response(null, { status: 204 });
}

function referrerOf(source: unknown, referrer: unknown, ownHost: string): string {
  // ?utm_source= / ?ref= wins: Telegram and most apps send no Referer header.
  if (typeof source === "string" && /^[\w.\-]{1,60}$/.test(source)) return source.toLowerCase();
  if (typeof referrer !== "string" || !referrer) return "";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    return host === ownHost.replace(/^www\./, "") ? "" : host.slice(0, 80);
  } catch {
    return "";
  }
}
