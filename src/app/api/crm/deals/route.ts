import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

const STUB_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const customerId = searchParams.get("customer_id");

  let query = supabase
    .from("deals")
    .select("*, customer:customers(id, name, phone, email), property:properties(id, title, price, city)")
    .eq("user_id", STUB_USER_ID)
    .order("created_at", { ascending: false });

  if (stage) query = query.eq("stage", stage);
  if (customerId) query = query.eq("customer_id", customerId);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Deals GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("deals")
    .insert({
      title: body.title,
      customer_id: body.customer_id || null,
      property_id: body.property_id || null,
      stage: body.stage || "lead",
      value: body.value || 0,
      expected_close_date: body.expected_close_date || null,
      notes: body.notes || null,
      user_id: STUB_USER_ID,
    })
    .select("*, customer:customers(id, name, phone, email), property:properties(id, title, price, city)")
    .single();

  if (error) {
    console.error("[CRM Deals POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
