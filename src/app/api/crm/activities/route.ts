import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customer_id");
  const propertyId = searchParams.get("property_id");
  const dealId = searchParams.get("deal_id");
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = supabase
    .from("activities")
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .order("date", { ascending: false })
    .limit(limit);

  if (customerId) query = query.eq("customer_id", customerId);
  if (propertyId) query = query.eq("property_id", propertyId);
  if (dealId) query = query.eq("deal_id", dealId);
  if (type) query = query.eq("type", type);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Activities GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("activities")
    .insert({
      type: body.type,
      customer_id: body.customer_id || null,
      property_id: body.property_id || null,
      deal_id: body.deal_id || null,
      description: body.description || null,
      date: body.date || new Date().toISOString(),
    })
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .single();

  if (error) {
    console.error("[CRM Activities POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
