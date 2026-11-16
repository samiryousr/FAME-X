"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  saveTestimonial,
  type TestimonialItem,
} from "@/lib/testimonialsService";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import {
  PROJECT_CATEGORIES,
  normalizeProjectCategory,
} from "@/components/Projects";
import { Loader2 } from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ProjectModal from "@/components/admin/ProjectModal";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import TestimonialModal from "@/components/admin/TestimonialModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SettingsTab from "@/components/admin/SettingsTab";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"projects" | "testimonials" | "settings">("projects");

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [togglingHomeId, setTogglingHomeId] = useState<string | null>(null);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [updatingTestimonialId, setUpdatingTestimonialId] = useState<string | null>(null);

  // Feedback & Status
  const [statusMessage, setStatusMessage] = useState("");
  const [formError, setFormError] = useState("");

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDanger?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectLabel, setProjectLabel] = useState("");
  const [projectIconName, setProjectIconName] = useState("Smartphone");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectOrder, setProjectOrder] = useState<number>(1);
  const [projectShowOnHome, setProjectShowOnHome] = useState(true);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectPreviewImage, setProjectPreviewImage] = useState("");
  const [projectDemoScreen, setProjectDemoScreen] = useState<"commerce" | "identity" | "platform" | "">("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);
  const [savingProject, setSavingProject] = useState(false);

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialRating, setTestimonialRating] = useState<number>(5);
  const [testimonialImage, setTestimonialImage] = useState("");
  const [testimonialStatusState, setTestimonialStatusState] = useState<"approved" | "pending">("approved");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  // Auth Guard
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

  // Load Testimonials
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

  const showToast = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  // ===================== PROJECT HANDLERS =====================
  const handleOpenNewProject = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectLabel(PROJECT_CATEGORIES[0].label);
    setProjectIconName(PROJECT_CATEGORIES[0].iconName);
    setProjectDescription("");
    setProjectUrl("");
    setProjectShowOnHome(true);
    setProjectOrder(projects.length + 1);
    setProjectPreviewImage("");
    setProjectImages([]);
    setProjectDemoScreen("");
    setFormError("");
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (p: ProjectItem) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    const catKey = normalizeProjectCategory(p.label);
    const cat = PROJECT_CATEGORIES.find((c) => c.id === catKey) || PROJECT_CATEGORIES[0];
    setProjectLabel(cat.label);
    setProjectIconName(cat.iconName);
    setProjectDescription(p.description);
    setProjectUrl(p.url || "");
    setProjectShowOnHome(p.showOnHome);
    setProjectOrder(p.order || 1);
    setProjectPreviewImage(p.previewImage || (p.images && p.images[0]) || "");
    setProjectImages(p.images || []);
    setProjectDemoScreen(p.demoScreen || "");
    setFormError("");
    setIsProjectModalOpen(true);
  };

  const handleToggleHome = async (p: ProjectItem) => {
    const updatedState = !p.showOnHome;
    try {
      setTogglingHomeId(p.id);
      await saveProject({
        ...p,
        showOnHome: updatedState,
      });
      setProjects((current) =>
        current.map((item) => (item.id === p.id ? { ...item, showOnHome: updatedState } : item))
      );
      showToast(
        updatedState
          ? `تم إظهار مشروع "${p.title}" بالرئيسية!`
          : `تم إخفاء مشروع "${p.title}" من الرئيسية.`
      );
    } catch (err) {
      console.error("Failed to toggle home visibility:", err);
      alert("حدث خطأ أثناء تعديل حالة العرض بالرئيسية.");
    } finally {
      setTogglingHomeId(null);
    }
  };

  const handleDeleteProject = (p: ProjectItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "تأكيد حذف المشروع",
      message: `هل أنت متأكد من حذف مشروع "${p.title}" نهائياً؟ سيتم أيضاً مسح صوره من خوادم Cloudinary.`,
      confirmText: "نعم، احذف المشروع",
      isDanger: true,
      onConfirm: async () => {
        try {
          setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
          if (p.images && p.images.length > 0) {
            await Promise.allSettled(p.images.map((imgUrl) => deleteFromCloudinary(imgUrl)));
          }
          await deleteProject(p.id);
          setProjects((prev) => prev.filter((item) => item.id !== p.id));
          showToast("تم حذف المشروع بنجاح!");
        } catch (err) {
          console.error("Delete error:", err);
          alert("حدث خطأ أثناء حذف المشروع.");
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFormError("");

    try {
      const fileArray = Array.from(files);
      // رفع متوازي فائق السرعة لجميع الصور دفعة واحدة في نفس اللحظة
      const uploadedUrls = await Promise.all(
        fileArray.map((file) => uploadToCloudinary(file))
      );

      setProjectImages((prev) => {
        const combined = [...prev, ...uploadedUrls];
        if (!projectPreviewImage && combined.length > 0) {
          setProjectPreviewImage(combined[0]);
        }
        return combined;
      });
      showToast(`تم رفع ${uploadedUrls.length} صور إلى Cloudinary بنجاح!`);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const uploadErr = err as { message?: string } | undefined;
      setFormError(uploadErr?.message || "فشل رفع إحدى الصور.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setProjectPreviewImage(imgUrl);
    setProjectImages((prev) => [imgUrl, ...prev.filter((u) => u !== imgUrl)]);
    showToast("تم تعيين الصورة كغلاف رئيسي!");
  };

  const handleRemoveImage = async (imgUrl: string, idx: number) => {
    try {
      setDeletingImageIndex(idx);
      await deleteFromCloudinary(imgUrl);
      const updated = projectImages.filter((_, i) => i !== idx);
      setProjectImages(updated);
      if (projectPreviewImage === imgUrl) {
        setProjectPreviewImage(updated[0] || "");
      }
      showToast("تم حذف الصورة من المشروع وCloudinary.");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("فشل حذف الصورة من Cloudinary.");
    } finally {
      setDeletingImageIndex(null);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!projectTitle.trim()) {
      setFormError("يرجى كتابة عنوان المشروع.");
      return;
    }

    try {
      setSavingProject(true);
      await saveProject({
        id: editingProjectId || undefined,
        title: projectTitle.trim(),
        label: projectLabel.trim() || PROJECT_CATEGORIES[0].label,
        description: projectDescription.trim(),
        previewImage: projectPreviewImage || projectImages[0] || "",
        images: projectImages,
        url: projectUrl.trim(),
        showOnHome: Boolean(projectShowOnHome),
        order: Number(projectOrder) || 1,
        demoScreen: projectDemoScreen || undefined,
        imageFit: "cover",
        iconName: projectIconName || PROJECT_CATEGORIES[0].iconName,
      });

      setIsProjectModalOpen(false);
      showToast(editingProjectId ? "تم تحديث المشروع بنجاح!" : "تمت إضافة المشروع الجديد بنجاح!");
      await fetchProjects();
    } catch (err: unknown) {
      console.error("Save error:", err);
      const saveErr = err as { message?: string } | undefined;
      setFormError(saveErr?.message || "حدث خطأ أثناء حفظ المشروع.");
    } finally {
      setSavingProject(false);
    }
  };

  // ===================== TESTIMONIAL HANDLERS =====================
  const handleOpenNewTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialName("");
    setTestimonialRole("");
    setTestimonialQuote("");
    setTestimonialRating(5);
    setTestimonialImage("");
    setTestimonialStatusState("approved");
    setFormError("");
    setIsTestimonialModalOpen(true);
  };

  const handleEditTestimonial = (item: TestimonialItem) => {
    setEditingTestimonialId(item.id);
    setTestimonialName(item.name);
    setTestimonialRole(item.role || "");
    setTestimonialQuote(item.quote);
    setTestimonialRating(item.rating || 5);
    setTestimonialImage(item.image || "");
    setTestimonialStatusState(item.status);
    setFormError("");
    setIsTestimonialModalOpen(true);
  };

  const handleToggleTestimonialStatus = async (item: TestimonialItem) => {
    const nextStatus = item.status === "approved" ? "pending" : "approved";
    try {
      setUpdatingTestimonialId(item.id);
      await setTestimonialStatus(item.id, nextStatus);
      setTestimonials((current) =>
        current.map((t) => (t.id === item.id ? { ...t, status: nextStatus } : t))
      );
      showToast(nextStatus === "approved" ? "تم نشر الرأي بنجاح." : "تم إخفاء الرأي.");
    } catch (err) {
      console.error("Failed to update testimonial status:", err);
      setTestimonialsError("تعذر تحديث حالة الرأي.");
    } finally {
      setUpdatingTestimonialId(null);
    }
  };

  const handleDeleteTestimonial = (item: TestimonialItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "تأكيد حذف رأي العميل",
      message: `هل أنت متأكد من حذف رأي "${item.name}" نهائياً من الموقع؟`,
      confirmText: "نعم، احذف الرأي",
      isDanger: true,
      onConfirm: async () => {
        try {
          setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
          await deleteTestimonial(item.id);
          setTestimonials((prev) => prev.filter((t) => t.id !== item.id));
          showToast("تم حذف رأي العميل بنجاح.");
        } catch (err) {
          console.error("Failed to delete testimonial:", err);
          alert("تعذر حذف الرأي.");
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const url = await uploadToCloudinary(file);
      setTestimonialImage(url);
      showToast("تم رفع صورة العميل بنجاح!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("فشل رفع صورة العميل إلى Cloudinary.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!testimonialName.trim()) {
      setFormError("يرجى كتابة اسم العميل.");
      return;
    }
    if (!testimonialQuote.trim()) {
      setFormError("يرجى كتابة نص رأي العميل.");
      return;
    }

    try {
      setSavingTestimonial(true);
      await saveTestimonial({
        id: editingTestimonialId || undefined,
        name: testimonialName.trim(),
        role: testimonialRole.trim(),
        quote: testimonialQuote.trim(),
        rating: testimonialRating,
        image: testimonialImage.trim(),
        status: testimonialStatusState,
      });

      setIsTestimonialModalOpen(false);
      showToast(editingTestimonialId ? "تم تعديل رأي العميل بنجاح!" : "تمت إضافة رأي العميل بنجاح!");
      await fetchTestimonials();
    } catch (err: unknown) {
      console.error("Save testimonial error:", err);
      const saveErr = err as { message?: string } | undefined;
      setFormError(saveErr?.message || "حدث خطأ أثناء حفظ رأي العميل.");
    } finally {
      setSavingTestimonial(false);
    }
  };

  // Summary Metrics for Stats Card
  const stats = useMemo(() => {
    const homeCount = projects.filter((p) => p.showOnHome).length;
    const liveCount = projects.filter((p) => Boolean(p.url)).length;
    const approvedReviews = testimonials.filter((t) => t.status === "approved").length;
    const totalRatingSum = testimonials.reduce((acc, t) => acc + (t.rating || 5), 0);
    const avgRating = testimonials.length > 0 ? totalRatingSum / testimonials.length : 5;

    return {
      totalProjects: projects.length,
      homeProjects: homeCount,
      liveProjects: liveCount,
      totalTestimonials: testimonials.length,
      approvedTestimonials: approvedReviews,
      averageRating: avgRating,
    };
  }, [projects, testimonials]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f7f2] text-[#286b3c] relative z-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#f7f7f2] text-[#20251f] p-4 sm:p-6 lg:p-8 relative z-20 font-[family-name:var(--font-digital)]"
      dir="rtl"
    >
      {/* Background Subtle Retro Dots */}
      <div className="fixed inset-0 bg-[radial-gradient(#286b3c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Modular Header */}
        <AdminHeader
          userEmail={user?.email}
          activeTab={activeTab}
          projectsCount={projects.length}
          testimonialsCount={testimonials.length}
          pendingTestimonialsCount={testimonials.filter((t) => t.status === "pending").length}
          statusMessage={statusMessage}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Modular Overview Stats */}
        <AdminStats
          totalProjects={stats.totalProjects}
          homeProjects={stats.homeProjects}
          liveProjects={stats.liveProjects}
          totalTestimonials={stats.totalTestimonials}
          approvedTestimonials={stats.approvedTestimonials}
          averageRating={stats.averageRating}
        />

        {/* Active Tab View */}
        {activeTab === "projects" ? (
          <ProjectsTab
            projects={projects}
            loading={loadingProjects}
            onAddNew={handleOpenNewProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onToggleHome={handleToggleHome}
            togglingHomeId={togglingHomeId}
          />
        ) : activeTab === "testimonials" ? (
          <TestimonialsTab
            testimonials={testimonials}
            loading={loadingTestimonials}
            error={testimonialsError}
            updatingId={updatingTestimonialId}
            onAddNew={handleOpenNewTestimonial}
            onEdit={handleEditTestimonial}
            onDelete={handleDeleteTestimonial}
            onToggleStatus={handleToggleTestimonialStatus}
          />
        ) : (
          <SettingsTab
            onSuccessToast={(msg) => {
              setStatusMessage(msg);
              setTimeout(() => setStatusMessage(""), 4000);
            }}
          />
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        editingId={editingProjectId}
        title={projectTitle}
        setTitle={setProjectTitle}
        label={projectLabel}
        setLabel={setProjectLabel}
        iconName={projectIconName}
        setIconName={setProjectIconName}
        description={projectDescription}
        setDescription={setProjectDescription}
        url={projectUrl}
        setUrl={setProjectUrl}
        order={projectOrder}
        setOrder={setProjectOrder}
        showOnHome={projectShowOnHome}
        setShowOnHome={setProjectShowOnHome}
        images={projectImages}
        previewImage={projectPreviewImage}
        demoScreen={projectDemoScreen}
        setDemoScreen={setProjectDemoScreen}
        uploadingImage={uploadingImage}
        deletingImageIndex={deletingImageIndex}
        saving={savingProject}
        formError={formError}
        onFilesUpload={handleFilesUpload}
        onSetPrimary={handleSetPrimaryImage}
        onRemoveImage={handleRemoveImage}
        onSave={handleSaveProject}
        onClose={() => setIsProjectModalOpen(false)}
      />

      {/* Testimonial Form Modal */}
      <TestimonialModal
        isOpen={isTestimonialModalOpen}
        editingId={editingTestimonialId}
        name={testimonialName}
        setName={setTestimonialName}
        role={testimonialRole}
        setRole={setTestimonialRole}
        quote={testimonialQuote}
        setQuote={setTestimonialQuote}
        rating={testimonialRating}
        setRating={setTestimonialRating}
        image={testimonialImage}
        setImage={setTestimonialImage}
        status={testimonialStatusState}
        setStatus={setTestimonialStatusState}
        uploadingAvatar={uploadingAvatar}
        saving={savingTestimonial}
        formError={formError}
        onAvatarUpload={handleAvatarUpload}
        onSave={handleSaveTestimonial}
        onClose={() => setIsTestimonialModalOpen(false)}
      />

      {/* Custom Sleek Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isDanger={confirmDialog.isDanger}
        isLoading={confirmDialog.isLoading}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
