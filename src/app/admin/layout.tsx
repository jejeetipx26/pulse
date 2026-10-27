import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/session";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Panel Admin | PULSE", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  return (
    <>
      {s.adminId && (
        <header className="sticky top-0 z-40 border-b border-aqua/70 bg-linear-to-r from-navy via-navy to-ocean text-white shadow-[0_4px_22px_rgba(23,155,194,0.45),0_0_14px_rgba(126,232,221,0.5)]">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
            <Link href="/admin" className="group flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain transition duration-500 group-hover:rotate-12 group-hover:drop-shadow-[0_0_10px_rgba(126,232,221,0.9)]" />
              <span className="font-bold">PULSE <span className="font-medium text-aqua">Admin</span></span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua text-sm font-bold text-navy shadow-[0_0_14px_rgba(126,232,221,0.7)]">
                  {(s.nama ?? "A").trim()[0]?.toUpperCase()}
                </span>
                <span className="hidden max-w-40 truncate text-sm text-white/85 sm:inline">{s.nama}</span>
              </div>
              <form action={logout}>
                <button className="flex min-h-10 items-center gap-2 rounded-full border border-white/40 px-4 text-sm transition duration-300 hover:bg-white hover:text-navy hover:shadow-[0_0_18px_rgba(126,232,221,0.8)] active:scale-95">
                  <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      {children}
    </>
  );
}
