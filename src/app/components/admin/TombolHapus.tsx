"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { hapusPengaduan } from "@/app/admin/actions";

export default function TombolHapus({ id }: { id: number }) {
  const [yakin, setYakin] = useState(false);
  const [proses, mulai] = useTransition();

  if (!yakin) {
    return (
      <button
        type="button"
        onClick={() => setYakin(true)}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-gold px-6 py-3 text-sm font-semibold text-navy transition duration-300 hover:-translate-y-0.5 hover:bg-gold/15 active:scale-95"
      >
        <Trash2 size={16} /> Hapus aduan
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-label="Konfirmasi hapus" className="animate-fade-up space-y-4">
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">Hapus aduan ini selamanya?</span> Riwayat status dan lampiran ikut terhapus. Tidak bisa dibatalkan.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={proses}
          onClick={() => mulai(async () => { await hapusPengaduan(id); })}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-red-700 active:scale-95 disabled:opacity-60"
        >
          <Trash2 size={16} /> {proses ? "Menghapus..." : "Ya, hapus"}
        </button>
        <button
          type="button"
          disabled={proses}
          onClick={() => setYakin(false)}
          className="min-h-11 flex-1 rounded-full border-2 border-sky/60 px-6 py-3 text-sm font-semibold transition duration-300 hover:bg-sky/15 active:scale-95"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
