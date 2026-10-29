import Image from "next/image";
import Link from "next/link";
import { PenLine, Search, Info, KeyRound, Activity } from "lucide-react";
import type { RowDataPacket } from "mysql2";
import Reveal from "@/app/components/layout/Reveal";
import StatusBadge from "@/app/components/pengaduan/StatusBadge";
import { db } from "@/lib/db";
import { tgl } from "@/lib/format";
import { WARNA_KATEGORI, type Kategori, type Status } from "@/lib/tipe";

export const revalidate = 30;

type Terbaru = { id: number; judul: string; kategori: Kategori; status: Status; created_at: Date };

async function ambilData() {
  try {
    const [hitung] = await db.query<RowDataPacket[]>("SELECT status, COUNT(*) AS n FROM pengaduan GROUP BY status");
    const [terbaru] = await db.query<RowDataPacket[]>(
      "SELECT id, sifat, sifat_lain, kategori, status, created_at FROM pengaduan ORDER BY created_at DESC LIMIT 5"
    );
    const masuk = hitung.reduce((t, h) => t + Number(h.n), 0);
    const selesai = Number(hitung.find((h) => h.status === "Selesai")?.n ?? 0);
    return { statistik: { masuk, selesai }, terbaru: terbaru as Terbaru[] };
  } catch (e) {
    console.error(e);
    return { statistik: { masuk: 0, selesai: 0 }, terbaru: [] as Terbaru[] };
  }
}

const btn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:scale-95";
const kartu =
  "h-full rounded-2xl border border-sky/40 bg-white/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_14px_34px_rgba(23,155,194,0.28)]";

const akses = [
  { href: "/buat-pengaduan", label: "Buat Pengaduan", isi: "Sampaikan keluhan, saran, atau kritik.", tombol: "Tulis", Icon: PenLine, tone: "bg-primary/15 text-primary" },
  { href: "/cek-pengaduan", label: "Cek Pengaduan", isi: "Lihat status dengan kode pelacakan.", tombol: "Cek", Icon: Search, tone: "bg-sage/20 text-sage" },
  { href: "/about", label: "Tentang PULSE", isi: "Kenali platform dan BEM KM IK.", tombol: "Baca", Icon: Info, tone: "bg-indigo/15 text-indigo" },
];

const langkah = [
  { judul: "Tulis aspirasi", isi: "Isi nama, angkatan, kategori, lalu ceritakan masalahmu. Lampirkan gambar bila ada.", warna: "bg-primary" },
  { judul: "Simpan kode", isi: "Setelah terkirim, kamu mendapat kode pelacakan. Catat dan simpan baik-baik.", warna: "bg-gold" },
  { judul: "Pantau status", isi: "Masukkan kode di Cek Pengaduan untuk melihat aduanmu sudah dibaca atau diproses.", warna: "bg-indigo" },
  { judul: "Terima tanggapan", isi: "BEM KM IK menindaklanjuti dan menulis tanggapan yang bisa dibaca lewat kode yang sama.", warna: "bg-leaf" },
];

export default async function Beranda() {
  const { statistik, terbaru } = await ambilData();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-aqua/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-mint/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-5 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="animate-fade-up text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Sampaikan aspirasimu langsung ke BEM KM IK
            </h1>
            <p className="mt-5 max-w-md animate-fade-up text-base leading-relaxed text-navy/75 sm:text-lg" style={{ animationDelay: "120ms" }}>
              PULSE menampung keluhan dan saran mahasiswa Ilmu Keperawatan
              Universitas Sriwijaya, lalu memantau tindak lanjutnya sampai selesai.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <Link href="/buat-pengaduan" className={`${btn} bg-primary text-white hover:bg-ocean hover:shadow-[0_0_22px_rgba(126,232,221,0.9)]`}>
                Buat pengaduan
              </Link>
              <Link href="/cek-pengaduan" className={`${btn} border-2 border-primary text-primary hover:bg-primary hover:text-white`}>
                Cek status
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[17rem] animate-fade-up sm:max-w-sm md:max-w-md" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 animate-spin-slow rounded-full border-2 border-dashed border-sky/60" />
            <div className="absolute inset-0 animate-glow rounded-full bg-linear-to-br from-aqua via-primary to-ocean" />
            <div className="absolute inset-0 animate-float">
              <Image src="/images/hero.png" alt="Ilustrasi mahasiswa keperawatan" fill priority sizes="(max-width: 768px) 80vw, 448px" className="object-contain p-6" />
            </div>
            <div className="absolute left-0 top-6 flex animate-float items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold shadow-lg" style={{ animationDelay: "-2s" }}>
              <KeyRound size={16} className="text-gold" /> Kode pelacakan
            </div>
            <div className="absolute bottom-8 right-0 flex animate-float items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold shadow-lg" style={{ animationDelay: "-4s" }}>
              <Activity size={16} className="text-indigo" /> Status: Diproses
            </div>
          </div>
        </div>
      </section>

      {/* Akses cepat */}
      <section className="px-4 py-8 sm:px-5">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl bg-linear-to-br from-primary to-ocean p-6 text-white transition duration-300 hover:-translate-y-2 hover:shadow-[0_14px_34px_rgba(23,155,194,0.5)]">
              <p className="text-sm font-semibold">Aspirasi di PULSE</p>
              <p className="mt-4 text-4xl font-bold">{statistik.masuk}</p>
              <p className="text-sm text-white/85">masuk</p>
              <p className="mt-3 text-2xl font-bold text-aqua">{statistik.selesai}</p>
              <p className="text-sm text-white/85">selesai ditanggapi</p>
            </div>
          </Reveal>

          {akses.map(({ href, label, isi, tombol, Icon, tone }, i) => (
            <Reveal key={href} delay={(i + 1) * 100} className="h-full">
              <div className={`flex flex-col ${kartu}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={24} />
                </span>
                <h2 className="mt-4 text-base font-semibold">{label}</h2>
                <p className="mt-1 flex-1 text-sm text-navy/70">{isi}</p>
                <Link href={href} className={`${btn} mt-4 self-start bg-primary !py-2 text-white hover:bg-ocean`}>
                  {tombol}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cara kerja */}
      <section className="px-4 py-14 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Cara kerja PULSE</h2>
            <p className="mt-2 max-w-lg text-navy/70">Empat langkah dari menulis sampai menerima jawaban.</p>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {langkah.map((l, i) => (
              <Reveal key={l.judul} delay={i * 110} className="h-full">
                <li className={`group relative overflow-hidden ${kartu}`}>
                  <span className={`absolute inset-x-0 top-0 h-1.5 ${l.warna}`} />
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white transition duration-300 group-hover:scale-110 ${l.warna}`}>
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{l.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/70">{l.isi}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-10 pt-4 sm:px-5">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-linear-to-r from-navy via-ocean to-primary p-7 text-white shadow-[0_18px_44px_rgba(28,84,138,0.4)] md:flex-row md:items-center md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-float rounded-full bg-aqua/30 blur-2xl" />
            <div className="relative max-w-xl">
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Ada hal yang mengganjal di prodi?</h2>
              <p className="mt-2 text-white/90">Ceritakan sekarang. Identitasmu cukup nama dan angkatan, tanpa email.</p>
            </div>
            <Link href="/buat-pengaduan" className={`${btn} relative shrink-0 bg-white text-ocean hover:bg-mint hover:shadow-[0_0_24px_rgba(126,232,221,0.9)]`}>
              Mulai menulis
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
