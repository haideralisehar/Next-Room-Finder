import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const backendRes = await fetch(
    "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh",
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,   // 🔥 forward cookie
      },
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }

  const data = await backendRes.json();

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15,
  });

  return res;
}
