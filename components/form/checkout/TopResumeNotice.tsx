"use client";

import { RotateCcw } from "lucide-react";

interface TopResumeNoticeProps {
  isReturningUser: boolean;
  onReset: () => void;
}

export function TopResumeNotice({ isReturningUser, onReset }: TopResumeNoticeProps) {
  if (!isReturningUser) return null;

  return (
    <div className="mb-6 rounded-xl bg-[#FFEA60]/20 border border-[#FFEA60]/40 px-5 py-3.5 flex items-center justify-between gap-4">
      <p className="text-sm text-black">
        Welcome back! You can continue where you left off.
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-black hover:opacity-70 font-medium whitespace-nowrap transition-opacity cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Start over
      </button>
    </div>
  );
}
