import { NextRequest, NextResponse } from "next/server";
import { formatPostcode } from "@/lib/utils";

interface IdealPostcodesAddress {
  line_1: string;
  line_2: string;
  line_3: string;
  post_town: string;
  county: string;
  postcode: string;
}

export async function GET(request: NextRequest) {
  try {
    const postcode = request.nextUrl.searchParams.get("postcode");

    if (!postcode || postcode.length < 5) {
      return NextResponse.json(
        { message: "Valid postcode required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IDEAL_POSTCODES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { addresses: [], message: "Address lookup not configured" },
        { status: 503 }
      );
    }

    const encoded = encodeURIComponent(postcode.trim());
    const res = await fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${encoded}?api_key=${apiKey}`
    );

    if (res.status === 404) {
      return NextResponse.json({
        postcode: formatPostcode(postcode),
        addresses: [],
      });
    }

    if (!res.ok) {
      console.error("Ideal Postcodes API error:", res.status, await res.text());
      return NextResponse.json(
        { addresses: [], message: "Address lookup failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results: IdealPostcodesAddress[] = data.result || [];

    const addresses = results.map((addr) => ({
      addressLine1: addr.line_1,
      addressLine2: [addr.line_2, addr.line_3].filter(Boolean).join(", "),
      city: addr.post_town,
      county: addr.county,
    }));

    return NextResponse.json({
      postcode: formatPostcode(postcode),
      addresses,
    });
  } catch (error) {
    console.error("Postcode lookup error:", error);
    return NextResponse.json(
      { addresses: [], message: "Lookup failed" },
      { status: 500 }
    );
  }
}
