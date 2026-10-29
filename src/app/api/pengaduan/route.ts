import type { ResultSetHeader } from "mysql2";
import { unlink } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { buatKode } from "@/lib/tracking";
import { skemaPengaduan } from "@/lib/validasi";
import { simpanLampiran, UPLOAD_DIR } from "@/lib/lampiran";
import { ambilIp, izinkan } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const fd = await req.formData();

  // honeypot: bot mengisi kolom tersembunyi, pura-pura sukses
  if (String(fd.get("website") ?? "")) return Response.json({ ok: true, kode: buatKode() });

  const hasil = skemaPengaduan.safeParse({
    nama: String(fd.get("nama") ?? ""),
    angkatan: String(fd.get("angkatan") ?? ""),
    kategori: String(fd.get("kategori") ?? ""),
    sifat: String(fd.get("sifat") ?? ""),
    // Jika sifat_lain kosong atau tidak ada, set ke undefined agar Zod optional bekerja
    sifat_lain: fd.get("sifat_lain") ? String(fd.get("sifat_lain")) : undefined,
    isi: String(fd.get("isi") ?? ""),
  });

  if (!hasil.success) {
    const fields: Record<string, string> = {};
    for (const i of hasil.error.issues) {
      const k = String(i.path[0]);
      if (!fields[k]) fields[k] = i.message;
    }
    return Response.json({ error: "Periksa kembali isianmu.", fields }, { status: 400 });
  }
  const d = hasil.data;

  if (!(await izinkan(`kirim:${ambilIp(req.headers)}`, 3, 3600))) {
    return Response.json({ error: "Terlalu banyak aduan dari perangkat ini. Coba lagi satu jam lagi." }, { status: 429 });
  }

  let namaFile: string | null = null;
  const f = fd.get("lampiran");
  if (f instanceof File && f.size > 0) {
    const s = await simpanLampiran(f);
    if (s.error) return Response.json({ error: s.error, fields: { lampiran: s.error } }, { status: 400 });
    namaFile = s.nama!;
  }

  let kode = "";
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    let id = 0;
    for (let i = 0; i < 5 && !id; i++) {
      kode = buatKode();
      try {
        const [r] = await c.query<ResultSetHeader>(
          // Pastikan ada 8 parameter (tracking_code, nama, angkatan, kategori, sifat, sifat_lain, isi, lampiran)
          "INSERT INTO pengaduan (tracking_code, nama, angkatan, kategori, sifat, sifat_lain, isi, lampiran) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          // Gunakan || null agar database MySQL benar-benar menerima nilai NULL jika sifat_lain kosong
          [kode, d.nama, d.angkatan, d.kategori, d.sifat, d.sifat_lain || null, d.isi, namaFile]
        );
        id = r.insertId;
      } catch (e) {
        if ((e as { code?: string }).code !== "ER_DUP_ENTRY") throw e;
      }
    }
    if (!id) throw new Error("Kode bentrok berulang");
    await c.query("INSERT INTO riwayat_status (pengaduan_id, status) VALUES (?, 'Dikirim')", [id]);
    await c.commit();
  } catch (e) {
    await c.rollback();
    console.error(e);
    if (namaFile) await unlink(path.join(UPLOAD_DIR, namaFile)).catch(() => {});
    return Response.json({ error: "Gagal menyimpan. Coba lagi." }, { status: 500 });
  } finally {
    c.release();
  }

  return Response.json({ ok: true, kode });
}