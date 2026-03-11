"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Matcher } from "react-day-picker";

interface AvailabilityData {
  fullyBookedDates: string[];
  dateCounts: Record<string, number>;
  maxPerDay: number;
}

export function CalendarStep() {
  const {
    formData,
    updateFormData,
    setCurrentStep,
    goBack,
    reservationToken,
    setReservationToken,
    setReservationExpiresAt,
  } = useFormContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.bookingDate ? new Date(formData.bookingDate) : undefined
  );
  const [availability, setAvailability] = useState<AvailabilityData>({
    fullyBookedDates: [],
    dateCounts: {},
    maxPerDay: 7,
  });
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings/availability")
      .then((res) => res.json())
      .then((data: AvailabilityData) => {
        setAvailability({
          fullyBookedDates: data.fullyBookedDates ?? [],
          dateCounts: data.dateCounts ?? {},
          maxPerDay: data.maxPerDay ?? 7,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const disabledDays: Matcher[] = [
    (date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
    ...availability.fullyBookedDates.map((d) => new Date(d)),
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setError(null);
  };

  const handleNext = async () => {
    if (!selectedDate) return;

    setReserving(true);
    setError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingDate: selectedDate.toISOString(),
          existingToken: reservationToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.code === "DATE_FULLY_BOOKED") {
          setError(
            data.message ||
              "This date is no longer available. Please choose another date."
          );
          // Refresh availability
          fetch("/api/bookings/availability")
            .then((r) => r.json())
            .then((d: AvailabilityData) =>
              setAvailability({
                fullyBookedDates: d.fullyBookedDates ?? [],
                dateCounts: d.dateCounts ?? {},
                maxPerDay: d.maxPerDay ?? 7,
              })
            )
            .catch(() => {});
          setReserving(false);
          return;
        }
        throw new Error(data.message || "Failed to reserve slot");
      }

      const { sessionToken, expiresAt } = await res.json();

      setReservationToken(sessionToken);
      setReservationExpiresAt(expiresAt);
      updateFormData({ bookingDate: selectedDate.toISOString() });
      setCurrentStep("payment");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reserve slot"
      );
    } finally {
      setReserving(false);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getSelectedDateSlots = () => {
    if (!selectedDate) return null;
    const dateStr = selectedDate.toISOString().split("T")[0];
    const booked = availability.dateCounts[dateStr] ?? 0;
    const remaining = availability.maxPerDay - booked;
    return { booked, remaining };
  };

  const slots = getSelectedDateSlots();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#1a1a2e]">
        Choose your preferred date
      </h2>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={loading ? [] : disabledDays}
          captionLayout="dropdown"
          startMonth={new Date()}
          endMonth={new Date(new Date().getFullYear() + 1, 11)}
          className={cn("rounded-md border border-gray-200 p-4")}
        />
      </div>

      {selectedDate && slots && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Selected date:{" "}
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </p>
          <p
            className={cn(
              "text-sm font-medium",
              slots.remaining <= 2 ? "text-orange-600" : "text-green-600"
            )}
          >
            {slots.remaining} of {availability.maxPerDay} slot
            {slots.remaining !== 1 ? "s" : ""} available
            {slots.remaining <= 2 &&
              slots.remaining > 0 &&
              " \u2013 book soon!"}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Each date has limited availability (max {availability.maxPerDay} bookings
        per day). Fully booked dates are greyed out. Your slot will be held for
        10 minutes once you proceed to payment.
      </p>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedDate || reserving}
        >
          {reserving ? "Reserving slot..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
