"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Loader2,
  MessageSquare,
  AlertCircle,
  Star,
  User,
  Edit3,
  Trash2,
} from "lucide-react";
import { TestimonialItem } from "@/lib/testimonialsService";

interface TestimonialsTabProps {
  testimonials: TestimonialItem[];
  loading: boolean;
  error?: string;
  updatingId?: string | null;
  onAddNew: () => void;
  onEdit: (item: TestimonialItem) => void;
  onDelete: (item: TestimonialItem) => void;
  onToggleStatus: (item: TestimonialItem) => void;
}

export default function TestimonialsTab({
  testimonials,
  loading,
  error,
  updatingId,
  onAddNew,
  onEdit,
  onDelete,
  onToggleStatus,
}: TestimonialsTabProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all");

  const filteredTestimonials = useMemo(() => {
    if (filterStatus === "all") return testimonials;
    return testimonials.filter((t) => t.status === filterStatus);
  }, [testimonials, filterStatus]);

  const counts = useMemo(() => {
    return {
      all: testimonials.length,
      approved: testimonials.filter((t) => t.status === "approved").length,
      pending: testimonials.filter((t) => t.status === "pending").length,
    };
  }, [testimonials]);

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#20251f]">
            إدارة <span className="text-[#286b3c]">آراء العملاء</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#727970] mt-1">
            أضف آراء جديدة مباشرة، عدّل الآراء القائمة، أو راجع الآراء الواردة من زوار الموقع.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] hover:from-[#215730] hover:to-[#2e743f] text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(40,107,60,0.22)] hover:shadow-[0_8px_25px_rgba(40,107,60,0.32)] transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رأي عميل جديد</span>
        </button>
      </div>

      {/* Filter Tabs */}
      {testimonials.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-[#286b3c] text-white shadow-sm"
                : "bg-white text-[#626a60] hover:bg-[#eef5e9] border border-[#e2e8de]"
            }`}
          >
            <span>الكل ({counts.all})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("approved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "approved"
                ? "bg-[#286b3c] text-white shadow-sm"
                : "bg-white text-[#626a60] hover:bg-[#eef5e9] border border-[#e2e8de]"
            }`}
          >
            <span>منشور ({counts.approved})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "pending"
                ? "bg-[#286b3c] text-white shadow-sm"
                : "bg-white text-[#626a60] hover:bg-[#eef5e9] border border-[#e2e8de]"
            }`}
          >
            <span>بانتظار المراجعة ({counts.pending})</span>
          </button>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Testimonials Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#286b3c]" />
          <p className="text-xs text-[#727970] font-[family-name:var(--font-mono)]">
            جاري جلب آراء العملاء...
          </p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center bg-[#ffffff] border-2 border-dashed border-[#d8e2d5] rounded-3xl">
          <MessageSquare className="w-12 h-12 text-[#9bb098] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#20251f] mb-1">لا توجد آراء عملاء مضافة بعد</h3>
          <p className="text-xs text-[#727970] mb-4">
            يمكنك إضافة رأي عميل مباشرة لعرضه في شريط آراء العملاء بالصفحة الرئيسية.
          </p>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رأي عميل الآن</span>
          </button>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="p-10 text-center bg-[#ffffff] border border-[#e2e8de] rounded-3xl">
          <p className="text-sm font-bold text-[#20251f]">لا توجد آراء في هذا التصنيف حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white border-2 border-[#e2e8de] hover:border-[#39834c]/60 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_35px_rgba(32,58,36,0.08)] group"
            >
              <div className="space-y-3">
                {/* Rating & Status */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-1 text-amber-500"
                    aria-label={`${testimonial.rating} من 5 نجوم`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < testimonial.rating
                            ? "fill-amber-400 text-amber-500"
                            : "text-[#d1ded0]"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      testimonial.status === "approved"
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-amber-800 bg-amber-50 border border-amber-200"
                    }`}
                  >
                    {testimonial.status === "approved" ? "منشور" : "بانتظار المراجعة"}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-sm leading-relaxed text-[#353c33] font-medium min-h-[60px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author & Actions Footer */}
              <div className="space-y-3 pt-3 border-t border-[#edf2ea]">
                <div className="flex items-center gap-3">
                  {testimonial.image ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#cfe0c9] shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#eef5e9] border border-[#cfe0c9] flex items-center justify-center font-bold text-sm text-[#286b3c] shrink-0">
                      {testimonial.name ? (
                        testimonial.name.trim().charAt(0)
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-[#20251f] truncate">{testimonial.name}</p>
                    <p className="text-[11px] text-[#727970] truncate">
                      {testimonial.role ||
                        (testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString("ar-EG")
                          : "عميل")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    disabled={updatingId === testimonial.id}
                    onClick={() => onToggleStatus(testimonial)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors disabled:opacity-50 cursor-pointer ${
                      testimonial.status === "approved"
                        ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                    }`}
                  >
                    {testimonial.status === "approved" ? "إخفاء" : "نشر الرأي"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(testimonial)}
                      className="flex items-center gap-1 text-xs font-bold bg-[#eef5e9] hover:bg-[#286b3c] text-[#286b3c] hover:text-white px-3 py-1.5 rounded-xl border border-[#cfe0c9] hover:border-[#286b3c] transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === testimonial.id}
                      onClick={() => onDelete(testimonial)}
                      className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      title="حذف الرأي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
