// Playwright temporarily disabled - using mock data until scraping sources are configured
import { ScrapingResult } from '../types';

export abstract class BaseScraper {
  protected userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  /**
   * Generate mock market data based on location
   * TODO: Replace with actual scraping when sources are configured
   */
  protected generateMockData(location: string): Partial<ScrapingResult> {
    // Generate realistic-looking mock data
    const basePrice = 25000 + Math.random() * 10000; // 25k-35k TL/m²
    const trendVariation = 0.95 + Math.random() * 0.1; // ±5% variation
    
    const sixMonthTrend = Array.from({ length: 6 }, (_, i) => {
      const monthPrice = basePrice * (1 + (5 - i) * 0.02 * trendVariation);
      return Math.round(monthPrice / 100) * 100; // Round to nearest 100
    }).reverse();

    return {
      sqm_avg: Math.round(basePrice / 100) * 100,
      six_month_trend: sixMonthTrend,
      sale_duration_days: 30 + Math.floor(Math.random() * 60), // 30-90 days
      demand_change_percent: (Math.random() - 0.5) * 20, // -10% to +10%
      active_listings_count: 50 + Math.floor(Math.random() * 200),
    };
  }

  protected parsePrice(text: string | null): number | null {
    if (!text) return null;
    const cleaned = text.replace(/[^\d,.]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  protected parseNumber(text: string | null): number | null {
    if (!text) return null;
    const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  abstract scrape(location: string): Promise<ScrapingResult>;
  
  // Close method no longer needed without Playwright
  async close(): Promise<void> {
    // No-op: Playwright browser cleanup removed
  }
}

