"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { ubahPengaduan } from "@/app/admin/actions";
import { STATUS, type Status } from "@/lib/tipe";

const input =
  "mt-1.5 w-full rounded-xl border border-sky/50 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_0_3px_rgba(23,155,194,0.25)]";

export default function FormTanggapan({ id, status, tanggapan }: { id: number; status: Status; tanggapan: string | null }) {
  const [state, aksi, loading] = useActionState(ubahPengaduan, undefined);
  const [teks, setTeks] = useState(tanggapan ?? "");
  const dariIni = STATUS.slice(STATUS.indexOf(status));

  return (
    <form action={aksi} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <label className="block text-sm font-semibold">
        Status
        <select name="status" defaultValue={status} className={input}>
          {dariIni.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Tanggapan untuk mahasiswa
        <textarea name="tanggapan" rows={6} maxLength={2000} value={teks} onChange={(e) => setTeks(e.target.value)} className={input} />
        <span className="mt-1 block text-right text-xs font-normal text-navy/55">{teks.length}/2000</span>
      </label>
      {state?.error && <p role="alert" className="animate-fade-up rounded-xl bg-gold/15 px-4 py-2.5 text-sm">{state.error}</p>}
      {state?.ok && <p role="status" className="animate-fade-up rounded-xl bg-leaf/15 px-4 py-2.5 text-sm">{state.ok}</p>}
      <button disabled={loading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-ocean px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(126,232,221,0.9)] active:scale-95 disabled:opacity-60">
        <Send size={16} /> {loading ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}