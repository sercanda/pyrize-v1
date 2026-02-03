import { getSupabaseServiceClient } from '@/lib/supabase/server';
// Playwright scrapers - only import when needed (server-side only)
let EndeksaScraper: typeof import('./scrapers/endeksa-scraper').EndeksaScraper;
let ZingatScraper: typeof import('./scrapers/zingat-scraper').ZingatScraper;
let EmlakjetScraper: typeof import('./scrapers/emlakjet-scraper').EmlakjetScraper;

// Lazy load scrapers to avoid build-time issues
async function getScrapers() {
  if (!EndeksaScraper) {
    const endeksa = await import('./scrapers/endeksa-scraper');
    EndeksaScraper = endeksa.EndeksaScraper;
  }
  if (!ZingatScraper) {
    const zingat = await import('./scrapers/zingat-scraper');
    ZingatScraper = zingat.ZingatScraper;
  }
  if (!EmlakjetScraper) {
    const emlakjet = await import('./scrapers/emlakjet-scraper');
    EmlakjetScraper = emlakjet.EmlakjetScraper;
  }
  return { EndeksaScraper, ZingatScraper, EmlakjetScraper };
}
import {
  MarketAnalysisData,
  MarketAnalysisOptions,
  CachedMarketData,
  ScrapingResult,
} from './types';

const CACHE_TTL_HOURS = 48;

export class MarketAnalysisService {
  /**
   * Get market analysis data for a location
   * Checks cache first, scrapes if needed
   */
  async getMarketAnalysis(
    options: MarketAnalysisOptions
  ): Promise<MarketAnalysisData | null> {
    const { location, forceRefresh = false, maxCacheAgeHours = CACHE_TTL_HOURS } = options;

    // Check cache
    if (!forceRefresh) {
      const cached = await this.getCachedData(location, maxCacheAgeHours);
      if (cached && !cached.is_stale) {
        return this.mapCachedToData(cached);
      }

      // If stale but exists, return it and trigger background refresh
      if (cached && cached.is_stale) {
        // Background refresh (don't wait)
        this.refreshMarketData(location).catch((err) =>
          console.error('[MarketAnalysis] Background refresh failed:', err)
        );
        return this.mapCachedToData(cached);
      }
    }

    // No cache or force refresh - scrape now
    return await this.scrapeAndCache(options);
  }

  /**
   * Get cached data from database
   */
  private async getCachedData(
    location: string,
    maxAgeHours: number
  ): Promise<CachedMarketData | null> {
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      console.warn('[MarketAnalysis] Supabase client not available');
      return null;
    }

