import { z } from "zod";
import { KATEGORI } from "@/lib/tipe";

export const SIFAT = ["Kritik", "Saran", "Keluhan", "Ide", "Inovasi", "Lainnya"] as const;

// Tahun sekarang mundur 6 tahun, menghasilkan array string untuk validasi
export function daftarAngkatan() {
  const t = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => String(t - i));
}

// Tambahkan "Yang Lain" ke dalam daftar opsi angkatan valid
const angkatanValid = [...daftarAngkatan(), "Yang Lain"];

export const skemaPengaduan = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  angkatan: z
    .string()
    .refine((a) => angkatanValid.includes(a), "Pilih angkatan yang valid"),
  kategori: z.enum(KATEGORI, { message: "Pilih kategori" }),
  sifat: z.enum(SIFAT, { message: "Pilih sifat pengaduan" }),
  sifat_lain: z.string().trim().max(100, "Keterangan maksimal 100 karakter").optional(),
  isi: z.string().trim().min(20, "Isi minimal 20 karakter").max(3000, "Isi maksimal 3000 karakter"),
}).superRefine((data, ctx) => {
  // Jika sifatnya 'Lainnya', sifat_lain wajib diisi
  if (data.sifat === "Lainnya" && (!data.sifat_lain || data.sifat_lain.length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sebutkan sifat pengaduan (min 3 karakter)",
      path: ["sifat_lain"],
    });
  }
});