import { BaseScraper } from './base-scraper';
import { ScrapingResult } from '../types';

export class EmlakjetScraper extends BaseScraper {
  async scrape(location: string): Promise<ScrapingResult> {
    // TODO: Playwright scraping will be implemented when sources are configured
    // For now, return mock data
    const mockData = this.generateMockData(location);
    
    return {
      source: 'emlakjet',
      success: true,
      ...mockData,
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
