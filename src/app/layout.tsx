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
    <html lang="id" className={poppins.variable} data-scroll-behavior="smooth">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
