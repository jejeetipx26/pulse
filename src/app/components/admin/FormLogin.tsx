"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { login } from "@/app/admin/actions";

const input =
  "w-full rounded-xl border border-sky/50 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_0_3px_rgba(23,155,194,0.25)]";

export default function FormLogin() {
  const [state, aksi, loading] = useActionState(login, undefined);
  const [lihat, setLihat] = useState(false);

  return (
    <form action={aksi} className="space-y-4">
      <label className="block text-sm font-semibold">
        Username
        <span className="relative mt-1.5 block">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
          <input name="username" autoComplete="username" required className={input} />
        </span>
      </label>
      <label className="block text-sm font-semibold">
        Password
        <span className="relative mt-1.5 block">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
          <input name="password" type={lihat ? "text" : "password"} autoComplete="current-password" required className={`${input} pr-12`} />
          <button type="button" onClick={() => setLihat(!lihat)} aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-navy/60 transition hover:bg-primary/10 hover:text-primary">
            {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {state?.error && <p role="alert" className="animate-fade-up rounded-xl bg-gold/15 px-4 py-2.5 text-sm">{state.error}</p>}
      <button disabled={loading} className="min-h-11 w-full rounded-full bg-linear-to-r from-primary to-ocean px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(126,232,221,0.9)] active:scale-95 disabled:opacity-60">
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}