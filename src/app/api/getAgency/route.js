import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cookies = req.cookies;

    const userId = cookies.get("userId")?.value;
    const token = cookies.get("token")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "No user ID found in cookies" },
        { status: 400 }
      );
    }

    const apiUrl = `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/${userId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ userName:"Muhammad Faisal", password:"1122334455" }),
      // credentials:true,
      Authorization: `Bearer ${token}`,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ agency: data });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
