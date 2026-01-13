import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

// Admin email'i doğrula ve cookie set et
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    // Email kontrolü
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Şifre kontrolü (opsiyonel - şimdilik email yeterli)
    // İleride Supabase Auth ile kontrol edilecek

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

