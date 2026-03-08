"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBCustomer } from "@/types/crm";

interface UseCRMCustomersOptions {
  type?: string;
  search?: string;
  autoFetch?: boolean;
}

export function useCRMCustomers(options: UseCRMCustomersOptions = {}) {
  const { type, search, autoFetch = true } = options;
  const [customers, setCustomers] = useState<DBCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (search) params.set("search", search);
      const res = await fetch(`/api/crm/customers?${params}`);
      if (!res.ok) throw new Error("Müşteriler yüklenemedi");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [type, search]);

  useEffect(() => {
    if (autoFetch) fetchCustomers();
  }, [fetchCustomers, autoFetch]);

  const createCustomer = async (customer: Partial<DBCustomer>) => {
    const res = await fetch("/api/crm/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error("Müşteri oluşturulamadı");
    const data = await res.json();
    setCustomers((prev) => [data, ...prev]);
    return data;
  };

  const updateCustomer = async (id: string, updates: Partial<DBCustomer>) => {
    const res = await fetch(`/api/crm/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Müşteri güncellenemedi");
    const data = await res.json();
    setCustomers((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  };

  const deleteCustomer = async (id: string) => {
    const res = await fetch(`/api/crm/customers/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Müşteri silinemedi");
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, deleteCustomer };
}
