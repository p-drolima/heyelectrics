"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReservationExpiredProps {
  onGoBack: () => void;
}

export function ReservationExpired({ onGoBack }: ReservationExpiredProps) {
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
