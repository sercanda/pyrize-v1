import { useCallback, useEffect, useMemo, useState } from "react";
import { mockSunumlar } from "../data";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface SupabaseSunum {
  id?: string;
  slug?: string;
  baslik?: string;
  title?: string;
  created_at?: string;
  mulk_turu?: string;
  mulkTuru?: string;
  fiyat?: number;
  durum?: string;
  istek?: any;
}

export function useSunumlar() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [sunumlar, setSunumlar] = useState<Array<{
    id: string;
    baslik: string;
    tarih: Date;
    mulkTuru: string;
    fiyat?: number;
    durum: string;
    istek?: any;
  }>>([...mockSunumlar]);
  const [loading, setLoading] = useState(Boolean(supabase));

  const fetchSunumlar = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSunumlar([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("sunumlar")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase sunumları alınamadı:", error.message);
        return;
      }
      if (data) {
        const mapped = data.map((row: SupabaseSunum) => ({
          id:
            row.id ||
            row.slug ||
            (typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).slice(2)),
          baslik: row.baslik || row.title || "Sunum",
          tarih: row.created_at ? new Date(row.created_at) : new Date(),
          mulkTuru: row.mulk_turu || row.mulkTuru || "bilinmiyor",
          fiyat: row.fiyat ?? row.istek?.mulk?.fiyat ?? undefined,
          durum: row.durum || "aktif",
          istek: row.istek || null,
        }));
        setSunumlar(mapped);
      }
    } catch (error) {
      console.warn("Supabase sunumları alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    fetchSunumlar();
  }, [supabase, fetchSunumlar]);

  return { sunumlar, loading, refresh: fetchSunumlar };
}

