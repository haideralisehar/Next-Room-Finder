import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

    // sessionStorage.removeItem('dictionaryTypes');
    // sessionStorage.removeItem('hotelData');
    // sessionStorage.removeItem('selectedHotel');

  // ❌ Clear authentication cookies
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  // Optional: if you stored user data in cookies
  response.cookies.set("userId", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("agencyId", "",{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0,

    })

  
  
  return response;
}
