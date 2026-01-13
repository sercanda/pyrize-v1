import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export function middleware(request: NextRequest) {
  // Admin paneli route'u kontrolü
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    // Cookie'den kullanıcı email'ini al
    const userEmail = request.cookies.get("user_email")?.value || "";
    
    // Admin email yapılandırılmamışsa engelle
    if (!ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Eğer email yoksa veya admin email ile eşleşmiyorsa erişimi engelle
    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      // Sayfaya yönlendir ama login formu gösterecek
      // (Login formu client-side'da kontrol ediliyor)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/admin/:path*",
};

