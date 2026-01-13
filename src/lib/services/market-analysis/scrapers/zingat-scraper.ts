import { BaseScraper } from './base-scraper';
import { ScrapingResult } from '../types';

export class ZingatScraper extends BaseScraper {
  async scrape(location: string): Promise<ScrapingResult> {
    // TODO: Playwright scraping will be implemented when sources are configured
    // For now, return mock data with slight variation
    const mockData = this.generateMockData(location);
    
    // Add some variation to make it different from Endeksa
    const variation = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
    const adjustedPrice = Math.round((mockData.sqm_avg || 25000) * variation / 100) * 100;
    
    return {
      source: 'zingat',
      success: true,
      ...mockData,
      sqm_avg: adjustedPrice,
    };
  }

  private normalizeLocation(location: string): string {
    return location
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  }
}
