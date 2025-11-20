// /api/tap/register-webhook/route.js
import { NextResponse } from "next/server";

async function register() {
  const body = {
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/webhook`,
    events: [
      "charge.captured",
      "charge.failed",
      "charge.authorized",
      "charge.refunded",
    ],
    content_type: "application/json"
  };

  const response = await fetch("https://api.tap.company/v2/webhooks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { success: false, message: "Tap API Error", error: data },
      { status: response.status }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Webhook registered successfully",
    webhook: data,
  });
}

// Allow POST request
export async function POST(req) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.WEBHOOK_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return register();
}

// Allow GET request (browser)
export async function GET() {
  // ⚠️ Only enable GET for local testing
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "GET not allowed in production" },
      { status: 405 }
    );
  }

  return register();
}
