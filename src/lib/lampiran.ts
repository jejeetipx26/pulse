import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";

// Folder penyimpanan di server. Atur UPLOAD_DIR di .env, bawaan ./uploads
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");
export const MAKS_BYTE = 2 * 1024 * 1024;
export const TIPE = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

// cek isi file (magic bytes), bukan percaya ekstensi dari pengguna
function deteksi(b: Buffer): keyof typeof TIPE | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export async function simpanLampiran(file: File): Promise<{ nama?: string; error?: string }> {
  if (file.size > MAKS_BYTE) return { error: "Ukuran lampiran maksimal 2 MB." };
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAKS_BYTE) return { error: "Ukuran lampiran maksimal 2 MB." };
  const ext = deteksi(buf);
  if (!ext) return { error: "Lampiran harus berupa gambar JPG, PNG, atau WebP." };

  await mkdir(UPLOAD_DIR, { recursive: true });
  const nama = `${randomBytes(16).toString("hex")}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, nama), buf);
  return { nama };
}
