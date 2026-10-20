// Minimal single-admin session: an HMAC-signed expiry timestamp in an httpOnly cookie.
// Uses Web Crypto so it works in both proxy.ts and server actions.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET must be set (16+ chars)");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(sig).toString("base64url");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, await hmac(exp));
  } catch {
    return false;
  }
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMACs so timing doesn't leak the password length.
  return safeEqual(await hmac(`pw:${password}`), await hmac(`pw:${expected}`));
}
