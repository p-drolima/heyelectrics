import { NextResponse } from "next/server";
import { and, eq, isNotNull, sql, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, slotReservations } from "@/lib/db/schema";

const MAX_BOOKINGS_PER_DAY = 7;

export async function GET() {
  try {
    const now = new Date();

    const bookingRows = await db
      .select({
        bookingDate: bookings.bookingDate,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(bookings)
      .where(
        and(
          isNotNull(bookings.bookingDate),
          eq(bookings.serviceType, "boiler")
        )
      )
      .groupBy(bookings.bookingDate);

    const reservationRows = await db
      .select({
        bookingDate: slotReservations.bookingDate,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(slotReservations)
      .where(
        and(
          gt(slotReservations.expiresAt, now),
          eq(slotReservations.serviceType, "boiler")
        )
      )
      .groupBy(slotReservations.bookingDate);

    const dateCounts: Record<string, number> = {};

    for (const row of bookingRows) {
      if (row.bookingDate != null) {
        const d = row.bookingDate as Date | string;
        const dateStr =
          typeof d === "object" && "toISOString" in d
            ? (d as Date).toISOString().split("T")[0]
            : String(d).split("T")[0];
        dateCounts[dateStr] = (dateCounts[dateStr] ?? 0) + Number(row.count);
      }
    }

    for (const row of reservationRows) {
      if (row.bookingDate != null) {
        const d = row.bookingDate as Date | string;
        const dateStr =
          typeof d === "object" && "toISOString" in d
            ? (d as Date).toISOString().split("T")[0]
            : String(d).split("T")[0];
        dateCounts[dateStr] = (dateCounts[dateStr] ?? 0) + Number(row.count);
      }
    }

    const fullyBookedDates: string[] = [];
    for (const [date, count] of Object.entries(dateCounts)) {
      if (count >= MAX_BOOKINGS_PER_DAY) {
        fullyBookedDates.push(date);
      }
    }

    return NextResponse.json({
      fullyBookedDates,
      dateCounts,
      maxPerDay: MAX_BOOKINGS_PER_DAY,
    });
  } catch (error) {
    console.error("Boiler availability error:", error);
    return NextResponse.json(
      {
        fullyBookedDates: [],
        dateCounts: {},
        maxPerDay: MAX_BOOKINGS_PER_DAY,
      },
      { status: 200 }
    );
  }
}
