"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface Keyword {
  word: string;
  weight: number;
}

export default function WordCloud({ kategori }: { kategori?: string }) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWordCloud() {
      setLoading(true);
      setError(false);
      try {
        // UBAH BAGIAN INI: Sesuaikan dengan endpoint yang kamu buat (/api/wordstat)
        const url = kategori
          ? `/api/wordstat?kategori=${encodeURIComponent(kategori)}`
          : "/api/wordstat";
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Gagal mengambil data: ${res.status}`); // Tambahkan res.status agar error lebih jelas
        
        const json = await res.json();
        if (json.success) {
          setKeywords(json.data);
        } else {
          throw new Error(json.message);
        }
      } catch (err) {
        console.error("Fetch WordCloud Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWordCloud();
  }, [kategori]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-sky/40 bg-white/85">
        <Loader className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-sm text-red-600">
        Gagal memuat tren kata kunci.
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-sky/60 bg-white/70 text-sm text-navy/65">
        Tidak ada data kata kunci.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky/40 bg-white/85 p-5">
      <h3 className="mb-4 text-sm font-bold text-navy">
        Tren Kata Kunci {kategori ? `(${kategori})` : "(Semua Kategori)"}
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {keywords.map((kw, i) => {
          // Menentukan ukuran font berdasarkan weight (10 - 100)
          // Normalisasi dasar: font-size antara 0.75rem sampai 2rem
          const fontSize = 0.75 + (kw.weight / 100) * 1.25;
          // Memilih warna secara acak dari palet kamu agar tampilannya menarik
          const colors = ["text-primary", "text-ocean", "text-navy", "text-indigo", "text-gold"];
          const color = colors[i % colors.length];

          return (
            <span
              key={i}
              className={`inline-block font-semibold transition-transform hover:scale-110 ${color}`}
              style={{ fontSize: `${fontSize}rem`, opacity: 0.6 + (kw.weight / 100) * 0.4 }}
            >
              {kw.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}