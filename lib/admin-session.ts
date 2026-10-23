import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Server actions are public endpoints — every admin action re-checks the session. */
export async function requireAdmin() {
  await connection(); // session expiry and admin data depend on the current time
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");
}
