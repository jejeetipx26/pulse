"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Download, ImagePlus, KeyRound, Send, X } from "lucide-react";
import { KATEGORI } from "@/lib/tipe";
import { simpanAduan } from "@/lib/lokal";
import { SIFAT } from "@/lib/validasi"; // Pastikan import enum SIFAT dari file zodsmu

const input =
  "mt-1.5 w-full rounded-xl border border-sky/50 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_0_3px_rgba(23,155,194,0.25)]";
const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:scale-95";
const MAKS = 2 * 1024 * 1024;

function Galat({ pesan }: { pesan?: string }) {
  return pesan ? (
    <span role="alert" className="mt-1 block animate-fade-up text-xs font-medium text-gold">
      {pesan}
    </span>
  ) : null;
}

// Komponen Sukses tidak perlu diubah, tetap sama seperti milikmu
function Sukses({ kode }: { kode: string }) {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(kode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = kode;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const sukses = document.execCommand("copy");
        textArea.remove();
        if (!sukses) throw new Error("Fallback gagal");
      }
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch (err) {
      console.error("Error salin:", err);
      alert("Gagal menyalin. Catat kodenya secara manual.");
    }
  }

  function unduh() {
    const b = new Blob(
      [`Kode pelacakan PULSE: ${kode}\nSimpan kode ini untuk memantau aduanmu di halaman Cek Pengaduan.\n`],
      { type: "text/plain" }
    );
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = `kode-${kode}.txt`;
    a.click();
    URL.revokeObjectURL(u);
  }

  return (
    <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-linear-to-br from-navy via-ocean to-primary p-6 text-center text-white shadow-[0_20px_50px_rgba(28,84,138,0.4)] sm:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 animate-float rounded-full bg-aqua/30 blur-2xl" />
      <span className="relative mx-auto flex h-16 w-16 animate-glow items-center justify-center rounded-full bg-aqua text-navy">
        <Check size={34} />
      </span>
      <h2 className="relative mt-5 text-2xl font-bold">Pengaduan berhasil dikirim</h2>
      <p className="relative mt-1 text-white/85">Ini kode pelacakanmu:</p>
      <p className="relative mx-auto mt-4 w-fit max-w-full break-all rounded-2xl border border-aqua/70 bg-white/10 px-5 py-4 font-mono text-2xl font-bold tracking-widest text-aqua shadow-[0_0_28px_rgba(126,232,221,0.5)] sm:text-4xl">
        {kode}
      </p>
      <p className="relative mx-auto mt-5 flex max-w-md items-start gap-2 rounded-2xl bg-gold/30 px-4 py-3 text-left text-sm">
        <KeyRound size={18} className="mt-0.5 shrink-0" />
        Simpan kode ini. Kode tidak bisa dipulihkan jika hilang.
      </p>
      <div className="relative mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={salin} className={`${btn} bg-white text-ocean hover:shadow-[0_0_22px_rgba(126,232,221,0.9)]`}>
          {tersalin ? <Check size={16} /> : <Copy size={16} />} {tersalin ? "Tersalin" : "Salin kode"}
        </button>
        <button onClick={unduh} className={`${btn} border border-white/60 hover:bg-white/15`}>
          <Download size={16} /> Unduh .txt
        </button>
      </div>
      <div className="relative mt-3 flex flex-wrap justify-center gap-3">
        <Link href={`/cek-pengaduan?kode=${kode}`} className={`${btn} bg-aqua text-navy hover:shadow-[0_0_22px_rgba(126,232,221,0.9)]`}>
          Cek pengaduan
        </Link>
        <Link href="/" className={`${btn} text-white/90 hover:bg-white/15`}>
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

// Ubah tipe angkatan menjadi string[]
export default function FormPengaduan({ angkatan }: { angkatan: string[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [kode, setKode] = useState("");
  const [berkas, setBerkas] = useState<File | null>(null);
  
  // State untuk melacak sifat (memunculkan sifat_lain jika diperlukan)
  const [sifatTerpilih, setSifatTerpilih] = useState("");
  const [isi, setIsi] = useState("");

  function pilihBerkas(f: File | undefined) {
    if (!f) return setBerkas(null);
    if (f.size > MAKS) {
      setFields((x) => ({ ...x, lampiran: "Ukuran lampiran maksimal 2 MB." }));
      return setBerkas(null);
    }
    setFields((x) => ({ ...x, lampiran: "" }));
    setBerkas(f);
  }

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setFields({});
    const fd = new FormData(e.currentTarget);
    if (berkas) fd.set("lampiran", berkas);
    else fd.delete("lampiran");

    setLoading(true);
    try {
      const res = await fetch("/api/pengaduan", { method: "POST", body: fd });
      if (res.status === 413) return setError("Ukuran data terlalu besar. Perkecil lampiran.");
      const j = await res.json();
      if (!res.ok) {
        setError(j.error ?? "Gagal mengirim.");
        setFields(j.fields ?? {});
        return;
      }
      
      // Simpan riwayat lokal: karena 'judul' dihapus, kita simpan tipe sifatnya untuk referensi
      const labelSifat = fd.get("sifat") === "Lainnya" ? fd.get("sifat_lain") : fd.get("sifat");
      simpanAduan({ kode: j.kode, judul: `Pengaduan: ${labelSifat}`, tanggal: new Date().toISOString() });
      
      setKode(j.kode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (kode) return <Sukses kode={kode} />;

  return (
    <form onSubmit={kirim} noValidate className="space-y-5 rounded-3xl border border-sky/40 bg-white/90 p-5 shadow-[0_10px_40px_rgba(23,155,194,0.15)] sm:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Nama lengkap/Inisial
          <input name="nama" required maxLength={100} autoComplete="name" className={input} />
          <Galat pesan={fields.nama} />
        </label>
        <label className="block text-sm font-semibold">
          Angkatan
          <select name="angkatan" required defaultValue="" className={input}>
            <option value="" disabled>Pilih angkatan</option>
            {angkatan.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value="Yang Lain">Yang Lain</option>
          </select>
          <Galat pesan={fields.angkatan} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Kategori
          <select name="kategori" required defaultValue="" className={input}>
            <option value="" disabled>Pilih kategori</option>
            {KATEGORI.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <Galat pesan={fields.kategori} />
        </label>

        <label className="block text-sm font-semibold">
          Sifat Pengaduan
          <select 
            name="sifat" 
            required 
            defaultValue="" 
            className={input}
            onChange={(e) => setSifatTerpilih(e.target.value)}
          >
            <option value="" disabled>Pilih sifat</option>
            {SIFAT.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Galat pesan={fields.sifat} />
        </label>
      </div>

      {/* Tampil hanya jika sifat == 'Lainnya' */}
      {sifatTerpilih === "Lainnya" && (
        <label className="block animate-fade-up text-sm font-semibold">
          Sebutkan sifat pengaduan
          <input name="sifat_lain" required maxLength={100} placeholder="Contoh: Permintaan data" className={input} />
          <Galat pesan={fields.sifat_lain} />
        </label>
      )}

      <label className="block text-sm font-semibold">
        Isi pengaduan
        <textarea name="isi" required rows={7} maxLength={3000} value={isi} onChange={(e) => setIsi(e.target.value)} className={input} />
        <span className="mt-1 block text-right text-xs font-normal text-navy/55">{isi.length}/3000</span>
        <Galat pesan={fields.isi} />
      </label>

      <div>
        <p className="text-sm font-semibold">Lampiran gambar <span className="font-normal text-navy/55">(opsional)</span></p>
        {berkas ? (
          <div className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-primary/50 bg-primary/5 px-4 py-3 text-sm">
            <span className="min-w-0 truncate">{berkas.name}</span>
            <button type="button" onClick={() => setBerkas(null)} aria-label="Hapus lampiran" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-navy/60 transition hover:bg-gold/20 hover:text-navy">
              <X size={18} />
            </button>
          </div>
        ) : (
          <label className="mt-1.5 flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sky/60 bg-sky/5 px-4 py-4 text-center text-sm text-navy/70 transition duration-300 hover:border-primary hover:bg-primary/5">
            <ImagePlus className="text-primary" size={24} />
            Pilih gambar (JPG, PNG, WebP, maks 2 MB)
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pilihBerkas(e.target.files?.[0])} />
          </label>
        )}
        <Galat pesan={fields.lampiran} />
      </div>

      {error && <p role="alert" className="animate-fade-up rounded-xl bg-gold/15 px-4 py-3 text-sm">{error}</p>}

      <button disabled={loading} className={`${btn} w-full bg-linear-to-r from-primary to-ocean text-white hover:shadow-[0_0_24px_rgba(126,232,221,0.9)] disabled:opacity-60`}>
        <Send size={16} /> {loading ? "Mengirim..." : "Kirim pengaduan"}
      </button>
    </form>
  );
}