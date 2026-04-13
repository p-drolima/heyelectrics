"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface TermsConsentBlockProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TermsConsentBlock({ checked, onChange }: TermsConsentBlockProps) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Checkbox
        id="agreeToTerms"
        checked={checked}
        onCheckedChange={(val) => onChange(!!val)}
      />
      <label
        htmlFor="agreeToTerms"
        className="text-sm font-medium leading-none cursor-pointer"
      >
        I agree to the{" "}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#44B4D7] hover:text-[#44B4D7]/80"
        >
          terms and conditions
        </a>
      </label>
    </div>
  );
}
