import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// Admin email ve şifre doğrula ve cookie set et
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Admin yapılandırması kontrolü
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Admin credentials not configured");
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    // Email kontrolü
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Şifre kontrolü - GÜVENLİK DÜZELTMESİ
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Cookie'ye email kaydet (7 gün geçerli)
    const cookieStore = await cookies();
    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: "/",
    });

    return NextResponse.json({ success: true, authorized: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cookie'yi kontrol et
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || "";

  if (!ADMIN_EMAIL) {
    return NextResponse.json(
      { authorized: false, error: "Admin email not configured" },
      { status: 500 }
    );
  }

  const isAuthorized =
    userEmail &&
    userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return NextResponse.json({
    authorized: isAuthorized,
    email: isAuthorized ? userEmail : null
  });
}

// Cookie'yi sil (logout)
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("user_email");

  return NextResponse.json({ success: true });
}

