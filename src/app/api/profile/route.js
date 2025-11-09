import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cookies = req.cookies;
    const token = cookies.get("token")?.value;
    const userId = cookies.get("userId")?.value;

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing credentials" },
        { status: 401 }
      );
    }

    // ✅ Fetch user data from backend API using userId
    const response = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if your API requires it
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch user profile" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
