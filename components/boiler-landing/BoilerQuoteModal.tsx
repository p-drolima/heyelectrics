"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BoilerQuoteForm } from "./BoilerQuoteForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BoilerQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BoilerQuoteModal({ isOpen, onClose }: BoilerQuoteModalProps) {
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
        "fixed inset-0 z-100 flex items-center justify-center",
        "bg-white"
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 rounded-full p-2 text-black hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-none sm:border sm:shadow-lg rounded-[17px]">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/hey-logo.svg"
                alt="HEY"
                width={120}
                height={40}
              />
            </div>
            <CardTitle className="text-xl font-bold text-black font-display">
              Book Your Boiler Service
            </CardTitle>
            <p className="text-sm text-muted-text mt-1">
              From just £99 — no hidden fees
            </p>
          </CardHeader>
          <CardContent>
            <BoilerQuoteForm onSubmitted={onClose} idPrefix="modal-" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
