"use client";

import { FolderGit2, Home, Globe, Star } from "lucide-react";

interface AdminStatsProps {
  totalProjects: number;
  homeProjects: number;
  liveProjects: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  averageRating: number;
}

export default function AdminStats({
  totalProjects,
  homeProjects,
  liveProjects,
  approvedTestimonials,
  averageRating,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Total Projects */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8de] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#727970]">إجمالي المشاريع</p>
          <h4 className="text-xl sm:text-2xl font-black text-[#20251f] mt-1 font-[family-name:var(--font-mono)]">
            {totalProjects}
          </h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#eef5e9] text-[#286b3c] flex items-center justify-center shrink-0">
          <FolderGit2 className="w-5 h-5" />
        </div>
      </div>

      {/* Home Projects */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8de] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#727970]">شاشة الرئيسية</p>
          <h4 className="text-xl sm:text-2xl font-black text-[#286b3c] mt-1 font-[family-name:var(--font-mono)]">
            {homeProjects}
          </h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Home className="w-5 h-5" />
        </div>
      </div>

      {/* Live Projects */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8de] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#727970]">مشاريع لايف (LIVE)</p>
          <h4 className="text-xl sm:text-2xl font-black text-[#0284c7] mt-1 font-[family-name:var(--font-mono)]">
            {liveProjects}
          </h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5" />
        </div>
      </div>

      {/* Approved Testimonials */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8de] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-xs font-bold text-[#727970]">آراء العملاء المعتمدة</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-xl sm:text-2xl font-black text-[#f59e0b] font-[family-name:var(--font-mono)]">
              {approvedTestimonials}
            </h4>
            {averageRating > 0 && (
              <span className="text-[11px] font-bold text-[#727970] flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{averageRating.toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
