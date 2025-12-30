import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    

  // Add agencyId to request body to get Markuped and Discounted prices
  const requestBody = {
    ...body
  };

    const apiUrl =
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/dida/booking/cancel";

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
    return NextResponse.json(
      { message: "API error", error: error.message },
      { status: 500 }
    );
  }
}


