import type { Metadata } from "next";
import {
  FileText,
  Search,
  ShieldCheck,
  MessagesSquare,
  Mail,
  MessageCircle,
  AtSign,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Reveal from "@/app/components/layout/Reveal";

export const metadata: Metadata = { title: "About | PULSE" };

const kartu =
  "h-full rounded-2xl border border-sky/40 bg-white/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_14px_34px_rgba(23,155,194,0.28)]";

const singkatan = [
  {
    huruf: "P",
    arti: "Public",
    isi: "Terbuka untuk seluruh mahasiswa PSIK",
    tile: "bg-primary text-white",
    glow: "group-hover:shadow-[0_0_22px_rgba(23,155,194,0.95)]",
  },
  {
    huruf: "U",
    arti: "University",
    isi: "Wadah resmi di lingkungan Universitas Sriwijaya",
    tile: "bg-sage text-white",
    glow: "group-hover:shadow-[0_0_22px_rgba(99,153,118,0.95)]",
  },
  {
    huruf: "L",
    arti: "Listening",
    isi: "Setiap suara dibaca dan ditanggapi",
    tile: "bg-aqua text-navy",
    glow: "group-hover:shadow-[0_0_22px_rgba(126,232,221,0.95)]",
  },
  {
    huruf: "S",
    arti: "Student",
    isi: "Dari mahasiswa, untuk mahasiswa",
    tile: "bg-gold text-white",
    glow: "group-hover:shadow-[0_0_22px_rgba(164,132,36,0.95)]",
  },
  {
    huruf: "E",
    arti: "Expression",
    isi: "Bebas menyampaikan keluhan, saran, dan kritik",
    tile: "bg-indigo text-white",
    glow: "group-hover:shadow-[0_0_22px_rgba(36,60,156,0.95)]",
  },
];

const fitur = [
  {
    Icon: FileText,
    judul: "Form terstruktur",
    isi: "Pilih kategori, tulis judul dan isi, lalu lampirkan gambar sebagai bukti bila perlu.",
    tone: "bg-primary/15 text-primary",
  },
  {
    Icon: Search,
    judul: "Lacak dengan kode",
    isi: "Setiap aduan mendapat kode unik untuk memantau perkembangannya.",
    tone: "bg-sage/20 text-sage",
  },
  {
    Icon: ShieldCheck,
    judul: "Identitas minimal",
    isi: "Hanya nama dan angkatan. Tidak ada email, tidak ada akun.",
    tone: "bg-indigo/15 text-indigo",
  },
  {
    Icon: MessagesSquare,
    judul: "Dijawab BEM",
    isi: "Admin BEM PSIK membaca, memproses, dan menulis tanggapan untuk tiap aduan.",
    tone: "bg-gold/20 text-gold",
  },
];

const status = [
  {
    nama: "Dikirim",
    isi: "Aduan baru masuk dan belum dibaca.",
    warna: "bg-indigo",
  },
  { nama: "Dibaca", isi: "Admin BEM sudah membuka aduanmu.", warna: "bg-gold" },
  {
    nama: "Diproses",
    isi: "Aduan sedang ditindaklanjuti.",
    warna: "bg-primary",
  },
  { nama: "Selesai", isi: "Aduan sudah ditanggapi.", warna: "bg-leaf" },
];

const faq = [
  {
    t: "Siapa yang bisa melihat nama saya?",
    j: "Nama dan angkatan hanya terlihat oleh admin BEM PSIK. Daftar aduan di halaman publik tidak menampilkan nama.",
  },
  {
    t: "Kode pelacakan saya hilang, bagaimana?",
    j: "Kode dapat disalin atau mengunduh file teks.",
  },
  {
    t: "Siapa yang menanggapi aduan saya?",
    j: "Pengurus BEM PSIK yang bertanggung jawab sesuai kategori aduan.",
  },
  {
    t: "Boleh melampirkan bukti?",
    j: "Boleh. Unggah satu gambar (JPG, PNG, atau WebP) dengan ukuran maksimal 2 MB.",
  },
];

// GANTI dengan kontak asli BEM PSIK
const kontak = [
  {
    Icon: Mail,
    label: "Email",
    nilai: "arunadhirasahityacaksana@gmail.com",
    tone: "bg-primary/15 text-primary",
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    nilai: "+62 822-8201-5524",
    tone: "bg-leaf/20 text-leaf",
  },
  {
    Icon: AtSign,
    label: "Instagram",
    nilai: "@bemkmikunsri",
    tone: "bg-indigo/15 text-indigo",
  },
  {
    Icon: MapPin,
    label: "Alamat",
    nilai: "Program Studi Ilmu Keperawatan, Universitas Sriwijaya",
    tone: "bg-gold/20 text-gold",
  },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-aqua/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-5 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <h1 className="animate-fade-up text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Tentang PULSE
            </h1>
            <p
              className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-navy/80 sm:text-lg text-justify"
              style={{ animationDelay: "120ms" }}
            >
              PULSE merupakan media berbasis website yang menjadi jembatan
              komunikasi antara mahasiswa dan BEM dalam menyampaikan aspirasi,
              keluhan, serta permasalahan di lingkungan kampus. Setiap laporan
              akan ditampung dan ditindaklanjuti melalui mekanisme advokasi BEM,
              mulai dari ketua bagian hingga tingkat dekanat, demi mewujudkan
              lingkungan kampus yang lebih responsif dan berpihak pada
              mahasiswa.
            </p>
            <div
              className="mt-6 flex animate-fade-up flex-wrap gap-2.5 text-sm font-medium"
              style={{ animationDelay: "240ms" }}
            >
              <span className="rounded-full bg-primary/15 px-4 py-1.5 text-ocean">
                Dikelola BEM PSIK
              </span>
              <span className="rounded-full bg-sage/20 px-4 py-1.5 text-navy">
                Tanpa email
              </span>
              <span className="rounded-full bg-gold/20 px-4 py-1.5 text-navy">
                Bisa dilacak
              </span>
            </div>
          </div>

          {/* Kartu arti PULSE */}
          <div
            className="relative animate-fade-up overflow-hidden rounded-3xl bg-linear-to-br from-navy via-ocean to-indigo p-5 text-white shadow-[0_22px_55px_rgba(20,33,67,0.4)] sm:p-8"
            style={{ animationDelay: "200ms" }}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 animate-float rounded-full bg-aqua/30 blur-2xl" />
            <div
              className="pointer-events-none absolute -bottom-14 -left-10 h-44 w-44 animate-float rounded-full bg-primary/40 blur-2xl"
              style={{ animationDelay: "-3s" }}
            />
            <div className="relative">
              <p className="text-sm font-semibold text-aqua">Arti nama PULSE</p>
              <ul className="mt-4 space-y-1.5">
                {singkatan.map((s) => (
                  <li
                    key={s.huruf}
                    className="group flex items-center gap-4 rounded-2xl p-2.5 transition duration-300 hover:translate-x-2 hover:bg-white/10"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-bold transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${s.tile} ${s.glow}`}
                    >
                      {s.huruf}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold">
                        {s.arti}
                      </span>
                      <span className="block text-sm leading-snug text-white/75">
                        {s.isi}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Yang kamu dapat di PULSE
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fitur.map(({ Icon, judul, isi, tone }, i) => (
              <Reveal key={judul} delay={i * 100} className="h-full">
                <div className={`group ${kartu}`}>
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${tone}`}
                  >
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/70">
                    {isi}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Arti status aduan
            </h2>
            <p className="mt-2 max-w-lg text-navy/70">
              Status berubah sesuai tindak lanjut admin dan hanya bergerak maju.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {status.map((s, i) => (
              <Reveal key={s.nama} delay={i * 100} className="h-full">
                <div className={`relative overflow-hidden ${kartu}`}>
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${s.warna}`}
                  />
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${s.warna}`}
                  >
                    {s.nama}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-navy/75">
                    {s.isi}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEM PSIK */}
      <section className="px-4 py-12 sm:px-5">
        <Reveal className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-linear-to-br from-mint to-aqua/60 p-7 shadow-[0_16px_40px_rgba(99,153,118,0.3)] sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">BEM PSIK</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-navy/85">
              Badan Eksekutif Mahasiswa Program Studi Ilmu Keperawatan adalah
              organisasi mahasiswa yang menjadi penghubung antara mahasiswa dan
              pihak prodi.{" "}
              {/* GANTI: tulis profil singkat dan nama kabinet BEM */}
            </p>
          </div>
        </Reveal>
      </section>

      {/* FAQ + Kontak */}
      <section
        id="kontak"
        className="scroll-mt-24 overflow-hidden px-4 py-12 sm:px-5"
      >
        <div className="mx-auto w-full max-w-6xl grid gap-12 md:grid-cols-2">
          {/* Kolom Kiri: FAQ */}
          <div className="min-w-0">
            {" "}
            {/* Mencegah elemen memanjang ke luar */}
            <h2 className="text-2xl font-bold sm:text-3xl">Pertanyaan umum</h2>
            <div className="mt-6 space-y-3">
              {faq.map((f) => (
                <details
                  key={f.t}
                  className="group rounded-2xl border border-sky/40 bg-white/80 px-5 py-4 transition duration-300 hover:border-primary open:border-primary open:shadow-[0_8px_24px_rgba(23,155,194,0.2)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                    <span className="break-words flex-1 pr-4">{f.t}</span>{" "}
                    {/* Ditambahkan flex-1 dan break-words */}
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-primary transition duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-navy/75 break-words">
                    {f.j}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Hubungi Kami */}
          <div className="min-w-0">
            {" "}
            {/* Mencegah elemen memanjang ke luar */}
            <h2 className="text-2xl font-bold sm:text-3xl">Hubungi kami</h2>
            <div className="mt-6 space-y-3">
              {kontak.map(({ Icon, label, nilai, tone }) => (
                <div
                  key={label}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-sky/40 bg-white/80 p-4 transition duration-300 hover:translate-x-2 hover:border-primary hover:shadow-[0_8px_24px_rgba(23,155,194,0.2)]"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 ${tone}`}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    {" "}
                    {/* Memaksa teks patuh pada batas lebar */}
                    <p className="text-xs font-semibold text-ocean">{label}</p>
                    <p className="break-words text-sm text-navy/85">{nilai}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
