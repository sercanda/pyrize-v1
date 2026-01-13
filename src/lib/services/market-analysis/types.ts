export interface MarketAnalysisData {
  location: string;
  province?: string;
  district?: string;
  neighborhood?: string;
  sqm_avg: number;
  six_month_trend: number[];
  sale_duration_days: number;
  demand_change_percent: number;
  active_listings_count?: number;
  data_source: string[];
  scrape_status: 'pending' | 'success' | 'failed' | 'partial';
  error_message?: string;
  last_updated: Date;
}

export interface ScrapingResult {
  sqm_avg?: number;
  six_month_trend?: number[];
  sale_duration_days?: number;
  demand_change_percent?: number;
  active_listings_count?: number;
  source: string;
  success: boolean;
  error?: string;
}

export interface MarketAnalysisOptions {
  location: string;
  province?: string;
  district?: string;
  neighborhood?: string;
  forceRefresh?: boolean;
  maxCacheAgeHours?: number;
}

export interface CachedMarketData {
  id: string;
  location: string;
  sqm_avg: number | null;
  six_month_trend: number[] | null;
  sale_duration_days: number | null;
  demand_change_percent: number | null;
  active_listings_count: number | null;
  last_updated: Date;
  is_stale: boolean;
}

