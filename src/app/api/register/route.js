import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Map form data to match backend API fields
    const payload = {
      id: 0,
      username: body.username,
      password: body.password,
      agencyName: body.agencyName,
      agencyEmail: body.agencyEmail,
      agencyPhone: body.agencyPhone,
      agencyCRNumber: body.agencyCR,
      crExpiryDate: new Date(body.agencyCRExpiry).toISOString(),
      agencyAddress: body.agencyAddress,
    };

    // Send to your actual backend API
    const response = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Agency/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    // Handle backend errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to register agency" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
