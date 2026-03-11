import { NextResponse } from "next/server";
import { isPostcodeAllowed, isValidUKPostcode } from "@/lib/postcodes";

export async function POST(request: Request) {
  try {
    const { postcode } = await request.json();

    if (!postcode || typeof postcode !== "string") {
      return NextResponse.json(
        { allowed: false, message: "Postcode is required" },
        { status: 400 }
      );
    }

    const trimmed = postcode.trim();
    const valid = isValidUKPostcode(trimmed);
    const allowed = valid && isPostcodeAllowed(trimmed);

    return NextResponse.json({
      allowed,
      valid,
      postcode: trimmed,
    });
  } catch (error) {
    console.error("Postcode validate error:", error);
    return NextResponse.json(
      { allowed: false, message: "Validation failed" },
      { status: 500 }
    );
  }
}
