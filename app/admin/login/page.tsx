"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AdminAuthProvider";
import { Lock, Mail, ArrowLeft, ShieldAlert, LogIn, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("من فضلك أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      router.replace("/admin");
    } catch (err: any) {
      console.error("Login failed:", err);
      if (
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        setError("بيانات الدخول غير صحيحة. تأكد من الإيميل والباسورد.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("محاولات كثيرة خاطئة. يرجى الانتظار قليلاً والمحاولة لاحقاً.");
      } else {
        setError(err?.message || "حدث خطأ أثناء تسجيل الدخول.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f2] text-[#286b3c]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#f7f7f2] relative z-10 font-[family-name:var(--font-digital)]">
      {/* Background Subtle Gradient & Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#286b3c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="w-full max-w-md bg-[#ffffff] border-2 border-[#e2e8de] rounded-3xl shadow-[0_12px_45px_rgba(32,58,36,0.08)] p-6 sm:p-9 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e9efe7]">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#626a60] hover:text-[#286b3c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع للموقع
          </Link>
          <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#286b3c] px-2.5 py-1 bg-[#eef5e9] border border-[#cfe0c9] rounded-lg tracking-wider" dir="ltr">
            [ ADMIN // V2.0 ]
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#39834c] to-[#28633a] shadow-[0_6px_18px_rgba(40,107,60,0.25)] text-white mb-3.5">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#20251f]">
            تسجيل دخول <span className="text-[#286b3c]">الأدمن</span>
          </h1>
          <p className="text-xs text-[#727970] mt-1 font-[family-name:var(--font-mono)] tracking-wider">
            FAMEX CONTROL CENTER
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a9488] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                placeholder="admin@famex.agency"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-3 pr-10 pl-4 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20251f] mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a9488] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                placeholder="••••••••"
                className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-3 pr-10 pl-4 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0] text-left"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-3 bg-gradient-to-r from-[#286b3c] to-[#39834c] hover:from-[#215730] hover:to-[#2e743f] text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(40,107,60,0.22)] hover:shadow-[0_8px_25px_rgba(40,107,60,0.32)] active:scale-[0.99] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
