import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

/* 🔒 CENTRAL ROLE → PERMISSION MAP (SERVER ONLY) */
const ROLE_PERMISSIONS = {
  Admin: {
    canViewBookings: true,
    canCancelBooking: false,
    canSettle: true,
  },
  SubAgencyAdmin: {
    canViewBookings: true,
    canCancelBooking: true,
    canSettle: false,
  },
  Agent: {
    canViewBookings: true,
    canCancelBooking: false,
    canSettle: false,
  },

};

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({
      permissions: null,
      isAuthorized: false,
    });
  }

  const decoded = jwtDecode(token);
  const role = decoded?.RoleName;

  const permissions = ROLE_PERMISSIONS[role];

  return NextResponse.json({
    permissions: permissions ?? null,
    isAuthorized: Boolean(permissions),
  });
}
