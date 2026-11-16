"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  X,
  AlertCircle,
  UploadCloud,
  Loader2,
  Trash2,
  Star,
  User,
  Save,
} from "lucide-react";

interface TestimonialModalProps {
  isOpen: boolean;
  editingId: string | null;
  name: string;
  setName: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  quote: string;
  setQuote: (v: string) => void;
  rating: number;
  setRating: (v: number) => void;
  image: string;
  setImage: (v: string) => void;
  status: "approved" | "pending";
  setStatus: (v: "approved" | "pending") => void;
  uploadingAvatar: boolean;
  saving: boolean;
  formError: string;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export default function TestimonialModal({
  isOpen,
  editingId,
  name,
  setName,
  role,
  setRole,
  quote,
  setQuote,
  rating,
  setRating,
  image,
  setImage,
  status,
  setStatus,
  uploadingAvatar,
  saving,
  formError,
  onAvatarUpload,
  onSave,
  onClose,
}: TestimonialModalProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-[#e2e8de] my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2ea] mb-5">
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#727970] hover:text-[#20251f] rounded-xl hover:bg-[#f7f7f2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-right">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#20251f]">
              {editingId ? "تعديل رأي العميل" : "إضافة رأي عميل جديد"}
            </h2>
            <p className="text-xs text-[#727970] mt-0.5">
              أدخل بيانات العميل وتقييمه ورأيه لعرضه في قسم آراء العملاء بالموقع
            </p>
          </div>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSave} className="space-y-4">
          {/* Client Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                اسم العميل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="مثال: م/ كريم عبد العزيز"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                الوظيفة / اسم المشروع أو الشركة
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="مثال: مؤسس متجر فاشون / صاحب شركة"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
              />
            </div>
          </div>

          {/* Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-1.5">
              التقييم (النجوم)
            </label>
            <div className="flex items-center gap-2 bg-[#fdfdfc] border border-[#d8e2d5] rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-500"
                          : "text-[#d1ded0]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#286b3c] mr-3">
                {rating} من 5 نجوم
              </span>
            </div>
          </div>

          {/* Quote / Review Text */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-1.5">
              نص رأي العميل <span className="text-red-500">*</span>
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={4}
              required
              placeholder="اكتب تجربة ورأي العميل بالتفصيل..."
              className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] resize-none"
            />
          </div>

          {/* Avatar Upload / URL */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-1.5">
              صورة العميل (اختياري)
            </label>
            <div className="flex items-center gap-3">
              {image ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#286b3c] shrink-0">
                  <Image src={image} alt="صورة العميل" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#f7f7f2] border-2 border-dashed border-[#d8e2d5] flex items-center justify-center shrink-0 text-[#9bb098]">
                  <User className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#eef5e9] hover:bg-[#e4ede0] text-[#286b3c] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>رفع صورة من الجهاز</span>
                      </>
                    )}
                  </button>

                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  dir="ltr"
                  placeholder="أو الصق رابط صورة خارجي مباشرة..."
                  className="w-full bg-[#fdfdfc] border border-[#d8e2d5] rounded-xl py-2 px-3 text-xs text-[#20251f] outline-none placeholder:text-[#a0aaa0] text-left"
                />
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex items-center justify-between p-3.5 bg-[#f7f7f2] border border-[#e2e8de] rounded-2xl">
            <div className="text-right">
              <p className="text-xs font-extrabold text-[#20251f]">حالة النشر في الموقع</p>
              <p className="text-[11px] text-[#727970] mt-0.5">
                عند اختيار &quot;معتمد ومنشور&quot;، سيظهر رأي العميل فوراً في الصفحة الرئيسية.
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "approved" | "pending")}
              className="bg-white border border-[#d8e2d5] rounded-xl py-2 px-3 text-xs font-bold text-[#20251f] outline-none"
            >
              <option value="approved">معتمد ومنشور</option>
              <option value="pending">بانتظار المراجعة (مخفي)</option>
            </select>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#edf2ea] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#d8e2d5] text-xs font-bold text-[#4d564b] hover:bg-[#f7f7f2] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving || uploadingAvatar}
              className="bg-[#286b3c] hover:bg-[#205730] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingId ? "تحديث الرأي" : "حفظ الرأي"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
