import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

// Security headers to add to all responses
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
};

export function middleware(request: NextRequest) {
  // Admin paneli route'u kontrolü
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    // Cookie'den kullanıcı email'ini al
    const userEmail = request.cookies.get("user_email")?.value || "";

    // Admin email yapılandırılmamışsa engelle
    if (!ADMIN_EMAIL) {
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      // Add security headers to redirect response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Eğer email yoksa veya admin email ile eşleşmiyorsa
    // Sayfaya yönlendir ama login formu gösterecek (client-side kontrolü)
    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const response = NextResponse.next();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  }

  // Add security headers to all other responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  // Apply to all routes except static files and API routes that need different headers
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

