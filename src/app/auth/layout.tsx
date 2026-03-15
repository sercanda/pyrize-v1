"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { PyrizeLogo } from "@/components/ui/PyrizeLogo";

const slogans = [
  "Profesyonel emlak sunumları",
  "2 dakikada hazır",
  "AI destekli değerleme",
  "Müşterilerinizi etkileyin",
  "Portföyünüzü büyütün",
];

function RotatingSlogan() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 text-[#C9A96E]/70 text-lg tracking-wide"
        >
          {slogans[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#030822]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden items-center justify-center">
        {/* Aurora gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C9A96E]/[0.04] blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#57B6B2]/[0.04] blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#E8D5A3]/[0.03] blur-[80px] animate-pulse" style={{ animationDelay: "3s" }} />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />

        {/* Content */}
        <div className="relative z-10 px-12 lg:px-20 max-w-lg">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <PyrizeLogo variant="dark" className="h-12" />
          </Link>

          {/* Gold divider */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#C9A96E] to-transparent mb-8" />

          {/* Rotating slogans */}
          <RotatingSlogan />

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                2.500+
              </p>
              <p className="text-sm text-white/40 mt-1">Oluşturulan sunum</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                %94
              </p>
              <p className="text-sm text-white/40 mt-1">Müşteri memnuniyeti</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-16 border-l-2 border-[#C9A96E]/30 pl-6">
            <p className="text-white/60 text-sm italic leading-relaxed">
              &ldquo;PYRIZE ile sunumlarımı dakikalar içinde hazırlıyorum. Müşterilerim profesyonel görünümden çok etkileniyor.&rdquo;
            </p>
            <p className="text-[#C9A96E]/60 text-xs mt-3 tracking-wide uppercase">
              — Emlak Danışmanı
            </p>
          </div>
        </div>

        {/* Right edge gold gradient line */}
        <div className="absolute right-0 top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-[#C9A96E]/20 to-transparent" />
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center px-6 py-12 bg-[#020618] relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E]/[0.02] via-transparent to-[#57B6B2]/[0.02]" />
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
