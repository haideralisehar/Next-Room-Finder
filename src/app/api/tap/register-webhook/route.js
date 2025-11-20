import { NextResponse } from "next/server";

<<<<<<< HEAD
export async function GET() {
  try {
    const url = "https://api.tap.company/v2/webhooks";
=======
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
// export async function GET() {
//   // ⚠️ Only enable GET for local testing
//   if (process.env.NODE_ENV === "production") {
//     return NextResponse.json(
//       { error: "GET not allowed in production" },
//       { status: 405 }
//     );
//   }
>>>>>>> be52928a6c78dd0c49dfa77917a3dcd8fa595d8f

    const body = {
      url: "https://next-room-finder-pro.vercel.app/api/tap/webhook",
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
