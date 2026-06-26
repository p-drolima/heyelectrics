"use client";

import Script from "next/script";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const USP_ITEMS = [
  "Brand new BG Sync EV wall mounted charger",
  "Fully certified installers and engineers",
  "Smart home charging setup",
  "Safe, compliant installation",
];

export function EVHero() {
  return (
    <>
      <style>{`
        #_form_9_ {
          font-family: var(--font-text), arial, sans-serif !important;
          font-size: 14px;
          margin: 0;
          box-shadow: none;
          background: white !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          color: #111 !important;
        }
        #_form_9_ ._form-label {
          font-family: var(--font-text), arial, sans-serif !important;
          font-size: 12px !important;
          font-weight: 400 !important;
          line-height: 100% !important;
          letter-spacing: 0.02em !important;
          text-transform: uppercase !important;
          color: #000000 !important;
          margin-bottom: 6px !important;
        }
        #_form_9_ ._form_element {
          margin-bottom: 10px !important;
        }
        #_form_9_ input::placeholder,
        #_form_9_ textarea::placeholder {
          font-family: var(--font-text), arial, sans-serif !important;
          font-weight: 400 !important;
          font-size: 14px !important;
          line-height: 100% !important;
          letter-spacing: 0.02em !important;
          color: #C8C8C8 !important;
        }
        #_form_9_ ._form_element :is(input[type="text"], input[type="date"], input[type="phone"], input[type="email"]),
        #_form_9_ ._form_element textarea,
        #_form_9_ .iti input {
          background: #F4F6FA !important;
          border: none !important;
          outline: 1px solid #D1D1D1 !important;
          border-radius: 8px !important;
          height: 50px !important;
          padding: 0 14px !important;
          font-family: var(--font-text), arial, sans-serif !important;
          font-size: 14px !important;
          color: #111 !important;
          width: 100% !important;
          box-sizing: border-box !important;
          transition: outline-color 0.15s ease !important;
        }
        #_form_9_ ._form_element :is(input[type="text"], input[type="email"]):focus,
        #_form_9_ ._form_element textarea:focus {
          outline: 2px solid #111 !important;
          background: #fff !important;
        }
        #_form_9_ input[type="text"]._has_error,
        #_form_9_ textarea._has_error {
          outline: 1px solid #ef4444 !important;
          background: #fff8f8 !important;
        }
        /* Hide AC tooltip error divs — errors shown inline in labels instead */
        #_form_9_ ._error { display: none !important; }
        /* Error text colour on label */
        #_form_9_ ._form-label .ac-inline-error {
          color: #ef4444 !important;
          font-weight: 600 !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }
        #_form_9_ ._submit {
          cursor: pointer;
          font-family: var(--font-text), arial, sans-serif !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          text-align: center;
          background: #000000 !important;
          border: 2px solid #000000 !important;
          border-radius: 9999px !important;
          width: 100%;
          color: #ffffff !important;
          padding: 16px !important;
          transition: opacity 0.15s ease !important;
        }
        #_form_9_ ._submit:hover {
          opacity: 0.85 !important;
        }
        #_form_9_ ._submit:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        #_form_9_ ._form-thank-you {
          font-family: var(--font-text), arial, sans-serif !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          text-align: center !important;
          padding: 24px 0 !important;
          color: #111 !important;
        }
        #_form_9_ .field-required { color: #ef4444; }
      `}</style>

      <section className="px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "max-w-[1375px] mx-auto",
            "bg-[#FFEA60] rounded-[17px]",
            "px-6 sm:px-10 lg:pl-[180px] lg:pr-[146px] py-16 lg:py-20"
          )}
        >
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-28">
            {/* Left — headline + USPs */}
            <div
              className={cn(
                "flex flex-col max-w-xl lg:max-w-2xl flex-1",
                "order-1 lg:order-1 text-center lg:text-left"
              )}
            >
              <h1
                className={cn(
                  "font-display font-bold",
                  "text-3xl sm:text-4xl lg:text-[50px] lg:leading-[97%]",
                  "text-black mb-5"
                )}
              >
                Home EV Charger Installation Made Simple
              </h1>

              <p className="font-text font-normal text-lg lg:text-[24px] leading-[117%] tracking-[0.01em] text-black/80 mb-7 text-center lg:text-left">
                Get a brand new <strong>BG Sync EV</strong> wall mounted charger installed
                at your home by fully certified Hey Electrics installers.
              </p>

              <ul className="space-y-3 mb-8 w-fit mx-auto lg:mx-0 text-left">
                {USP_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-black text-base sm:text-lg"
                  >
                    <span className="shrink-0 rounded-full bg-black p-0.5">
                      <Check className="h-4 w-4 text-[#FFEA60]" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — AC enquiry form with hanging stamp */}
            <div
              className={cn(
                "w-full max-w-md shrink-0 relative",
                "order-2 lg:order-2"
              )}
            >
              {/* Price stamp — mobile: small, centred on top edge of card */}
              <div className="lg:hidden absolute -top-[44px] left-1/2 -translate-x-1/2 z-10 w-[88px] h-[88px] drop-shadow-lg pointer-events-none">
                <Image
                  src="/images/price-stamp-ev.svg"
                  alt="Full installations from £879"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Price stamp — desktop: hangs off left edge of card */}
              <div className="hidden lg:block absolute top-[39px] -left-[142px] z-10 w-[158px] h-[156px] drop-shadow-lg pointer-events-none">
                <Image
                  src="/images/price-stamp-ev.svg"
                  alt="Full installations from £879"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="bg-white rounded-[15px] shadow-xl px-6 sm:px-[47px] pt-16 lg:pt-10 pb-8 lg:pb-[34px] lg:min-h-[543px] flex flex-col">
                <h2
                  className="font-display font-bold text-xl lg:text-[32px] leading-[97%] tracking-[0em] text-black mb-[18px] text-center"
                >
                  Start Your Quote Below
                </h2>

                <form
                  method="POST"
                  action="https://gas939.activehosted.com/proc.php"
                  id="_form_9_"
                  className="_form _form_9 _inline-form _dark flex-1 flex flex-col"
                  noValidate
                  data-styles-version="5"
                >
                  <input type="hidden" name="u" value="9" />
                  <input type="hidden" name="f" value="9" />
                  <input type="hidden" name="s" />
                  <input type="hidden" name="c" value="0" />
                  <input type="hidden" name="m" value="0" />
                  <input type="hidden" name="act" value="sub" />
                  <input type="hidden" name="v" value="2" />
                  <input type="hidden" name="or" value="c7cb27f7-5e35-98fd-ba3e-a76b2d251340" />

                  <div className="_form-content flex-1 flex flex-col">
                    <div className="_form_element _x36282118 _full_width">
                      <label htmlFor="fullname" className="_form-label">
                        Full Name<span className="field-required"> *</span>
                      </label>
                      <div className="_field-wrapper">
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="_form_element _field_email _full_width">
                      <label htmlFor="email" className="_form-label">
                        Email Address<span className="field-required"> *</span>
                      </label>
                      <div className="_field-wrapper">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          placeholder="youremail@domain.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="_form_element _field_phone _full_width">
                      <label htmlFor="phone" className="_form-label">
                        Phone Number<span className="field-required"> *</span>
                      </label>
                      <div className="_field-wrapper">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          placeholder="+44 7400 123456"
                          required
                        />
                      </div>
                    </div>

                    <div className="_form_element _x69143513 _full_width">
                      <label htmlFor="field[12]" className="_form-label">
                        Postcode<span className="field-required"> *</span>
                      </label>
                      <div className="_field-wrapper">
                        <input
                          type="text"
                          id="field[12]"
                          name="field[12]"
                          placeholder="M23 1LB"
                          required
                        />
                      </div>
                    </div>

                    {/* Privacy policy checkbox — custom styled */}
                    <div className="flex items-center gap-2.5 mb-[18px] mt-1">
                      <div className="relative shrink-0 group w-[25px] h-[25px]">
                        <input
                          type="checkbox"
                          id="privacy_consent"
                          name="privacy_consent"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-[25px] h-[25px] rounded-[3px] border border-[#ccc] bg-[#F4F6FA] flex items-center justify-center group-has-checked:bg-[#4eb4da] group-has-checked:border-[#4eb4da] transition-colors">
                          <svg
                            className="w-2.5 h-2.5 text-white opacity-0 group-has-checked:opacity-100 transition-opacity"
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
                        htmlFor="privacy_consent"
                        className="text-[11px] text-[#323232] leading-snug cursor-pointer"
                      >
                        Yes, I agree with the privacy policy and terms and conditions
                      </label>
                    </div>

                    <div className="_button-wrapper _full_width">
                      <button
                        id="_form_9_submit"
                        className="_submit"
                        type="submit"
                      >
                        Get your FREE quote
                      </button>
                    </div>

                    <div className="_clear-element" />
                  </div>

                  <div className="_form-thank-you" style={{ display: "none" }} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Script
        id="ac-form-9"
        src="/scripts/ac-form-9.js"
        strategy="afterInteractive"
      />
    </>
  );
}
