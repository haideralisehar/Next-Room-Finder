import { NextResponse } from "next/server";

const AZURE_BACKEND_URL = "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net";

export async function POST(req) {
  try {
    // 🔥 FIX: Get ALL cookies as a string
    const cookieHeader = req.headers.get("cookie") || "";
    console.log("Cookie header to forward:", cookieHeader);
    
    if (!cookieHeader.includes("refreshToken")) {
      console.error("NO refreshToken in cookies!");
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }
    
    // 🔥 FIX: Forward EXACT cookie header
    const backendRes = await fetch(`${AZURE_BACKEND_URL}/api/Auth/refresh`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader  // Forward exactly
      },
    });

    console.log("Azure status:", backendRes.status);
    
    if (!backendRes.ok) {
      const text = await backendRes.text();
      console.log("Azure error text:", text);
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data = await backendRes.json();
    console.log("Azure response:", data);
    
    const newAccessToken = data.token || data.Token;
    
    if (!newAccessToken) {
      return NextResponse.json({ error: "No token in response" }, { status: 500 });
    }

    const response = NextResponse.json({ 
      success: true, 
      token: newAccessToken 
    });

    response.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}