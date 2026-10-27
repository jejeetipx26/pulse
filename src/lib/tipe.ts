export const STATUS = ["Dikirim", "Dibaca", "Diproses", "Selesai"] as const;
export type Status = (typeof STATUS)[number];

export const KATEGORI = ["Akademik", "Fasilitas", "Organisasi", "Keuangan", "Lainnya"] as const;
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
  Fasilitas: "bg-primary/15 text-ocean",
  Organisasi: "bg-sage/20 text-navy",
  Keuangan: "bg-gold/20 text-navy",
  Lainnya: "bg-sky/25 text-navy",
};
