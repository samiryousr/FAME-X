"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getPublishedTestimonials,
  submitTestimonial,
  type TestimonialItem,
} from "@/lib/testimonialsService";

type DisplayTestimonial = TestimonialItem & { image?: string };

const SAMPLE_TESTIMONIALS: DisplayTestimonial[] = [
  {
    id: "sample-ahmed",
    name: "أحمد حسن",
    quote: "تجربة مميزة من أول خطوة، والتواصل كان واضح والشغل طلع مرتب وسهل الاستخدام.",
    rating: 5,
    status: "approved",
    createdAt: 0,
    image: "/developer.png",
  },
  {
    id: "sample-sara",
    name: "سارة محمود",
    quote: "فريق متعاون واهتم بالتفاصيل، والنتيجة كانت قريبة جدًا من اللي كنا متخيلينه.",
    rating: 5,
    status: "approved",
    createdAt: 0,
    image: "/designer.png",
  },
  {
    id: "sample-mohamed",
    name: "محمد علي",
    quote: "شغل احترافي وتنفيذ سريع، والتجربة كلها كانت مريحة من البداية للنهاية.",
    rating: 5,
    status: "approved",
    createdAt: 0,
    image: "/photographer.png",
  },
];

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="testimonial-card__quote-svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>(SAMPLE_TESTIMONIALS);

  useEffect(() => {
    let isMounted = true;

    getPublishedTestimonials()
      .then((items) => {
        if (isMounted && items.length > 0) {
          setTestimonials(items);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load testimonials:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure we have enough items for an unbroken endless chain without any gaps
  const displayTestimonials = (() => {
    if (testimonials.length === 0) return [];
    let items = [...testimonials];
    while (items.length < 8) {
      items = [...items, ...testimonials];
    }
    return items;
  })();

  return (
    <div className="testimonials-wrapper" dir="rtl">
      <div
        className="testimonials-marquee"
        dir="ltr"
        role="region"
        aria-label="آراء العملاء"
      >
        <div className="testimonials-marquee__track" dir="ltr">
          {[0, 1].map((copy) => (
            <div
              className="testimonials-marquee__set"
              key={copy}
              aria-hidden={copy === 1}
            >
              {displayTestimonials.map((testimonial, idx) => (
                <article
                  className="testimonial-card"
                  dir="rtl"
                  key={`${copy}-${testimonial.id}-${idx}`}
                >
                  <div className="testimonial-card__top">
                    <div
                      className="testimonial-card__stars"
                      aria-label={`التقييم: ${testimonial.rating} من 5`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          className={index < testimonial.rating ? "is-filled" : ""}
                          key={index}
                        >
                          <StarIcon filled={index < testimonial.rating} />
                        </span>
                      ))}
                    </div>
                    <span className="testimonial-card__quote-icon">
                      <QuoteIcon />
                    </span>
                  </div>
                  <blockquote className="testimonial-card__text">
                    <p>{testimonial.quote}</p>
                  </blockquote>
                  <div className="testimonial-card__author">
                    {testimonial.image ? (
                      <Image
                        className="testimonial-card__avatar object-cover"
                        src={testimonial.image}
                        alt={`صورة ${testimonial.name}`}
                        width={52}
                        height={52}
                      />
                    ) : (
                      <span className="testimonial-card__avatar" aria-hidden="true">
                        {testimonial.name.trim().charAt(0)}
                      </span>
                    )}
                    <div>
                      <cite className="testimonial-card__name">{testimonial.name}</cite>
                      {testimonial.role && (
                        <p className="text-[11px] text-[#8ea593] mt-0.5 leading-tight">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ReviewForm />
    </div>
  );
}

function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!rating) {
      setError("اختار تقييمك من النجوم قبل الإرسال.");
      return;
    }

    try {
      setSubmitting(true);
      await submitTestimonial({ name, quote, rating });
      setSubmitted(true);
      setName("");
      setQuote("");
      setRating(0);
      setIsOpen(false);
    } catch (submitError: unknown) {
      console.error("Failed to submit testimonial:", submitError);
      setError("تعذر إرسال رأيك. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="review-invite">
        <div>
          <h3 className="review-invite__title">
            {submitted ? "شكرًا لمشاركة رأيك" : "رأيك يهمنا"}
          </h3>
          <p className="review-invite__text">
            {submitted
              ? "وصلنا رأيك وهيظهر بعد مراجعته."
              : "شاركنا تجربتك وساعد غيرك ياخد قراره."}
          </p>
        </div>
        <button
          type="button"
          className="review-invite__button"
          onClick={() => {
            setSubmitted(false);
            setError("");
            setIsOpen(true);
          }}
        >
          اكتب رأيك
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </button>
      </div>

      {isOpen && createPortal(
        <div
          className="review-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) setIsOpen(false);
          }}
        >
          <section
            className="review-form-wrapper"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            dir="rtl"
          >
            <button
              type="button"
              className="review-modal__close"
              aria-label="إغلاق"
              onClick={() => setIsOpen(false)}
              disabled={submitting}
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
            <div className="review-form-header">
              <p className="eyebrow">شاركنا تجربتك</p>
              <h3 className="review-form-title" id="review-modal-title">اكتب رأيك</h3>
              <p className="review-form-subtitle">
                رأيك هيوصلنا للمراجعة، وهيظهر هنا بعد اعتماده من فريقنا.
              </p>
            </div>

            {submitted ? (
              <div className="review-form-success" role="status">
                <svg
                  aria-hidden="true"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>شكرًا ليك! رأيك اتبعت للمراجعة</p>
                <button
                  type="button"
                  className="review-form-submit"
                  onClick={() => setIsOpen(false)}
                >
                  تمام
                </button>
              </div>
            ) : (
              <form className="review-form" onSubmit={handleSubmit}>
                <div className="review-form-field">
                  <label htmlFor="review-name" className="review-form-label">اسمك</label>
                  <input
                    id="review-name"
                    type="text"
                    className="review-form-input"
                    placeholder="اكتب اسمك هنا..."
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    required
                  />
                </div>

                <fieldset className="review-form-field review-form-rating">
                  <legend className="review-form-label">تقييمك</legend>
                  <div className="review-form-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="review-form-star-btn"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(star)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`${star} نجوم`}
                        aria-pressed={rating === star}
                      >
                        <StarIcon filled={star <= (hoverRating || rating)} />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="review-form-field review-form-field--review">
                  <label htmlFor="review-text" className="review-form-label">رأيك</label>
                  <textarea
                    id="review-text"
                    className="review-form-textarea"
                    placeholder="قولنا رأيك في تجربتك معانا..."
                    rows={4}
                    value={quote}
                    onChange={(event) => setQuote(event.target.value)}
                    minLength={5}
                    maxLength={1000}
                    required
                  />
                </div>

                {error && <p className="review-form-error" role="alert">{error}</p>}

                <button
                  type="submit"
                  className="review-form-submit"
                  disabled={submitting}
                >
                  {submitting ? "جاري الإرسال..." : "إرسال الرأي"}
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

export default TestimonialsSection;
