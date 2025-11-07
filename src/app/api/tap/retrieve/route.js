import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { tap_id } = await req.json();

    const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
