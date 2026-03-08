import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "100");

  let query = supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (type) query = query.eq("type", type);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Customers GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      type: body.type || "buyer",
      status: body.status || "Aktif",
      city: body.city || null,
      source: body.source || null,
      tags: body.tags || [],
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[CRM Customers POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
