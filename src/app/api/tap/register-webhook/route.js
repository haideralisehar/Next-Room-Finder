import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = "https://api.tap.company/v2/webhooks";

    const body = {
      url: "https://next-room-finder-pro.vercel.app/api/tap/webhook",
      content_type: "json",  // REQUIRED for Tap
      events: [
        "charge.succeeded",
        "charge.failed",
        "charge.captured",
        "charge.refunded"
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
