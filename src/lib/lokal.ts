// Simpan kode aduan di browser pengguna (localStorage). Hanya jalan di client.
const KEY = "pulse_aduan";

export type AduanLokal = { kode: string; judul: string; tanggal: string };

export function bacaAduan(): AduanLokal[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function simpanAduan(a: AduanLokal) {
  try {
    const daftar = bacaAduan().filter((x) => x.kode !== a.kode);
    daftar.unshift(a);
    localStorage.setItem(KEY, JSON.stringify(daftar.slice(0, 20)));
  } catch {
    /* abaikan */
  }
}
