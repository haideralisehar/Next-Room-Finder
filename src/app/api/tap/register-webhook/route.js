// /api/tap/register-webhook/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = "https://api.tap.company/v2/webhooks";

    const body = {
      type: "webhook",
      url: "https://next-room-finder-pro.vercel.app/api/tap/webhook",
      events: [
        "charge.captured",
        "charge.failed",
        "charge.refunded",
        "charge.authorized",
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
