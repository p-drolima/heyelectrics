"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border ring-offset-white transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44B4D7] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "border-[#44B4D7] bg-[#44B4D7] text-white"
            : "border-gray-300 bg-white",
          className
        )}
        {...props}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
