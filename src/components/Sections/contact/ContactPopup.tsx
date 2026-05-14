"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useForm, ValidationError } from "@formspree/react";
import Image from "next/image";
import AnimatedButton from "@/components/AnimatedButton";
import CloseButton from "@/components/CloseButton";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./ContactPopup.module.css";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Minimalny typ “podobny do Formspree errors”.
 * - bez `any`
 * - pozwala sprawdzić metody getFormErrors / getFieldErrors jeśli istnieją
 */
type FormspreeErrorsLike = {
  getFormErrors?: () => unknown[];
  getFieldErrors?: () => unknown[];
} & Record<string, unknown>;

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("contactPopup");

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isCompactHeight, setIsCompactHeight] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});

  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const [state, submitToFormspree] = useForm("xkgqgagz");

  // Opcja B: bezpieczne wykrywanie realnych błędów Formspree (SubmissionError)
  // useCallback => stabilna referencja i brak warninga w deps useEffect
  const hasFormspreeErrors = useCallback((errors: unknown): boolean => {
    if (!errors) return false;

    const e = errors as FormspreeErrorsLike;

    if (typeof e.getFormErrors === "function") {
      const formErrors = e.getFormErrors();
      return Array.isArray(formErrors) && formErrors.length > 0;
    }

    if (typeof e.getFieldErrors === "function") {
      const fieldErrors = e.getFieldErrors();
      return Array.isArray(fieldErrors) && fieldErrors.length > 0;
    }

    if (typeof e === "object") {
      return Object.keys(e).length > 0;
    }

    return true;
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "email":
        if (!value.trim()) return t("errors.required");
        if (!validateEmail(value)) return t("errors.emailFormat");
        return null;
      case "firstName":
      case "subject":
      case "message":
        if (!value.trim()) return t("errors.required");
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        errors[key as keyof typeof validationErrors] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const checkViewportHeight = () => {
      setIsCompactHeight(window.innerHeight < 900);
    };

    checkViewportHeight();
    window.addEventListener("resize", checkViewportHeight);
    return () => window.removeEventListener("resize", checkViewportHeight);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const checkScroll = () => {
      const hasScroll = container.scrollHeight > container.clientHeight;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      setShowScrollIndicator(hasScroll && !isAtBottom);
    };

    const timeoutId = window.setTimeout(checkScroll, 50);

    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      window.clearTimeout(timeoutId);
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [isOpen, showSuccessPopup, validationErrors]);

  useEffect(() => {
    if (!isOpen) return;

    // ✅ snapshot refów — nie używamy overlayRef.current / popupRef.current w cleanup
    const overlayEl = overlayRef.current;
    const popupEl = popupRef.current;

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    tlRef.current?.kill();
    if (overlayEl) gsap.killTweensOf(overlayEl);
    if (popupEl) gsap.killTweensOf(popupEl);

    const tl = gsap.timeline({
      onComplete: () => {
        if (popupEl) gsap.set(popupEl, { willChange: "auto" });
      },
    });
    tlRef.current = tl;

    if (popupEl) {
      gsap.set(popupEl, {
        opacity: 1,
        visibility: "visible",
        transformOrigin: "top center",
        willChange: "transform",
      });
    }

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const overlayDuration = isMobile ? 0.3 : 0.5;
    const popupDuration = isMobile ? 0.6 : isTablet ? 0.75 : 0.9;
    const popupDelay = isMobile ? "-=0.1" : "-=0.2";

    if (overlayEl) {
      tl.fromTo(
        overlayEl,
        { opacity: 0 },
        { opacity: 1, duration: overlayDuration, ease: "power2.out" }
      );
    }

    if (popupEl) {
      tl.fromTo(
        popupEl,
        {
          clipPath: "inset(0 0 100% 0)",
          y: isMobile ? -10 : -20,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform, clip-path",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          boxShadow: isMobile
            ? "0 20px 60px rgba(0,0,0,0.25)"
            : "0 30px 80px rgba(0,0,0,0.3)",
          duration: popupDuration,
          ease: isMobile ? "power2.out" : "power2.inOut",
          transform: "translate3d(0, 0, 0)",
          onComplete: () => {
            popupEl.style.willChange = "auto";
          },
        },
        popupDelay
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && popupEl) {
        const focusable = popupEl.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const active = document.activeElement as HTMLElement | null;
        if (!active) return;

        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overscrollBehavior = originalOverscroll;
      document.removeEventListener("keydown", handleKeyDown);

      tlRef.current?.kill();
      tlRef.current = null;

      if (overlayEl) gsap.killTweensOf(overlayEl);
      if (popupEl) gsap.killTweensOf(popupEl);

      lastActiveElementRef.current?.focus?.();
      lastActiveElementRef.current = null;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Formspree state
  useEffect(() => {
    if (state.succeeded) {
      setShowSuccessPopup(true);
      setSubmitStatus("success");
      setFormData({
        firstName: "",
        email: "",
        subject: "",
        message: "",
      });
      return;
    }

    if (hasFormspreeErrors(state.errors)) {
      setSubmitStatus("error");
    }
  }, [state.succeeded, state.errors, hasFormspreeErrors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus("idle");
    setValidationErrors({});

    if (!validateForm()) return;

    await submitToFormspree(e);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setTimeout(() => {
      onClose();
      setSubmitStatus("idle");
    }, 300);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof validationErrors];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 z-[9998] hidden md:block"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <div
          ref={popupRef}
          className={`
            bg-white flex flex-col
            w-full h-full
            sm:w-full sm:h-full
            md:w-[calc(100vw-32px)]
            ${
              isCompactHeight
                ? "md:h-[calc(100vh-16px)] md:max-h-[calc(100vh-16px)] md:m-2"
                : "md:h-[calc(100vh-32px)] md:max-h-[85vh] md:m-4"
            }
            md:max-w-[600px]
            lg:w-[calc(100vw-64px)] lg:h-auto lg:max-w-[600px]
            ${
              isCompactHeight
                ? "lg:max-h-[calc(100vh-20px)] lg:m-2"
                : "lg:max-h-[80vh] lg:m-8"
            }
            ${
              isCompactHeight
                ? "xl:w-[600px] xl:max-h-[calc(100vh-24px)]"
                : "xl:w-[600px] xl:max-h-[85vh]"
            }
            ${
              isCompactHeight
                ? "2xl:w-[600px] 2xl:max-h-[calc(100vh-24px)]"
                : "2xl:w-[600px] 2xl:max-h-[90vh]"
            }
          `}
          style={{ opacity: 1, transformOrigin: "top center" }}
        >
          {showSuccessPopup ? (
            <>
              <div
                className={`
                  flex-shrink-0 bg-white 
                  flex justify-end items-center relative z-20
                  ${
                    isCompactHeight
                      ? "p-3 sm:p-4 md:p-4 lg:p-5 xl:p-5"
                      : "p-4 sm:p-6 md:p-6 lg:p-7 xl:p-8"
                  }
                `}
              >
                <CloseButton
                  onClick={handleCloseSuccessPopup}
                  ariaLabel={t("success.closeAria")}
                  rounded
                />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pb-8">
                <div className="mb-6">
                  <Image
                    src="/images/emoji.svg"
                    alt={t("success.emojiAlt")}
                    width={160}
                    height={82}
                    className="w-auto h-[60px] sm:h-[70px] md:h-[82px]"
                    priority
                  />
                </div>

                <h2 className="text-black font-bold text-center mb-3 text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px]">
                  {t("success.title")}
                </h2>

                <p className="text-black/80 text-center max-w-md text-[14px] sm:text-[16px] md:text-[18px] font-normal">
                  {t("success.description")}
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className={`
                  flex-shrink-0 bg-white 
                  flex justify-end items-start relative z-20
                  ${
                    isCompactHeight
                      ? "pt-3 px-3 sm:pt-4 sm:px-4 md:pt-4 md:px-4 lg:pt-5 lg:px-5 xl:pt-5 xl:px-5 pb-0"
                      : "pt-4 px-4 sm:pt-6 sm:px-6 md:pt-6 md:px-6 lg:pt-7 lg:px-7 xl:pt-8 xl:px-8 pb-0"
                  }
                `}
              >
                <CloseButton onClick={onClose} ariaLabel={t("closeAria")} />
              </div>

              <div
                className={`
                  flex-shrink-0 bg-white relative z-20
                  ${
                    isCompactHeight
                      ? "px-3 sm:px-4 md:px-4 lg:px-5 xl:px-5 pt-3"
                      : "px-4 sm:px-6 md:px-6 lg:px-7 xl:px-8 pt-3"
                  }
                `}
              >
                <h3
                  id="contact-title"
                  className={`
                    text-black font-semibold text-left
                    ${
                      isCompactHeight
                        ? "text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] xl:text-[32px]"
                        : "text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px]"
                    }
                  `}
                >
                  {t("title")}
                </h3>
              </div>

              <div
                ref={scrollContainerRef}
                className={`
                  flex-1 overflow-y-auto overflow-x-hidden
                  overscroll-contain min-h-0 ${styles.scroll}
                  relative
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
                `}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div
                  className={`
                    ${
                      isCompactHeight
                        ? "px-3 sm:px-4 md:px-4 lg:px-5 xl:px-5 pb-6"
                        : "px-4 sm:px-6 md:px-6 lg:px-7 xl:px-8 pb-8"
                    }
                  `}
                >
                  <div className="pt-8">
                    <p
                      className={`
                        text-black font-medium text-left mb-1
                        ${
                          isCompactHeight
                            ? "text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]"
                            : "text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px]"
                        }
                      `}
                    >
                      {t("description.line1")}
                    </p>
                    <p
                      className={`
                        text-black font-medium text-left
                        ${
                          isCompactHeight
                            ? "text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]"
                            : "text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px]"
                        }
                      `}
                    >
                      {t("description.line2")}
                    </p>
                  </div>

                  <div className="pt-8">
                    <div className="w-full h-0.5 bg-black mb-8" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="popup-content">
                      <input
                        ref={firstInputRef}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={t("fields.firstName.placeholder")}
                        required
                        className={`
                          w-full border-2  
                          text-black placeholder-gray-600 
                          focus:outline-none transition-all duration-200
                          px-3 py-2.5 sm:px-4 sm:py-3
                          text-[14px] sm:text-[15px] md:text-[16px]
                          ${
                            validationErrors.firstName
                              ? "bg-[#e2e2e2] border-red-500 focus:border-red-500 focus:bg-white"
                              : formData.firstName
                              ? "bg-[#e2e2e2] border-transparent text-black focus:bg-white focus:border-transparent"
                              : "bg-[#e2e2e2] border-transparent focus:border-transparent focus:bg-white"
                          }
                        `}
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.firstName}
                        </p>
                      )}
                      <ValidationError
                        prefix="First Name"
                        field="firstName"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="popup-content">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("fields.email.placeholder")}
                        required
                        className={`
                          w-full border-2  
                          text-black placeholder-gray-600 
                          focus:outline-none transition-all duration-200
                          px-3 py-2.5 sm:px-4 sm:py-3
                          text-[14px] sm:text-[15px] md:text-[16px]
                          ${
                            validationErrors.email
                              ? "bg-[#e2e2e2] border-red-500 focus:border-red-500 focus:bg-white"
                              : formData.email
                              ? "bg-[#e2e2e2] border-transparent text-black focus:bg-white focus:border-transparent"
                              : "bg-[#e2e2e2] border-transparent focus:border-transparent focus:bg-white"
                          }
                        `}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="popup-content mt-8">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={t("fields.subject.placeholder")}
                        required
                        className={`
                          w-full border-2  
                          text-black placeholder-gray-600 
                          focus:outline-none transition-all duration-200
                          px-3 py-2.5 sm:px-4 sm:py-3
                          text-[14px] sm:text-[15px] md:text-[16px]
                          ${
                            validationErrors.subject
                              ? "bg-[#e2e2e2] border-red-500 focus:border-red-500 focus:bg-white"
                              : formData.subject
                              ? "bg-[#e2e2e2] border-transparent text-black focus:bg-white focus:border-transparent"
                              : "bg-[#e2e2e2] border-transparent focus:border-transparent focus:bg-white"
                          }
                        `}
                      />
                      {validationErrors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.subject}
                        </p>
                      )}
                      <ValidationError
                        prefix="Subject"
                        field="subject"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="popup-content">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={t("fields.message.placeholder")}
                        required
                        rows={isCompactHeight ? 3 : 4}
                        className={`
                          w-full border-2  
                          text-black placeholder-gray-600 
                          resize-none focus:outline-none transition-all duration-200
                          ${
                            isCompactHeight
                              ? "px-2.5 py-2 sm:px-3 sm:py-2.5"
                              : "px-3 py-2.5 sm:px-4 sm:py-3"
                          }
                          text-[14px] sm:text-[15px] md:text-[16px]
                          ${
                            isCompactHeight
                              ? "min-h-[80px] sm:min-h-[90px] md:min-h-[100px] lg:min-h-[110px]"
                              : "min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px]"
                          }
                          ${
                            validationErrors.message
                              ? "bg-[#e2e2e2] border-red-500 focus:border-red-500 focus:bg-white"
                              : formData.message
                              ? "bg-[#e2e2e2] border-transparent text-black focus:bg-white focus:border-transparent"
                              : "bg-[#e2e2e2] border-transparent focus:border-transparent focus:bg-white"
                          }
                        `}
                      />
                      {validationErrors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.message}
                        </p>
                      )}
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="popup-content mb-2">
                      <AnimatedButton
                        type="submit"
                        variant="cookieAccept"
                        disabled={state.submitting}
                        className="
                          w-full md:w-auto md:min-w-[200px]
                          h-[45px] sm:h-[48px] md:h-[53px]
                          px-6 sm:px-7 md:px-8
                          text-[14px] sm:text-[15px] md:text-[16px]
                        "
                        ariaLabel={t("submit.aria")}
                      >
                        {state.submitting
                          ? t("submit.sending")
                          : submitStatus === "success" || state.succeeded
                          ? t("submit.sent")
                          : t("submit.default")}
                      </AnimatedButton>
                    </div>

                    {submitStatus === "error" && (
                      <p className="text-red-600 text-sm mt-2">
                        {t("submit.error")}
                      </p>
                    )}
                    <ValidationError
                      errors={state.errors}
                      className="text-red-500 text-sm mt-2"
                    />
                  </form>
                </div>

                {showScrollIndicator && (
                  <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactPopup;
