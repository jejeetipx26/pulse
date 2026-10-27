"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/buat-pengaduan", label: "Buat Pengaduan" },
  { href: "/cek-pengaduan", label: "Cek Pengaduan" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-aqua/70 bg-white/90 shadow-[0_4px_22px_rgba(23,155,194,0.45),0_0_14px_rgba(126,232,221,0.55)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Logo PULSE"
            width={40}
            height={40}
            className="h-10 w-10 object-contain transition duration-500 group-hover:rotate-12 group-hover:drop-shadow-[0_0_10px_rgba(23,155,194,0.9)]"
          />
          <span className="text-xl font-bold text-primary">PULSE</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const aktif = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:text-primary hover:after:scale-x-100 ${
                  aktif
                    ? "font-semibold text-primary after:scale-x-100"
                    : "font-medium text-navy/75 after:scale-x-0"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-navy transition active:scale-90 md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="animate-fade-up border-t border-aqua/50 bg-white px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3 py-3 text-base ${
                pathname === l.href
                  ? "bg-primary/10 font-semibold text-primary"
                  : "font-medium text-navy/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
