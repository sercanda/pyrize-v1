"""
gecmisi.com.tr fiyat geçmişi scraper
Sahibinden ilan numarası ile fiyat geçmişi verilerini çeker
"""

import requests
from bs4 import BeautifulSoup
import re
import json
from typing import Dict, List, Optional
from datetime import datetime
import time

class GecmisiScraper:
    def __init__(self):
        self.base_url = "https://gecmisi.com.tr"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
    
    def search_by_ilan_no(self, ilan_no: str) -> Optional[Dict]:
        """
        İlan numarası ile arama yapar ve fiyat geçmişi verilerini çeker
        
        Args:
            ilan_no: Sahibinden ilan numarası (örn: "123456789")
            
        Returns:
            Dict with price history data or None if not found
        """
        try:
            # Önce arama sayfasına git
            search_url = f"{self.base_url}/arama"
            search_params = {
                'q': ilan_no,
                'type': 'sahibinden'
            }
            
            response = self.session.get(search_url, params=search_params, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # İlan linkini bul
            ilan_link = None
            links = soup.find_all('a', href=True)
            for link in links:
                href = link.get('href', '')
                if 'ilan' in href.lower() and ilan_no in href:
                    ilan_link = href if href.startswith('http') else f"{self.base_url}{href}"
                    break
            
            if not ilan_link:
                # Direkt ilan URL'ini dene
                ilan_link = f"{self.base_url}/ilan/{ilan_no}"
                test_response = self.session.get(ilan_link, timeout=10)
                if test_response.status_code != 200:
                    return None
            
            # İlan detay sayfasını çek
            return self.scrape_ilan_page(ilan_link, ilan_no)
            
        except Exception as e:
            print(f"❌ Scraper hatası: {e}")
            return None
    
    def scrape_ilan_page(self, url: str, ilan_no: str) -> Optional[Dict]:
        """
        İlan detay sayfasından fiyat geçmişi verilerini çeker
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Fiyat geçmişi tablosunu bul
            price_history = []
            min_price = None
            max_price = None
            current_price = None
            market_position = None
            
            # Farklı selector'ları dene
            selectors = [
                'table.price-history',
                '.price-history table',
                'table[class*="price"]',
                'table[class*="history"]',
                '.timeline',
                '.price-timeline'
            ]
            
            table = None
            for selector in selectors:
                table = soup.select_one(selector)
                if table:
                    break
            
            if table:
                rows = table.find_all('tr')[1:]  # Header'ı atla
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 2:
                        date_str = cells[0].get_text(strip=True)
                        price_str = cells[1].get_text(strip=True)
                        
                        # Fiyatı parse et
                        price_match = re.search(r'[\d.]+', price_str.replace('.', '').replace(',', '.'))
                        if price_match:
                            price = float(price_match.group())
                            price_history.append({
                                'date': date_str,
                                'price': price,
                                'formatted': price_str
                            })
                            
                            if min_price is None or price < min_price:
                                min_price = price
                            if max_price is None or price > max_price:
                                max_price = price
                            
                            # En son fiyat current_price olur
                            current_price = price
            
            # Mevcut fiyatı başka yerden de bulmaya çalış
            if not current_price:
                price_elements = soup.find_all(['span', 'div', 'p'], class_=re.compile(r'price|fiyat', re.I))
                for elem in price_elements:
                    text = elem.get_text(strip=True)
                    price_match = re.search(r'[\d.]+', text.replace('.', '').replace(',', '.'))
                    if price_match:
                        current_price = float(price_match.group())
                        break
            
            # Piyasa karşılaştırması bul
            market_text = soup.get_text()
            if 'piyasanın üstünde' in market_text.lower() or 'üstünde' in market_text.lower():
                market_position = 'above'
            elif 'piyasanın altında' in market_text.lower() or 'altında' in market_text.lower():
                market_position = 'below'
            else:
                market_position = 'average'
            
            if not price_history and not current_price:
                return None
            
            return {
                'ilan_no': ilan_no,
                'price_history': price_history,
                'min_price': min_price,
                'max_price': max_price,
                'current_price': current_price,
                'market_position': market_position,
                'scraped_at': datetime.now().isoformat(),
                'url': url
            }
            
        except Exception as e:
            print(f"❌ Sayfa çekme hatası: {e}")
            return None

def scrape_price_history(ilan_no: str) -> Optional[Dict]:
    """
    Ana fonksiyon - ilan numarası ile fiyat geçmişi çeker
    """
    scraper = GecmisiScraper()
    return scraper.search_by_ilan_no(ilan_no)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        ilan_no = sys.argv[1]
        result = scrape_price_history(ilan_no)
        if result:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(json.dumps({"error": "Veri bulunamadı"}, ensure_ascii=False))
    else:
        # Test
        test_ilan = "123456789"
        result = scrape_price_history(test_ilan)
        if result:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(json.dumps({"error": "Veri bulunamadı"}, ensure_ascii=False))

