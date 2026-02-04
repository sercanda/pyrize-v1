'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Search,
  ChevronRight,
  TrendingUp,
  Users,
  Building2,
  Compass,
  Sparkles,
} from 'lucide-react';

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

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: {
    province?: Province;
    district?: District;
    neighborhood?: Neighborhood;
    fullAddress: string;
  }) => void;
  currentLocation?: string;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentLocation
}: LocationPickerModalProps) {
  const [step, setStep] = useState<'province' | 'district' | 'neighborhood'>('province');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (step === 'province') {
        loadProvinces();
      }
    } else {
      resetSelectionToProvince();
    }
  }, [isOpen, step]);

  const resetSelectionToProvince = () => {
    setStep('province');
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedNeighborhood(null);
    setDistricts([]);
    setNeighborhoods([]);
    setSearchQuery('');
  };

  const loadProvinces = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lokasyon?type=provinces');
      const result = await response.json();
      setProvinces(result.data || []);
    } catch (error) {
      console.error('İller yüklenemedi:', error);
    }
    setLoading(false);
  };

  const loadDistricts = async (provinceId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lokasyon?type=districts&provinceId=${provinceId}`);
      const result = await response.json();
      setDistricts(result.data || []);
    } catch (error) {
      console.error('İlçeler yüklenemedi:', error);
    }
    setLoading(false);
  };

  const loadNeighborhoods = async (districtId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lokasyon?type=neighborhoods&districtId=${districtId}`);
      const result = await response.json();
      setNeighborhoods(result.data || []);
    } catch (error) {
      console.error('Mahalleler yüklenemedi:', error);
    }
    setLoading(false);
  };

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setStep('district');
    setSearchQuery('');
    setSelectedDistrict(null);
    setSelectedNeighborhood(null);
    setNeighborhoods([]);
    loadDistricts(province.id);
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setStep('neighborhood');
    setSearchQuery('');
    setSelectedNeighborhood(null);
    loadNeighborhoods(district.id);
  };

  const handleNeighborhoodSelect = (neighborhood: Neighborhood) => {
    const fullAddress = `${neighborhood.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`;
    onSelect({
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      neighborhood,
      fullAddress
    });
    setSearchQuery('');
    onClose();
  };

  const handleSkipNeighborhood = () => {
    const fullAddress = selectedNeighborhood
      ? `${selectedNeighborhood.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`
      : `${selectedDistrict?.name}, ${selectedProvince?.name}`;

    onSelect({
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      neighborhood: selectedNeighborhood || undefined,
      fullAddress
    });
    setSearchQuery('');
    onClose();
  };

  const goBack = () => {
    if (step === 'neighborhood') {
      setStep('district');
      setSelectedNeighborhood(null);
      setSearchQuery('');
    } else if (step === 'district') {
      setStep('province');
      setSelectedDistrict(null);
      setDistricts([]);
      setSearchQuery('');
    }
  };

  const filteredProvinces = provinces.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNeighborhoods = neighborhoods.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const breadcrumb = (
    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
      <button
        onClick={resetSelectionToProvince}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 transition ${
          step === 'province'
            ? 'border-cyan-400/80 bg-cyan-400/20 text-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
            : 'border-white/10 bg-white/5 hover:border-cyan-200/40 hover:text-cyan-100'
        }`}
      >
        {selectedProvince?.name || 'İl'}
      </button>
      {(step === 'district' || step === 'neighborhood') && (
        <>
          <ChevronRight className="h-4 w-4 text-slate-500" />
          <button
            onClick={() => setStep('district')}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 transition ${
              step === 'district'
                ? 'border-cyan-400/80 bg-cyan-400/20 text-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                : 'border-white/10 bg-white/5 hover:border-cyan-200/40 hover:text-cyan-100'
            }`}
          >
            {selectedDistrict?.name || 'İlçe'}
          </button>
        </>
      )}
      {step === 'neighborhood' && (
        <>
          <ChevronRight className="h-4 w-4 text-slate-500" />
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/80 bg-cyan-400/20 px-3 py-1 text-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            {selectedNeighborhood?.name || 'Mahalle'}
          </span>
        </>
      )}
    </div>
  );

  const renderList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400/40 border-t-transparent" />
        </div>
      );
    }

    const items = step === 'province' ? filteredProvinces : step === 'district' ? filteredDistricts : filteredNeighborhoods;

    if (step === 'province') {
      return items.map((province) => (
        <button
          key={province.id}
          onClick={() => handleProvinceSelect(province as Province)}
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/60 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-indigo-500/10"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-300 group-hover:scale-110 transition">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-white">{province.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {(province as Province).population?.toLocaleString('tr-TR')}
                </span>
                {(province as Province).isMetropolitan && (
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-cyan-200">
                    Büyükşehir
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
        </button>
      ));
    }

    if (step === 'district') {
      return items.map((district) => (
        <button
          key={district.id}
          onClick={() => handleDistrictSelect(district as District)}
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/60 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-indigo-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-300 group-hover:scale-110 transition">
              <MapPin className="h-5 w-5" />
            </span>
            <p className="font-medium text-white">{district.name}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
        </button>
      ));
    }

    return items.map((neighborhood) => (
      <button
        key={neighborhood.id}
        onClick={() => handleNeighborhoodSelect(neighborhood as Neighborhood)}
        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/60 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-indigo-500/10"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-300 group-hover:scale-110 transition">
            <TrendingUp className="h-5 w-5" />
          </span>
          <p className="font-medium text-white">{neighborhood.name}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#050915] via-[#0b1528] to-[#0d1b33] text-slate-200 shadow-[0_25px_80px_rgba(15,30,60,0.55)]">
        <div className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%)]" />
          <div className="relative px-6 py-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.35)]">
                  <Compass className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Konum Seçimi</h2>
                  <p className="text-sm text-slate-400">
                    {step === 'province' && 'Önce ili seçin, ardından ilçeye ilerleyin.'}
                    {step === 'district' && 'İlçe seçerek alanı daraltın.'}
                    {step === 'neighborhood' && 'Mahalle seçimi opsiyoneldir.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:border-cyan-200/60 hover:text-cyan-200 transition"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {breadcrumb}
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${step === 'province' ? 'İl' : step === 'district' ? 'İlçe' : 'Mahalle'} ara...`}
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white placeholder-slate-400 transition focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-white"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-2">{renderList()}</div>
        </div>

        <div className="flex gap-3 border-t border-white/10 bg-white/5 p-4">
          <button
            onClick={goBack}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-cyan-200/40 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={step === 'province'}
          >
            Geri
          </button>
          <button
            onClick={handleSkipNeighborhood}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!selectedProvince || !selectedDistrict}
          >
            {step === 'neighborhood' ? 'Devam Et' : 'İlerleyin'}
          </button>
          {step === 'neighborhood' && (
            <button
              onClick={() => {
                if (selectedNeighborhood) handleNeighborhoodSelect(selectedNeighborhood);
              }}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-300/50 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!selectedNeighborhood}
            >
              Mahalle Seçimini Tamamla
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.7);
        }
      `}</style>
    </div>
  );
}

