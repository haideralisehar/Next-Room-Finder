import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const userId = req.cookies.get("userId")?.value;
  const url = req.nextUrl.clone();

  const isLoggedIn = token && userId;
  const isLoginPage = url.pathname.startsWith("/authentication/login");
  const isProtectedRoute =
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/dsr") ||
    url.pathname.startsWith("/bookingPage");

  // ✅ Case 0: If only one cookie exists (inconsistent state)
  // e.g. token exists but userId missing, or vice versa
  if ((token && !userId) || (!token && userId)) {
    const response = NextResponse.redirect(new URL("/authentication/login", req.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    return response;
  }

  // ✅ Case 1: Not logged in and trying to access protected route
  if (!isLoggedIn && isProtectedRoute) {
    const response = NextResponse.redirect(new URL("/authentication/login", req.url));

    // Clear any invalid cookies
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });

    return response;
  }

  // ✅ Case 2: Logged in but visiting login page → redirect to home
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Case 3: If user deletes one cookie on unprotected routes, still clear both cookies
  if (!isLoggedIn && !isProtectedRoute && (token || userId)) {
    const response = NextResponse.next();
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    return response;
  }

  // ✅ Otherwise allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/authentication/login",
    "/dsr",
    "/bookingPage",
    "/((?!_next|favicon.ico).*)", // include all routes except internal Next.js files
  ],
};
