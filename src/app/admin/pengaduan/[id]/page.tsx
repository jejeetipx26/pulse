import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Hash, Paperclip, Tag, User } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { tgl } from "@/lib/format";
import { WARNA_KATEGORI, WARNA_STATUS, type Kategori, type Status } from "@/lib/tipe";
import StatusBadge from "@/app/components/pengaduan/StatusBadge";
import StatusStepper from "@/app/components/pengaduan/StatusStepper";
import FormTanggapan from "@/app/components/admin/FormTanggapan";
import Reveal from "@/app/components/layout/Reveal";

const panel = "rounded-3xl border border-sky/40 bg-white/90 p-5 shadow-[0_8px_30px_rgba(23,155,194,0.12)] sm:p-7";

export default async function DetailPengaduan({ params }: { params: Promise<{ id: string }> }) {
  const { adminId } = await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM pengaduan WHERE id = ?", [id]);
  const p = rows[0];
  if (!p) notFound();

  // buka detail pertama kali: Dikirim otomatis jadi Dibaca
  if (p.status === "Dikirim") {
    const c = await db.getConnection();
    try {
      await c.beginTransaction();
      await c.query("UPDATE pengaduan SET status = 'Dibaca' WHERE id = ? AND status = 'Dikirim'", [id]);
      await c.query("INSERT INTO riwayat_status (pengaduan_id, status, admin_id) VALUES (?, 'Dibaca', ?)", [id, adminId]);
      await c.commit();
      p.status = "Dibaca";
    } catch (e) {
      await c.rollback();
      throw e;
    } finally {
      c.release();
    }
  }

  const [riwayat] = await db.query<RowDataPacket[]>(
    "SELECT status, created_at FROM riwayat_status WHERE pengaduan_id = ? ORDER BY id",
    [id]
  );

  const meta = [
    { Icon: Hash, label: "Kode", nilai: p.tracking_code },
    { Icon: User, label: "Pengirim", nilai: `${p.nama}, angkatan ${p.angkatan}` },
    { Icon: Tag, label: "Kategori", nilai: p.kategori, chip: WARNA_KATEGORI[p.kategori as Kategori] },
    { Icon: Calendar, label: "Dikirim", nilai: tgl(p.created_at) },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
      <Link href="/admin" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={18} className="transition duration-300 group-hover:-translate-x-1.5" /> Kembali ke daftar
      </Link>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className={`relative animate-fade-up overflow-hidden ${panel}`}>
            <span className={`absolute inset-x-0 top-0 h-2 ${WARNA_STATUS[p.status as Status]}`} />
            <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
              <h1 className="min-w-0 break-words text-xl font-bold sm:text-2xl">{p.judul}</h1>
              <StatusBadge status={p.status} />
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {meta.map(({ Icon, label, nilai, chip }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-sky/10 p-3 transition duration-300 hover:bg-sky/20">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm"><Icon size={18} /></span>
                  <div className="min-w-0">
                    <dt className="text-xs text-navy/60">{label}</dt>
                    <dd className={`break-words text-sm font-semibold ${chip ? `inline-block rounded-full px-2.5 py-0.5 ${chip}` : ""}`}>{nilai}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-2xl border-l-4 border-primary bg-primary/5 p-4 sm:p-5">
              <p className="whitespace-pre-wrap break-words leading-relaxed">{p.isi}</p>
            </div>
            {p.lampiran && (
              <a href={`/api/lampiran/${p.lampiran}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white">
                <Paperclip size={16} /> Lihat lampiran
              </a>
            )}
          </div>

          <Reveal>
            <div className={panel}>
              <h2 className="mb-5 text-lg font-bold">Perkembangan</h2>
              <StatusStepper riwayat={riwayat as { status: Status; created_at: Date }[]} />
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:sticky lg:top-24">
          <div className={panel}>
            <h2 className="mb-5 text-lg font-bold">Ubah status dan tanggapi</h2>
            <FormTanggapan id={id} status={p.status} tanggapan={p.tanggapan} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
