import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingReference(): string {
  const prefix = "HE";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function extractOutwardCode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s?\d[A-Z]{2}$/);
  if (match) return match[1];
  return cleaned.split(/\d/)[0] || cleaned;
}

/** Format a Date as YYYY-MM-DD using **local** time (not UTC). */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns true if a YYYY-MM-DD string falls on Saturday or Sunday. */
export function isWeekend(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

export function formatPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
  if (cleaned.length < 5) return cleaned;
  return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
}
