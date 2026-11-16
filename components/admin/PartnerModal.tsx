"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  AlertCircle,
  UploadCloud,
  Loader2,
  Trash2,
  Building2,
  Globe,
  Save,
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { Partner } from "@/lib/partnersService";

interface PartnerModalProps {
  isOpen: boolean;
  editingPartner: Partner | null;
  onSave: (partnerData: Omit<Partner, "id"> & { id?: string }) => Promise<void>;
  onClose: () => void;
}

export default function PartnerModal({
  isOpen,
  editingPartner,
  onSave,
  onClose,
}: PartnerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [showOnHome, setShowOnHome] = useState(true);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingPartner) {
      setName(editingPartner.name);
      setLogoUrl(editingPartner.logoUrl);
      setWebsiteUrl(editingPartner.websiteUrl || "");
      setOrder(editingPartner.order || 1);
      setShowOnHome(editingPartner.showOnHome !== false);
    } else {
      setName("");
      setLogoUrl("");
      setWebsiteUrl("");
      setOrder(1);
      setShowOnHome(true);
    }
    setFormError("");
  }, [editingPartner, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setFormError("");

    try {
      const url = await uploadToCloudinary(file);
      setLogoUrl(url);
    } catch (err: unknown) {
      console.error("Logo upload error:", err);
      const errorObj = err as { message?: string } | undefined;
      setFormError(errorObj?.message || "فشل رفع اللوجو إلى Cloudinary.");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("يرجى إدخال اسم الشركة أو العميل.");
      return;
    }

    if (!logoUrl.trim()) {
      setFormError("يرجى رفع لوجو الشركة.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        id: editingPartner?.id,
        name: name.trim(),
        logoUrl: logoUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        order: Number(order) || 1,
        showOnHome: Boolean(showOnHome),
      });
      onClose();
    } catch (err: unknown) {
      console.error("Save partner error:", err);
      const errorObj = err as { message?: string } | undefined;
      setFormError(errorObj?.message || "حدث خطأ أثناء حفظ الشريك.");
    } finally {
      setSaving(false);
    }
  };

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
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-right">
            <h2 className="text-lg font-black text-[#20251f]">
              {editingPartner ? "تعديل بيانات الشريك" : "إضافة شريك نجاح جديد"}
            </h2>
            <p className="text-xs text-[#727970] mt-0.5">
              سيظهر اللوجو في شريط الشركاء المتحرك بالصفحة الرئيسية
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo Uploader */}
          <div>
            <label className="block text-xs font-bold text-[#444c41] mb-2">
              لوجو الشركة <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-[#cfe0c9] rounded-2xl bg-[#fafcfa] hover:bg-[#f3f7f2] transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadingLogo}
              />

              {logoUrl ? (
                <div className="relative w-24 h-16 bg-[#070d08] rounded-xl p-2 flex items-center justify-center shrink-0 border border-[#286b3c]/30 group">
                  <Image
                    src={logoUrl}
                    alt="معاينة اللوجو"
                    width={80}
                    height={50}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors cursor-pointer"
                    title="حذف اللوجو"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#eef5e9] border border-[#cfe0c9] flex items-center justify-center text-[#286b3c] shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#286b3c] hover:bg-[#1e522d] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الرفع...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>{logoUrl ? "تغيير اللوجو" : "رفع اللوجو"}</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#727970] mt-1.5 leading-relaxed">
                  يُفضل لوجو شفاف (PNG أو SVG) بأبعاد واضحة.
                </p>
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-[#444c41] mb-1.5">
              اسم الشركة أو البراند <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: شركة الحلول الرقمية، كود تيك، الخ..."
                className="w-full pl-3 pr-10 py-2.5 bg-[#fbfdfa] border border-[#d5ded1] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl text-sm font-semibold text-[#20251f] placeholder:text-[#a0aba0] transition-all outline-none"
              />
              <Building2 className="w-4 h-4 text-[#727970] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-bold text-[#444c41] mb-1.5">
              رابط موقع الشركة (اختياري)
            </label>
            <div className="relative" dir="ltr">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pr-3 pl-10 py-2.5 bg-[#fbfdfa] border border-[#d5ded1] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl text-sm font-semibold text-[#20251f] placeholder:text-[#a0aba0] transition-all outline-none text-left"
              />
              <Globe className="w-4 h-4 text-[#727970] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#727970] mt-1">
              إذا تم إدخاله، سيتحول اللوجو في الشريط إلى رابط يفتح موقع الشركة.
            </p>
          </div>

          {/* Order & Visibility Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#444c41] mb-1.5">
                ترتيب العرض
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-[#fbfdfa] border border-[#d5ded1] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl text-sm font-semibold text-[#20251f] transition-all outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="relative flex items-center gap-3 p-3 bg-[#f7fbf5] border border-[#d5ded1] rounded-xl cursor-pointer hover:bg-[#eef5e9] transition-colors w-full mt-auto">
                <input
                  type="checkbox"
                  checked={showOnHome}
                  onChange={(e) => setShowOnHome(e.target.checked)}
                  className="w-4 h-4 rounded text-[#286b3c] focus:ring-[#286b3c] border-[#cfe0c9] accent-[#286b3c]"
                />
                <span className="text-xs font-bold text-[#20251f]">
                  إظهار في الشريط بالرئيسية
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#edf2ea] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#727970] hover:text-[#20251f] hover:bg-[#f7f7f2] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving || uploadingLogo}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#286b3c] hover:bg-[#1e522d] text-white rounded-xl text-sm font-extrabold shadow-md shadow-[#286b3c]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingPartner ? "حفظ التعديلات" : "إضافة الشريك"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
