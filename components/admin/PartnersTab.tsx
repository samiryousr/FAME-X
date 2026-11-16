"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Loader2,
  ExternalLink,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Handshake,
  Globe,
} from "lucide-react";
import type { Partner } from "@/lib/partnersService";

interface PartnersTabProps {
  partners: Partner[];
  loading: boolean;
  onAddNew: () => void;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onToggleHome: (partner: Partner) => Promise<void>;
  togglingHomeId?: string | null;
}

export default function PartnersTab({
  partners,
  loading,
  onAddNew,
  onEdit,
  onDelete,
  onToggleHome,
  togglingHomeId,
}: PartnersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.websiteUrl && p.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [partners, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Tab Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم الشركة أو الموقع..."
            className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#d5ded1] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl text-sm font-semibold text-[#20251f] placeholder:text-[#8d988b] transition-all outline-none"
          />
          <Search className="w-4 h-4 text-[#727970] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Add Partner Button */}
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#286b3c] hover:bg-[#1e522d] text-white rounded-xl text-sm font-extrabold shadow-md shadow-[#286b3c]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شريك جديد</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white border border-[#e2e8de] rounded-3xl">
          <Loader2 className="w-8 h-8 text-[#286b3c] animate-spin mb-3" />
          <p className="text-sm font-bold text-[#727970]">
            جاري تحميل قائمة الشركاء...
          </p>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white border border-[#e2e8de] rounded-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#eef5e9] border border-[#cfe0c9] flex items-center justify-center text-[#286b3c] mb-4">
            <Handshake className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#20251f] mb-1">
            {searchQuery ? "لم يتم العثور على نتائج" : "لا يوجد شركاء مسجلين حتى الآن"}
          </h3>
          <p className="text-xs sm:text-sm text-[#727970] max-w-sm mb-5 leading-relaxed">
            {searchQuery
              ? "جرّب البحث باسم شركة آخر أو امسح شريط البحث."
              : "ابدأ بإضافة أول شريك أو عميل ليظهر شعاره في الشريط المتحرك بالصفحة الرئيسية."}
          </p>
          {!searchQuery && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#286b3c] hover:bg-[#1e522d] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#286b3c]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول شريك</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPartners.map((partner) => {
            const isToggling = togglingHomeId === partner.id;

            return (
              <div
                key={partner.id}
                className="group relative flex flex-col bg-white border-2 border-[#e2e8de] hover:border-[#286b3c]/40 rounded-2xl p-4 shadow-[0_2px_12px_rgba(32,58,36,0.04)] hover:shadow-lg transition-all"
              >
                {/* Logo Display Box on dark backdrop */}
                <div className="relative w-full h-24 bg-[#09150d] rounded-xl p-3 flex items-center justify-center border border-[#1b3420] overflow-hidden mb-3">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={160}
                    height={64}
                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                  />
                  {/* Order Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-white/80">
                    #{partner.order}
                  </span>
                </div>

                {/* Partner Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-[#20251f] truncate mb-1">
                    {partner.name}
                  </h4>

                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#286b3c] hover:underline font-mono truncate max-w-full"
                    >
                      <Globe className="w-3 h-3 shrink-0" />
                      <span className="truncate">{partner.websiteUrl.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#a0aba0] font-mono">
                      بدون رابط موقع
                    </span>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#edf2ea]">
                  {/* Live Visibility Toggle Switch */}
                  <button
                    onClick={() => onToggleHome(partner)}
                    disabled={isToggling}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      partner.showOnHome
                        ? "bg-[#eef5e9] text-[#286b3c] hover:bg-[#e2edd9]"
                        : "bg-gray-100 text-[#727970] hover:bg-gray-200"
                    }`}
                    title={partner.showOnHome ? "ظاهر في الرئيسية (اضغط للإخفاء)" : "مخفي من الرئيسية (اضغط للإظهار)"}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : partner.showOnHome ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    <span>{partner.showOnHome ? "ظاهر" : "مخفي"}</span>
                  </button>

                  {/* Edit & Delete Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(partner)}
                      className="p-1.5 rounded-lg text-[#727970] hover:text-[#286b3c] hover:bg-[#eef5e9] transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(partner)}
                      className="p-1.5 rounded-lg text-[#727970] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
