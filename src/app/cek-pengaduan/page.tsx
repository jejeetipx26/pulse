import type { Metadata } from "next";
import FormCek from "@/app/components/pengaduan/FormCek";

export const metadata: Metadata = { title: "Cek Pengaduan | PULSE" };

export default async function CekPengaduan({ searchParams }: { searchParams: Promise<{ kode?: string }> }) {
  const { kode } = await searchParams;
  const awal = kode && /^ASP-[A-Z0-9]{8}$/i.test(kode) ? kode.toUpperCase() : undefined;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-aqua/40 blur-3xl" />
      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-14">
        <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">Cek pengaduan</h1>
        <p className="mt-3 animate-fade-up text-navy/75" style={{ animationDelay: "100ms" }}>
          Masukkan kode pelacakan untuk melihat status dan tanggapan BEM PSIK.
        </p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <FormCek awal={awal} />
        </div>
      </div>
    </section>
  );
}
