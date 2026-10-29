import type { Metadata } from "next";
import FormPengaduan from "@/app/components/pengaduan/FormPengaduan";
import { daftarAngkatan } from "@/lib/validasi";

export const metadata: Metadata = { title: "Buat Pengaduan | PULSE" };

export default function BuatPengaduan() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-mint/60 blur-3xl" />
      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-14">
        <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">Buat pengaduan</h1>
        <p className="mt-3 animate-fade-up text-navy/75" style={{ animationDelay: "100ms" }}>
          Ceritakan keluhan, saran, atau kritikmu untuk BEM KM IK. Identitasmu cukup nama dan angkatan.
        </p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <FormPengaduan angkatan={daftarAngkatan()} />
        </div>
      </div>
    </section>
  );
}
