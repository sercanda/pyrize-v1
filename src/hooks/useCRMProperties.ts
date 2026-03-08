"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBProperty } from "@/types/crm";

interface UseCRMPropertiesOptions {
  type?: string;
  status?: string;
  customerId?: string;
  search?: string;
  autoFetch?: boolean;
}

export function useCRMProperties(options: UseCRMPropertiesOptions = {}) {
  const { type, status, customerId, search, autoFetch = true } = options;
  const [properties, setProperties] = useState<DBProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (status) params.set("status", status);
      if (customerId) params.set("customer_id", customerId);
      if (search) params.set("search", search);
      const res = await fetch(`/api/crm/properties?${params}`);
      if (!res.ok) throw new Error("Mülkler yüklenemedi");
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [type, status, customerId, search]);

  useEffect(() => {
    if (autoFetch) fetchProperties();
  }, [fetchProperties, autoFetch]);

  const createProperty = async (property: Partial<DBProperty>) => {
    const res = await fetch("/api/crm/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });
    if (!res.ok) throw new Error("Mülk oluşturulamadı");
    const data = await res.json();
    setProperties((prev) => [data, ...prev]);
    return data;
  };

  const updateProperty = async (id: string, updates: Partial<DBProperty>) => {
    const res = await fetch(`/api/crm/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Mülk güncellenemedi");
    const data = await res.json();
    setProperties((prev) => prev.map((p) => (p.id === id ? data : p)));
    return data;
  };

  const deleteProperty = async (id: string) => {
    const res = await fetch(`/api/crm/properties/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Mülk silinemedi");
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return { properties, loading, error, fetchProperties, createProperty, updateProperty, deleteProperty };
}
