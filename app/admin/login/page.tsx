"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="relative grid min-h-dvh place-items-center px-4">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <form action={action} className="relative w-full max-w-sm rounded-[20px] border border-line bg-surface p-8">
        <span className="grid size-12 place-items-center rounded-xl bg-amber font-mono font-bold text-amber-ink">
          MB
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold">Admin panel</h1>
        <p className="mt-1 text-sm text-muted">Davom etish uchun parolni kiriting</p>
        <label className="mt-6 block text-sm font-medium" htmlFor="password">
          Parol
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base outline-none transition focus:border-amber"
        />
        {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
        <button
          disabled={pending}
          className="mt-6 w-full rounded-xl bg-amber py-3 font-semibold text-amber-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Tekshirilmoqda…" : "Kirish"}
        </button>
      </form>
    </div>
  );
}
