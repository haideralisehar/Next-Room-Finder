import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const cookies = req.cookies;

    const userId = cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const azureEndpoint =
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/${userId}`;

    const response = await fetch(azureEndpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body) // ✅ IMPORTANT
    });

    // PUT returns 204 → no JSON body
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to update profile" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
