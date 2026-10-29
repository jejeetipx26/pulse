export const STATUS = ["Dikirim", "Dibaca", "Diproses", "Selesai"] as const;
export type Status = (typeof STATUS)[number];

export const KATEGORI = ["Akademik", "Fasilitas & Sarana Prasarana", "Dosen dan Tendik", "Pelayanan Administrasi Mahasiswa", "Transparansi Kebijakan Kampus", "Lingkungan dan Keamanan Kampus"] as const;
export type Kategori = (typeof KATEGORI)[number];

export const WARNA_STATUS: Record<Status, string> = {
  Dikirim: "bg-indigo",
  Dibaca: "bg-gold",
  Diproses: "bg-primary",
  Selesai: "bg-leaf",
};

export const BORDER_STATUS: Record<Status, string> = {
  Dikirim: "border-l-indigo",
  Dibaca: "border-l-gold",
  Diproses: "border-l-primary",
  Selesai: "border-l-leaf",
};

export const WARNA_KATEGORI: Record<Kategori, string> = {
  Akademik: "bg-indigo/15 text-indigo",
  "Fasilitas & Sarana Prasarana": "bg-primary/15 text-ocean",
  "Dosen dan Tendik": "bg-sage/20 text-navy",
  "Pelayanan Administrasi Mahasiswa": "bg-gold/20 text-navy",
  "Transparansi Kebijakan Kampus": "bg-sky/25 text-navy",
  "Lingkungan dan Keamanan Kampus": "bg-emerald/20 text-navy",
};
