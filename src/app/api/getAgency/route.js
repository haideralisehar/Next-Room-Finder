import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cookies = req.cookies;
    const agencyId = cookies.get("agencyId")?.value;

    if (!agencyId) {
      return NextResponse.json(
        { error: "No agency ID found in cookies" },
        { status: 400 }
      );
    }

    const apiUrl = `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/SubAgencies/${agencyId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch agency data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ agency: data });
  } catch (error) {
    console.error("Error fetching agency:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
