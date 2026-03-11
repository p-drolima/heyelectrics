import { NextResponse } from "next/server";
import { eq, sql, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { slotReservations, bookings } from "@/lib/db/schema";
import { randomBytes } from "crypto";

const MAX_BOOKINGS_PER_DAY = 7;
const RESERVATION_MINUTES = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingDate, existingToken } = body;

    if (!bookingDate) {
      return NextResponse.json(
        { message: "bookingDate is required" },
        { status: 400 }
      );
    }

    const dateOnly = new Date(bookingDate).toISOString().split("T")[0];
    const now = new Date();

    // Clean up expired reservations for this date
    await db
      .delete(slotReservations)
      .where(lt(slotReservations.expiresAt, now));

    // If user already has a reservation, release it first
    if (existingToken) {
      await db
        .delete(slotReservations)
        .where(eq(slotReservations.sessionToken, existingToken));
    }

    // Count confirmed bookings for this date
    const [bookingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.bookingDate, dateOnly));

    // Count active (non-expired) reservations for this date
    const [reservationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(slotReservations)
      .where(
        sql`${slotReservations.bookingDate} = ${dateOnly} AND ${slotReservations.expiresAt} > ${now}`
      );

    const totalHeld =
      Number(bookingCount.count) + Number(reservationCount.count);

    if (totalHeld >= MAX_BOOKINGS_PER_DAY) {
      return NextResponse.json(
        {
          message:
            "This date is no longer available. All slots are either booked or reserved by other users. Please choose another date.",
          code: "DATE_FULLY_BOOKED",
        },
        { status: 409 }
      );
    }

    // Create reservation
    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      now.getTime() + RESERVATION_MINUTES * 60 * 1000
    );

    await db.insert(slotReservations).values({
      bookingDate: dateOnly,
      sessionToken,
      expiresAt,
    });

    return NextResponse.json({
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      reservationMinutes: RESERVATION_MINUTES,
    });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { message: "Failed to reserve slot" },
      { status: 500 }
    );
  }
}
