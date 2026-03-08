"use client";

import { useState, useEffect, useCallback } from "react";
import type { CRMDashboardStats } from "@/types/crm";

export function useCRMDashboard() {
  const [stats, setStats] = useState<CRMDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/dashboard");
      if (!res.ok) throw new Error("Dashboard verileri yüklenemedi");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, fetchStats };
}
