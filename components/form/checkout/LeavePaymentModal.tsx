"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeavePaymentModalProps {
  onStay: () => void;
  onLeave: () => void;
}

export function LeavePaymentModal({ onStay, onLeave }: LeavePaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm mx-4 p-6 space-y-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-black">Leave payment?</h3>
            <p className="text-sm text-gray-600">
              Your 10-minute slot reservation will be cancelled and the date may
              become unavailable. Are you sure you want to go back?
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onStay} className="text-sm">
            Stay &amp; Pay
          </Button>
          <Button
            onClick={onLeave}
            className="bg-orange-600 hover:bg-orange-700 text-sm"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
