import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

// true = boleh lanjut, false = kena batas
export async function izinkan(kunci: string, maks: number, detik: number) {
  await db.query("DELETE FROM rate_limit WHERE waktu < (NOW() - INTERVAL 1 DAY)");
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM rate_limit WHERE kunci = ? AND waktu > (NOW() - INTERVAL ? SECOND)",
    [kunci, detik]
  );
  if (Number(rows[0].n) >= maks) return false;
  await db.query("INSERT INTO rate_limit (kunci) VALUES (?)", [kunci]);
  return true;
}

// IP pengunjung. Di balik proxy hosting, header ini yang berisi IP asli.
export function ambilIp(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "lokal";
}
