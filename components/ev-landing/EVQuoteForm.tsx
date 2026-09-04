"use client";

import { useState } from "react";
import { UTM_KEYS, getCookie, utmCookieName } from "@/lib/utm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    _show_thank_you?: (
      id: string,
      message: string,
      trackcmp_url?: string,
      email?: string
    ) => void;
    _show_error?: (id: string, message: string, html?: string) => void;
  }
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/** Maps ActiveCampaign's custom field IDs to the UTM keys they store. */
const UTM_FIELD_IDS: Record<(typeof UTM_KEYS)[number], string> = {
  utm_source: "field[22]",
  utm_medium: "field[23]",
  utm_campaign: "field[24]",
  utm_term: "field[25]",
};

const GENERIC_ERROR_MESSAGE =
  "Something went wrong sending your enquiry. Please try again or call us on 0161 566 0197.";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  postcode: string;
  privacy: boolean;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  postcode?: string;
}

const FIELD_CLASS =
  "w-full h-[50px] rounded-[8px] bg-[#F4F6FA] outline outline-1 outline-[#D1D1D1] px-[14px] text-[14px] text-[#111] placeholder:text-[#C8C8C8] placeholder:text-[14px] placeholder:tracking-[0.02em] font-text focus:outline-2 focus:outline-black focus:bg-white transition-all";

