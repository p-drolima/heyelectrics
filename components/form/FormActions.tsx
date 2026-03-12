"use client";

import { cn } from "@/lib/utils";

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 safe-bottom",
        "sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:px-0 sm:py-0 sm:pt-6",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}
