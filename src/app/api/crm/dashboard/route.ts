import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

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
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("deals").select("id, value").not("stage", "in", "(closed,lost)"),
    supabase.from("deals").select("id, value").eq("stage", "closed").gte("updated_at", startOfMonth),
    supabase.from("todos").select("id", { count: "exact", head: true }).neq("status", "done").lte("due_date", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("*, customer:customers(id, name), deal:deals(id, title)").order("date", { ascending: false }).limit(5),
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
