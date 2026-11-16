"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Project,
  PROJECT_CATEGORIES,
  normalizeProjectCategory,
  ProjectActionButton,
} from "@/components/Projects";

interface ProjectGalleryModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectGalleryModal({
  project,
  isOpen,
  onClose,
}: ProjectGalleryModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [magnified, setMagnified] = useState(false);
  const isDraggingRef = useRef(false);

  // Reset active image on project change or modal open
  useEffect(() => {
    setActiveIdx(0);
    setDirection(0);
    setIsZoomed(false);
    setMagnified(false);
  }, [project?.id, isOpen]);

  const images =
    project?.images && project.images.length > 0
      ? project.images
      : project?.previewImage
      ? [project.previewImage]
      : [];

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setMagnified(false);
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setMagnified(false);
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Lock body & html scroll & listen for keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
          setMagnified(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handleNext();
      } else if (e.key === "ArrowRight") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev, isZoomed]);

  if (!isOpen || !project) return null;

  const catKey = normalizeProjectCategory(project.label || project.demoScreen);
  const cat = PROJECT_CATEGORIES.find((c) => c.id === catKey);
  const CategoryIcon = cat ? cat.Icon : project.Icon || Layers;
  const currentImage = images[activeIdx] || project.previewImage;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center select-none overscroll-contain"
        dir="rtl"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-5 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto relative w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain touch-pan-y no-scrollbar rounded-3xl border border-[#a6f45d]/30 bg-gradient-to-b from-[#0f1d13] via-[#09130d] to-[#040805] shadow-[0_25px_65px_rgba(0,0,0,0.95),0_0_35px_rgba(166,244,93,0.12)] flex flex-col z-10"
          >
            {/* Header Close Bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#09130d]/85 backdrop-blur-md border-b border-[#1b3420]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a6f45d]/10 border border-[#a6f45d]/30 text-[#a6f45d] text-xs font-bold">
                  <CategoryIcon className="w-3.5 h-3.5" />
                  <span>{cat?.label || project.label || "مشروع مميز"}</span>
                </span>
                {images.length > 1 && (
                  <span className="text-xs font-mono text-[#8fa593] bg-black/40 px-2.5 py-0.5 rounded-full border border-white/5">
                    صورة {activeIdx + 1} من {images.length}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-[#a6f45d] text-white/70 hover:text-black border border-white/10 hover:border-[#a6f45d] transition-all cursor-pointer"
                aria-label="إغلاق النافذة"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Image Gallery Viewport */}
            <div className="relative aspect-[16/10] w-full bg-[#070d08] overflow-hidden border-b border-[#1b3420] group/gallery touch-pan-y">
              {/* Static Background Ambient Glow (Zero CPU/GPU drag overhead) */}
              {currentImage && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,244,93,0.12)_0%,transparent_75%)]" />
                  <Image
                    key={currentImage}
                    src={currentImage}
                    alt=""
                    fill
                    aria-hidden="true"
                    className="object-cover blur-2xl opacity-25 scale-110 pointer-events-none transition-opacity duration-300"
                    sizes="320px"
                  />
                </div>
              )}

              {currentImage ? (
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIdx}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: -dir * 90,
                        opacity: 0,
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                      },
                      exit: (dir: number) => ({
                        zIndex: 0,
                        x: dir * 90,
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 380, damping: 35 },
                      opacity: { duration: 0.18 },
                    }}
                    drag={images.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                    }}
                    onDragEnd={(_, info) => {
                      const swipe = info.offset.x;
                      const velocity = info.velocity.x;
                      if (swipe > 30 || velocity > 200) {
                        handleNext();
                      } else if (swipe < -30 || velocity < -200) {
                        handlePrev();
                      }
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 250);
                    }}
                    onTap={() => {
                      if (!isDraggingRef.current) {
                        setIsZoomed(true);
                      }
                    }}
                    className={`absolute inset-0 flex items-center justify-center cursor-zoom-in will-change-transform ${
                      images.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                    title="اضغط لتكبير وعرض الصورة بالحجم الكامل"
                  >
                    {/* Foreground Sharp Image */}
                    <Image
                      src={currentImage}
                      alt={`${project.title} - صورة ${activeIdx + 1}`}
                      fill
                      className="object-contain p-2 relative z-10 select-none pointer-events-none"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7d9b7f] font-mono text-sm">
                  معاينة المشروع
                </div>
              )}

              {/* Floating Zoom Button */}
              {currentImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                  className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-[#a6f45d] text-white/90 hover:text-black border border-white/15 hover:border-[#a6f45d] backdrop-blur-md text-xs font-mono font-medium transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer group/zoom"
                  aria-label="تكبير الصورة بالحجم الكامل"
                  title="تكبير الصورة (اضغط على الصورة أو الزر)"
                >
                  <Maximize2 size={13} className="transition-transform group-hover/zoom:scale-110" />
                  <span>تكبير</span>
                </button>
              )}

              {/* Prev / Next Arrows (RTL) */}
              {images.length > 1 && (
                <>
                  {/* زرار التالي (يسار) - للتقدم في اتجاه القراءة العربي */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-[#a6f45d] text-white hover:text-black border border-white/10 transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                    aria-label="الصورة التالية"
                    title="التالي"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {/* زرار السابق (يمين) - للرجوع للخلف */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-[#a6f45d] text-white hover:text-black border border-white/10 transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                    aria-label="الصورة السابقة"
                    title="السابق"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="p-3 bg-[#0a140d]/60 border-b border-[#1b3420] overflow-x-auto no-scrollbar flex items-center gap-2.5">
                {images.map((img, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDirection(idx > activeIdx ? 1 : -1);
                        setActiveIdx(idx);
                      }}
                      className={`relative shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#a6f45d] shadow-[0_0_12px_rgba(166,244,93,0.4)] scale-105"
                          : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`مصغرة ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Details & Action Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#a8bda7] leading-relaxed whitespace-pre-line">
                  {project.description &&
                  project.description.trim() &&
                  project.description !== "لا يوجد وصف مدخل."
                    ? project.description
                    : catKey === "mobile"
                    ? "تطبيق ذكي متكامل بنظام تشغيل سريع وتجربة مستخدم تفاعلية متطورة صُممت لتلبي احتياجات العملاء بأعلى كفاءة."
                    : catKey === "branding"
                    ? "هوية بصرية كاملة وتصميم جرافيكي مبتكر يبرز قوة وحضور علامتك التجارية ويحفرها في ذهن العميل."
                    : "منصة ويب متطورة وتجربة رقمية فائقة السرعة تخدم نمو البيزنس وتحقق أعلى مبيعات."}
                </p>
              </div>

              {/* Bottom Actions Footer */}
              <div className="pt-4 border-t border-[#1b3420] flex items-center justify-between gap-3">
                <ProjectActionButton project={project} />

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8fa593] hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fullscreen Lightbox Zoom Overlay */}
        <AnimatePresence>
          {isZoomed && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-2xl flex flex-col select-none overscroll-contain"
              dir="rtl"
            >
              {/* Top Bar - Mobile Optimized & Zero Overflow */}
              <div className="sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-black/85 backdrop-blur-md border-b border-white/10 gap-2">
                {/* Right: Category & Counter */}
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#a6f45d]/10 border border-[#a6f45d]/30 text-[#a6f45d] text-[11px] sm:text-xs font-bold shrink-0">
                    <CategoryIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate max-w-[85px] sm:max-w-none">
                      {cat?.label || project.label || "مشروع مميز"}
                    </span>
                  </span>

                  <span className="text-white font-bold text-sm hidden md:inline truncate max-w-xs">
                    {project.title}
                  </span>

                  {images.length > 1 && (
                    <span className="text-[11px] sm:text-xs font-mono text-[#a6f45d] bg-black/60 px-2 sm:px-2.5 py-0.5 rounded-full border border-white/10 whitespace-nowrap shrink-0">
                      {activeIdx + 1} / {images.length}
                    </span>
                  )}
                </div>

                {/* Left: Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMagnified((prev) => !prev)}
                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    title={magnified ? "عرض بالحجم المناسب" : "تكبير تفاصيل 1.8x"}
                  >
                    {magnified ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                    <span className="hidden sm:inline">
                      {magnified ? "تناسب الشاشة" : "تكبير تفاصيل"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsZoomed(false);
                      setMagnified(false);
                    }}
                    className="p-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#a6f45d] hover:bg-[#bcf87c] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(166,244,93,0.35)] cursor-pointer flex items-center gap-1.5 shrink-0"
                    aria-label="إغلاق وضع التكبير"
                    title="إغلاق التكبير"
                  >
                    <X size={16} className="sm:hidden" />
                    <Minimize2 size={15} className="hidden sm:inline" />
                    <span className="hidden sm:inline">تصغير</span>
                    <span className="hidden md:inline text-[10px] opacity-75">(Esc)</span>
                  </button>
                </div>
              </div>

              {/* Viewport with Static Ambient Glow & Smooth Touch Drag */}
              <div
                className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden touch-pan-y"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsZoomed(false);
                    setMagnified(false);
                  }
                }}
              >
                {/* Static Background Ambient Glow (Zero CPU/GPU drag overhead) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,244,93,0.1)_0%,transparent_70%)]" />
                  {currentImage && (
                    <Image
                      key={currentImage}
                      src={currentImage}
                      alt=""
                      fill
                      aria-hidden="true"
                      className="object-contain blur-3xl opacity-20 scale-110 pointer-events-none transition-opacity duration-300"
                      sizes="320px"
                    />
                  )}
                </div>

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIdx}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: -dir * 90,
                        opacity: 0,
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                      },
                      exit: (dir: number) => ({
                        zIndex: 0,
                        x: dir * 90,
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 380, damping: 35 },
                      opacity: { duration: 0.18 },
                    }}
                    drag={magnified ? true : images.length > 1 ? "x" : false}
                    dragConstraints={
                      magnified
                        ? { left: -400, right: 400, top: -250, bottom: 250 }
                        : { left: 0, right: 0 }
                    }
                    dragElastic={magnified ? 0.2 : 0.7}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                    }}
                    onDragEnd={(_, info) => {
                      if (!magnified && images.length > 1) {
                        const swipe = info.offset.x;
                        const velocity = info.velocity.x;
                        if (swipe > 30 || velocity > 200) {
                          handleNext();
                        } else if (swipe < -30 || velocity < -200) {
                          handlePrev();
                        }
                      }
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 250);
                    }}
                    onTap={() => {
                      if (!isDraggingRef.current) {
                        setMagnified((prev) => !prev);
                      }
                    }}
                    className={`absolute inset-0 m-auto w-full h-full max-w-[95vw] max-h-[80vh] flex items-center justify-center select-none will-change-transform ${
                      magnified
                        ? "cursor-grab active:cursor-grabbing"
                        : images.length > 1
                        ? "cursor-grab active:cursor-grabbing"
                        : "cursor-zoom-in"
                    }`}
                    style={{
                      scale: magnified ? 1.75 : 1,
                      transition: "scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    title={
                      magnified
                        ? "اضغط للتصغير أو اسحب للتحريك"
                        : "اضغط لتكبير أدق التفاصيل أو اسحب للتنقل"
                    }
                  >
                    <Image
                      src={currentImage}
                      alt={`${project.title} - صورة مكبرة ${activeIdx + 1}`}
                      fill
                      className="object-contain relative z-10 select-none pointer-events-none"
                      sizes="100vw"
                      priority
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Adjacent Image Preloader for zero-delay instant switching */}
                {images.length > 1 && (
                  <div className="hidden pointer-events-none" aria-hidden="true">
                    <Image
                      src={images[(activeIdx + 1) % images.length]}
                      alt=""
                      width={10}
                      height={10}
                      priority
                    />
                    <Image
                      src={images[(activeIdx - 1 + images.length) % images.length]}
                      alt=""
                      width={10}
                      height={10}
                      priority
                    />
                  </div>
                )}

                {/* Prev / Next Arrows in Zoom Mode */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMagnified(false);
                        handleNext();
                      }}
                      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 hover:bg-[#a6f45d] text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
                      aria-label="الصورة التالية"
                      title="التالي"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMagnified(false);
                        handlePrev();
                      }}
                      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 hover:bg-[#a6f45d] text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
                      aria-label="الصورة السابقة"
                      title="السابق"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Thumbnails in Zoom Mode */}
              {images.length > 1 && (
                <div
                  className="sticky bottom-0 z-40 p-3 bg-black/80 backdrop-blur-md border-t border-white/10 overflow-x-auto no-scrollbar flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {images.map((img, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMagnified(false);
                          setDirection(idx > activeIdx ? 1 : -1);
                          setActiveIdx(idx);
                        }}
                        className={`relative shrink-0 w-14 sm:w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isActive
                            ? "border-[#a6f45d] shadow-[0_0_12px_rgba(166,244,93,0.5)] scale-105"
                            : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/50"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`مصغرة ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
