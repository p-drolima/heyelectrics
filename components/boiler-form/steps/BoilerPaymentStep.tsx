"use client";

import { useRef } from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBoilerFormContext } from "../BoilerFormProvider";
import { ProgressHeader } from "@/components/form/checkout/ProgressHeader";
import { TopResumeNotice } from "@/components/form/checkout/TopResumeNotice";
import { StepHeading } from "@/components/form/checkout/StepHeading";
import { BookingSummaryCard } from "@/components/form/checkout/BookingSummaryCard";
import { NextStepsCard } from "@/components/form/checkout/NextStepsCard";
import { TrustReassurancePanel } from "@/components/form/checkout/TrustReassurancePanel";
import { CredibilityLogos } from "@/components/form/checkout/CredibilityLogos";
import { PaymentCard, type PaymentCardHandle } from "@/components/form/checkout/PaymentCard";
import { CheckoutActions } from "@/components/form/checkout/CheckoutActions";
import { StripeElementWrapper } from "@/components/form/checkout/StripeElementWrapper";
import { ReservationTimer } from "@/components/form/checkout/ReservationTimer";
import { ReservationExpired } from "@/components/form/checkout/ReservationExpired";
import { LeavePaymentModal } from "@/components/form/checkout/LeavePaymentModal";
import { BOILER_SERVICE_DISPLAY } from "@/lib/boiler-pricing";

const CHECKOUT_STEPS = [
  { id: "boiler-status", label: "Boiler" },
  { id: "boiler-property-type", label: "Property" },
  { id: "boiler-details", label: "Details" },
  { id: "boiler-bedrooms", label: "Size" },
  { id: "boiler-calendar", label: "Date" },
  { id: "boiler-payment", label: "Checkout" },
];
const PAYMENT_STEP_INDEX = 5;

export function BoilerPaymentStep() {
  const router = useRouter();
  const {
    formData,
    updateFormData,
    goBack,
    isSubmitting,
    setIsSubmitting,
    isReturningUser,
    resetForm,
    reservationToken,
    reservationExpiresAt,
    setReservationToken,
    setReservationExpiresAt,
    partialBookingId,
  } = useBoilerFormContext();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [stripeComplete, setStripeComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);
  const paymentCardRef = useRef<PaymentCardHandle>(null);

  useEffect(() => {
    if (reservationExpiresAt) {
      const diff = new Date(reservationExpiresAt).getTime() - Date.now();
      if (diff <= 0) setExpired(true);
    }
  }, [reservationExpiresAt]);

  const createIntent = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/create-boiler-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
        }),
      });
      if (!res.ok) throw new Error("Failed to initialise payment");
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load payment form"
      );
    }
  }, [formData.fullName, formData.email]);

  useEffect(() => {
    createIntent();
  }, [createIntent]);

  const handleExpired = useCallback(() => {
    setExpired(true);
    setReservationToken(null);
    setReservationExpiresAt(null);
  }, [setReservationToken, setReservationExpiresAt]);

  const releaseAndGoBack = useCallback(() => {
    if (reservationToken) {
      fetch("/api/reservations/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: reservationToken }),
      }).catch(() => {});
    }
    setReservationToken(null);
    setReservationExpiresAt(null);
    goBack();
  }, [reservationToken, setReservationToken, setReservationExpiresAt, goBack]);

  const handleBackClick = () => {
    if (reservationToken && !expired) {
      setShowBackWarning(true);
    } else {
      goBack();
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bookingReference: _unused, ...submitData } = formData;
      const res = await fetch("/api/boiler-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submitData,
          stripePaymentIntentId: paymentIntentId,
          fullPaymentPaid: true,
          reservationToken,
          partialBookingId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "DATE_FULLY_BOOKED") {
          setErrorMessage(
            errData.message ||
              "This date is now fully booked. Please go back and choose another date."
          );
          setIsSubmitting(false);
          return;
        }
        throw new Error(errData.message || "Failed to save booking");
      }

      const data = await res.json();
      const ref = data?.bookingReference ?? formData.bookingReference;
      const isNew = data?.isNewCustomer !== false;
      updateFormData({ bookingReference: ref });
      router.push(
        `/boiler-service/thank-you?ref=${encodeURIComponent(ref)}&new=${isNew}`
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (expired) {
    return (
      <div className="space-y-6">
        <ProgressHeader steps={CHECKOUT_STEPS} currentStepIndex={PAYMENT_STEP_INDEX} />
        <ReservationExpired onGoBack={releaseAndGoBack} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showBackWarning && (
        <LeavePaymentModal
          onStay={() => setShowBackWarning(false)}
          onLeave={releaseAndGoBack}
        />
      )}

      <ProgressHeader steps={CHECKOUT_STEPS} currentStepIndex={PAYMENT_STEP_INDEX} />
      <TopResumeNotice isReturningUser={isReturningUser} onReset={resetForm} />

      {reservationExpiresAt && (
        <ReservationTimer
          expiresAt={reservationExpiresAt}
          onExpired={handleExpired}
        />
      )}

      <StepHeading title="Confirm your booking" />

      {/* Booking summary with price embedded */}
      <div className="px-5">
        <BookingSummaryCard
          formData={formData}
          onUpdateFormData={(updates) => updateFormData(updates as Parameters<typeof updateFormData>[0])}
          onEditDate={releaseAndGoBack}
          serviceName="Boiler Service"
          totalDisplay={BOILER_SERVICE_DISPLAY}
          depositDisplay={BOILER_SERVICE_DISPLAY}
        />
      </div>

      {/* Trust signals + logos — full viewport width white band */}
      <div className="relative">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen bg-white" />
        <div className="relative py-6 space-y-6">
          <TrustReassurancePanel variant="boiler" />
          <CredibilityLogos variant="boiler" />
        </div>
      </div>

      {/* What happens next */}
      <NextStepsCard variant="boiler" />

      {/* Payment form */}
      {loadError && (
        <p className="text-sm text-red-500 px-[60px]">{loadError}</p>
      )}
      {!clientSecret && !loadError && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading payment form...</div>
        </div>
      )}
      {clientSecret && (
        <div className="px-0 sm:px-[60px] space-y-4">
          <StripeElementWrapper clientSecret={clientSecret}>
            <PaymentCard
              ref={paymentCardRef}
              title={`Payment – ${BOILER_SERVICE_DISPLAY}`}
              agreeToTerms={agreeToTerms}
              onTermsChange={setAgreeToTerms}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onStripeChange={setStripeComplete}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              expired={expired}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </StripeElementWrapper>

          {/* Actions rendered outside Stripe context */}
          <CheckoutActions
            onSubmit={() => paymentCardRef.current?.submit()}
            onBack={handleBackClick}
            isSubmitting={isSubmitting}
            stripeReady={stripeComplete}
            termsAccepted={agreeToTerms}
            depositDisplay={BOILER_SERVICE_DISPLAY}
          />
        </div>
      )}
    </div>
  );
}
