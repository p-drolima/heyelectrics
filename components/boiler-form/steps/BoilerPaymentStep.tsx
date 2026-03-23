"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";
import { BOILER_SERVICE_DISPLAY } from "@/lib/boiler-pricing";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function ReservationTimer({
  expiresAt,
  onExpired,
}: {
  expiresAt: string;
  onExpired: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpired();
      return;
    }

    const timer = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      const remaining = Math.max(0, Math.floor(diff / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        onExpired();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 120;
  const isCritical = secondsLeft <= 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
        isCritical
          ? "border-red-300 bg-red-50 text-red-700"
          : isUrgent
            ? "border-orange-300 bg-orange-50 text-orange-700"
            : "border-[#44B4D7]/30 bg-[#44B4D7]/5 text-[black]"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : (
        <Clock className="h-4 w-4 shrink-0" />
      )}
      <span>
        Your slot is reserved for{" "}
        <span className="font-bold tabular-nums">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </span>
      {isCritical && (
        <span className="ml-auto text-xs">Complete payment now!</span>
      )}
    </div>
  );
}

function ReservationExpired({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center space-y-4">
      <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
      <h3 className="text-lg font-semibold text-red-800">
        Your reservation has expired
      </h3>
      <p className="text-sm text-red-700">
        The 10-minute hold on your selected date has expired. The slot has been
        released and may no longer be available. Please go back and select a new
        date.
      </p>
      <Button onClick={onGoBack} className="bg-red-600 hover:bg-red-700">
        Choose Another Date
      </Button>
    </div>
  );
}

function BoilerBookingSummary() {
  const { formData } = useBoilerFormContext();

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const propertyLabel = formData.propertySubtype || "Residential";

  const addressLine = [
    formData.addressLine1,
    formData.city,
    formData.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-2xl bg-[#F4F6FA] p-4 sm:p-6 mb-6 space-y-4">
      <h3 className="text-sm font-semibold text-muted-text uppercase tracking-wider">
        Booking Summary
      </h3>

      <div className="space-y-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-text">Property</p>
          <p className="text-sm font-medium text-black truncate">
            {propertyLabel}
          </p>
          {formData.bedrooms && (
            <p className="text-xs text-muted-text">
              {formData.bedrooms} bedroom{formData.bedrooms > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-text">Address</p>
          <p className="text-sm font-medium text-black">{addressLine}</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-text">Date</p>
          <p className="text-sm font-medium text-black">
            {formatDate(formData.bookingDate)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-text">Contact</p>
          <p className="text-sm font-medium text-black">{formData.fullName}</p>
          <p className="text-xs text-muted-text truncate">{formData.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-text">Boiler Service</span>
          <span className="text-sm font-medium text-black">
            {BOILER_SERVICE_DISPLAY}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">Total</span>
          <span className="text-lg font-bold text-black font-display">
            {BOILER_SERVICE_DISPLAY}
          </span>
        </div>
      </div>
    </div>
  );
}

function BoilerCheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const {
    formData,
    updateFormData,
    goBack,
    isSubmitting,
    setIsSubmitting,
    reservationToken,
    reservationExpiresAt,
    setReservationToken,
    setReservationExpiresAt,
  } = useBoilerFormContext();

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);

  useEffect(() => {
    if (reservationExpiresAt) {
      const diff = new Date(reservationExpiresAt).getTime() - Date.now();
      if (diff <= 0) setExpired(true);
    }
  }, [reservationExpiresAt]);

  const handleExpired = useCallback(() => {
    setExpired(true);
    setReservationToken(null);
    setReservationExpiresAt(null);
  }, [setReservationToken, setReservationExpiresAt]);

  const handleGoBackToCalendar = () => {
    releaseReservationAndGoBack();
  };

  const releaseReservationAndGoBack = () => {
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
  };

  const handleBackClick = () => {
    if (reservationToken && !expired) {
      setShowBackWarning(true);
    } else {
      goBack();
    }
  };

  const handleSubmit = async () => {
    if (!stripe || !elements || !agreeToTerms || expired) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { bookingReference: _unused, ...submitData } = formData;
        const res = await fetch("/api/boiler-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...submitData,
            stripePaymentIntentId: paymentIntent.id,
            fullPayment: true,
            reservationToken,
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
      } else {
        setErrorMessage("Payment was not completed. Please try again.");
        setIsSubmitting(false);
      }
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
    return <ReservationExpired onGoBack={handleGoBackToCalendar} />;
  }

  return (
    <div className="space-y-6">
      {showBackWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm mx-4 p-6 space-y-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-[black]">Leave payment?</h3>
                <p className="text-sm text-gray-600">
                  Your 10-minute slot reservation will be cancelled and the date
                  may become unavailable. Are you sure you want to go back?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowBackWarning(false)}
                className="text-sm"
              >
                Stay & Pay
              </Button>
              <Button
                onClick={releaseReservationAndGoBack}
                className="bg-orange-600 hover:bg-orange-700 text-sm"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      )}

      {reservationExpiresAt && (
        <ReservationTimer
          expiresAt={reservationExpiresAt}
          onExpired={handleExpired}
        />
      )}

      <Card className={cn("border-2 border-[#44B4D7]")}>
        <CardHeader>
          <CardTitle className="text-lg">
            Payment – {BOILER_SERVICE_DISPLAY}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="agreeToTerms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              I agree to the terms and conditions
            </label>
          </div>
        </CardContent>
      </Card>

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <FormActions>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || !elements || !agreeToTerms || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? "Processing..."
            : `Pay ${BOILER_SERVICE_DISPLAY} & Confirm Booking`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleBackClick}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      </FormActions>
    </div>
  );
}

export function BoilerPaymentStep() {
  const { formData } = useBoilerFormContext();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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

      if (!res.ok) {
        throw new Error("Failed to initialise payment");
      }

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[black]">
        Confirm your booking
      </h2>

      <BoilerBookingSummary />

      {loadError && <p className="text-sm text-red-500">{loadError}</p>}

      {!clientSecret && !loadError && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">
            Loading payment form...
          </div>
        </div>
      )}

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#44B4D7",
                borderRadius: "6px",
              },
            },
          }}
        >
          <BoilerCheckoutForm />
        </Elements>
      )}
    </div>
  );
}
