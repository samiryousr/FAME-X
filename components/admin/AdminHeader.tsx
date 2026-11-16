"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  ExternalLink,
  LogOut,
  FolderGit2,
  MessageSquare,
  CheckCircle2,
  Phone,
} from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string | null;
  activeTab: "projects" | "testimonials" | "settings";
  projectsCount: number;
  testimonialsCount: number;
  pendingTestimonialsCount: number;
  statusMessage?: string;
  onTabChange: (tab: "projects" | "testimonials" | "settings") => void;
  onLogout: () => void;
}

export default function AdminHeader({
  userEmail,
  activeTab,
  projectsCount,
  testimonialsCount,
  pendingTestimonialsCount,
  statusMessage,
  onTabChange,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Navbar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#ffffff] border-2 border-[#e2e8de] rounded-2xl sm:rounded-3xl shadow-[0_4px_24px_rgba(32,58,36,0.05)]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wider font-[family-name:var(--font-pixel)] hover:opacity-90 transition-opacity"
            dir="ltr"
          >
            <Image
              src="/famex-symbol.svg"
              alt="FameX Logo"
              width={28}
              height={23}
              priority
              className="shrink-0"
            />
            <span>
              <span className="text-[#286b3c]">FAME</span>
              <span className="text-[#39a653]">X</span>
            </span>
          </Link>
          <span className="text-[#c5d1c2]">/</span>
          <span className="text-xs font-bold text-[#286b3c] bg-[#eef5e9] px-3 py-1 rounded-lg border border-[#cfe0c9]">
            لوحة الإدارة الذكية
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {userEmail && (
            <span className="text-xs text-[#727970] font-[family-name:var(--font-mono)] hidden md:inline-block">
              {userEmail}
            </span>
          )}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-[#286b3c] bg-[#eef5e9] hover:bg-[#e4ede0] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <Link
            href="/projects"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-[#286b3c] bg-[#eef5e9] hover:bg-[#e4ede0] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>المعرض</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </header>

      {/* Status Toast */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-sm flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav aria-label="أقسام لوحة التحكم" className="flex items-center gap-2 border-b-2 border-[#e2e8de] pb-3">
        <button
          type="button"
          onClick={() => onTabChange("projects")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === "projects"
              ? "bg-[#286b3c] text-white shadow-md shadow-[#286b3c]/20"
              : "bg-white text-[#727970] hover:text-[#20251f] hover:bg-[#eef5e9] border border-[#e2e8de]"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>المشاريع</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] ${
              activeTab === "projects" ? "bg-white/20 text-white" : "bg-[#eef5e9] text-[#286b3c]"
            }`}
          >
            {projectsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("testimonials")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === "testimonials"
              ? "bg-[#286b3c] text-white shadow-md shadow-[#286b3c]/20"
              : "bg-white text-[#727970] hover:text-[#20251f] hover:bg-[#eef5e9] border border-[#e2e8de]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>آراء العملاء</span>
          {testimonialsCount > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] ${
                activeTab === "testimonials" ? "bg-white/20 text-white" : "bg-[#eef5e9] text-[#286b3c]"
              }`}
            >
              {testimonialsCount}
            </span>
          )}
          {pendingTestimonialsCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
              {pendingTestimonialsCount} بانتظار المراجعة
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-[#286b3c] text-white shadow-md shadow-[#286b3c]/20"
              : "bg-white text-[#727970] hover:text-[#20251f] hover:bg-[#eef5e9] border border-[#e2e8de]"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>بيانات التواصل</span>
        </button>
      </nav>
    </div>
  );
}
