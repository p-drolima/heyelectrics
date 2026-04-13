"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import type { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { forwardRef, useImperativeHandle, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TermsConsentBlock } from "./TermsConsentBlock";

export interface PaymentCardHandle {
  submit: () => Promise<void>;
}

interface PaymentCardProps {
  agreeToTerms: boolean;
  onTermsChange: (checked: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (val: boolean) => void;
  onStripeChange: (complete: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  expired: boolean;
  onPaymentSuccess: (paymentIntentId: string) => void;
  title?: string;
}

export const PaymentCard = forwardRef<PaymentCardHandle, PaymentCardProps>(
  function PaymentCard(
    {
      agreeToTerms,
      onTermsChange,
      isSubmitting,
      setIsSubmitting,
      onStripeChange,
      errorMessage,
      setErrorMessage,
      expired,
      onPaymentSuccess,
      title,
    },
    ref
  ) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = useCallback(async () => {
      if (!stripe || !elements || !agreeToTerms || expired) return;

      setErrorMessage(null);
      setIsSubmitting(true);

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: window.location.href },
          redirect: "if_required",
        });

        if (error) {
          setErrorMessage(error.message || "Payment failed. Please try again.");
          setIsSubmitting(false);
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          onPaymentSuccess(paymentIntent.id);
        } else {
          setErrorMessage("Payment was not completed. Please try again.");
          setIsSubmitting(false);
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
      }
    }, [stripe, elements, agreeToTerms, expired, setErrorMessage, setIsSubmitting, onPaymentSuccess]);

    useImperativeHandle(ref, () => ({ submit: handleSubmit }), [handleSubmit]);

    return (
      <Card className="border-2 border-[#44B4D7]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {title ?? "Payment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement
            options={{ layout: "tabs" }}
            onChange={(e: StripePaymentElementChangeEvent) => onStripeChange(e.complete)}
          />
          <TermsConsentBlock checked={agreeToTerms} onChange={onTermsChange} />
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    );
  }
);
