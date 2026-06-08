"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Image from "next/image";
import AnimatedButton from "@/components/AnimatedButton";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type FormspreeErrorsLike = {
  getFormErrors?: () => unknown[];
  getFieldErrors?: () => unknown[];
} & Record<string, unknown>;

type ValidationErrors = {
  firstName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

interface CaseStudyContactSectionProps {
  formId?: string;
}

const CaseStudyContactSection: React.FC<CaseStudyContactSectionProps> = ({
  formId = "xkgqgagz",
}) => {
  const t = useTranslations("caseStudyContact");
  const [state, submitToFormspree] = useForm(formId);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

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
    const errors: ValidationErrors = {};

    (Object.entries(formData) as Array<[keyof typeof formData, string]>).forEach(
      ([key, value]) => {
        const error = validateField(String(key), value);
        if (error) errors[key] = error;
      }
    );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isSucceeded = useMemo(() => state.succeeded, [state.succeeded]);

  React.useEffect(() => {
    if (isSucceeded) {
      setSubmitStatus("success");
      setFormData({ firstName: "", email: "", subject: "", message: "" });
      setValidationErrors({});
      return;
    }

    if (hasFormspreeErrors(state.errors)) {
      setSubmitStatus("error");
    }
  }, [isSucceeded, state.errors, hasFormspreeErrors]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ValidationErrors];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus("idle");
    setValidationErrors({});

    if (!validateForm()) return;

    await submitToFormspree(e);
  };

  const handleSendAnother = () => {
    // Nie opieramy widoku o state.succeeded, bo tego nie da się zresetować
    setSubmitStatus("idle");
    setValidationErrors({});
    setFormData({ firstName: "", email: "", subject: "", message: "" });
  };

  const showSuccess = submitStatus === "success";

  const sectionRef = useScrollReveal<HTMLElement>({
    start: "top 80%",
    end: "top 50%",
  });

  return (
    <section ref={sectionRef} className="w-full bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px] pb-[60px] lg:pb-[100px]">
        <div>
          {/* płynny odstęp między kolumnami + pełna szerokość do krawędzi sekcji */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* LEFT: copy (na desktop na dole) */}
            <div className="flex-1 lg:max-w-[540px] lg:self-end">
              <p className="text-black text-base leading-[150%]">{t("kicker")}</p>

              <h2 className="mt-3 font-semibold text-[40px] sm:text-[48px] lg:text-[56px] leading-[100%] text-black">
                {t("headline")}
              </h2>
            </div>

            {/* RIGHT: kolumna do krawędzi, ale karta max 500px i dosunięta do prawej */}
            <div className="flex-1 w-full">
              <div className="ml-auto w-full max-w-[500px] bg-white border border-black p-6 sm:p-8">
                {showSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-6">
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

                    <h3 className="text-black font-bold mb-3 text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px]">
                      {t("success.title")}
                    </h3>

                    <p className="text-black/80 max-w-md text-[14px] sm:text-[16px] md:text-[18px] font-normal">
                      {t("success.description")}
                    </p>

                    <button
                      type="button"
                      onClick={handleSendAnother}
                      className="mt-8 underline text-black hover:opacity-70 transition-opacity"
                    >
                      {t("success.sendAnother")}
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-black font-semibold text-[28px] leading-[110%]">
                      {t("form.title")}
                    </h3>

                    <div className="mt-6 w-full border-t border-black" />

                    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                      {/* Name */}
                      <div className="popup-content">
                        <input
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

                      {/* Email */}
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

                      {/* Subject */}
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

                      {/* Message */}
                      <div className="popup-content">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={t("fields.message.placeholder")}
                          required
                          rows={4}
                          className={`
                            w-full border-2  
                            text-black placeholder-gray-600 
                            resize-none focus:outline-none transition-all duration-200
                            px-3 py-2.5 sm:px-4 sm:py-3
                            text-[14px] sm:text-[15px] md:text-[16px]
                            min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px]
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

                      {/* Submit */}
                      <div className="popup-content mb-2">
                        <AnimatedButton
                          type="submit"
                          variant="cookieAccept"
                          disabled={state.submitting}
                          className="
                            w-full
                            h-[45px] sm:h-[48px] md:h-[53px]
                            px-6 sm:px-7 md:px-8
                            text-[14px] sm:text-[15px] md:text-[16px]
                          "
                          ariaLabel={t("submit.aria")}
                        >
                          {state.submitting
                            ? t("submit.sending")
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyContactSection;
