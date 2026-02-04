/**
 * Türkiye API Service
 * https://api.turkiyeapi.dev/v1/
 * 
 * Bu servis Türkiye'deki il, ilçe, mahalle ve köy verilerini sağlar.
 */

const TURKIYE_API_BASE = 'https://api.turkiyeapi.dev/v1';

export interface Province {
  id: number;
  name: string;
  population: number;
  area: number;
  areaCode: string;
  isMetropolitan: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
  population: number;
  area: number;
}

export interface Neighborhood {
  id: number;
  name: string;
  districtId: number;
  population: number;
}

/**
 * Tüm illeri getirir
 */
export async function getProvinces(): Promise<Province[]> {
  try {
    const response = await fetch(`${TURKIYE_API_BASE}/provinces?fields=id,name,population,area,isMetropolitan,coordinates`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Türkiye API - İller getirilemedi:', error);
    return [];
  }
}

/**
 * Belirli bir ile ait ilçeleri getirir
 */
export async function getDistricts(provinceId: number): Promise<District[]> {
  try {
    const response = await fetch(`${TURKIYE_API_BASE}/districts?provinceId=${provinceId}&fields=id,name,provinceId,population,area`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Türkiye API - İlçeler getirilemedi:', error);
    return [];
  }
}

/**
 * Belirli bir ilçeye ait mahalleleri getirir
 */
export async function getNeighborhoods(districtId: number): Promise<Neighborhood[]> {
  try {
    const response = await fetch(`${TURKIYE_API_BASE}/neighborhoods?districtId=${districtId}&fields=id,name,districtId,population`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Türkiye API - Mahalleler getirilemedi:', error);
    return [];
  }
}

/**
 * İl adını ID'ye çevirir
 */
export async function getProvinceIdByName(provinceName: string): Promise<number | null> {
  const provinces = await getProvinces();
  const province = provinces.find(p => 
    p.name.toLowerCase().includes(provinceName.toLowerCase()) ||
    provinceName.toLowerCase().includes(p.name.toLowerCase())
  );
  return province?.id || null;
}

/**
 * İl ve ilçe bilgilerini birleştirerek konum metni oluşturur
 */
export function formatLocation(provinceName: string, districtName?: string, neighborhoodName?: string): string {
  const parts = [neighborhoodName, districtName, provinceName].filter(Boolean);
  return parts.join(', ');
}

/**
 * İl demografik verilerini AI için hazırlar
 */
export async function getProvinceAnalysisData(provinceId: number) {
  try {
    const response = await fetch(`${TURKIYE_API_BASE}/provinces/${provinceId}?fields=name,population,area,isMetropolitan,coordinates`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    const province = result.data;
    
    return {
      name: province.name,
      population: province.population,
      area: province.area,
      isMetropolitan: province.isMetropolitan,
      populationDensity: Math.round(province.population / province.area),
      coordinates: province.coordinates
    };
  } catch (error) {
    console.error('Türkiye API - İl analiz verisi getirilemedi:', error);
    return null;
  }
}

/**
 * İlçe demografik verilerini AI için hazırlar
 */
export async function getDistrictAnalysisData(districtId: number) {
  try {
    const response = await fetch(`${TURKIYE_API_BASE}/districts/${districtId}?fields=name,population,area,province`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    const district = result.data;
    
    return {
      name: district.name,
      provinceName: district.province?.name,
      population: district.population,
      area: district.area,
      populationDensity: district.area > 0 ? Math.round(district.population / district.area) : 0
    };
  } catch (error) {
    console.error('Türkiye API - İlçe analiz verisi getirilemedi:', error);
    return null;
  }
}

