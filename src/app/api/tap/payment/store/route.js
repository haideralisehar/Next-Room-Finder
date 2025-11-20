import { NextResponse } from "next/server";
// import your DB

export async function POST(req) {
  try {
    const data = await req.json();

    console.log("Saving WEBHOOK Data:", data);

    // TODO: Save in DB here (MongoDB, Prisma, SQL, Appwrite, etc.)

    return NextResponse.json({ success: true, "Data:" :data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
