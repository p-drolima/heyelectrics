"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface ProgressHeaderProps {
  steps: Step[];
  currentStepIndex: number;
}

export function ProgressHeader({ steps, currentStepIndex }: ProgressHeaderProps) {
  return (
    <div className="mb-8">
      {/* Desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300 font-display",
                      isCompleted && "border-[#44B4D7] bg-[#44B4D7] text-white",
                      isCurrent && "border-[#44B4D7] bg-white text-[#44B4D7] shadow-[0_0_0_4px_rgba(68,180,215,0.15)]",
                      !isCompleted && !isCurrent && "border-gray-200 bg-white text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      (isCompleted || isCurrent) ? "text-black" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 self-start mt-5">
                    <div className="h-0.5 w-full relative bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 bg-[#44B4D7] rounded-full transition-all duration-500",
                          isCompleted ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-black">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-sm font-semibold text-black">
            {steps[currentStepIndex]?.label}
          </span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                index <= currentStepIndex ? "bg-[#44B4D7]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
