"use server";

import bcrypt from "bcryptjs";
import { unlink } from "fs/promises";
import path from "path";
import type { RowDataPacket } from "mysql2";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, requireAdmin } from "@/lib/session";
import { izinkan } from "@/lib/ratelimit";
import { UPLOAD_DIR } from "@/lib/lampiran";
import { STATUS, type Status } from "@/lib/tipe";

export type Hasil = { error?: string; ok?: string } | undefined;

export async function login(_: Hasil, fd: FormData): Promise<Hasil> {
  const username = String(fd.get("username") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  if (!username || !password) return { error: "Username dan password wajib diisi." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "lokal";
  if (!(await izinkan(`login:${ip}`, 5, 600))) {
    return { error: "Terlalu banyak percobaan. Coba lagi 10 menit lagi." };
  }

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, nama, password_hash FROM admin WHERE username = ? LIMIT 1",
    [username]
  );
  const admin = rows[0];
  // bandingkan hash walau user tidak ada, supaya waktu respons seragam
  const hash = admin?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
  const cocok = await bcrypt.compare(password, hash);
  if (!admin || !cocok) return { error: "Username atau password salah." };

  const s = await getSession();
  s.adminId = admin.id;
  s.nama = admin.nama;
  await s.save();
  redirect("/admin");
}

export async function logout() {
  const s = await getSession();
  s.destroy();
  redirect("/admin/login");
}

export async function ubahPengaduan(_: Hasil, fd: FormData): Promise<Hasil> {
  const { adminId } = await requireAdmin();
  const id = Number(fd.get("id"));
  const status = String(fd.get("status")) as Status;
  const tanggapan = String(fd.get("tanggapan") ?? "").trim();

  if (!Number.isInteger(id) || !STATUS.includes(status)) return { error: "Data tidak valid." };
  if (tanggapan.length > 2000) return { error: "Tanggapan maksimal 2000 karakter." };

  const [rows] = await db.query<RowDataPacket[]>("SELECT status FROM pengaduan WHERE id = ?", [id]);
  if (!rows[0]) return { error: "Aduan tidak ditemukan." };

  const lama = STATUS.indexOf(rows[0].status as Status);
  if (STATUS.indexOf(status) < lama) return { error: "Status tidak boleh mundur." };
  if (status === "Selesai" && !tanggapan) return { error: "Tanggapan wajib diisi sebelum Selesai." };

  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    await c.query("UPDATE pengaduan SET status = ?, tanggapan = ? WHERE id = ?", [status, tanggapan || null, id]);
    if (status !== rows[0].status) {
      await c.query("INSERT INTO riwayat_status (pengaduan_id, status, admin_id) VALUES (?, ?, ?)", [id, status, adminId]);
    }
    await c.commit();
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/pengaduan/${id}`);
  return { ok: "Perubahan tersimpan." };
}

export async function hapusPengaduan(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id)) return;

  const [rows] = await db.query<RowDataPacket[]>("SELECT lampiran FROM pengaduan WHERE id = ?", [id]);
  if (rows[0]) {
    // riwayat_status ikut terhapus otomatis (ON DELETE CASCADE)
    await db.query("DELETE FROM pengaduan WHERE id = ?", [id]);
    const f = rows[0].lampiran as string | null;
    if (f && /^[a-f0-9]{32}\.(jpg|png|webp)$/.test(f)) {
      await unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
    }
  }
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin?dihapus=1");
}
