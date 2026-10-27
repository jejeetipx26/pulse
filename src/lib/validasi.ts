import { z } from "zod";
import { KATEGORI } from "@/lib/tipe";

// tahun sekarang mundur 6 tahun
export function daftarAngkatan() {
  const t = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => t - i);
}

export const skemaPengaduan = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  angkatan: z.coerce
    .number()
    .refine((a) => daftarAngkatan().includes(a), "Pilih angkatan"),
  kategori: z.enum(KATEGORI, { message: "Pilih kategori" }),
  judul: z.string().trim().min(5, "Judul minimal 5 karakter").max(150, "Judul maksimal 150 karakter"),
  isi: z.string().trim().min(20, "Isi minimal 20 karakter").max(3000, "Isi maksimal 3000 karakter"),
});
