"use client";

import { Button } from "@/components/ui/button";

interface CheckoutActionsProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  stripeReady: boolean;
  termsAccepted: boolean;
  depositDisplay: string;
}

export function CheckoutActions({
  onSubmit,
  onBack,
  isSubmitting,
  stripeReady,
  termsAccepted,
  depositDisplay,
}: CheckoutActionsProps) {
  const isDisabled = !stripeReady || !termsAccepted || isSubmitting;

  function getCtaLabel() {
    if (isSubmitting) return "Processing...";
    return `Pay ${depositDisplay} Deposit & Confirm`;
  }

  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isDisabled}
      >
        {getCtaLabel()}
      </Button>
    </div>
  );
}