    try {
      const { data, error } = await supabase.rpc('get_market_analysis', {
        p_location: location,
        p_max_age_hours: maxAgeHours,
      });

      if (error) {
        console.error('[MarketAnalysis] Cache lookup error:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const row = data[0];
      return {
        id: row.id,
        location: row.location,
        sqm_avg: row.sqm_avg,
        six_month_trend: row.six_month_trend || [],
        sale_duration_days: row.sale_duration_days,
        demand_change_percent: row.demand_change_percent,
        active_listings_count: row.active_listings_count,
        last_updated: new Date(row.last_updated),
        is_stale: row.is_stale,
      };
    } catch (error) {
      console.error('[MarketAnalysis] Cache lookup exception:', error);
      return null;
    }
  }

  /**
   * Scrape data from all sources and cache it
   */
  private async scrapeAndCache(
    options: MarketAnalysisOptions
  ): Promise<MarketAnalysisData | null> {
    const { location, province, district, neighborhood } = options;

    console.log(`[MarketAnalysis] Starting scrape for: ${location}`);

    // Lazy load scrapers
    const { EndeksaScraper, ZingatScraper, EmlakjetScraper } = await getScrapers();
    const scrapers = [
      { name: 'endeksa', scraper: new EndeksaScraper() },
      { name: 'zingat', scraper: new ZingatScraper() },
      { name: 'emlakjet', scraper: new EmlakjetScraper() },
    ];

    // Scrape from all sources in parallel
    const results = await Promise.allSettled(
      scrapers.map(({ name, scraper }) =>
        scraper
          .scrape(location)
          .then((result) => ({ ...result, source: name }))
          .catch((error) => ({
            source: name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }))
      )
    );

    // Aggregate results
    const aggregated = this.aggregateResults(results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

    // Cache the result - spread aggregated first, then override with explicit values
    await this.cacheMarketData({
      ...aggregated,
      location,
      province,
      district,
      neighborhood,
    });

    // Cleanup scrapers (no longer needed with mock data)
    // await Promise.all(
    //   scrapers.map(({ scraper }) => scraper.close().catch(() => {}))
    // );

    return aggregated;
  }

  /**
   * Aggregate scraping results from multiple sources
   */
  private aggregateResults(results: (ScrapingResult | null)[]): MarketAnalysisData {
    const successful = results.filter((r) => r && r.success) as ScrapingResult[];
    const sources = successful.map((r) => r.source);

    // Calculate average sqm_avg
    const sqmPrices = successful
      .map((r) => r.sqm_avg)
      .filter((p): p is number => p !== undefined);
    const sqm_avg = sqmPrices.length > 0
      ? sqmPrices.reduce((sum, p) => sum + p, 0) / sqmPrices.length
      : 0;

    // Merge trends (take longest or average)
    let six_month_trend: number[] = [];
    const trends = successful
      .map((r) => r.six_month_trend)
      .filter((t): t is number[] => t !== undefined && t.length > 0);

    if (trends.length > 0) {
      // Average across all trends
      const maxLength = Math.max(...trends.map((t) => t.length));
      six_month_trend = Array.from({ length: maxLength }, (_, i) => {
        const values = trends
          .map((t) => t[i])
          .filter((v): v is number => v !== undefined);
        return values.length > 0
          ? values.reduce((sum, v) => sum + v, 0) / values.length
          : 0;
      });
    }

    // Average sale duration
    const durations = successful
      .map((r) => r.sale_duration_days)
      .filter((d): d is number => d !== undefined);
    const sale_duration_days = durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
      : 0;

    // Average demand change
    const demandChanges = successful
      .map((r) => r.demand_change_percent)
      .filter((d): d is number => d !== undefined);
    const demand_change_percent = demandChanges.length > 0
      ? demandChanges.reduce((sum, d) => sum + d, 0) / demandChanges.length
      : 0;

    // Sum active listings
    const listings = successful
      .map((r) => r.active_listings_count)
      .filter((c): c is number => c !== undefined);
    const active_listings_count = listings.length > 0
      ? listings.reduce((sum, c) => sum + c, 0)
      : 0;

    return {
      location: '', // Will be set by caller
      sqm_avg,
      six_month_trend,
      sale_duration_days,
      demand_change_percent,
      active_listings_count,
      data_source: sources,
      scrape_status: successful.length === 0 ? 'failed' : successful.length < results.length ? 'partial' : 'success',
      last_updated: new Date(),
    };
  }

  /**
   * Cache market data to database
   */
  private async cacheMarketData(data: Partial<MarketAnalysisData> & { location: string }): Promise<void> {
    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      console.warn('[MarketAnalysis] Supabase client not available for caching');
      return;
    }

    try {
      const { error } = await supabase
        .from('market_analysis_cache')
        .upsert(
          {
            location: data.location,
            province: data.province || null,
            district: data.district || null,
            neighborhood: data.neighborhood || null,
            sqm_avg: data.sqm_avg || null,
            six_month_trend: data.six_month_trend || [],
            sale_duration_days: data.sale_duration_days || null,
            demand_change_percent: data.demand_change_percent || null,
            active_listings_count: data.active_listings_count || null,
            data_source: data.data_source || [],
            scrape_status: data.scrape_status || 'pending',
            error_message: data.error_message || null,
            last_updated: new Date().toISOString(),
          },
          {
            onConflict: 'location',
          }
        );

      if (error) {
        console.error('[MarketAnalysis] Cache save error:', error);
      } else {
        console.log(`[MarketAnalysis] Cached data for: ${data.location}`);
      }
    } catch (error) {
      console.error('[MarketAnalysis] Cache save exception:', error);
    }
  }

  /**
   * Refresh market data for a location (background task)
   */
  async refreshMarketData(location: string): Promise<void> {
    console.log(`[MarketAnalysis] Background refresh for: ${location}`);
    await this.scrapeAndCache({ location, forceRefresh: true });
  }

  /**
   * Refresh all stale data (for CRON job)
   */
  async refreshStaleData(maxAgeHours: number = CACHE_TTL_HOURS): Promise<number> {
    const supabase = getSupabaseServiceClient();
    if (!supabase) return 0;

    try {
      const { data, error } = await supabase
        .from('market_analysis_cache')
        .select('location')
        .lt('last_updated', new Date(Date.now() - maxAgeHours * 60 * 60 * 1000).toISOString());

      if (error || !data) {
        console.error('[MarketAnalysis] Failed to fetch stale locations:', error);
        return 0;
      }

      let refreshed = 0;
      for (const row of data) {
        try {
          await this.refreshMarketData(row.location);
          refreshed++;
          // Rate limiting: wait 2 seconds between refreshes
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`[MarketAnalysis] Failed to refresh ${row.location}:`, error);
        }
      }

      return refreshed;
    } catch (error) {
      console.error('[MarketAnalysis] Refresh stale data exception:', error);
      return 0;
    }
  }

  /**
   * Map cached data to MarketAnalysisData format
   */
  private mapCachedToData(cached: CachedMarketData): MarketAnalysisData {
    return {
      location: cached.location,
      sqm_avg: cached.sqm_avg || 0,
      six_month_trend: cached.six_month_trend || [],
      sale_duration_days: cached.sale_duration_days || 0,
      demand_change_percent: cached.demand_change_percent || 0,
      active_listings_count: cached.active_listings_count || 0,
      data_source: [],
      scrape_status: 'success',
      last_updated: cached.last_updated,
    };
  }

  /**
   * Public methods matching the requirements
   */
  async fetchPriceAverage(location: string): Promise<number | null> {
    const data = await this.getMarketAnalysis({ location });
    return data?.sqm_avg || null;
  }

  async fetchSixMonthTrend(location: string): Promise<number[]> {
    const data = await this.getMarketAnalysis({ location });
    return data?.six_month_trend || [];
  }

  async fetchSaleDuration(location: string): Promise<number | null> {
    const data = await this.getMarketAnalysis({ location });
    return data?.sale_duration_days || null;
  }

  async fetchDemandTrend(location: string): Promise<number | null> {
    const data = await this.getMarketAnalysis({ location });
    return data?.demand_change_percent || null;
  }
}

// Singleton instance
export const marketAnalysisService = new MarketAnalysisService();

