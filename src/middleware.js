import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const userId = req.cookies.get("userId")?.value;
  const url = req.nextUrl.clone();

  const isLoggedIn = token && userId;
  const isLoginPage = url.pathname.startsWith("/authentication/login");
  const isProtectedRoute = url.pathname.startsWith("/profile") || url.pathname.startsWith("/dsr");
  

  // ✅ Case 1: Not logged in and trying to access protected route
  if (!isLoggedIn && isProtectedRoute) {
    const response = NextResponse.redirect(new URL("/authentication/login", req.url));

    // Clear invalid cookies
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });

    return response;
  }

  // ✅ Case 2: Logged in but visiting login page → redirect to profile
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Otherwise allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/authentication/login", "/dsr"],
};
