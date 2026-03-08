"use client";

import { useState, useEffect, useCallback } from "react";
import type { DBDeal, DealStage } from "@/types/crm";

interface UseCRMDealsOptions {
  stage?: string;
  customerId?: string;
  autoFetch?: boolean;
}

export function useCRMDeals(options: UseCRMDealsOptions = {}) {
  const { stage, customerId, autoFetch = true } = options;
  const [deals, setDeals] = useState<DBDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (stage) params.set("stage", stage);
      if (customerId) params.set("customer_id", customerId);
      const res = await fetch(`/api/crm/deals?${params}`);
      if (!res.ok) throw new Error("Fırsatlar yüklenemedi");
      const data = await res.json();
      setDeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, [stage, customerId]);

  useEffect(() => {
    if (autoFetch) fetchDeals();
  }, [fetchDeals, autoFetch]);

  const createDeal = async (deal: Partial<DBDeal>) => {
    const res = await fetch("/api/crm/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deal),
    });
    if (!res.ok) throw new Error("Fırsat oluşturulamadı");
    const data = await res.json();
    setDeals((prev) => [data, ...prev]);
    return data;
  };

  const updateDeal = async (id: string, updates: Partial<DBDeal>) => {
    const res = await fetch(`/api/crm/deals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Fırsat güncellenemedi");
    const data = await res.json();
    setDeals((prev) => prev.map((d) => (d.id === id ? data : d)));
    return data;
  };

  const moveDealStage = async (id: string, newStage: DealStage) => {
    return updateDeal(id, { stage: newStage } as Partial<DBDeal>);
  };

  const deleteDeal = async (id: string) => {
    const res = await fetch(`/api/crm/deals/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Fırsat silinemedi");
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return { deals, loading, error, fetchDeals, createDeal, updateDeal, moveDealStage, deleteDeal };
}
