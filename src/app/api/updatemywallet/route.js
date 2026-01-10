// File: app/api/wallet/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json();
  try {
    // ✅ Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: token missing" },
        { status: 401 }
      );
    }

    // ✅ Backend endpoint (token decides identity)
   const updateWalletRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
      {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
      }
    );

    if (!updateWalletRes.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch wallet", details: text },
        { status: response.status }
      );
    }

    const data = await updateWalletRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Wallet API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
