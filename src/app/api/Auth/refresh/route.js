import { NextResponse } from "next/server";

export async function POST(req) {
  const backendRes = await fetch(
    "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh",
    {
      method: "POST",
      credentials: "include",
      headers: {
  cookie: req.headers.get("cookie") ?? "",
}
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await backendRes.json();

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 2,
  });

  return res;
}
