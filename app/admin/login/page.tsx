"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="relative grid min-h-dvh place-items-center px-4">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <form
        action={action}
        className="group-card materialize relative w-full max-w-sm p-8 backdrop-blur-xl"
      >
        <span className="grid size-12 place-items-center rounded-[14px] bg-amber font-mono font-bold text-amber-ink shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_8px_24px_-8px_rgba(255,194,75,0.6)]">
          MB
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold leading-tight">Admin panel</h1>
        <p className="mt-1 text-sm text-muted">Davom etish uchun parolni kiriting</p>
        <label className="mt-7 block text-sm font-medium" htmlFor="password">
          Parol
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "password-error" : undefined}
          className="field"
        />
        {state?.error && (
          <p id="password-error" role="alert" className="mt-3 text-sm text-red-300">
            {state.error}
          </p>
        )}
        <button disabled={pending} className="press btn-primary mt-6 h-12 w-full">
          {pending ? "Tekshirilmoqda…" : "Kirish"}
        </button>
      </form>
    </div>
  );
}
