"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteForm } from "./QuoteForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-white"
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 rounded-full p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-none sm:border sm:shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a2e]">
                HEY
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-[#1a1a2e]">
              Start Your Quote Below
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Starting from only £79*
            </p>
          </CardHeader>
          <CardContent>
            <QuoteForm onSubmitted={onClose} idPrefix="modal-" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
