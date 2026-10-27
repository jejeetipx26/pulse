import { Check } from "lucide-react";
import { STATUS, WARNA_STATUS, type Status } from "@/lib/tipe";
import { tgl } from "@/lib/format";

type Riwayat = { status: Status; created_at: Date | string };

export default function StatusStepper({ riwayat }: { riwayat: Riwayat[] }) {
  const waktu = new Map(riwayat.map((r) => [r.status, r.created_at]));
  const sekarang = Math.max(...riwayat.map((r) => STATUS.indexOf(r.status)));

  return (
    <ol className="grid gap-5 sm:grid-cols-4 sm:gap-0">
      {STATUS.map((s, i) => {
        const w = waktu.get(s);
        const aktif = i === sekarang;
        const garis = i < sekarang ? WARNA_STATUS[STATUS[i + 1]] : "bg-sky/30";
        return (
          <li key={s} className="relative flex items-start gap-4 sm:block">
            {i < STATUS.length - 1 && (
              <span className={`absolute left-[3.25rem] right-0 top-5 hidden h-1 rounded-full sm:block ${garis}`} />
            )}
            <span
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition duration-300 ${
                w ? `${WARNA_STATUS[s]} text-white shadow-[0_0_16px_rgba(23,155,194,0.55)]` : "bg-sky/25 text-navy/40"
              } ${aktif ? "animate-pulse ring-4 ring-aqua/60" : ""}`}
            >
              {w && !aktif ? <Check size={18} /> : i + 1}
            </span>
            <span className="sm:mt-2 sm:block">
              <span className={`block text-sm font-semibold ${w ? "" : "text-navy/40"}`}>{s}</span>
              <span className="block text-xs text-navy/60">{w ? tgl(w) : "Belum"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}