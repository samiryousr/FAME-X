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
  Image as ImageIcon,
  Save,
} from "lucide-react";
import {
  PROJECT_CATEGORIES,
  normalizeProjectCategory,
} from "@/components/Projects";

interface ProjectModalProps {
  isOpen: boolean;
  editingId: string | null;
  title: string;
  setTitle: (v: string) => void;
  label: string;
  setLabel: (v: string) => void;
  iconName: string;
  setIconName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  order: number;
  setOrder: (v: number) => void;
  showOnHome: boolean;
  setShowOnHome: (v: boolean) => void;
  images: string[];
  previewImage: string;
  demoScreen: "commerce" | "identity" | "platform" | "";
  setDemoScreen: (v: "commerce" | "identity" | "platform" | "") => void;
  uploadingImage: boolean;
  deletingImageIndex: number | null;
  saving: boolean;
  formError: string;
  onFilesUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSetPrimary: (url: string) => void;
  onRemoveImage: (url: string, index: number) => Promise<void>;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export default function ProjectModal({
  isOpen,
  editingId,
  title,
  setTitle,
  label,
  setLabel,
  iconName,
  setIconName,
  description,
  setDescription,
  url,
  setUrl,
  order,
  setOrder,
  showOnHome,
  setShowOnHome,
  images,
  previewImage,
  demoScreen,
  setDemoScreen,
  uploadingImage,
  deletingImageIndex,
  saving,
  formError,
  onFilesUpload,
  onSetPrimary,
  onRemoveImage,
  onSave,
  onClose,
}: ProjectModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e2e8de] my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSave} className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Modal Header (Sticky Top) */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#edf2ea] bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#727970] hover:text-[#20251f] rounded-xl hover:bg-[#f7f7f2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-right">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#20251f]">
                {editingId ? "تعديل بيانات المشروع" : "إضافة مشروع جديد"}
              </h2>
              <p className="text-xs text-[#727970] mt-0.5">
                ارفع الصور واكتب تفاصيل المشروع لتحديثها فورا على المنصة
              </p>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 min-h-0">
            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-1.5">
              عنوان المشروع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="مثال: متجر إلكتروني طلقة / تطبيق توصيل سريع"
              className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
            />
          </div>

          {/* Project Specialty / Category Selector (3 Core Disciplines) */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-2 flex items-center justify-between">
              <span>
                تخصص وتصنيف المشروع <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-[#727970]">
                اختر أحد تخصصات الشركة الـ 3
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PROJECT_CATEGORIES.map((cat) => {
                const IconComponent = cat.Icon;
                const isSelected =
                  normalizeProjectCategory(label) === cat.id || iconName === cat.iconName;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setLabel(cat.label);
                      setIconName(cat.iconName);
                    }}
                    className={`relative p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer text-start ${
                      isSelected
                        ? "bg-[#eef5e9] border-[#286b3c] shadow-sm ring-2 ring-[#286b3c]/20"
                        : "bg-[#fdfdfc] border-[#d8e2d5] hover:bg-[#f7f7f2] hover:border-[#286b3c]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#286b3c] text-white" : "bg-[#f0f4ee] text-[#286b3c]"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#286b3c] text-white">
                          محدد
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#20251f]">{cat.label}</h4>
                      <p className="text-[10px] text-[#727970] mt-0.5" dir="ltr">
                        {cat.subLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-1.5">
              وصف المشروع
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب نبذة مختصرة وجذابة عن المشروع وأهم مميزاته..."
              className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] resize-none"
            />
          </div>

          {/* URL & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                رابط المشروع الخارجي (اختياري)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                dir="ltr"
                placeholder="https://example.com"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                ترتيب الظهور (Order)
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Show on Home Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#f7f7f2] border border-[#e2e8de] rounded-2xl">
            <div className="text-right">
              <p className="text-xs font-extrabold text-[#20251f]">
                العرض في الصفحة الرئيسية (Home)
              </p>
              <p className="text-[11px] text-[#727970] mt-0.5">
                عند التفعيل، سيظهر المشروع داخل شاشة التليفون في قسم أعمالنا بالصفحة الرئيسية.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
              className="w-5 h-5 accent-[#286b3c] rounded cursor-pointer"
            />
          </div>

          {/* Images Uploader Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#727970] font-bold">
                {images.length} {images.length === 1 ? "صورة مرفوعة" : "صور مرفوعة"}
              </span>
              <label className="text-xs font-bold text-[#20251f] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#286b3c]" />
                صور المشروع (Cloudinary)
              </label>
            </div>

            {/* Upload Trigger Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${
                uploadingImage
                  ? "border-[#286b3c] bg-[#eef5e9]"
                  : "border-[#d8e2d5] hover:border-[#286b3c] bg-[#fafaf7]"
              } rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesUpload}
                className="hidden"
              />

              {uploadingImage ? (
                <>
                  <Loader2 className="w-8 h-8 text-[#286b3c] animate-spin" />
                  <p className="text-xs font-bold text-[#286b3c]">
                    جاري رفع الصور إلى Cloudinary بجودة عالية...
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#39834c]" />
                  <div>
                    <p className="text-xs font-bold text-[#20251f]">
                      اضغط لاختيار صورة أو عدة صور للمشروع
                    </p>
                    <p className="text-[11px] text-[#727970] mt-0.5">
                      PNG, JPG, WEBP — يتم تحسينها وضغطها تلقائياً لأعلى سرعة وجودة
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Uploaded Images Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {images.map((imgUrl, idx) => {
                  const isPrimary = previewImage === imgUrl;
                  const isDeletingThis = deletingImageIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 ${
                        isPrimary
                          ? "border-[#286b3c] shadow-[0_0_12px_rgba(40,107,60,0.35)]"
                          : "border-[#d8e2d5]"
                      } bg-[#101812] group`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`صورة ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <span className="absolute top-1 right-1 bg-[#286b3c] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          الرئيسية
                        </span>
                      )}

                      {/* Loading overlay if deleting */}
                      {isDeletingThis ? (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => onSetPrimary(imgUrl)}
                              className="p-1.5 bg-[#286b3c] text-white rounded-lg hover:scale-110 transition-transform cursor-pointer"
                              title="تعيين كصورة رئيسية"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onRemoveImage(imgUrl, idx)}
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform cursor-pointer"
                            title="حذف من المشروع وسيرفر Cloudinary"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Demo Screen Fallback if no images */}
          {images.length === 0 && (
            <div>
              <label className="block text-xs font-bold text-[#727970] mb-1">
                شاشة الديمو التفاعلية (في حال عدم رفع صور بعد)
              </label>
              <select
                value={demoScreen}
                onChange={(e) =>
                  setDemoScreen(
                    e.target.value as "commerce" | "identity" | "platform" | ""
                  )
                }
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] rounded-xl py-2 px-3 text-[#20251f] text-xs outline-none"
              >
                <option value="">بدون ديمو تفاعلي</option>
                <option value="commerce">ديمو متجر إلكتروني (E-commerce Screen)</option>
                <option value="identity">ديمو هوية بصرية (Brand Identity Screen)</option>
                <option value="platform">ديمو منصة وداشبورد (Dashboard Screen)</option>
              </select>
            </div>
          )}

          </div>

          {/* Modal Sticky Footer Actions */}
          <div className="px-5 sm:px-7 py-3.5 border-t border-[#edf2ea] bg-[#fafbf9] shrink-0 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#d8e2d5] text-xs font-bold text-[#4d564b] hover:bg-[#f7f7f2] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
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
                  <span>{editingId ? "تحديث المشروع" : "حفظ المشروع"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
