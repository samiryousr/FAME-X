"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  ExternalLink,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/SocialIcons";
import {
  getContactSettings,
  saveContactSettings,
  cleanPhoneNumber,
  type ContactSettings,
  DEFAULT_CONTACT_SETTINGS,
} from "@/lib/settingsService";

interface SettingsTabProps {
  onSuccessToast?: (msg: string) => void;
}

export default function SettingsTab({ onSuccessToast }: SettingsTabProps) {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getContactSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaveSuccess(false);

    try {
      await saveContactSettings(settings);
      setSaveSuccess(true);
      if (onSuccessToast) {
        onSuccessToast("تم حفظ وتحديث بيانات التواصل بنجاح في الموقع!");
      }
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const rawPhone = cleanPhoneNumber(settings.whatsappNumber);
  const whatsappPreviewUrl = rawPhone
    ? `https://wa.me/${rawPhone}`
    : "https://wa.me/";

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#286b3c]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="py-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#20251f]">
          بيانات <span className="text-[#286b3c]">التواصل والسوشيال ميديا</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#727970] mt-1">
          تحكم في رقم الواتساب الرسمي، البريد الإلكتروني، وروابط صفحات السوشيال ميديا المعروضة في الموقع والفوتر.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم حفظ الإعدادات وتحديثها فورياً في كامل الموقع وفي الذاكرة السحابية!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 space-y-5 bg-white p-5 sm:p-7 rounded-3xl border border-[#e2e8de] shadow-sm">
          {/* Section 1: Direct Contact */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-[#20251f] flex items-center gap-2 pb-2 border-b border-[#edf2ea]">
              <Phone className="w-4 h-4 text-[#286b3c]" />
              <span>قنوات التواصل المباشر (واتساب & إيميل)</span>
            </h2>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <WhatsAppIcon size={14} />
                  <span>رقم الواتساب الرسمي (مع كود الدولة)</span>
                </span>
                <span className="text-[11px] font-normal text-[#727970]">
                  مثال: 201012345678
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  value={settings.whatsappNumber}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                  }
                  placeholder="2010xxxxxxxx"
                  className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] font-mono text-left"
                />
              </div>
              <p className="text-[11px] text-[#727970] mt-1">
                عند كتابة الرقم، سيتم فتح محادثة الواتساب المباشرة مع هذا الرقم فوراً عند الضغط على أزرار التواصل.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#286b3c]" />
                <span>البريد الإلكتروني الرسمي</span>
              </label>
              <input
                type="email"
                dir="ltr"
                value={settings.email}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="contact@famex.dev"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] font-mono text-left"
              />
            </div>
          </div>

          {/* Section 2: Social Media Links */}
          <div className="space-y-4 pt-4 border-t border-[#edf2ea]">
            <h2 className="text-sm font-black text-[#20251f] flex items-center gap-2 pb-2 border-b border-[#edf2ea]">
              <Share2 className="w-4 h-4 text-[#286b3c]" />
              <span>روابط صفحات السوشيال ميديا</span>
            </h2>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5 flex items-center gap-1.5">
                <FacebookIcon size={14} />
                <span>رابط صفحة فيسبوك (Facebook URL)</span>
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.facebookUrl}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, facebookUrl: e.target.value }))
                }
                placeholder="https://facebook.com/yourpage"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] font-mono text-left"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5 flex items-center gap-1.5">
                <InstagramIcon size={14} />
                <span>رابط صفحة إنستجرام (Instagram URL)</span>
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.instagramUrl}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, instagramUrl: e.target.value }))
                }
                placeholder="https://instagram.com/yourhandle"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] font-mono text-left"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-bold text-[#20251f] mb-1.5 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#286b3c]" />
                <span>رابط صفحة لينكد إن (LinkedIn URL - اختياري)</span>
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.linkedinUrl || ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                }
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] font-mono text-left"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#edf2ea] flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#286b3c] hover:bg-[#205730] text-white font-extrabold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ والتحديث...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات التواصل</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Live Preview Cards */}
        <div className="space-y-4">
          <div className="bg-[#f0f4ee] p-5 rounded-3xl border border-[#dbe6d7] space-y-4">
            <h3 className="text-xs font-black text-[#286b3c] tracking-wider uppercase flex items-center gap-1.5 font-mono">
              <span>LIVE PREVIEW // معاينة مباشرة</span>
            </h3>

            {/* WhatsApp Test Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#e2e8de] space-y-2">
              <span className="text-[11px] font-bold text-[#727970] block">رابط الواتساب الناتج:</span>
              <p className="text-xs font-mono text-[#20251f] break-all bg-[#f7f9f6] p-2 rounded-lg" dir="ltr">
                {whatsappPreviewUrl}
              </p>
              {rawPhone && (
                <a
                  href={whatsappPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#286b3c] hover:underline pt-1"
                >
                  <span>تجربة فتح الرابط</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Email Test Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#e2e8de] space-y-2">
              <span className="text-[11px] font-bold text-[#727970] block">البريد الإلكتروني:</span>
              <p className="text-xs font-mono text-[#20251f] break-all bg-[#f7f9f6] p-2 rounded-lg" dir="ltr">
                {settings.email || "hello@famex.dev"}
              </p>
            </div>

            {/* Social Links Status */}
            <div className="bg-white p-4 rounded-2xl border border-[#e2e8de] space-y-2 text-xs">
              <span className="text-[11px] font-bold text-[#727970] block mb-2">حالة روابط السوشيال:</span>
              <div className="flex items-center justify-between py-1 border-b border-[#edf2ea]">
                <span className="flex items-center gap-1.5">
                  <FacebookIcon size={13} />
                  <span>فيسبوك</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.facebookUrl ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {settings.facebookUrl ? "مفعل" : "غير محدد"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <InstagramIcon size={13} />
                  <span>إنستجرام</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.instagramUrl ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {settings.instagramUrl ? "مفعل" : "غير محدد"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
