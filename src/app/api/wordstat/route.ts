import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { extractKeywords } from "@/lib/tfidf-keyword"; // Pastikan path ini sesuai dengan file tfidf yang kita buat sebelumnya

export async function GET(request: Request) {
    
    const s = await getSession();
      if (!s.adminId) return new Response("Tidak diizinkan", { status: 401 });
    try {
        const { searchParams } = new URL(request.url);
        // Menggunakan param "kategori" (bisa disesuaikan jika kamu ingin menggunakan "category")
        const kategori = searchParams.get("kategori") || null;

        // 1. Ambil semua teks (isi) pengaduan dari DB menggunakan mysql2
        let query = "SELECT isi FROM pengaduan";
        const params: string[] = [];

        if (kategori) {
            query += " WHERE kategori = ?";
            params.push(kategori);
        }

        const [rows] = await db.query<RowDataPacket[]>(query, params);

        // Ekstrak kolom 'isi' dari setiap baris menjadi array of string
        const contents = rows.map((row) => String(row.isi));

        if (contents.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Tidak ada data pengaduan.",
            });
        }

        // 2. Ekstrak keyword dengan TF-IDF — tidak perlu fetch ke AI API
        const keywords = extractKeywords(contents, 60);

        if (keywords.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Tidak ada kata kunci yang dapat diekstrak.",
            });
        }

        return NextResponse.json({ success: true, data: keywords });

    } catch (error) {
        console.error("Wordcloud API error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "UNKNOWN",
                message: "Terjadi kesalahan server.",
            },
            { status: 500 }
        );
    }
}