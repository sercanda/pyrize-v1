import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

const STUB_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı kurulamadı" }, { status: 503 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    customersRes,
    openDealsRes,
    closedDealsRes,
    todosRes,
    propertiesRes,
    activitiesRes,
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("user_id", STUB_USER_ID),
    supabase.from("deals").select("id, value").eq("user_id", STUB_USER_ID).not("stage", "in", "(closed,lost)"),
    supabase.from("deals").select("id, value").eq("user_id", STUB_USER_ID).eq("stage", "closed").gte("updated_at", startOfMonth),
    supabase.from("todos").select("id", { count: "exact", head: true }).eq("user_id", STUB_USER_ID).neq("status", "done").lte("due_date", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("user_id", STUB_USER_ID),
    supabase.from("activities").select("*, customer:customers(id, name), deal:deals(id, title)").eq("user_id", STUB_USER_ID).order("date", { ascending: false }).limit(5),
  ]);

  const openDeals = openDealsRes.data || [];
  const closedDeals = closedDealsRes.data || [];

  return NextResponse.json({
    activeCustomers: customersRes.count || 0,
    openDeals: openDeals.length,
    openDealsValue: openDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0),
    closedThisMonth: closedDeals.length,
    closedThisMonthValue: closedDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0),
    upcomingTodos: todosRes.count || 0,
    totalProperties: propertiesRes.count || 0,
    recentActivities: activitiesRes.data || [],
  });
}
