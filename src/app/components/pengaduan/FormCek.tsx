"use client";

import { useEffect, useState } from "react";
import { Inbox, Lock, Paperclip, Search } from "lucide-react";
import { tgl } from "@/lib/format";
import { WARNA_KATEGORI, type Kategori, type Status } from "@/lib/tipe";
import { bacaAduan, type AduanLokal } from "@/lib/lokal";
import StatusBadge from "@/app/components/pengaduan/StatusBadge";
import StatusStepper from "@/app/components/pengaduan/StatusStepper";

type Hasil = {
  judul: string;
  kategori: Kategori;
  isi: string;
  status: Status;
  tanggapan: string | null;
  created_at: string;
  ada_lampiran: boolean;
  riwayat: { status: Status; created_at: string }[];
};

export default function FormCek({ awal }: { awal?: string }) {
  const [kode, setKode] = useState(awal ?? "");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lokal, setLokal] = useState<AduanLokal[]>([]);

  async function cari(k: string) {
    const bersih = k.trim().toUpperCase();
    if (!bersih || loading) return;
    setKode(bersih);
    setError("");
    setHasil(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode: bersih }),
      });
      const j = await res.json();
      if (!res.ok) setError(j.error ?? "Gagal memeriksa kode.");
      else setHasil(j);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLokal(bacaAduan());
    if (awal) cari(awal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          cari(kode);
        }}
        className="flex flex-col gap-3 rounded-3xl border border-sky/40 bg-white/90 p-4 shadow-[0_10px_40px_rgba(23,155,194,0.15)] sm:flex-row sm:p-5"
      >
        <span className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
          <input
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="ASP-XXXXXXXX"
            aria-label="Kode pelacakan"
            maxLength={12}
            className="min-h-12 w-full rounded-xl border border-sky/50 bg-white py-3 pl-11 pr-4 font-mono text-sm uppercase tracking-wider outline-none transition focus:border-primary focus:shadow-[0_0_0_3px_rgba(23,155,194,0.25)]"
          />
        </span>
        <button disabled={loading} className="min-h-12 rounded-full bg-linear-to-r from-primary to-ocean px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(126,232,221,0.9)] active:scale-95 disabled:opacity-60">
          {loading ? "Mencari..." : "Cek"}
        </button>
      </form>

      {error && <p role="alert" className="mt-4 animate-fade-up rounded-2xl bg-gold/15 px-5 py-3 text-sm">{error}</p>}

      {!hasil && lokal.length > 0 && (
        <div className="mt-6 animate-fade-up rounded-3xl border border-sky/40 bg-white/80 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold"><Inbox size={18} className="text-primary" /> Aduan di perangkat ini</h2>
          <ul className="mt-3 space-y-2">
            {lokal.map((a) => (
              <li key={a.kode}>
                <button onClick={() => cari(a.kode)} className="group flex w-full items-center justify-between gap-3 rounded-xl border border-sky/40 bg-white px-4 py-3 text-left transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_22px_rgba(23,155,194,0.2)]">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{a.judul}</span>
                    <span className="text-xs text-navy/55">{tgl(a.tanggal)}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-primary">{a.kode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasil && (
        <div className="mt-6 space-y-6">
          <div className="animate-fade-up rounded-3xl border border-sky/40 bg-white/90 p-5 shadow-[0_8px_30px_rgba(23,155,194,0.12)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="min-w-0 break-words text-xl font-bold sm:text-2xl">{hasil.judul}</h2>
              <StatusBadge status={hasil.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-navy/65">
              <span className={`rounded-full px-2.5 py-0.5 font-medium ${WARNA_KATEGORI[hasil.kategori]}`}>{hasil.kategori}</span>
              <span>Dikirim {tgl(hasil.created_at)}</span>
              <span className="font-mono">{kode}</span>
            </div>
            <div className="mt-5 rounded-2xl border-l-4 border-primary bg-primary/5 p-4">
              <p className="whitespace-pre-wrap break-words leading-relaxed">{hasil.isi}</p>
            </div>
            {hasil.ada_lampiran && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky/15 px-4 py-1.5 text-sm"><Paperclip size={15} /> Lampiran terkirim ke admin</p>
            )}
          </div>

          <div className="animate-fade-up rounded-3xl border border-sky/40 bg-white/90 p-5 sm:p-7" style={{ animationDelay: "120ms" }}>
            <h3 className="mb-5 text-lg font-bold">Perkembangan</h3>
            <StatusStepper riwayat={hasil.riwayat} />
          </div>

          <div className="animate-fade-up rounded-3xl border border-sky/40 bg-white/90 p-5 sm:p-7" style={{ animationDelay: "240ms" }}>
            <h3 className="text-lg font-bold">Tanggapan BEM PSIK</h3>
            {hasil.tanggapan ? (
              <div className="mt-4 rounded-2xl border-l-4 border-leaf bg-leaf/10 p-4">
                <p className="whitespace-pre-wrap break-words leading-relaxed">{hasil.tanggapan}</p>
              </div>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-sm text-navy/60"><Lock size={16} /> Belum ada tanggapan. Cek lagi nanti.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
