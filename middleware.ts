import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://openrouter.ai https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
  ].join("; "),
};

function addSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function middleware(request: NextRequest) {
  // Run Supabase session refresh + route protection
  const response = await updateSession(request);

  // Admin panel check (on top of auth check)
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    const userEmail = request.cookies.get("user_email")?.value || "";

    if (!ADMIN_EMAIL) {
      const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
      return addSecurityHeaders(redirect);
    }

    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return addSecurityHeaders(response);
    }
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
