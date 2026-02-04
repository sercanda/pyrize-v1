'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface Province {
  id: number;
  name: string;
  population: number;
  isMetropolitan: boolean;
}

interface District {
  id: number;
  name: string;
  provinceId: number;
}

interface Neighborhood {
  id: number;
  name: string;
  districtId: number;
}

interface LocationSelectorProps {
  value: string;
  onChange: (location: string, details?: { province?: Province; district?: District; neighborhood?: Neighborhood }) => void;
  className?: string;
}

export default function LocationSelector({ value, onChange, className = '' }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  
  const [loading, setLoading] = useState(false);

  // İlleri yükle
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await fetch('/api/lokasyon?type=provinces');
        const result = await response.json();
        setProvinces(result.data || []);
      } catch (error) {
        console.error('İller yüklenemedi:', error);
      }
    };
    loadProvinces();
  }, []);

  // İl seçildiğinde ilçeleri yükle
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/lokasyon?type=districts&provinceId=${selectedProvince.id}`);
          const result = await response.json();
          setDistricts(result.data || []);
        } catch (error) {
          console.error('İlçeler yüklenemedi:', error);
        }
        setNeighborhoods([]);
        setLoading(false);
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setNeighborhoods([]);
    }
  }, [selectedProvince]);

  // İlçe seçildiğinde mahalleleri yükle
  useEffect(() => {
    if (selectedDistrict) {
      const loadNeighborhoods = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/lokasyon?type=neighborhoods&districtId=${selectedDistrict.id}`);
          const result = await response.json();
          setNeighborhoods(result.data || []);
        } catch (error) {
          console.error('Mahalleler yüklenemedi:', error);
        }
        setLoading(false);
      };
      loadNeighborhoods();
    } else {
      setNeighborhoods([]);
    }
  }, [selectedDistrict]);

  // Konum değiştiğinde parent'a bildir
  useEffect(() => {
    const parts = [
      selectedNeighborhood?.name,
      selectedDistrict?.name,
      selectedProvince?.name
    ].filter(Boolean);
    
    if (parts.length > 0) {
      const locationString = parts.join(', ');
      onChange(locationString, {
        province: selectedProvince || undefined,
        district: selectedDistrict || undefined,
        neighborhood: selectedNeighborhood || undefined
      });
    }
  }, [selectedProvince, selectedDistrict, selectedNeighborhood]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* İl Seçimi */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          İl *
        </label>
        <select
          value={selectedProvince?.id || ''}
          onChange={(e) => {
            const province = provinces.find(p => p.id === Number(e.target.value));
            setSelectedProvince(province || null);
            setSelectedDistrict(null);
            setSelectedNeighborhood(null);
          }}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
          required
        >
          <option value="">İl Seçin</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id} className="bg-gray-800">
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* İlçe Seçimi */}
      {selectedProvince && (
        <div>
          <label className="block text-sm font-medium mb-2">
            İlçe *
          </label>
          <select
            value={selectedDistrict?.id || ''}
            onChange={(e) => {
              const district = districts.find(d => d.id === Number(e.target.value));
              setSelectedDistrict(district || null);
              setSelectedNeighborhood(null);
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
            disabled={loading || districts.length === 0}
            required
          >
            <option value="">İlçe Seçin</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id} className="bg-gray-800">
                {district.name}
              </option>
            ))}
          </select>
          {loading && <p className="text-xs text-gray-400 mt-1">Yükleniyor...</p>}
        </div>
      )}

      {/* Mahalle Seçimi */}
      {selectedDistrict && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Mahalle (Opsiyonel)
          </label>
          <select
            value={selectedNeighborhood?.id || ''}
            onChange={(e) => {
              const neighborhood = neighborhoods.find(n => n.id === Number(e.target.value));
              setSelectedNeighborhood(neighborhood || null);
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57B6B2]"
            disabled={loading || neighborhoods.length === 0}
          >
            <option value="">Mahalle Seçin (Opsiyonel)</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id} className="bg-gray-800">
                {neighborhood.name}
              </option>
            ))}
          </select>
          {loading && <p className="text-xs text-gray-400 mt-1">Yükleniyor...</p>}
        </div>
      )}

      {/* Seçilen Konum Özeti */}
      {selectedProvince && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Seçilen Konum:</p>
          <p className="text-sm text-white font-medium">
            {[
              selectedNeighborhood?.name,
              selectedDistrict?.name,
              selectedProvince?.name
            ].filter(Boolean).join(', ')}
          </p>
          {selectedProvince && (
            <p className="text-xs text-gray-500 mt-1">
              Nüfus: {selectedProvince.population.toLocaleString('tr-TR')} • 
              {selectedProvince.isMetropolitan ? ' Büyükşehir' : ' İl'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

