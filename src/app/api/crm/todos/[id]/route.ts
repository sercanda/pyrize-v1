import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { id } = await params;

  const { data, error } = await supabase
    .from("todos")
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("todos")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, customer:customers(id, name), deal:deals(id, title)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const { id } = await params;

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
