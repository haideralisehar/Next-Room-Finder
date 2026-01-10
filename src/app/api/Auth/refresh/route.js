import { NextResponse } from "next/server";

export async function POST() {
  const backendRes = await fetch(
    "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh",
    {
      method: "POST",
      credentials: "include", // sends refreshToken cookie
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    );
  }
  

  const data = await backendRes.json();
  const res = NextResponse.json({ success: true });
  console.log(data);

  // 🔥 IMPORTANT: overwrite access token cookie
  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return res;
}