const LABEL_CLASS =
  "block text-[12px] font-text font-normal uppercase tracking-[0.02em] text-black mb-[10px]";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function EVQuoteForm() {
  const [values, setValues] = useState<FormValues>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    postcode: "",
    privacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!values.firstname.trim()) e.firstname = "This field is required.";
    if (!values.lastname.trim()) e.lastname = "This field is required.";
    if (!values.email.trim()) {
      e.email = "This field is required.";
    } else if (!EMAIL_REGEX.test(values.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!values.phone.trim()) e.phone = "This field is required.";
    if (!values.postcode.trim()) e.postcode = "This field is required.";
    return e;
  };

  const handleChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = field === "privacy" ? e.target.checked : e.target.value;
      setValues((v) => ({ ...v, [field]: val }));
      if (errors[field as keyof FormErrors]) {
        setErrors((err) => ({ ...err, [field]: undefined }));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const params = new URLSearchParams({
      u: "9",
      f: "9",
      s: "",
      c: "0",
      m: "0",
      act: "sub",
      v: "2",
      or: "6e45f5e0-3123-4700-b939-3d2ca372451e",
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      "field[12]": values.postcode.trim(),
      jsonp: "true",
    });

    // Attach whatever UTM params were captured on landing (see UtmCapture),
    // so campaign attribution survives the /ev-charger -> get-a-quote hop.
    UTM_KEYS.forEach((key) => {
      const value = getCookie(utmCookieName(key));
      if (value) params.set(UTM_FIELD_IDS[key], value);
    });

    const transactionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `ev-${Date.now()}`;

    let settled = false;

    const cleanup = () => {
      delete window._show_thank_you;
      delete window._show_error;
    };

    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      setSubmitError(GENERIC_ERROR_MESSAGE);
      setSubmitting(false);
    }, 10000);

    // ActiveCampaign's JSONP response calls these globals directly to report
    // the real outcome — the previous implementation relied on the <script>
    // tag's onload firing, which happens whether AC accepted or rejected the
    // lead, so failed submissions were shown "Thank you!" and still counted
    // as conversions.
    window._show_thank_you = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      cleanup();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "ev_quote_submitted",
        transaction_id: transactionId,
      });
      setSubmitted(true);
      setSubmitting(false);
    };

    window._show_error = (_id, message) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      cleanup();
      setSubmitError(stripHtml(message) || GENERIC_ERROR_MESSAGE);
      setSubmitting(false);
    };

    const script = document.createElement("script");
    script.src = `https://gas939.activehosted.com/proc.php?${params.toString()}`;
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      cleanup();
      setSubmitError(GENERIC_ERROR_MESSAGE);
      setSubmitting(false);
    };
    document.head.appendChild(script);
  };

  return (
    <div className="w-full max-w-[447px] mx-auto bg-white rounded-[15px] shadow-xl px-[47px] pt-10 pb-[34px]">
      <h2 className="font-display font-bold text-[32px] leading-[97%] tracking-[0em] text-black mb-[18px] text-center">
        Start Your Quote Below
      </h2>

      {submitted ? (
        <div className="text-center py-10">
          <p className="text-xl font-bold font-display text-black mb-2">
            Thank you!
          </p>
          <p className="text-[#848484] text-sm leading-relaxed">
            We&rsquo;ve received your enquiry and will be in touch shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* First Name */}
          <div className="mb-[10px]">
            <label className={LABEL_CLASS}>
              First Name
              {errors.firstname ? (
                <span className="normal-case tracking-normal text-[#ef4444] font-semibold">
                  {" "}&mdash; {errors.firstname}
                </span>
              ) : (
                <span className="text-[#ef4444]"> *</span>
              )}
            </label>
            <input
              type="text"
              placeholder="John"
              value={values.firstname}
              onChange={handleChange("firstname")}
              className={`${FIELD_CLASS} ${errors.firstname ? "outline-[#ef4444] bg-[#fff8f8]" : ""}`}
            />
          </div>

          {/* Last Name */}
          <div className="mb-[10px]">
            <label className={LABEL_CLASS}>
              Last Name
              {errors.lastname ? (
                <span className="normal-case tracking-normal text-[#ef4444] font-semibold">
                  {" "}&mdash; {errors.lastname}
                </span>
              ) : (
                <span className="text-[#ef4444]"> *</span>
              )}
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={values.lastname}
              onChange={handleChange("lastname")}
              className={`${FIELD_CLASS} ${errors.lastname ? "outline-[#ef4444] bg-[#fff8f8]" : ""}`}
            />
          </div>

          {/* Email */}
          <div className="mb-[10px]">
            <label className={LABEL_CLASS}>
              Email Address
              {errors.email ? (
                <span className="normal-case tracking-normal text-[#ef4444] font-semibold">
                  {" "}&mdash; {errors.email}
                </span>
              ) : (
                <span className="text-[#ef4444]"> *</span>
              )}
            </label>
            <input
              type="text"
              placeholder="youremail@domain.com"
              value={values.email}
              onChange={handleChange("email")}
              className={`${FIELD_CLASS} ${errors.email ? "outline-[#ef4444] bg-[#fff8f8]" : ""}`}
            />
          </div>

          {/* Phone */}
          <div className="mb-[10px]">
            <label className={LABEL_CLASS}>
              Phone Number
              {errors.phone ? (
                <span className="normal-case tracking-normal text-[#ef4444] font-semibold">
                  {" "}&mdash; {errors.phone}
                </span>
              ) : (
                <span className="text-[#ef4444]"> *</span>
              )}
            </label>
            <input
              type="text"
              placeholder="+44 7400 123456"
              value={values.phone}
              onChange={handleChange("phone")}
              className={`${FIELD_CLASS} ${errors.phone ? "outline-[#ef4444] bg-[#fff8f8]" : ""}`}
            />
          </div>

          {/* Postcode */}
          <div className="mb-[10px]">
            <label className={LABEL_CLASS}>
              Postcode
              {errors.postcode ? (
                <span className="normal-case tracking-normal text-[#ef4444] font-semibold">
                  {" "}&mdash; {errors.postcode}
                </span>
              ) : (
                <span className="text-[#ef4444]"> *</span>
              )}
            </label>
            <input
              type="text"
              placeholder="M23 1LB"
              value={values.postcode}
              onChange={handleChange("postcode")}
              className={`${FIELD_CLASS} ${errors.postcode ? "outline-[#ef4444] bg-[#fff8f8]" : ""}`}
            />
          </div>

          {/* Privacy checkbox */}
          <div className="flex items-center gap-2.5 mb-[18px] mt-1">
            <div className="relative shrink-0 group w-[25px] h-[25px]">
              <input
                type="checkbox"
                id="quote_privacy_consent"
                checked={values.privacy}
                onChange={handleChange("privacy")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-[25px] h-[25px] rounded-[3px] border border-[#ccc] bg-[#F4F6FA] flex items-center justify-center group-has-checked:bg-[#4eb4da] group-has-checked:border-[#4eb4da] transition-colors">
                <svg
                  className="w-3 h-3 text-white opacity-0 group-has-checked:opacity-100 transition-opacity"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor="quote_privacy_consent"
              className="text-[11px] text-[#323232] leading-snug cursor-pointer"
            >
              Yes, I agree with the privacy policy and terms and conditions
            </label>
          </div>

          {/* Submission error */}
          {submitError && (
            <div className="mb-[10px] rounded-[8px] bg-[#fff8f8] outline outline-[#ef4444] px-[14px] py-3 text-[13px] leading-snug text-[#ef4444] font-text">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white font-text font-bold text-[16px] rounded-full py-4 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {submitting ? "Sending\u2026" : "Get your FREE quote"}
          </button>
        </form>
      )}
    </div>
  );
}
