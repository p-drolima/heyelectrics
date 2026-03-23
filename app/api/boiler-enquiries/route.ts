import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { sendBoilerEnquiryEmails } from "@/lib/boiler-email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      enquiry_type,
      fullName,
      companyName,
      email,
      phone,
      fuelType,
      postcode,
      address,
      message,
    } = body;

    const enquiryType = enquiry_type || "broken_boiler";

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { message: "Missing required fields: fullName, email, phone" },
        { status: 400 }
      );
    }

    const [row] = await db
      .insert(enquiries)
      .values({
        serviceType: "boiler",
        enquiryType,
        fullName: String(fullName),
        companyName: companyName ? String(companyName) : null,
        email: String(email),
        phone: String(phone),
        postcode: postcode ? String(postcode) : null,
        address: address ? String(address) : null,
        message: message ? String(message) : null,
      })
      .returning();

    sendBoilerEnquiryEmails({
      enquiryType,
      fullName: String(fullName),
      companyName: companyName || null,
      email: String(email),
      phone: String(phone),
      fuelType: fuelType || null,
      postcode: postcode || null,
      address: address || null,
      message: message || null,
    }).catch((err: unknown) => console.error("Email send failed:", err));

    return NextResponse.json({
      id: row?.id,
      message: "Enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Boiler enquiry error:", error);
    return NextResponse.json(
      { message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
