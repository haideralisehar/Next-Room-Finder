import { NextResponse } from "next/server";

export async function POST(req) {
  // Get raw browser cookies (contains Azure cookies)
  const cookieHeader = req.headers.get("cookie");

  const backendRes = await fetch(
    "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh",
    {
      method: "POST",
      headers: {
        Cookie: cookieHeader || "", // 🔥 forward ALL browser cookies
      },
      credentials: "include"   // 🔥 ADD THIS
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }

  const data = await backendRes.json();

  const res = NextResponse.json({ success: true });

  // Store new access token on frontend domain
  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15,
  });

  return res;
}
