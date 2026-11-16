"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, FolderGit2, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 text-center text-[#e5fbe6] font-[family-name:var(--font-digital)] selection:bg-[#a6f45d] selection:text-[#070d08]"
      dir="rtl"
    >
      <div className="max-w-2xl w-full flex flex-col items-center my-auto py-12">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111913]/90 border border-[#a6f45d]/25 shadow-[0_0_15px_rgba(166,244,93,0.15)] mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#a6f45d] animate-ping" />
          <span className="font-[family-name:var(--font-vt323)] text-sm text-[#a6f45d] tracking-widest" dir="ltr">
            [ ERROR // 404_PAGE_NOT_FOUND ]
          </span>
        </div>

        {/* 404 Digital Display & Mascot Area */}
        <div className="relative mb-6 flex flex-col items-center select-none">
          {/* Digital Display Container */}
          <div className="relative flex items-center justify-center" dir="ltr">
            {/* Faint unlit 888 background segments - authentic LCD / Digital Clock effect */}
            <span
              aria-hidden="true"
              className="absolute font-[family-name:var(--font-vt323)] text-[9.5rem] sm:text-[13rem] md:text-[15rem] leading-none tracking-[0.18em] text-[#a6f45d]/[0.06] select-none pointer-events-none"
            >
              888
            </span>

            {/* Glowing Active 404 Digital Digits */}
            <h1
              className="relative font-[family-name:var(--font-vt323)] text-[9.5rem] sm:text-[13rem] md:text-[15rem] leading-none tracking-[0.18em] font-normal text-[#a6f45d] drop-shadow-[0_0_35px_rgba(166,244,93,0.6)] select-none"
            >
              404
            </h1>
          </div>

          {/* Pixel Character Overlay */}
          <div className="relative -mt-16 sm:-mt-24 w-36 h-36 sm:w-44 sm:h-44 group cursor-pointer transition-transform duration-300 hover:scale-105">
            {/* Glowing Ring Beneath Mascot */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#a6f45d]/20 rounded-full blur-md animate-pulse" />
            <Image
              src="/characters/developer.png"
              alt="FameX Pixel Character"
              fill
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] filter"
              priority
            />
          </div>
        </div>

        {/* Humorous / Cyber Copy */}
        <div className="space-y-3 mb-8 max-w-lg px-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e5fbe6] leading-snug">
            دخلت في حيطة سد؟ <span className="text-[#a6f45d]">ولا يهمك.. إحنا بنفتح سكك!</span> 🛸
          </h2>
          <p className="text-xs sm:text-sm text-[#8fa593] leading-relaxed">
            الصفحة دي تاهت في السيرفرات، بس شغلنا مبيقفش.. دوس تحت ونرجعك للملعب الحقيقي فوراً!
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#a6f45d] hover:bg-[#bbf977] text-[#070d08] font-black text-sm shadow-[0_0_24px_rgba(166,244,93,0.3)] hover:shadow-[0_0_32px_rgba(166,244,93,0.5)] transition-all cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </Link>

          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0b140d]/80 hover:bg-[#122216] text-[#e5fbe6] hover:text-[#a6f45d] border border-[#a6f45d]/20 hover:border-[#a6f45d]/50 font-bold text-sm backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <FolderGit2 className="w-4 h-4 text-[#a6f45d]" />
            <span>استكشف المشاريع</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Retro Terminal Ping Bar */}
        <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#070d08]/70 border border-[#a6f45d]/10 font-[family-name:var(--font-mono)] text-[11px] text-[#6b826f] tracking-wide" dir="ltr">
          <Terminal className="w-3.5 h-3.5 text-[#a6f45d]" />
          <span>STATUS: PACKET_LOST // RE-ROUTING TO SAFETY: READY</span>
        </div>
      </div>
    </main>
  );
}
