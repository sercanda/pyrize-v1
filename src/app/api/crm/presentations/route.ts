import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customer_id");

  let query = supabase
    .from("presentations")
    .select("id, title, purpose, style, theme, customer_id, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (customerId) query = query.eq("customer_id", customerId);

  const { data, error } = await query;

  if (error) {
    console.error("[CRM Presentations GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
