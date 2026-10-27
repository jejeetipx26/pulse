"use client";

import { useEffect, useRef, useState } from "react";

// Konten selalu terlihat dulu (aman walau JavaScript belum jalan).
// Setelah JS aktif, hanya elemen di bawah layar yang disembunyikan lalu dimunculkan saat di-scroll.
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sembunyi, setSembunyi] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || el.getBoundingClientRect().top < window.innerHeight) return;

    setSembunyi(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSembunyi(false);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: sembunyi ? "0ms" : `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        sembunyi ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
