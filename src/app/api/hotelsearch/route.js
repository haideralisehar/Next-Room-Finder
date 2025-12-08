import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();

    // 🔥 FIX: cookies() must be awaited
    const cookieStore = await cookies();
    const agencyId = cookieStore.get("agencyId")?.value || "undefined";

    console.log("Cookie agencyId:", agencyId);

    // Add agencyId to request body
    const requestBody = {
      ...body,
      agencyId,
    };

    const apiUrl =
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Hotels/search-with-details";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error.message);

    return NextResponse.json(
      { message: "API error", error: error.message },
      { status: 500 }
    );
  }
}
