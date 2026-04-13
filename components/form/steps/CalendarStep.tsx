"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Calendar } from "@/components/ui/calendar";
import { cn, toLocalDateString } from "@/lib/utils";
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
    partialBookingId,
    setPartialBookingId,
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
    (date) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return date < tomorrow;
    },
    (date) => date.getDay() === 0 || date.getDay() === 6,
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
          bookingDate: toLocalDateString(selectedDate),
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
      updateFormData({ bookingDate: toLocalDateString(selectedDate) });

      // Silently update the existing partial record with the chosen date
      if (partialBookingId) {
        fetch("/api/bookings/partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            bookingDate: toLocalDateString(selectedDate),
            existingPartialId: partialBookingId,
          }),
        }).catch(() => { /* non-fatal */ });
      }

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
    const dateStr = toLocalDateString(selectedDate);
    const booked = availability.dateCounts[dateStr] ?? 0;
    const remaining = availability.maxPerDay - booked;
    return { booked, remaining };
  };

  const slots = getSelectedDateSlots();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        Choose your preferred date
      </h2>

      <div className="flex justify-center relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={loading ? [() => true] : disabledDays}
          captionLayout="dropdown"
          startMonth={new Date()}
          endMonth={new Date(new Date().getFullYear() + 1, 11)}
          className={cn("rounded-md border border-gray-200 p-4", loading && "opacity-50 pointer-events-none")}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-text animate-pulse">Loading availability...</p>
          </div>
        )}
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

      <FormActions>
        <Button
          onClick={handleNext}
          disabled={!selectedDate || reserving}
          className="w-full sm:w-auto"
        >
          {reserving ? "Reserving slot..." : "Next"}
        </Button>
        <Button type="button" variant="outline" onClick={goBack} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </div>
  );
}
