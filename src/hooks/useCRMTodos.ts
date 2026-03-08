"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBTodo } from "@/types/crm";

interface UseCRMTodosOptions {
  status?: string;
  priority?: string;
  customerId?: string;
  dealId?: string;
  autoFetch?: boolean;
}

export function useCRMTodos(options: UseCRMTodosOptions = {}) {
  const { status, priority, customerId, dealId, autoFetch = true } = options;
  const [todos, setTodos] = useState<DBTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);
      if (customerId) params.set("customer_id", customerId);
      if (dealId) params.set("deal_id", dealId);
      const res = await fetch(`/api/crm/todos?${params}`);
      if (!res.ok) throw new Error("Görevler yüklenemedi");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [status, priority, customerId, dealId]);

  useEffect(() => {
    if (autoFetch) fetchTodos();
  }, [fetchTodos, autoFetch]);

  const createTodo = async (todo: Partial<DBTodo>) => {
    const res = await fetch("/api/crm/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error("Görev oluşturulamadı");
    const data = await res.json();
    setTodos((prev) => [data, ...prev]);
    return data;
  };

  const updateTodo = async (id: string, updates: Partial<DBTodo>) => {
    const res = await fetch(`/api/crm/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Görev güncellenemedi");
    const data = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newStatus = todo.status === "done" ? "todo" : "done";
    return updateTodo(id, { status: newStatus } as Partial<DBTodo>);
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/crm/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Görev silinemedi");
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return { todos, loading, error, fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo };
}
