import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

const STUB_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const customerId = searchParams.get("customer_id");
  const dealId = searchParams.get("deal_id");

  let query = supabase
    .from("todos")
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .eq("user_id", STUB_USER_ID)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (customerId) query = query.eq("customer_id", customerId);
  if (dealId) query = query.eq("deal_id", dealId);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Todos GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("todos")
    .insert({
      title: body.title,
      description: body.description || null,
      priority: body.priority || "medium",
      status: body.status || "todo",
      due_date: body.due_date || null,
      customer_id: body.customer_id || null,
      deal_id: body.deal_id || null,
      property_id: body.property_id || null,
      user_id: STUB_USER_ID,
    })
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .single();

  if (error) {
    console.error("[CRM Todos POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
