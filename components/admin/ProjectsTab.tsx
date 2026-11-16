"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Loader2,
  Image as ImageIcon,
  FolderGit2,
  ExternalLink,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { ProjectItem } from "@/lib/projectsService";
import {
  PROJECT_CATEGORIES,
  ProjectCategoryKey,
  normalizeProjectCategory,
} from "@/components/Projects";

interface ProjectsTabProps {
  projects: ProjectItem[];
  loading: boolean;
  onAddNew: () => void;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
  onToggleHome: (project: ProjectItem) => Promise<void>;
  togglingHomeId?: string | null;
}

export default function ProjectsTab({
  projects,
  loading,
  onAddNew,
  onEdit,
  onDelete,
  onToggleHome,
  togglingHomeId,
}: ProjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectCategoryKey>("all");

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const catKey = normalizeProjectCategory(p.label);
      const matchesCat = activeCategory === "all" || catKey === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [projects, searchQuery, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: projects.length,
      mobile: projects.filter((p) => normalizeProjectCategory(p.label) === "mobile").length,
      web: projects.filter((p) => normalizeProjectCategory(p.label) === "web").length,
      branding: projects.filter((p) => normalizeProjectCategory(p.label) === "branding").length,
    };
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#20251f]">
            إدارة <span className="text-[#286b3c]">المشاريع</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#727970] mt-1">
            أضف، عدل، وارفع صور مشاريعك لعرضها في الموقع الرئيسي وصفحة المشاريع.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] hover:from-[#215730] hover:to-[#2e743f] text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(40,107,60,0.22)] hover:shadow-[0_8px_25px_rgba(40,107,60,0.32)] transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      {projects.length > 0 && (
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e2e8de] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8fa593] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المشروع أو الوصف..."
              className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2 pl-3 pr-10 text-xs sm:text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "bg-[#286b3c] text-white shadow-sm"
                  : "bg-[#f7f7f2] text-[#626a60] hover:bg-[#eef5e9]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل</span>
              <span className="text-[10px] opacity-80">({categoryCounts.all})</span>
            </button>

            {PROJECT_CATEGORIES.map((cat) => {
              const IconCmp = cat.Icon;
              const isSelected = activeCategory === cat.id;
              const count = categoryCounts[cat.id];
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#286b3c] text-white shadow-sm"
                      : "bg-[#f7f7f2] text-[#626a60] hover:bg-[#eef5e9]"
                  }`}
                >
                  <IconCmp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#286b3c]" />
          <p className="text-xs text-[#727970] font-[family-name:var(--font-mono)]">
            جاري جلب المشاريع من السيرفر...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-[#ffffff] border-2 border-dashed border-[#d8e2d5] rounded-3xl">
          <ImageIcon className="w-12 h-12 text-[#9bb098] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#20251f] mb-1">لا توجد مشاريع مضافة حتى الآن</h3>
          <p className="text-xs text-[#727970] mb-4">
            ابدأ بإضافة أول مشروع ليظهر لزوار موقع FameX.
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مشروع الآن</span>
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-10 text-center bg-[#ffffff] border border-[#e2e8de] rounded-3xl">
          <p className="text-sm font-bold text-[#20251f] mb-1">
            لا توجد مشاريع مطابقة لبحثك أو الفلتر المحدد
          </p>
          <p className="text-xs text-[#727970] mb-3">
            جرّب البحث بكلمات أخرى أو اختر قسماً مختلفاً.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs font-bold text-[#286b3c] hover:underline"
          >
            إعادة تعيين الفلتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProjects.map((p) => {
            const primaryImg = p.previewImage || (p.images && p.images[0]);
            const imageCount = p.images?.length || (p.previewImage ? 1 : 0);
            const isTogglingHome = togglingHomeId === p.id;

            return (
              <article
                key={p.id}
                className="bg-[#ffffff] border-2 border-[#e2e8de] hover:border-[#39834c]/60 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_10px_35px_rgba(32,58,36,0.08)] group"
              >
                {/* Image / Screen Preview */}
                <div className="relative aspect-[16/10] bg-[#101812] overflow-hidden border-b border-[#e2e8de]">
                  {primaryImg ? (
                    <>
                      {/* Ambient Blurred Aura */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <Image
                          src={primaryImg}
                          alt=""
                          fill
                          aria-hidden="true"
                          className="object-cover blur-2xl opacity-35 scale-125"
                        />
                      </div>
                      <Image
                        src={primaryImg}
                        alt={p.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#9db09a] gap-2">
                      <FolderGit2 className="w-8 h-8 opacity-60 text-[#39834c]" />
                      <span className="text-xs font-[family-name:var(--font-mono)] text-[#cfe0c9]">
                        {p.demoScreen ? `شاشة ديمو (${p.demoScreen})` : "لا توجد صورة"}
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {p.showOnHome && (
                      <span className="bg-[#286b3c] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                        الرئيسية
                      </span>
                    )}
                    <span className="bg-[#101812]/80 backdrop-blur text-white text-[10px] font-[family-name:var(--font-mono)] px-2.5 py-0.5 rounded-full border border-white/10">
                      {imageCount} {imageCount === 1 ? "صورة" : "صور"}
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#ffffff]/90 text-[#286b3c] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d8e2d5] shadow-sm">
                      #{p.order}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-extrabold text-[#286b3c] bg-[#eef5e9] px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                        {(() => {
                          const catKey = normalizeProjectCategory(p.label);
                          const cat =
                            PROJECT_CATEGORIES.find(
                              (c) => c.id === catKey || c.iconName === p.iconName
                            ) || PROJECT_CATEGORIES[0];
                          const IconCmp = cat.Icon;
                          return (
                            <>
                              <IconCmp className="w-3.5 h-3.5 text-[#286b3c]" />
                              <span>{cat.label}</span>
                            </>
                          );
                        })()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#20251f] group-hover:text-[#286b3c] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#727970] mt-1.5 line-clamp-2 leading-relaxed">
                      {p.description || "لا يوجد وصف مدخل."}
                    </p>
                  </div>

                  {/* Actions & Quick Toggles */}
                  <div className="pt-3 border-t border-[#edf2ea] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {/* Quick Home Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleHome(p)}
                        disabled={isTogglingHome}
                        title={
                          p.showOnHome
                            ? "المشروع معروض بالرئيسية (اضغط للإخفاء)"
                            : "المشروع مخفي من الرئيسية (اضغط للإظهار)"
                        }
                        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                          p.showOnHome
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-[#f7f7f2] text-[#8fa593] hover:text-[#20251f] hover:bg-[#eef5e9]"
                        }`}
                      >
                        {isTogglingHome ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : p.showOnHome ? (
                          <Eye className="w-3.5 h-3.5 text-[#286b3c]" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {p.showOnHome ? "بالرئيسية" : "مخفي"}
                        </span>
                      </button>

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#626a60] hover:text-[#286b3c] bg-[#f7f7f2] hover:bg-[#eef5e9] rounded-xl transition-colors"
                          title="رابط المشروع"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="flex items-center gap-1.5 text-xs font-bold bg-[#eef5e9] hover:bg-[#286b3c] text-[#286b3c] hover:text-white px-3.5 py-2 rounded-xl border border-[#cfe0c9] hover:border-[#286b3c] transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all cursor-pointer"
                        title="حذف المشروع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
