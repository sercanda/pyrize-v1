"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBActivity } from "@/types/crm";

interface UseCRMActivitiesOptions {
  customerId?: string;
  propertyId?: string;
  dealId?: string;
  type?: string;
  limit?: number;
  autoFetch?: boolean;
}

export function useCRMActivities(options: UseCRMActivitiesOptions = {}) {
  const { customerId, propertyId, dealId, type, limit, autoFetch = true } = options;
  const [activities, setActivities] = useState<DBActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (customerId) params.set("customer_id", customerId);
      if (propertyId) params.set("property_id", propertyId);
      if (dealId) params.set("deal_id", dealId);
      if (type) params.set("type", type);
      if (limit) params.set("limit", String(limit));
      const res = await fetch(`/api/crm/activities?${params}`);
      if (!res.ok) throw new Error("Aktiviteler yüklenemedi");
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [customerId, propertyId, dealId, type, limit]);

  useEffect(() => {
    if (autoFetch) fetchActivities();
  }, [fetchActivities, autoFetch]);

  const createActivity = async (activity: Partial<DBActivity>) => {
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error("Aktivite oluşturulamadı");
    const data = await res.json();
    setActivities((prev) => [data, ...prev]);
    return data;
  };

  return { activities, loading, error, fetchActivities, createActivity };
}
