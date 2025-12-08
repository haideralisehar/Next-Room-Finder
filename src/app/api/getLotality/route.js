// File: app/api/wallet/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get("agencyId");

    if (!agencyId) {
      return NextResponse.json(
        { error: "Missing required parameter: agencyId" },
        { status: 400 }
      );
    }

    const apiUrl = `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Loyalty/agency/${agencyId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // avoid caching stale balances
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch loyality data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Loyality API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
