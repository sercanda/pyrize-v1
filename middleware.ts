import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    const userEmail = request.cookies.get("user_email")?.value || "";

    if (!ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/admin/:path*",
};
