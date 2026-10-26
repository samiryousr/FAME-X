"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AdminAuthProvider";
import {
  getAllProjects,
  saveProject,
  deleteProject,
  ProjectItem,
} from "@/lib/projectsService";
import {
  deleteTestimonial,
  getAllTestimonials,
  setTestimonialStatus,
  type TestimonialItem,
} from "@/lib/testimonialsService";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  X,
  Star,
  Image as ImageIcon,
  Save,
  FolderGit2,
  MessageSquare,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [updatingTestimonialId, setUpdatingTestimonialId] = useState<string | null>(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [showOnHome, setShowOnHome] = useState(true);
  const [order, setOrder] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [demoScreen, setDemoScreen] = useState<"commerce" | "identity" | "platform" | "">("");

  // Uploading & Submitting state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);

  // Load Projects
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true);
      setTestimonialsError("");
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setTestimonialsError("تعذر تحميل الآراء. تحقق من اتصال Firebase والصلاحيات.");
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTestimonials();
    }
  }, [user]);

  const handleTestimonialStatus = async (testimonial: TestimonialItem) => {
    const status = testimonial.status === "approved" ? "pending" : "approved";

    try {
      setUpdatingTestimonialId(testimonial.id);
      await setTestimonialStatus(testimonial.id, status);
      setTestimonials((current) =>
        current.map((item) => item.id === testimonial.id ? { ...item, status } : item)
      );
      setStatusMessage(status === "approved" ? "تم نشر الرأي بنجاح." : "تم إخفاء الرأي.");
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      console.error("Failed to update testimonial status:", err);
      setTestimonialsError("تعذر تحديث حالة الرأي. تحقق من صلاحيات حساب الإدارة.");
    } finally {
      setUpdatingTestimonialId(null);
    }
  };

  const handleTestimonialDelete = async (testimonial: TestimonialItem) => {
    if (!confirm(`هل أنت متأكد من حذف رأي "${testimonial.name}" نهائيًا؟`)) return;

    try {
      setUpdatingTestimonialId(testimonial.id);
      await deleteTestimonial(testimonial.id);
      setTestimonials((current) => current.filter((item) => item.id !== testimonial.id));
      setStatusMessage("تم حذف الرأي بنجاح.");
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      setTestimonialsError("تعذر حذف الرأي. تحقق من صلاحيات حساب الإدارة.");
    } finally {
      setUpdatingTestimonialId(null);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  // Open modal for new project
  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setLabel("");
    setDescription("");
    setUrl("");
    setShowOnHome(true);
    setOrder(projects.length + 1);
    setPreviewImage("");
    setImages([]);
    setDemoScreen("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for editing existing project
  const handleEdit = (p: ProjectItem) => {
    setEditingId(p.id);
    setTitle(p.title);
    setLabel(p.label);
    setDescription(p.description);
    setUrl(p.url || "");
    setShowOnHome(p.showOnHome);
    setOrder(p.order || 1);
    setPreviewImage(p.previewImage || (p.images && p.images[0]) || "");
    setImages(p.images || []);
    setDemoScreen(p.demoScreen || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle file upload to Cloudinary
  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFormError("");

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadToCloudinary(file);
        uploadedUrls.push(uploadedUrl);
      }

      setImages((prev) => {
        const updated = [...prev, ...uploadedUrls];
        if (!previewImage && updated.length > 0) {
          setPreviewImage(updated[0]);
        }
        return updated;
      });

      if (!previewImage && uploadedUrls.length > 0) {
        setPreviewImage(uploadedUrls[0]);
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const uploadErr = err as { message?: string } | undefined;
      setFormError(uploadErr?.message || "فشل رفع الصورة إلى Cloudinary.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove an image from the list and delete it from Cloudinary
  const handleRemoveImage = async (imgUrl: string, index: number) => {
    setDeletingImageIndex(index);
    try {
      // 1. Delete image from Cloudinary
      await deleteFromCloudinary(imgUrl);

      // 2. Remove from local images state
      const remaining = images.filter((img) => img !== imgUrl);
      setImages(remaining);
      if (previewImage === imgUrl) {
        setPreviewImage(remaining[0] || "");
      }
    } catch (err) {
      console.warn("Could not delete from Cloudinary:", err);
    } finally {
      setDeletingImageIndex(null);
    }
  };

  // Set as primary preview image
  const handleSetPrimary = (imgUrl: string) => {
    setPreviewImage(imgUrl);
  };

  // Handle Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("يرجى كتابة عنوان المشروع.");
      return;
    }

    try {
      setSaving(true);
      await saveProject({
        id: editingId || undefined,
        title: title.trim(),
        label: label.trim(),
        description: description.trim(),
        previewImage: previewImage || (images[0] ?? ""),
        images: images,
        url: url.trim(),
        showOnHome: Boolean(showOnHome),
        order: Number(order) || 1,
        demoScreen: demoScreen || undefined,
      });

      setIsModalOpen(false);
      setStatusMessage("تم حفظ وتحديث المشروع بنجاح!");
      setTimeout(() => setStatusMessage(""), 4000);
      await fetchProjects();
    } catch (err: unknown) {
      console.error("Save error:", err);
      const saveErr = err as { message?: string } | undefined;
      setFormError(saveErr?.message || "حدث خطأ أثناء حفظ المشروع.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Project Delete
  const handleDelete = async (id: string, projectTitle: string, projectImages?: string[]) => {
    if (!confirm(`هل أنت متأكد من حذف مشروع "${projectTitle}" نهائياً؟`)) {
      return;
    }

    try {
      // Delete images from Cloudinary if available
      if (projectImages && projectImages.length > 0) {
        for (const imgUrl of projectImages) {
          deleteFromCloudinary(imgUrl).catch(() => {});
        }
      }

      await deleteProject(id);
      setStatusMessage("تم حذف المشروع بنجاح.");
      setTimeout(() => setStatusMessage(""), 4000);
      await fetchProjects();
    } catch (err: unknown) {
      const delErr = err as { message?: string } | undefined;
      alert("فشل حذف المشروع: " + (delErr?.message || "خطأ غير معروف"));
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f2] text-[#286b3c]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f2] text-[#20251f] p-3 sm:p-6 lg:p-8 relative z-10 font-[family-name:var(--font-digital)]">
      {/* Background Subtle Retro Dots */}
      <div className="fixed inset-0 bg-[radial-gradient(#286b3c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-7">
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#ffffff] border-2 border-[#e2e8de] rounded-2xl sm:rounded-3xl shadow-[0_4px_24px_rgba(32,58,36,0.05)]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-wider font-[family-name:var(--font-pixel)] hover:opacity-90 transition-opacity"
              dir="ltr"
            >
              <span className="text-[#286b3c]">FAME</span>
              <span className="text-[#39a653]">X</span>
            </Link>
            <span className="text-[#c5d1c2]">/</span>
            <span className="text-xs font-bold text-[#286b3c] bg-[#eef5e9] px-3 py-1 rounded-lg border border-[#cfe0c9]">
              لوحة تحكم المشاريع
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-[#727970] font-[family-name:var(--font-mono)] hidden md:inline-block">
              {user?.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-[#286b3c] bg-[#eef5e9] hover:bg-[#e4ede0] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              الرئيسية
            </Link>
            <Link
              href="/projects"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-[#286b3c] bg-[#eef5e9] hover:bg-[#e4ede0] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              صفحة المشاريع
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              تسجيل خروج
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

        {/* Action Header */}
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
            onClick={handleOpenNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] hover:from-[#215730] hover:to-[#2e743f] text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(40,107,60,0.22)] hover:shadow-[0_8px_25px_rgba(40,107,60,0.32)] transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            إضافة مشروع جديد
          </button>
        </div>

        {/* Projects Grid */}
        {loadingProjects ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#286b3c]" />
            <p className="text-xs text-[#727970] font-[family-name:var(--font-mono)]">جاري جلب المشاريع من السيرفر...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center bg-[#ffffff] border-2 border-dashed border-[#d8e2d5] rounded-3xl">
            <ImageIcon className="w-12 h-12 text-[#9bb098] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#20251f] mb-1">لا توجد مشاريع مضافة حتى الآن</h3>
            <p className="text-xs text-[#727970] mb-4">ابدأ بإضافة أول مشروع ليظهر لزوار موقع FameX.</p>
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة مشروع الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {projects.map((p) => {
              const primaryImg = p.previewImage || (p.images && p.images[0]);
              const imageCount = p.images?.length || (p.previewImage ? 1 : 0);

              return (
                <article
                  key={p.id}
                  className="bg-[#ffffff] border-2 border-[#e2e8de] hover:border-[#39834c]/60 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_10px_35px_rgba(32,58,36,0.08)] group"
                >
                  {/* Image / Screen Preview */}
                  <div className="relative aspect-[16/10] bg-[#101812] overflow-hidden border-b border-[#e2e8de]">
                    {primaryImg ? (
                      <Image
                        src={primaryImg}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
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
                        <span className="text-xs font-extrabold text-[#286b3c] bg-[#eef5e9] px-2.5 py-0.5 rounded-md">
                          {p.label || "مشروع مميز"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#20251f] group-hover:text-[#286b3c] transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#727970] mt-1.5 line-clamp-2 leading-relaxed">
                        {p.description || "لا يوجد وصف مدخل."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#edf2ea] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
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
                          onClick={() => handleEdit(p)}
                          className="flex items-center gap-1.5 text-xs font-bold bg-[#eef5e9] hover:bg-[#286b3c] text-[#286b3c] hover:text-white px-3.5 py-2 rounded-xl border border-[#cfe0c9] hover:border-[#286b3c] transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title, p.images)}
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

        <section className="space-y-5 pt-6 border-t-2 border-[#e2e8de]" aria-labelledby="testimonials-admin-heading">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 id="testimonials-admin-heading" className="text-2xl font-black text-[#20251f]">
                إدارة <span className="text-[#286b3c]">آراء العملاء</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#727970] mt-1">
                راجع الآراء الجديدة، وانشر المناسب منها أو أخفِها واحذف غير المرغوب.
              </p>
            </div>
            <span className="text-xs font-bold text-[#286b3c] bg-[#eef5e9] px-3 py-2 rounded-xl border border-[#cfe0c9]">
              {testimonials.filter((item) => item.status === "pending").length} بانتظار المراجعة
            </span>
          </div>

          {testimonialsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{testimonialsError}</span>
            </div>
          )}

          {loadingTestimonials ? (
            <div className="py-12 flex items-center justify-center gap-3 text-[#727970]">
              <Loader2 className="w-6 h-6 animate-spin text-[#286b3c]" />
              <span className="text-sm">جاري تحميل الآراء...</span>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-10 text-center bg-white border-2 border-dashed border-[#d8e2d5] rounded-3xl">
              <MessageSquare className="w-10 h-10 text-[#9bb098] mx-auto mb-3" />
              <p className="text-sm font-bold text-[#20251f]">لا توجد آراء حتى الآن</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="bg-white border-2 border-[#e2e8de] rounded-2xl p-4 sm:p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-1 text-amber-500" aria-label={`${testimonial.rating} من 5 نجوم`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${index < testimonial.rating ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                      testimonial.status === "approved"
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-amber-800 bg-amber-50 border border-amber-200"
                    }`}>
                      {testimonial.status === "approved" ? "منشور" : "بانتظار المراجعة"}
                    </span>
                  </div>
                  <blockquote className="text-sm leading-7 text-[#434a41]">
                    {testimonial.quote}
                  </blockquote>
                  <div className="flex items-center justify-between gap-3 border-t border-[#edf2ea] pt-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#20251f] truncate">{testimonial.name}</p>
                      <p className="text-[11px] text-[#727970]">
                        {testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString("ar-EG")
                          : "تاريخ غير متاح"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={updatingTestimonialId === testimonial.id}
                        onClick={() => handleTestimonialStatus(testimonial)}
                        className="text-xs font-bold text-[#286b3c] bg-[#eef5e9] hover:bg-[#e4ede0] border border-[#cfe0c9] px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {testimonial.status === "approved" ? "إخفاء" : "نشر"}
                      </button>
                      <button
                        type="button"
                        disabled={updatingTestimonialId === testimonial.id}
                        onClick={() => handleTestimonialDelete(testimonial)}
                        className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors disabled:opacity-50"
                        aria-label={`حذف رأي ${testimonial.name}`}
                        title="حذف الرأي"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL: ADD / EDIT PROJECT (RESPONSIVE & COMFORTABLE ON MOBILE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#ffffff] border-2 border-[#d8e2d5] rounded-3xl shadow-[0_20px_60px_rgba(32,58,36,0.18)] p-5 sm:p-7 relative my-4 sm:my-8 text-right max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#edf2ea] mb-5">
              <button
                onClick={() => setIsModalOpen(false)}
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

            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProject} className="space-y-4">
              {/* Title & Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                    عنوان المشروع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="مثال: متجر إلكتروني طلقة"
                    className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20251f] mb-1.5">
                    تصنيف المشروع (Label)
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="مثال: أبلكيشن متجر / براندينج وهوية"
                    className="w-full bg-[#fdfdfc] border border-[#d8e2d5] focus:border-[#286b3c] focus:ring-2 focus:ring-[#286b3c]/15 rounded-xl py-2.5 px-3.5 text-[#20251f] text-sm outline-none transition-all placeholder:text-[#a0aaa0]"
                  />
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
                  <p className="text-xs font-extrabold text-[#20251f]">العرض في الصفحة الرئيسية (Home)</p>
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

              {/* IMAGES UPLOADER SECTION */}
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
                    onChange={handleFilesUpload}
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
                          PNG, JPG, WEBP — سيتم رفعها لـ Cloudinary وتخزينها بأمان
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
                            /* Actions overlay */
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimary(imgUrl)}
                                  className="p-1.5 bg-[#286b3c] text-white rounded-lg hover:scale-110 transition-transform cursor-pointer"
                                  title="تعيين كصورة رئيسية"
                                >
                                  <Star className="w-3.5 h-3.5 fill-white" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgUrl, idx)}
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
                    onChange={(e) => setDemoScreen(e.target.value as "commerce" | "identity" | "platform" | "")}
                    className="w-full bg-[#fdfdfc] border border-[#d8e2d5] rounded-xl py-2 px-3 text-xs text-[#20251f] outline-none"
                  >
                    <option value="">بدون شاشة تفاعلية</option>
                    <option value="commerce">شاشة متجر إلكتروني (Commerce Demo)</option>
                    <option value="identity">شاشة هوية وبراندينج (Identity Demo)</option>
                    <option value="platform">شاشة منصة وداشبورد (Platform Demo)</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#edf2ea] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#727970] hover:text-[#20251f] bg-[#f7f7f2] hover:bg-[#edf2ea] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#286b3c] to-[#39834c] hover:from-[#215730] hover:to-[#2e743f] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-[0_4px_16px_rgba(40,107,60,0.25)] transition-all cursor-pointer disabled:opacity-50"
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
      )}
    </div>
  );
}
