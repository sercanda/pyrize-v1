import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const customerId = searchParams.get("customer_id");
  const search = searchParams.get("search");

  let query = supabase
    .from("properties")
    .select("*, customer:customers(id, name, phone)")
    .order("created_at", { ascending: false });

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);
  if (customerId) query = query.eq("customer_id", customerId);
  if (search) query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Properties GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("properties")
    .insert({
      title: body.title,
      address: body.address || null,
      city: body.city || null,
      price: body.price || 0,
      type: body.type || "sale",
      status: body.status || "available",
      customer_id: body.customer_id || null,
      notes: body.notes || null,
      images: body.images || [],
      room_count: body.room_count || null,
      area_sqm: body.area_sqm || null,
      floor_info: body.floor_info || null,
      building_age: body.building_age || null,
      features: body.features || [],
    })
    .select()
    .single();

  if (error) {
    console.error("[CRM Properties POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
