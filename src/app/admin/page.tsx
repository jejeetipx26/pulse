import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Eye,
  Inbox,
  Loader,
  Search,
  Send,
} from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { tgl } from "@/lib/format";
import {
  BORDER_STATUS,
  KATEGORI,
  STATUS,
  WARNA_KATEGORI,
  WARNA_STATUS,
  type Kategori,
  type Status,
} from "@/lib/tipe";
import StatusBadge from "@/app/components/pengaduan/StatusBadge";
import Reveal from "@/app/components/layout/Reveal";

const input =
  "min-h-11 rounded-xl border border-sky/50 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_0_3px_rgba(23,155,194,0.25)]";

const META = {
  Dikirim: { Icon: Send, tile: "bg-indigo/15 text-indigo" },
  Dibaca: { Icon: Eye, tile: "bg-gold/20 text-gold" },
  Diproses: { Icon: Loader, tile: "bg-primary/15 text-primary" },
  Selesai: { Icon: Check, tile: "bg-leaf/20 text-leaf" },
} as const;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kategori?: string; q?: string }>;
}) {
  const { nama } = await requireAdmin();
  const { status, kategori, q } = await searchParams;

  const where: string[] = [];
  const params: string[] = [];
  if (status && (STATUS as readonly string[]).includes(status)) {
    where.push("status = ?");
    params.push(status);
  }
  if (kategori && (KATEGORI as readonly string[]).includes(kategori)) {
    where.push("kategori = ?");
    params.push(kategori);
  }
  if (q?.trim()) {
    where.push("(nama LIKE ? OR judul LIKE ? OR tracking_code LIKE ?)");
    const k = `%${q.trim()}%`;
    params.push(k, k, k);
  }

  const [hitung] = await db.query<RowDataPacket[]>(
    "SELECT status, COUNT(*) AS n FROM pengaduan GROUP BY status",
  );
  const [daftar] = await db.query<RowDataPacket[]>(
    `SELECT id, tracking_code, nama, angkatan, kategori, judul, status, created_at
     FROM pengaduan ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY created_at DESC LIMIT 100`,
    params,
  );

  const jumlah = (s: Status) =>
    Number(hitung.find((h) => h.status === s)?.n ?? 0);
  const total = STATUS.reduce((t, s) => t + jumlah(s), 0);
  const baru = jumlah("Dikirim");

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
      {/* Sapaan */}
      <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-linear-to-r from-navy via-ocean to-primary p-6 text-white shadow-[0_18px_44px_rgba(28,84,138,0.4)] sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 animate-float rounded-full bg-aqua/30 blur-2xl" />
        <div
          className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 animate-float rounded-full bg-indigo/40 blur-2xl"
          style={{ animationDelay: "-3s" }}
        />
        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Halo, {nama}</h1>
          <p className="mt-2 text-white/90">
            {baru > 0
              ? `Ada ${baru} aduan baru yang belum dibaca.`
              : "Tidak ada aduan baru. Semua sudah dibaca."}
          </p>
          <span className="mt-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
            Total aduan: {total}
          </span>
        </div>
      </div>

      {/* Statistik */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATUS.map((s, i) => {
          const { Icon, tile } = META[s];
          const n = jumlah(s);
          const persen = total ? Math.round((n / total) * 100) : 0;
          return (
            <Reveal key={s} delay={i * 90} className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-sky/40 bg-white/85 p-4 transition duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_14px_34px_rgba(23,155,194,0.28)] sm:p-5">
                <span
                  className={`absolute inset-x-0 top-0 h-1.5 ${WARNA_STATUS[s]}`}
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile}`}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-xs font-semibold text-navy/55">
                    {persen}%
                  </span>
                </div>
                <p className="mt-3 text-3xl font-bold">{n}</p>
                <p className="text-sm text-navy/70">{s}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sky/20">
                  <div
                    className={`h-full rounded-full ${WARNA_STATUS[s]} transition-all duration-1000`}
                    style={{ width: `${persen}%` }}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Filter */}
      <form
        className="mt-6 rounded-2xl border border-sky/40 bg-white/85 p-3 sm:p-4"
        role="search"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <span className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama, judul, atau kode"
              className={`${input} w-full pl-10`}
            />
          </span>
          <select name="status" defaultValue={status ?? ""} className={input}>
            <option value="">Semua status</option>
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            name="kategori"
            defaultValue={kategori ?? ""}
            className={input}
          >
            <option value="">Semua kategori</option>
            {KATEGORI.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button className="min-h-11 rounded-full bg-linear-to-r from-primary to-ocean px-7 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(126,232,221,0.9)] active:scale-95">
            Terapkan
          </button>
        </div>
      </form>

      {/* Daftar */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">Pengaduan</h2>
        <span className="text-sm text-navy/60">
          {daftar.length} ditampilkan
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {daftar.length === 0 && (
          <li className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-sky/60 bg-white/70 p-10 text-center text-navy/65">
            <Inbox size={36} className="text-primary" />
            Tidak ada pengaduan yang cocok.
          </li>
        )}
        {daftar.map((p, i) => (
          <li key={p.id}>
            <Reveal delay={Math.min(i, 6) * 60}>
              <Link
                href={`/admin/pengaduan/${p.id}`}
                className={`group flex items-center gap-4 rounded-2xl border border-l-4 border-sky/40 bg-white/85 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_30px_rgba(23,155,194,0.25)] ${BORDER_STATUS[p.status as Status]}`}
              >
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white sm:flex">
                  {String(p.nama).trim()[0]?.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold">{p.judul}</p>
                  <p className="mt-1 text-xs text-navy/65">
                    {p.nama} (angkatan {p.angkatan}) · {tgl(p.created_at)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${WARNA_KATEGORI[p.kategori as Kategori]}`}
                    >
                      {p.kategori}
                    </span>
                    <span className="text-xs text-navy/50">
                      {p.tracking_code}
                    </span>
                  </div>
                </div>
                <StatusBadge status={p.status} />
                <ChevronRight
                  size={20}
                  className="hidden shrink-0 text-primary transition duration-300 group-hover:translate-x-1.5 sm:block"
                />
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
