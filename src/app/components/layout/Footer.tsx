import Image from "next/image";
import Link from "next/link";

// GANTI dengan kontak asli BEM PSIK
const kontak = {
  email: "arunadhirasahityacaksana@gmail.com",
  whatsapp: "https://wa.me/6282282015524",
  instagram: "https://www.instagram.com/bemkmikunsri?vrfl=eTR4MHBrdmp3MmZv",
  alamat: "Program Studi Ilmu Keperawatan, Universitas Sriwijaya",
};

const tautan = "transition hover:text-aqua hover:underline underline-offset-4";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-aqua/60 bg-linear-to-br from-navy via-navy to-ocean text-white shadow-[0_-4px_24px_rgba(23,155,194,0.35)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-5 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold">PULSE</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Platform aspirasi dan pengaduan mahasiswa yang dikelola BEM PSIK,
            Universitas Sriwijaya.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-aqua">Halaman</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-white/80">
            <li><Link href="/buat-pengaduan" className={tautan}>Buat Pengaduan</Link></li>
            <li><Link href="/cek-pengaduan" className={tautan}>Cek Pengaduan</Link></li>
            <li><Link href="/about" className={tautan}>About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-aqua">Kontak</h3>
          <ul className="mt-3 space-y-2.5 break-words text-sm text-white/80">
            <li>{kontak.email}</li>
            <li><a href={kontak.whatsapp} className={tautan}>WhatsApp BEM</a></li>
            <li><a href={kontak.instagram} className={tautan}>Instagram BEM</a></li>
            <li>{kontak.alamat}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} PULSE, BEM PSIK Universitas Sriwijaya
      </div>
    </footer>
  );
}