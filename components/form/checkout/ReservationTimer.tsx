"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ReservationTimerProps {
  expiresAt: string;
  onExpired: () => void;
}

export function ReservationTimer({ expiresAt, onExpired }: ReservationTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  const handleExpired = useCallback(() => {
    onExpired();
  }, [onExpired]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      handleExpired();
      return;
    }

    const timer = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      const remaining = Math.max(0, Math.floor(diff / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        handleExpired();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, handleExpired, secondsLeft]);

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
            : "border-[#44B4D7]/30 bg-[#44B4D7]/5 text-black"
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
