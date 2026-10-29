import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#179bc2",
};

export const metadata: Metadata = {
  title: "PULSE | Aspirasi Mahasiswa BEM PSIK Universitas Sriwijaya",
  description:
    "Platform aspirasi dan pengaduan mahasiswa Program Studi Ilmu Keperawatan, Universitas Sriwijaya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-sans">
        <Navbar />
        {/* Tambahkan bg-aqua/70 (atau nilai opasitas lain) dan bg-blend-overlay */}
        <main className="min-h-screen bg-[url('/images/background.png')] bg-white/85 bg-blend-overlay bg-cover bg-center bg-no-repeat bg-fixed">
  {children}
</main>
        <Footer />
      </body>
    </html>
  );
}