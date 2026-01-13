import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, fotograflar } = body;

    if (!slug || !fotograflar || !Array.isArray(fotograflar)) {
      return NextResponse.json(
        { error: "Slug ve fotograflar array'i gerekli" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServiceClient();
    if (!supabaseServer) {
      return NextResponse.json(
        { error: "Supabase bağlantısı kurulamadı" },
        { status: 500 }
      );
    }

    // Mevcut sunum verisini al
    const { data: existingSunum, error: fetchError } = await supabaseServer
      .from("sunumlar")
      .select("icerik")
      .eq("slug", slug)
      .single();

    if (fetchError || !existingSunum) {
      return NextResponse.json(
        { error: "Sunum bulunamadı" },
        { status: 404 }
      );
    }

    // Fotoğrafları içerik'e ekle
    const updatedIcerik = {
      ...existingSunum.icerik,
      fotograflar: fotograflar
    };

    // Supabase'e güncelleme yap
    const { error: updateError } = await supabaseServer
      .from("sunumlar")
      .update({
        icerik: updatedIcerik,
        updated_at: new Date().toISOString()
      })
      .eq("slug", slug);

    if (updateError) {
      console.error("❌ Fotoğraflar güncellenirken hata:", updateError);
      return NextResponse.json(
        { error: "Fotoğraflar güncellenemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${fotograflar.length} adet fotoğraf eklendi`
    });
  } catch (error: any) {
    console.error("❌ Fotoğraflar API hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Fotoğraflar eklenirken bir hata meydana geldi" },
      { status: 500 }
    );
  }
}

