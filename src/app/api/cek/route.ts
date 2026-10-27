import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { POLA_KODE } from "@/lib/tracking";
import { ambilIp, izinkan } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const kode = String(body?.kode ?? "").trim().toUpperCase();
  if (!POLA_KODE.test(kode)) {
    return Response.json({ error: "Format kode salah. Contoh: ASP-AB23CD45" }, { status: 400 });
  }

  if (!(await izinkan(`cek:${ambilIp(req.headers)}`, 10, 60))) {
    return Response.json({ error: "Terlalu banyak pengecekan. Tunggu sebentar." }, { status: 429 });
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, judul, kategori, isi, status, tanggapan, created_at, (lampiran IS NOT NULL) AS ada_lampiran
     FROM pengaduan WHERE tracking_code = ? LIMIT 1`,
    [kode]
  );
  const p = rows[0];
  if (!p) {
    return Response.json({ error: "Kode tidak ditemukan. Pastikan kode yang dimasukkan benar." }, { status: 404 });
  }

  const [riwayat] = await db.query<RowDataPacket[]>(
    "SELECT status, created_at FROM riwayat_status WHERE pengaduan_id = ? ORDER BY id",
    [p.id]
  );

  return Response.json({
    judul: p.judul,
    kategori: p.kategori,
    isi: p.isi,
    status: p.status,
    tanggapan: p.tanggapan,
    created_at: p.created_at,
    ada_lampiran: Boolean(p.ada_lampiran),
    riwayat,
  });
}
