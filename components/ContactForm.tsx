"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

const QUICK_TAGS = [
  "تطبيق موبايل",
  "موقع إلكتروني",
  "تصميم UI/UX",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleAddTag = (tag: string) => {
    setIdea((prev) => {
      const clean = prev.trim();
      if (!clean) return tag;
      if (clean.includes(tag)) return prev;
      return `${clean} + ${tag}`;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttempted(true);

    const cleanName = name.trim();
    const cleanIdea = idea.trim();

    if (!cleanName || !cleanIdea) {
      return;
    }

    const message = `مرحباً فريق FameX 👋\nاسمي: ${cleanName}\nفكرة مشروعي:\n${cleanIdea}\n\nجاهز نبدأ قعدة ونطلّع الفكرة للنور!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contact__card">
      <div className="contact__card-header">
        <div className="contact__card-dots" aria-hidden="true">
          <span className="contact__card-dot dot-red" />
          <span className="contact__card-dot dot-yellow" />
          <span className="contact__card-dot dot-green" />
        </div>
        <span className="contact__card-badge" dir="ltr">
          [ MESSAGE_GENERATOR // V2.0 ]
        </span>
      </div>

      <form onSubmit={handleSubmit} className="contact__card-body" noValidate>
        {/* Field 1: Name */}
        <div className="contact__field">
          <label htmlFor="contact-name" className="contact__label">
            <span>اسمك</span>
            <span className="contact__required" title="مطلوب">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            className={hasAttempted && !name.trim() ? "contact__input is-invalid" : "contact__input"}
            placeholder="نحب نناديك بإيه؟"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {hasAttempted && !name.trim() && (
            <p className="contact__field-error" role="alert">
              من فضلك اكتب اسمك
            </p>
          )}
        </div>

        {/* Field 2: Idea */}
        <div className="contact__field">
          <div className="contact__field-header">
            <label htmlFor="contact-idea" className="contact__label">
              <span>احكيلنا عن فكرتك</span>
              <span className="contact__required" title="مطلوب">*</span>
            </label>
            <span className="contact__field-hint">
              <Zap size={12} className="inline ml-1" />
              اختر للمساعدة:
            </span>
          </div>

          {/* Quick Suggestion Tags */}
          <div className="contact__tags">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="contact__tag-btn"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            id="contact-idea"
            name="idea"
            required
            className={hasAttempted && !idea.trim() ? "contact__textarea is-invalid" : "contact__textarea"}
            rows={4}
            placeholder="تطبيق موبايل، موقع، أو فكرة لسه بتكبر..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          {hasAttempted && !idea.trim() && (
            <p className="contact__field-error" role="alert">
              من فضلك احكيلنا باختصار عن فكرتك
            </p>
          )}
        </div>

        {/* Card Footer: Reassurance & Action Buttons */}
        <div className="contact__card-footer">
          <p className="contact__reassurance">
            <ShieldCheck size={15} aria-hidden="true" />
            <span>مفيش حاجة بتتبعت تلقائيًا</span>
          </p>

          <div className="contact__card-actions">
            <button
              type="submit"
              className="contact__btn-wa"
              aria-label="إرسال عبر واتساب"
            >
              <WhatsAppIcon size={16} />
              <span>إرسال واتساب</span>
              <ArrowLeft size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
