"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { CrmTask, mockTasks } from "../data";

interface SupabaseTaskRow {
  id?: string;
  title?: string;
  description?: string;
  due_date?: string;
  status?: string;
  priority?: string;
  type?: string;
  customer_id?: string | null;
  presentation_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

const mapRowToTask = (row: SupabaseTaskRow): CrmTask => ({
  id:
    row.id ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)),
  title: row.title || "Görev",
  description: row.description || "",
  dueDate: row.due_date || new Date().toISOString(),
  status: (row.status as CrmTask["status"]) || "pending",
  priority: (row.priority as CrmTask["priority"]) || "medium",
  type: (row.type as CrmTask["type"]) || "meeting",
  customerId: row.customer_id || null,
  presentationId: row.presentation_id || null,
  createdAt: row.created_at || new Date().toISOString(),
});

export function useTasks() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [tasks, setTasks] = useState<CrmTask[]>([...mockTasks]);
  const [loading, setLoading] = useState(Boolean(supabase));

  const fetchTasks = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) {
        console.warn("Supabase görevleri alınamadı:", error.message);
        return;
      }

      if (data) {
        setTasks(
          data.map(mapRowToTask).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        );
      }
    } catch (error) {
      console.warn("Supabase görevleri alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    fetchTasks();
  }, [supabase, fetchTasks]);

  return { tasks, loading, refresh: fetchTasks };
}

