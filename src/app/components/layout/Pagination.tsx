"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function pindahHalaman(page: number) {
    // Salin parameter pencarian yang ada saat ini (status, kategori, q)
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    // Pindah ke halaman baru tanpa refresh penuh
    router.push(`?${params.toString()}`);
  }

  // Sembunyikan pagination jika data hanya 1 halaman
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-sky/40 bg-white/85 p-4 sm:justify-end">
      <span className="text-sm font-medium text-navy/70">
        Halaman <strong className="text-navy">{currentPage}</strong> dari {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => pindahHalaman(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/20 text-navy transition hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-sky/20 disabled:hover:text-navy"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => pindahHalaman(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/20 text-navy transition hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-sky/20 disabled:hover:text-navy"
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}