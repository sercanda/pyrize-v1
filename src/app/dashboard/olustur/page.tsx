/* eslint-disable @next/next/no-img-element */
'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  BarChart3,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Users
} from 'lucide-react';

import LocationPickerModal from '@/components/LocationPickerModal';
import {
  DanismanBilgileri,
  DetayliDegerlemeComparable,
  DetayliDegerlemeDurum,
  DetayliDegerlemeSnapshot,
  DetayliDegerlemeVerisi,
  MulkBilgileri,
  MulkTuru,
  SunumAmaci,
  SunumStili,
  SunumUzunlugu,
  TemaTuru
} from '@/types';
import {
  formatCurrencyInput,
  formatPriceRange,
  parseCurrencyToNumber
} from '@/lib/utils/price';
import { getSupabaseClient } from '@/lib/supabaseClient';
import {
  getNadirFirsatTemplate,
  getKonumPrimiTemplate,
  getGelisimPotansiyeliTemplate,
  getHedefKitleTemplates,
  getReklamKanallariTemplate
} from '@/lib/templates/default-sections';

type FieldKey = 'konumAvantajlari' | 'kullanimPotansiyeli' | 'aciklama';

const FIELD_API_MAP: Record<FieldKey, 'konum_avantajlari' | 'kullanim_potansiyeli' | 'aciklama'> = {
  konumAvantajlari: 'konum_avantajlari',
  kullanimPotansiyeli: 'kullanim_potansiyeli',
  aciklama: 'aciklama'
};

type ConsultantProfile = DanismanBilgileri & {
  id: string;
  label: string;
};

type LocationSelection = {
  province?: string;
  district?: string;
  neighborhood?: string;
  fullAddress: string;
};

interface MulkFormState {
  tur: MulkTuru;
  konum: string;
  fiyatMin: string;
  fiyatMax: string;
  metrekare: string;
  odaSayisi: string;
  cephe: string;
  kat: string;
  yas: string;
  krediyeUygun: 'uygun' | 'uygun_degil' | 'kismen';
  konumAvantajlari: string;
  kullanimPotansiyeli: string;
  aciklama: string;
  fotograflar: string[];
  ilanNo?: string;
  siteMi?: boolean;
  asansor?: boolean;
  otopark?: boolean;
  guvenlik?: boolean;
  havuz?: boolean;
  sporSalonu?: boolean;
  bahceTeras?: boolean;
  merkeziIsitma?: boolean;
}

interface StepOption<T> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
}

const PURPOSE_OPTIONS: StepOption<SunumAmaci>[] = [
  {
    value: 'portfoy_almak',
    label: 'Portföy Almak',
    description: 'Satıcıyı ikna eden, güven odaklı sunum'
  },
  {
    value: 'portfoy_satmak',
    label: 'Portföy Satmak',
    description: 'Potansiyel alıcıya yönelik ikna sunumu'
  }
];

const STYLE_OPTIONS: StepOption<SunumStili>[] = [
  {
    value: 'detayli_analiz',
    label: 'Detaylı Analiz',
    description: 'Rakam odaklı, analitik güven inşa eden format (5 sayfa)',
    badge: 'Favori'
  },
  {
    value: 'hizli_satis',
    label: 'Hızlı Satış',
    description: 'Öne çıkan fırsatları anlatan hızlı akış (3 sayfa)'
  },
  {
    value: 'premium_sunum',
    label: 'Premium Sunum',
    description: 'Lüks portföyler için zarif, geniş tasarım (5 sayfa)'
  },
  {
    value: 'guven_odakli',
    label: 'Güven Odaklı',
    description: 'Danışman güvenini ön plana çıkaran format (4 sayfa)'
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Sade, temiz, sadece esansiyel bilgi (3 sayfa)'
  }
];

const THEME_OPTIONS: StepOption<TemaTuru>[] = [
  {
    value: 'modern',
    label: 'Modern',
    description: 'Dinamik ve enerjik görünümler'
  },
  {
    value: 'kurumsal',
    label: 'Kurumsal',
    description: 'Profesyonel ve güven veren çizgi'
  },
  {
    value: 'luks',
    label: 'Lüks',
    description: 'Prestijli ve yüksek standartlarda vitrin'
  }
];

const DEFAULT_MARKET_SNAPSHOTS: DetayliDegerlemeSnapshot[] = [
  { title: '', value: '', trend: 'stable', trendLabel: '' },
  { title: '', value: '', trend: 'stable', trendLabel: '' },
  { title: '', value: '', trend: 'stable', trendLabel: '' }
];

const DEFAULT_COMPARABLE: DetayliDegerlemeComparable = {
  address: '',
  price: '',
  status: 'Satışta',
  size: '',
  pricePerSqm: ''
};

const LOADING_MESSAGES = [
  'Piyasa verileri modelleniyor',
  'Rakip portföyler taranıyor',
  'Konum analizleri optimize ediliyor',
  'Prestij hikayesi yazılıyor',
  'Yatırımcı dili cilalanıyor'
];

const PROFILES_STORAGE_KEY = 'pyrize.consultantProfiles.v1';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function PremiumLoadingOverlay({
  progress,
  message
}: {
  progress: number;
  message: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040813]/90 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#050915] via-[#07162a] to-[#0a203c] p-10 shadow-[0_45px_100px_rgba(8,25,48,0.75)]">
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative space-y-8">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-slate-900 shadow-[0_0_35px_rgba(56,189,248,0.35)]">
              <Sparkles className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-200/80">
                Premium Hazırlık
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Sunumunuz premium deneyim için hazırlanıyor
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner">
            <div className="flex justify-between text-xs uppercase tracking-[0.45em] text-slate-400">
              <span>Hazırlık</span>
              <span>%{progress}</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-700/50">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 shadow-[0_0_18px_rgba(56,189,248,0.5)] transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-slate-300">{message}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <Users className="h-3.5 w-3.5" />
              Hedef Kitle Analitiği
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Piyasa Denklemi
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              10 Sn&apos;de Hazır
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOlusturPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSelection | null>(null);
  const [locationAnalysis, setLocationAnalysis] = useState('');
  const [locationAnalysisLoading, setLocationAnalysisLoading] = useState(false);

  // AI ile üretilen Konum Analizi & Değerleme kartları ve Hedef Kitle Profili
  const [aiMarketAnalysisCards, setAiMarketAnalysisCards] = useState<Array<{ title: string; content: string }>>([]);
  const [aiTargetAudienceCards, setAiTargetAudienceCards] = useState<Array<{ baslik: string; aciklama: string }>>([]);
  const [aiAdChannels, setAiAdChannels] = useState<string[]>([]);

  const [secenekler, setSecenekler] = useState<{
    amac: SunumAmaci | null;
    tema: TemaTuru | null;
    sunumStili: SunumStili | null;
    uzunluk: SunumUzunlugu;
  }>({
    amac: null,
    tema: null,
    sunumStili: null,
    uzunluk: 'uzun'
  });

  const [mulk, setMulk] = useState<MulkFormState>({
    tur: 'daire',
    konum: '',
    fiyatMin: '',
    fiyatMax: '',
    metrekare: '',
    odaSayisi: '',
    cephe: '',
    kat: '',
    yas: '',
    krediyeUygun: 'uygun',
    konumAvantajlari: '',
    kullanimPotansiyeli: '',
    aciklama: '',
    fotograflar: [],
    ilanNo: ''
  });

  const [danisman, setDanisman] = useState<DanismanBilgileri>({
    adSoyad: '',
    telefon: '',
    email: '',
    deneyim: '',
    oduller: '',
    referans: '',
    ofisAdi: '',
    profilFotografi: '',
    ofisLogosu: ''
  });

  const [detayliDegerlemeAktif, setDetayliDegerlemeAktif] = useState(false);
  const [marketSnapshots, setMarketSnapshots] = useState<DetayliDegerlemeSnapshot[]>(DEFAULT_MARKET_SNAPSHOTS);
  const [comparables, setComparables] = useState<DetayliDegerlemeComparable[]>([DEFAULT_COMPARABLE]);
  const [estimatedValueRange, setEstimatedValueRange] = useState('');
  const [ilanNo, setIlanNo] = useState('');
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
  const [priceHistoryData, setPriceHistoryData] = useState<{
    price_history: Array<{ date: string; price: number; formatted: string }>;
    min_price: number | null;
    max_price: number | null;
    current_price: number | null;
    market_position: string | null;
  } | null>(null);

  const [fieldLoading, setFieldLoading] = useState<Record<FieldKey, boolean>>({
    konumAvantajlari: false,
    kullanimPotansiyeli: false,
    aciklama: false
  });

  // Animasyon state'leri - her alanın durumunu tutar
  const [fieldStatus, setFieldStatus] = useState<Record<FieldKey, 'idle' | 'filling' | 'success'>>({
    konumAvantajlari: 'idle',
    kullanimPotansiyeli: 'idle',
    aciklama: 'idle'
  });

  // Konum Analizi için animasyon state'i
  const [locationAnalysisStatus, setLocationAnalysisStatus] = useState<'idle' | 'filling' | 'success'>('idle');

  const [savedProfiles, setSavedProfiles] = useState<ConsultantProfile[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const numericMetrekare = useMemo(() => {
    if (!mulk.metrekare) return undefined;
    const digits = mulk.metrekare.replace(/[^\d]/g, '');
    if (!digits) return undefined;
    const value = parseInt(digits, 10);
    return Number.isNaN(value) ? undefined : value;
  }, [mulk.metrekare]);

  const maxPriceNumber = useMemo(() => {
    if (!mulk.fiyatMax) return undefined;
    return parseCurrencyToNumber(mulk.fiyatMax);
  }, [mulk.fiyatMax]);

  const locationName = useMemo(() => {
    if (!mulk.konum) return '';
    const firstPart = mulk.konum.split(',')[0]?.trim();
    return firstPart || mulk.konum;
  }, [mulk.konum]);

  const isLargePrestigeDaire = mulk.tur === 'daire' && (numericMetrekare ?? 0) >= 180;

  const marketAnalysisCards = useMemo(() => {
    // AI'dan gelen veriler varsa onları kullan
    if (aiMarketAnalysisCards.length > 0) {
      return aiMarketAnalysisCards.map(card => ({
        baslik: card.title,
        icerik: card.content
      }));
    }

    // AI verisi yoksa fallback template'leri kullan
    if (isLargePrestigeDaire) {
      const metrekareText = numericMetrekare ? `${numericMetrekare}m²` : '195m²';
      return [
        {
          baslik: 'Nadir Fırsat',
          icerik: `Bu m²'deki (${metrekareText} net) daireler doğru pazarlanmazsa, standart 3+1'ler ile kıyaslanıp 'pahalı' algısı oluşabilir. 'Net Kullanım Alanı' ve 'İnşaat Kalitesi' vurgulanmalıdır.`
        },
        {
          baslik: 'Konum Primi',
          icerik: `Proje, şehir gürültüsünden uzak ancak ana arterlere yakın konumuyla 'Huzurlu Lüks' arayanların ilk tercihidir.`
        },
        {
          baslik: 'Gelişim Potansiyeli',
          icerik: `Bölgedeki yeni yapılaşmalar site konseptine dönmekte, geniş m²'li ve sosyal donatılı projelere olan talep, standart apartman dairelerine göre %40 daha hızlı artmaktadır.`
        }
      ];
    }

    return [
      {
        baslik: 'Nadir Fırsat',
        icerik: getNadirFirsatTemplate({
          mulkTur: mulk.tur,
          metrekare: numericMetrekare,
          odaSayisi: mulk.odaSayisi || undefined,
          konum: mulk.konum || 'Bölge',
          fiyat: maxPriceNumber
        })
      },
      {
        baslik: 'Konum Primi',
        icerik: getKonumPrimiTemplate({
          mulkTur: mulk.tur,
          konum: mulk.konum || 'Bölge',
          locationAnalysis
        })
      },
      {
        baslik: 'Gelişim Potansiyeli',
        icerik: getGelisimPotansiyeliTemplate({
          mulkTur: mulk.tur,
          konum: mulk.konum || 'Bölge',
          locationAnalysis
        })
      }
    ];
  }, [aiMarketAnalysisCards, isLargePrestigeDaire, numericMetrekare, mulk.tur, mulk.odaSayisi, mulk.konum, maxPriceNumber, locationAnalysis]);

  const targetAudienceCards = useMemo(() => {
    // AI'dan gelen veriler varsa onları kullan
    if (aiTargetAudienceCards.length > 0) {
      return aiTargetAudienceCards;
    }

    // AI verisi yoksa fallback template'leri kullan
    if (isLargePrestigeDaire) {
      return [
        {
          baslik: 'Geniş Aileler',
          aciklama: 'Çocukları için güvenli oyun alanı, havuz ve ferah ev arayan, 3+1\'e sığmayan aileler.'
        },
        {
          baslik: 'Konfor Arayanlar',
          aciklama: 'Giyinme odası, ebeveyn banyosu, geniş balkon gibi lüks detaylara önem veren profesyoneller.'
        },
        {
          baslik: 'Yatırımcılar',
          aciklama: `${locationName || 'Bölgenin'} değer artış potansiyelini bilen ve nitelikli mülk yatırımı yapmak isteyenler.`
        }
      ];
    }

    // Standart fallback - HER ZAMAN en azından bunlar gösterilsin
    const templateCards = getHedefKitleTemplates({
      mulkTur: mulk.tur,
      konum: mulk.konum || 'Bölge',
      metrekare: numericMetrekare,
      odaSayisi: mulk.odaSayisi || undefined,
      fiyat: maxPriceNumber
    });

    // Eğer template boş dönerse, standart fallback göster
    if (templateCards.length === 0) {
      return [
        {
          baslik: 'Yatırımcılar',
          aciklama: `${mulk.konum || 'Bölge'} bölgesindeki değer artış potansiyelini değerlendirmek isteyen yatırımcılar. Bölgenin gelişim trendi ve kiralama potansiyeli, orta-uzun vadeli getiri arayanlar için cazip fırsatlar sunuyor.`
        },
        {
          baslik: 'Aileler',
          aciklama: `${mulk.konum || 'Bölge'} çevresinde güvenli, konforlu ve sosyal olanaklara yakın yaşam arayan aileler. Okullara, parklara ve alışveriş merkezlerine erişim kolaylığı, aile yaşamı için ideal koşullar sağlıyor.`
        },
        {
          baslik: 'Profesyoneller',
          aciklama: `İş merkezlerine kolay ulaşım ve kaliteli yaşam alanı arayan genç profesyoneller. Modern yaşam tarzına uygun sosyal donatılar ve ulaşım avantajları, aktif çalışanlar için büyük kolaylık.`
        }
      ];
    }

    return templateCards;
  }, [aiTargetAudienceCards, isLargePrestigeDaire, locationName, mulk.tur, mulk.konum, numericMetrekare, mulk.odaSayisi, maxPriceNumber]);

  const adChannelsList = useMemo(() => {
    // AI'dan gelen veriler varsa onları kullan
    if (aiAdChannels.length > 0) {
      return aiAdChannels;
    }

    // AI verisi yoksa fallback template'leri kullan
    if (isLargePrestigeDaire) {
      const baseChannels = [
        'Sahibinden Vitrin',
        'Emlakjet Premium',
        'Facebook/Instagram (Aile Hedefli)',
        'Google Ads'
      ];
      if (maxPriceNumber && maxPriceNumber > 0) {
        baseChannels.push('LinkedIn (Yüksek Gelir Grubu)');
      }
      if (danisman.ofisAdi) {
        if (danisman.ofisAdi.toUpperCase().includes('RE/MAX')) {
          baseChannels.push('RE/MAX Ağı');
        } else {
          baseChannels.push(`${danisman.ofisAdi} Ağı`);
        }
      }
      return baseChannels;
    }

    // Standart fallback - HER ZAMAN en azından bunlar gösterilsin
    const standardChannels = getReklamKanallariTemplate(danisman.ofisAdi, mulk.tur, maxPriceNumber);
    return standardChannels.length > 0 ? standardChannels : [
      'Sahibinden Vitrin İlan',
      'Emlakjet Premium Paket',
      'Facebook & Instagram Reklamları',
      'Google Ads (Arama + Display)',
      'YouTube Video Reklamları'
    ];
  }, [aiAdChannels, isLargePrestigeDaire, maxPriceNumber, danisman.ofisAdi, mulk.tur]);

  const premiumAnimationRef = useRef<number | null>(null);
  const premiumMessageInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: ConsultantProfile[] = JSON.parse(stored);
        setSavedProfiles(parsed);
      } catch (error) {
        console.warn('Danışman profilleri okunamadı:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('consultant_profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .order('created_at', { ascending: false });
        if (!active) return;
        if (error) {
          console.warn('Supabase danışman profilleri alınamadı:', error.message);
          return;
        }
        if (data && data.length) {
          const mapped = data
            .map((row: any) => {
              const payload = (row.payload ?? {}) as ConsultantProfile;
              const id =
                payload.id ||
                row.id ||
                (typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : Math.random().toString(36).slice(2));
              const label = row.label || payload.label || payload.adSoyad || 'Danışman Profili';
              return {
                ...payload,
                id,
                label,
              } as ConsultantProfile;
            })
            .filter((item) => Boolean(item?.id));

          if (mapped.length) {
            setSavedProfiles(mapped);
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(mapped));
            }
          }
        }
      } catch (error) {
        console.warn('Supabase danışman profilleri alınırken hata:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    if (isGenerating) {
      const start = performance.now();
      const animate = () => {
        const elapsed = performance.now() - start;
        const ratio = Math.min(elapsed / 10000, 1);
        setLoadingProgress(Math.round(ratio * 100));
        if (ratio < 1) {
          premiumAnimationRef.current = requestAnimationFrame(animate);
        }
      };
      premiumAnimationRef.current = requestAnimationFrame(animate);
      premiumMessageInterval.current = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2400);
    } else {
      if (premiumAnimationRef.current) cancelAnimationFrame(premiumAnimationRef.current);
      if (premiumMessageInterval.current) clearInterval(premiumMessageInterval.current);
      setLoadingProgress(0);
      setLoadingMessageIndex(0);
    }

    return () => {
      if (premiumAnimationRef.current) cancelAnimationFrame(premiumAnimationRef.current);
      if (premiumMessageInterval.current) clearInterval(premiumMessageInterval.current);
    };
  }, [isGenerating]);

  const onDropProfile = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const dataUrl = await readFileAsDataUrl(acceptedFiles[0]);
    setDanisman((prev) => ({ ...prev, profilFotografi: dataUrl }));
  }, []);

  const onDropOffice = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const dataUrl = await readFileAsDataUrl(acceptedFiles[0]);
    setDanisman((prev) => ({ ...prev, ofisLogosu: dataUrl }));
  }, []);

  const onDropPropertyPhotos = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const dataUrls = await Promise.all(acceptedFiles.map(readFileAsDataUrl));
    setMulk((prev) => ({ ...prev, fotograflar: [...prev.fotograflar, ...dataUrls] }));
  }, []);

  const profileDropzone = useDropzone({
    onDrop: onDropProfile,
    accept: { 'image/*': [] },
    multiple: false
  });

  const officeDropzone = useDropzone({
    onDrop: onDropOffice,
    accept: { 'image/*': [] },
    multiple: false
  });

  const propertyPhotosDropzone = useDropzone({
    onDrop: onDropPropertyPhotos,
    accept: { 'image/*': [] },
    multiple: true
  });

  const handleOptionSelect = <T,>(field: 'amac' | 'tema' | 'sunumStili', value: T) => {
    setSecenekler((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationSelection) => {
    setSelectedLocation(location);
    setMulk((prev) => ({ ...prev, konum: location.fullAddress }));
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setMulk((prev) => ({ ...prev, konum: '' }));
    setLocationAnalysis('');
  };

  const handleGenerateLocationAnalysis = async () => {
    if (!selectedLocation?.province || !mulk.tur) {
      console.warn('Konum analizi için il ve mülk türü seçilmelidir.');
      return;
    }
    setLocationAnalysisLoading(true);
    setLocationAnalysisStatus('filling'); // Animasyon başlat

    try {
      const response = await fetch('/api/lokasyon/analiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: selectedLocation.province,
          district: selectedLocation.district,
          neighborhood: selectedLocation.neighborhood,
          mulkTuru: mulk.tur
        })
      });
      const data = await response.json();
      if (response.ok && data?.analysis) {
        setLocationAnalysis(data.analysis);

        // Başarı animasyonu
        setLocationAnalysisStatus('success');
        setTimeout(() => {
          setLocationAnalysisStatus('idle');
        }, 2000); // 2 saniye sonra normale dön
      } else {
        throw new Error(data?.error || 'Konum analizi oluşturulamadı');
      }
    } catch (error) {
      console.error(error);
      // Hata durumunda da idle'a dön
      setLocationAnalysisStatus('idle');
    } finally {
      setLocationAnalysisLoading(false);
    }
  };

  const handleScrapePriceHistory = async (ilanNoValue: string) => {
    if (!ilanNoValue || ilanNoValue.trim().length < 5) {
      return; // Çok kısa ilan numaraları için çalışma
    }

    if (!detayliDegerlemeAktif) {
      return; // Detaylı değerleme aktif değilse çalışma
    }

    setPriceHistoryLoading(true);
    try {
      // Fiyat geçmişini çek
      const scrapeResponse = await fetch('/api/scrape-price-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ilanNo: ilanNoValue.trim() })
      });

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        console.warn('⚠️ Fiyat geçmişi çekilemedi:', errorData.error);
        return;
      }

      const scrapeData = await scrapeResponse.json();
      const priceData = scrapeData.data;

      if (!priceData || !priceData.price_history || priceData.price_history.length === 0) {
        console.warn('⚠️ Fiyat geçmişi bulunamadı');
        return;
      }

      // Groq API ile analiz oluştur
      const reportResponse = await fetch('/api/generate-value-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceData,
          mulkInfo: buildMulkPayload(false)
        })
      });

      if (!reportResponse.ok) {
        console.warn('⚠️ Analiz oluşturulamadı');
        return;
      }

      const reportData = await reportResponse.json();
      const analysis = reportData.analysis || '';

      // Fiyat geçmişi verilerini state'e kaydet
      setPriceHistoryData({
        price_history: priceData.price_history || [],
        min_price: priceData.min_price || null,
        max_price: priceData.max_price || null,
        current_price: priceData.current_price || null,
        market_position: priceData.market_position || null
      });

      // Form alanlarını doldur
      if (priceData.min_price && priceData.max_price) {
        // Estimated value range'i güncelle
        const minFormatted = `₺${Math.round(priceData.min_price).toLocaleString('tr-TR')}`;
        const maxFormatted = `₺${Math.round(priceData.max_price).toLocaleString('tr-TR')}`;
        setEstimatedValueRange(`${minFormatted} - ${maxFormatted}`);
      }

      // Market snapshots'ı güncelle
      const newSnapshots: DetayliDegerlemeSnapshot[] = [];

      if (priceData.current_price) {
        newSnapshots.push({
          title: 'Mevcut Fiyat',
          value: `₺${Math.round(priceData.current_price).toLocaleString('tr-TR')}`,
          trend: 'stable',
          trendLabel: 'Güncel'
        });
      }

      if (priceData.min_price) {
        newSnapshots.push({
          title: 'Minimum Fiyat',
          value: `₺${Math.round(priceData.min_price).toLocaleString('tr-TR')}`,
          trend: 'down',
          trendLabel: 'Tarihsel minimum'
        });
      }

      if (priceData.max_price) {
        newSnapshots.push({
          title: 'Maksimum Fiyat',
          value: `₺${Math.round(priceData.max_price).toLocaleString('tr-TR')}`,
          trend: 'up',
          trendLabel: 'Tarihsel maksimum'
        });
      }

      if (priceData.market_position) {
        const positionText = priceData.market_position === 'above'
          ? 'Piyasanın Üstünde'
          : priceData.market_position === 'below'
            ? 'Piyasanın Altında'
            : 'Piyasa Ortalaması';

        newSnapshots.push({
          title: 'Piyasa Pozisyonu',
          value: positionText,
          trend: priceData.market_position === 'above' ? 'up' : priceData.market_position === 'below' ? 'down' : 'stable',
          trendLabel: `${priceData.price_history.length} fiyat değişimi`
        });
      }

      if (newSnapshots.length > 0) {
        setMarketSnapshots(newSnapshots);
      }

      // Analizi bir snapshot'a ekle (veya ayrı bir alana)
      if (analysis) {
        // Analizi ilk snapshot'ın trendLabel'ına ekle veya yeni bir snapshot oluştur
        const analysisSnapshot: DetayliDegerlemeSnapshot = {
          title: 'AI Analizi',
          value: analysis.substring(0, 100) + '...', // İlk 100 karakter
          trend: 'stable',
          trendLabel: analysis // Tam analiz trendLabel'da
        };
        setMarketSnapshots(prev => [...prev, analysisSnapshot]);
      }

      console.log('✅ Fiyat geçmişi ve analiz eklendi');

    } catch (error) {
      console.error('❌ Fiyat geçmişi çekme hatası:', error);
    } finally {
      setPriceHistoryLoading(false);
    }
  };

  const fetchAdChannels = async () => {
    try {
      console.log('📢 Reklam kanalları API çağrısı yapılıyor...');
      const adChannelsResponse = await fetch('/api/ai/generate-ad-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mulk: {
            tur: mulk.tur,
            konum: mulk.konum,
            fiyatMax: mulk.fiyatMax
          },
          danismanOfisAdi: danisman.ofisAdi
        })
      });

      const adChannelsData = await adChannelsResponse.json();
      if (adChannelsResponse.ok && adChannelsData.success && adChannelsData.data && adChannelsData.data.length > 0) {
        setAiAdChannels(adChannelsData.data);
        console.log('✅ Reklam kanalları güncellendi:', adChannelsData.data.length, 'kanal');
        return true;
      } else {
        console.warn('⚠️ Reklam kanalları boş, fallback kullanılacak');
        return false;
      }
    } catch (adError: any) {
      console.error('❌ Reklam kanalları API hatası:', adError);
      return false;
    }
  };

  const handleGenerateComprehensiveAnalysis = async () => {
    if (!mulk.konum || !mulk.tur || !selectedLocation) {
      console.warn('Kapsamlı analiz için konum ve mülk türü seçilmelidir.');
      // Yine de reklam kanallarını çağırmayı dene
      await fetchAdChannels();
      return;
    }

    console.log('🧠 Kapsamlı analiz başlatılıyor...');

    try {
      const response = await fetch('/api/ai/generate-comprehensive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: selectedLocation.province,
          district: selectedLocation.district,
          neighborhood: selectedLocation.neighborhood,
          fullAddress: mulk.konum,
          propertyType: mulk.tur,
          konumAvantajlari: mulk.konumAvantajlari,
          kullanimPotansiyeli: mulk.kullanimPotansiyeli,
          aciklama: mulk.aciklama
        })
      });

      const data = await response.json();
      console.log('📦 API Response:', {
        ok: response.ok,
        status: response.status,
        success: data.success,
        hasData: !!data.data,
        hedefKitleCount: data.data?.hedefKitleProfili?.length || 0,
        marketCardsCount: data.data?.marketAnalysisCards ? Object.keys(data.data.marketAnalysisCards).length : 0
      });

      if (response.ok && data.success && data.data) {
        console.log('✅ Kapsamlı analiz tamamlandı');

        // Hedef Kitle Profili
        if (data.data.hedefKitleProfili && data.data.hedefKitleProfili.length > 0) {
          setAiTargetAudienceCards(data.data.hedefKitleProfili);
          console.log('✅ Hedef Kitle Profili güncellendi:', data.data.hedefKitleProfili.length, 'segment');
        } else {
          console.warn('⚠️ Hedef Kitle Profili boş, fallback kullanılacak');
        }

        // Konum Analizi & Değerleme Kartları
        if (data.data.marketAnalysisCards) {
          const cards = [];

          if (data.data.marketAnalysisCards.nadirFirsat) {
            cards.push({
              title: 'Nadir Fırsat',
              content: data.data.marketAnalysisCards.nadirFirsat
            });
          }

          if (data.data.marketAnalysisCards.konumPrimi) {
            cards.push({
              title: 'Konum Primi',
              content: data.data.marketAnalysisCards.konumPrimi
            });
          }

          if (data.data.marketAnalysisCards.gelisimPotansiyeli) {
            cards.push({
              title: 'Gelişim Potansiyeli',
              content: data.data.marketAnalysisCards.gelisimPotansiyeli
            });
          }

          if (cards.length > 0) {
            setAiMarketAnalysisCards(cards);
            console.log('✅ Konum Analizi kartları güncellendi:', cards.length, 'kart');
          } else {
            console.warn('⚠️ Konum Analizi kartları boş, fallback kullanılacak');
          }
        }

        // Reklam Kanalları - Her durumda çağır
        await fetchAdChannels();
      } else {
        console.warn('⚠️ Kapsamlı analiz başarısız');
        console.log('   Response:', data);
        if (data.error) {
          console.log('   Hata mesajı:', data.error);
        }
        // Başarısız olsa bile reklam kanallarını çağır
        await fetchAdChannels();
      }
    } catch (error: any) {
      console.error('❌ Kapsamlı analiz network hatası:', error);
      console.log('   Error details:', error.message);
      // Network hatası durumunda bile reklam kanallarını çağırmayı dene
      await fetchAdChannels();
    }
  };

  const handleGenerateField = async (field: FieldKey) => {
    if (!mulk.konum || !mulk.tur) {
      alert('AI içeriği oluşturmak için lütfen önce konum ve mülk türü seçiniz.');
      return;
    }

    if (!selectedLocation) {
      alert('Lütfen önce "Konum Seç" butonundan konum seçimi yapınız.');
      return;
    }

    setFieldLoading((prev) => ({ ...prev, [field]: true }));
    setFieldStatus((prev) => ({ ...prev, [field]: 'filling' })); // Animasyon başlat

    try {
      // Yeni endpoint'i çağırıyoruz
      const response = await fetch('/api/ai/location-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: field, // konumAvantajlari, kullanimPotansiyeli veya aciklama
          fullAddress: mulk.konum,
          propertyType: mulk.tur,
          city: selectedLocation?.province,
          district: selectedLocation?.district,
          neighborhood: selectedLocation?.neighborhood
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // API hatası - fallback data kullan
        console.warn('⚠️ API hatası, fallback data kullanılıyor:', data?.error);
        const locationName = selectedLocation.district || selectedLocation.province || 'Bölge';

        let fallbackText = '';
        if (field === 'konumAvantajlari') {
          fallbackText = `• ${locationName} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
        } else if (field === 'kullanimPotansiyeli') {
          fallbackText = `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
        } else {
          fallbackText = `${mulk.konum} konumunda bulunan bu ${mulk.tur}, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
        }

        setMulk((prev) => ({ ...prev, [field]: fallbackText }));

        // Fallback için de başarı animasyonu
        setFieldStatus((prev) => ({ ...prev, [field]: 'success' }));
        setTimeout(() => {
          setFieldStatus((prev) => ({ ...prev, [field]: 'idle' }));
        }, 2000);
        return;
      }

      if (data.success && data.data) {
        console.log('✅ AI içerik oluşturuldu:', field);
        setMulk((prev) => ({ ...prev, [field]: data.data }));

        // Başarı animasyonu
        setFieldStatus((prev) => ({ ...prev, [field]: 'success' }));
        setTimeout(() => {
          setFieldStatus((prev) => ({ ...prev, [field]: 'idle' }));
        }, 2000); // 2 saniye sonra normale dön
      } else {
        // Data yoksa fallback kullan
        console.warn('⚠️ AI yanıtı boş, fallback data kullanılıyor');
        const locationName = selectedLocation.district || selectedLocation.province || 'Bölge';

        let fallbackText = '';
        if (field === 'konumAvantajlari') {
          fallbackText = `• ${locationName} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
        } else if (field === 'kullanimPotansiyeli') {
          fallbackText = `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
        } else {
          fallbackText = `${mulk.konum} konumunda bulunan bu ${mulk.tur}, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
        }

        setMulk((prev) => ({ ...prev, [field]: fallbackText }));

        // Fallback için de başarı animasyonu
        setFieldStatus((prev) => ({ ...prev, [field]: 'success' }));
        setTimeout(() => {
          setFieldStatus((prev) => ({ ...prev, [field]: 'idle' }));
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ API çağrısı başarısız:', error);
      // Network hatası - fallback data kullan
      const locationName = selectedLocation?.district || selectedLocation?.province || 'Bölge';

      let fallbackText = '';
      if (field === 'konumAvantajlari') {
        fallbackText = `• ${locationName} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
      } else if (field === 'kullanimPotansiyeli') {
        fallbackText = `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
      } else {
        fallbackText = `${mulk.konum} konumunda bulunan bu ${mulk.tur}, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
      }

      setMulk((prev) => ({ ...prev, [field]: fallbackText }));

      // Fallback için de başarı animasyonu
      setFieldStatus((prev) => ({ ...prev, [field]: 'success' }));
      setTimeout(() => {
        setFieldStatus((prev) => ({ ...prev, [field]: 'idle' }));
      }, 2000);
    } finally {
      setFieldLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSaveProfile = async () => {
    if (!danisman.adSoyad || !danisman.telefon) {
      alert('Profil kaydetmek için en az Ad Soyad ve Telefon gereklidir.');
      return;
    }
    const label =
      typeof window !== 'undefined'
        ? window.prompt('Profil adı belirleyin', danisman.adSoyad || 'Yeni Profil')
        : danisman.adSoyad || 'Yeni Profil';
    if (!label) return;

    const profile: ConsultantProfile = {
      ...danisman,
      id: createId(),
      label
    };
    const updatedProfiles = [...savedProfiles, profile];
    setSavedProfiles(updatedProfiles);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    }

    if (supabase) {
      try {
        await supabase.from('consultant_profiles').upsert({
          id: profile.id,
          label: profile.label,
          payload: profile
        });
      } catch (error) {
        console.warn('Profil Supabase üzerine kaydedilemedi:', error);
      }
    }
  };

  const handleProfileSelect = (profileId: string) => {
    const profile = savedProfiles.find((item) => item.id === profileId);
    if (!profile) return;
    const { id, label, ...rest } = profile;
    setDanisman(rest);
  };

  const handleProfileDelete = async (profileId: string) => {
    const updated = savedProfiles.filter((item) => item.id !== profileId);
    setSavedProfiles(updated);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updated));
    }

    if (supabase) {
      try {
        await supabase.from('consultant_profiles').delete().eq('id', profileId);
      } catch (error) {
        console.warn('Profil Supabase üzerinden silinemedi:', error);
      }
    }
  };

  const handleAddSnapshot = () => {
    setMarketSnapshots((prev) => [...prev, { title: '', value: '', trend: 'stable', trendLabel: '' }]);
  };

  const handleRemoveSnapshot = (index: number) => {
    setMarketSnapshots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSnapshotChange = (
    index: number,
    field: keyof DetayliDegerlemeSnapshot,
    value: string
  ) => {
    setMarketSnapshots((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
            ...item,
            [field]: field === 'trend' ? (value as DetayliDegerlemeSnapshot['trend']) : value
          }
          : item
      )
    );
  };

  const handleAddComparable = () => {
    setComparables((prev) => [...prev, { ...DEFAULT_COMPARABLE }]);
  };

  const handleRemoveComparable = (index: number) => {
    setComparables((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleComparableChange = (
    index: number,
    field: keyof DetayliDegerlemeComparable,
    value: string
  ) => {
    setComparables((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
            ...item,
            [field]:
              field === 'status'
                ? (value as DetayliDegerlemeDurum)
                : value
          }
          : item
      )
    );
  };

  const canProceedToStep2 = useMemo(
    () => Boolean(secenekler.amac && secenekler.sunumStili && secenekler.tema),
    [secenekler]
  );

  const canSubmit = useMemo(() => {
    return (
      !!secenekler.amac &&
      !!secenekler.tema &&
      !!secenekler.sunumStili &&
      !!mulk.konum &&
      !!danisman.adSoyad &&
      !!danisman.telefon
    );
  }, [secenekler, mulk.konum, danisman]);

  const buildMulkPayload = (includePhotos = false): MulkBilgileri & { fotograflar?: string[]; ilanNo?: string } => ({
    tur: mulk.tur,
    konum: mulk.konum,
    fiyat: parseCurrencyToNumber(mulk.fiyatMax) ?? parseCurrencyToNumber(mulk.fiyatMin),
    fiyatMin: parseCurrencyToNumber(mulk.fiyatMin),
    fiyatMax: parseCurrencyToNumber(mulk.fiyatMax),
    metrekare: parseCurrencyToNumber(mulk.metrekare),
    odaSayisi: mulk.odaSayisi || undefined,
    cephe: mulk.cephe || undefined,
    kat: mulk.kat || undefined,
    yas: mulk.yas || undefined,
    krediyeUygun: mulk.krediyeUygun,
    siteMi: mulk.siteMi || undefined,
    asansor: mulk.asansor || undefined,
    otopark: mulk.otopark || undefined,
    guvenlik: mulk.guvenlik || undefined,
    havuz: mulk.havuz || undefined,
    sporSalonu: mulk.sporSalonu || undefined,
    bahceTeras: mulk.bahceTeras || undefined,
    merkeziIsitma: mulk.merkeziIsitma || undefined,
    // Çok uzun metinler OpenRouter tarafında PAYLOAD_TOO_LARGE hatasına neden olabiliyor.
    // Bu yüzden açıklama ve AI alanlarını makul bir uzunlukta kesiyoruz.
    aciklama: mulk.aciklama ? mulk.aciklama.slice(0, 2000) : undefined,
    konumAvantajlari: mulk.konumAvantajlari ? mulk.konumAvantajlari.slice(0, 2000) : undefined,
    kullanimPotansiyeli: mulk.kullanimPotansiyeli ? mulk.kullanimPotansiyeli.slice(0, 2000) : undefined,
    // Fotoğraflar base64 string olarak çok büyük payload oluşturuyor (PAYLOAD_TOO_LARGE hatası).
    // Bu yüzden fotoğrafları payload'dan çıkarıyoruz ve sunum oluşturulduktan sonra ayrı bir API çağrısıyla ekliyoruz.
    fotograflar: includePhotos && mulk.fotograflar.length > 0 ? mulk.fotograflar : undefined,
    ilanNo: mulk.ilanNo || ilanNo || undefined
  });

  const buildDetayliDegerleme = (): DetayliDegerlemeVerisi | undefined => {
    if (!detayliDegerlemeAktif) return undefined;

    const formattedSnapshots = marketSnapshots
      .filter((item) => item.title && item.value)
      .map((item) => ({
        ...item,
        trend: item.trend ?? 'stable'
      }));

    const formattedComparables = comparables.filter((item) => item.address && item.price);

    if (!formattedSnapshots.length && !formattedComparables.length && !estimatedValueRange) {
      return undefined;
    }

    return {
      marketSnapshots: formattedSnapshots.length ? formattedSnapshots : undefined,
      comparables: formattedComparables.length ? formattedComparables : undefined,
      estimatedValueRange: estimatedValueRange || undefined
    };
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Fotoğrafları payload'dan çıkarıyoruz (base64 string'ler çok büyük payload oluşturuyor)
    const photosToAdd = mulk.fotograflar.length > 0 ? mulk.fotograflar : [];

    const requestBody = {
      danisman,
      mulk: buildMulkPayload(false), // Fotoğrafları dahil etme
      amac: secenekler.amac!,
      uzunluk: secenekler.uzunluk,
      tema: secenekler.tema!,
      sunumStili: secenekler.sunumStili!,
      // locationAnalysis metni AI tarafından üretildiğinde oldukça uzun olabiliyor.
      // OpenRouter'ın payload limitine takılmamak için burada da kırpıyoruz.
      locationAnalysis: locationAnalysis ? locationAnalysis.slice(0, 4000) : undefined,
      detayliDegerleme: buildDetayliDegerleme(),
      detayliDegerlemeAktif,
      // Konum Analizi & Değerleme kartları (Nadir Fırsat, Konum Primi, Gelişim Potansiyeli)
      marketAnalysisCards,
      // Hedef Kitle Profili
      targetAudience: targetAudienceCards,
      // Reklam Kanalları
      adChannels: adChannelsList,
      template: secenekler.sunumStili || 'detayli_analiz'
    };

    setIsGenerating(true);
    const minimum = 10000;
    const started = Date.now();

    try {
      const response = await fetch('/api/sunum/olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Sunum oluşturulamadı');
      }

      const elapsed = Date.now() - started;
      if (elapsed < minimum) {
        await new Promise((resolve) => setTimeout(resolve, minimum - elapsed));
      }

      const created = data?.data;

      // Fotoğrafları sunum oluşturulduktan sonra Supabase'e ekle
      if (created?.slug && photosToAdd.length > 0) {
        try {
          // Fotoğrafları içerik'e ekle
          const updatedIcerik = {
            ...created.icerik,
            fotograflar: photosToAdd
          };

          // Supabase'e güncelleme yap
          const updateResponse = await fetch('/api/sunum/fotograflar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slug: created.slug,
              fotograflar: photosToAdd
            })
          });

          if (updateResponse.ok) {
            console.log('✅ Fotoğraflar eklendi:', photosToAdd.length, 'adet');
            // Güncellenmiş içeriği created'e ekle
            created.icerik = updatedIcerik;
          } else {
            console.warn('⚠️ Fotoğraflar eklenirken hata oluştu, sunum devam ediyor');
          }
        } catch (error) {
          console.warn('⚠️ Fotoğraflar eklenirken hata:', error);
        }
      }

      if (created?.slug && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`sunum_${created.slug}`, JSON.stringify(created));
        } catch (error) {
          console.warn('Sunum verisi kaydedilirken hata:', error);
        }
      }

      // TASK 2: Use UUID (id) for routing to ensure consistency with DB lookups and PDF export
      // The 'id' is the canonical identifier; PDF export prioritizes UUID over slug
      router.push(`/sunum/${created?.id}/duzenle` || '/dashboard');
    } catch (error: any) {
      console.error('❌ Sunum oluşturma hatası:', error);

      // Kullanıcıya açık hata mesajı göster
      const errorMessage = error?.message ||
        'Sunum oluşturulurken bir hata oluştu. ' +
        'API ayarlarınızı ve .env.local dosyasını kontrol edin.';

      alert(`HATA: ${errorMessage}\n\nÇözüm önerileri:\n` +
        `1. .env.local dosyasını kontrol edin\n` +
        `2. FAL_KEY değerini doğru ayarlayın\n` +
        `3. Dev server'ı yeniden başlatın (Ctrl+C sonra npm run dev)`);
    } finally {
      // CRITICAL: Loading state'i her durumda temizle
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040813] pb-24 text-slate-100">
      {isGenerating && (
        <PremiumLoadingOverlay
          progress={loadingProgress}
          message={LOADING_MESSAGES[loadingMessageIndex]}
        />
      )}
      <div className="relative mx-auto max-w-5xl space-y-10 px-6 pt-16 md:pt-20">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">
                AI Destekli Sunum Motoru
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                3 Adımda Premium Gayrimenkul Sunumu
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Clock className="h-4 w-4" />
              Ortalama 2 dk&apos;da hazır
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`rounded-2xl border px-5 py-4 transition ${step === item
                  ? 'border-cyan-400/60 bg-cyan-500/10 text-white shadow-[0_15px_45px_rgba(56,189,248,0.2)]'
                  : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-200/70">
                  Adım {item}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {item === 1 && 'Amaç & Stil'}
                  {item === 2 && 'Mülk Detayları'}
                  {item === 3 && 'Danışman & Değerleme'}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="space-y-8">
          {step === 1 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                  Seçim Paneli
                </p>
                <h2 className="text-2xl font-semibold text-white">Sunum Parametreleri</h2>
                <p className="text-sm text-slate-300">
                  Amaç, stil ve temayı belirleyin. Zip tabanlı özel tasarım bu kombinasyona göre seçilir.
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Sunum Amacı *
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {PURPOSE_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleOptionSelect('amac', option.value)}
                        className={`rounded-2xl border px-5 py-4 text-left transition ${secenekler.amac === option.value
                          ? 'border-cyan-500/60 bg-cyan-500/10 text-white shadow-[0_15px_40px_rgba(56,189,248,0.25)]'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                          }`}
                      >
                        <p className="text-sm font-semibold">{option.label}</p>
                        {option.description && (
                          <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Sunum Stili *
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {STYLE_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleOptionSelect('sunumStili', option.value)}
                        className={`rounded-2xl border px-5 py-4 text-left transition ${secenekler.sunumStili === option.value
                          ? 'border-emerald-400/70 bg-emerald-500/10 text-white shadow-[0_15px_40px_rgba(52,211,153,0.2)]'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-300/40 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{option.label}</p>
                          {option.badge && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-emerald-200">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Tasarım Teması *
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {THEME_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleOptionSelect('tema', option.value)}
                        className={`rounded-2xl border px-5 py-4 text-left transition ${secenekler.tema === option.value
                          ? 'border-indigo-400/70 bg-indigo-500/20 text-white shadow-[0_15px_40px_rgba(99,102,241,0.2)]'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-indigo-300/40 hover:text-white'
                          }`}
                      >
                        <p className="text-sm font-semibold">{option.label}</p>
                        {option.description && (
                          <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4 pt-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Building2 className="h-4 w-4" />
                  Zip tabanlı kombinasyon seçimi otomatik yapılır.
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_45px_rgba(56,189,248,0.35)] transition hover:shadow-[0_18px_55px_rgba(56,189,248,0.5)] disabled:opacity-40"
                >
                  2. Adıma Geç
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                  Adım 2
                </p>
                <h2 className="text-2xl font-semibold text-white">Mülk Bilgileri</h2>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Mülk Türü *
                  </label>
                  <select
                    value={mulk.tur}
                    onChange={(event) =>
                      setMulk((prev) => ({
                        ...prev,
                        tur: event.target.value as MulkTuru
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    <option value="daire" className="bg-slate-900 text-white">Daire</option>
                    <option value="arsa" className="bg-slate-900 text-white">Arsa</option>
                    <option value="villa" className="bg-slate-900 text-white">Villa</option>
                    <option value="ticari" className="bg-slate-900 text-white">Ticari</option>
                    <option value="ofis" className="bg-slate-900 text-white">Ofis</option>
                    <option value="kompleks" className="bg-slate-900 text-white">Kompleks</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Metrekare
                  </label>
                  <input
                    value={mulk.metrekare}
                    onChange={(event) =>
                      setMulk((prev) => ({ ...prev, metrekare: formatCurrencyInput(event.target.value) }))
                    }
                    placeholder="Örneğin 185"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Fiyat (Minimum)
                  </label>
                  <input
                    value={mulk.fiyatMin}
                    onChange={(event) =>
                      setMulk((prev) => ({ ...prev, fiyatMin: formatCurrencyInput(event.target.value) }))
                    }
                    placeholder="Örn. 5.000.000"
                    className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-white placeholder:text-emerald-200/60 transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Fiyat (Maksimum)
                  </label>
                  <input
                    value={mulk.fiyatMax}
                    onChange={(event) =>
                      setMulk((prev) => ({ ...prev, fiyatMax: formatCurrencyInput(event.target.value) }))
                    }
                    placeholder="Örn. 7.500.000"
                    className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-white placeholder:text-emerald-200/60 transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Krediye Uygunluk
                  </label>
                  <select
                    value={mulk.krediyeUygun || 'uygun'}
                    onChange={(event) =>
                      setMulk((prev) => ({
                        ...prev,
                        krediyeUygun: event.target.value as any
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    <option value="uygun" className="bg-slate-900 text-white">Uygun</option>
                    <option value="kismen" className="bg-slate-900 text-white">Kısmen / Bankaya Göre</option>
                    <option value="uygun_degil" className="bg-slate-900 text-white">Uygun Değil</option>
                  </select>
                </div>

                {/* Oda Sayısı - Arsa için gizle */}
                {mulk.tur !== 'arsa' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Oda Sayısı
                    </label>
                    <input
                      value={mulk.odaSayisi}
                      onChange={(event) => {
                        let value = event.target.value;
                        // Sadece rakam girildiyse otomatik + ekle
                        if (value && /^\d+$/.test(value)) {
                          value = value + '+';
                        }
                        setMulk((prev) => ({ ...prev, odaSayisi: value }));
                      }}
                      placeholder="Örn: 3 yazın otomatik 3+ olur"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />
                  </div>
                )}

                {/* Bulunduğu Kat - Arsa için gizle */}
                {mulk.tur !== 'arsa' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Bulunduğu Kat
                    </label>
                    <input
                      value={mulk.kat}
                      onChange={(event) => {
                        let value = event.target.value;
                        // Sadece rakam girildiyse otomatik ". Kat" ekle
                        if (value && /^\d+$/.test(value)) {
                          value = value + '. Kat';
                        }
                        setMulk((prev) => ({ ...prev, kat: value }));
                      }}
                      placeholder="Örn: 5 yazın otomatik 5. Kat olur"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />
                  </div>
                )}
              </div>

              {/* Mülk Özellikleri Toggle Grid */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Mülk Özellikleri
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { key: 'siteMi' as const, label: 'Site İçi' },
                    { key: 'asansor' as const, label: 'Asansör' },
                    { key: 'otopark' as const, label: 'Otopark' },
                    { key: 'guvenlik' as const, label: '7/24 Güvenlik' },
                    { key: 'havuz' as const, label: 'Havuz' },
                    { key: 'sporSalonu' as const, label: 'Spor Salonu' },
                    { key: 'bahceTeras' as const, label: 'Bahçe / Teras' },
                    { key: 'merkeziIsitma' as const, label: 'Merkezi Isıtma' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setMulk((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition border ${
                        mulk[item.key]
                          ? 'border-[#DBE64C]/40 bg-[#DBE64C]/10 text-[#DBE64C]'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                        mulk[item.key] ? 'bg-[#DBE64C]/20' : 'bg-white/10'
                      }`}>
                        {mulk[item.key] && (
                          <svg className="w-3 h-3 text-[#DBE64C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Konum Bilgisi *
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">Adres ve Analiz</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLocationModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:border-cyan-300/80"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Konum Seç
                    </button>
                    {selectedLocation && (
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-red-400/60 hover:text-red-200"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Temizle
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {selectedLocation ? (
                    <>
                      {selectedLocation.province && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-slate-200">
                          İl: {selectedLocation.province}
                        </span>
                      )}
                      {selectedLocation.district && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-slate-200">
                          İlçe: {selectedLocation.district}
                        </span>
                      )}
                      {selectedLocation.neighborhood && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-slate-200">
                          Mahalle: {selectedLocation.neighborhood}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Konum seçerek bölge analizi tetikleyin.
                    </span>
                  )}
                </div>

                {selectedLocation && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        Konum Analizi

                        {/* Status Indicator */}
                        {locationAnalysisStatus === 'filling' && (
                          <span className="inline-flex items-center gap-1.5 text-cyan-400 animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-[10px]">AI oluşturuyor...</span>
                          </span>
                        )}
                        {locationAnalysisStatus === 'success' && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 animate-bounce">
                            <Check className="h-3 w-3" />
                            <span className="text-[10px]">Tamamlandı!</span>
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateLocationAnalysis}
                        disabled={locationAnalysisLoading}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200 transition hover:border-emerald-300/80 disabled:opacity-40 relative overflow-hidden"
                      >
                        {locationAnalysisLoading && (
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            style={{ animation: 'shimmer 2s infinite linear' }}
                          />
                        )}
                        {locationAnalysisLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin relative z-10" />
                            <span className="relative z-10">Analiz ediliyor</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            AI ile Oluştur
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        value={locationAnalysis}
                        onChange={(event) => setLocationAnalysis(event.target.value)}
                        placeholder="Konum analizi burada görüntülenecek."
                        disabled={locationAnalysisLoading}
                        className={`
                            min-h-[120px] w-full rounded-2xl px-4 py-3 text-sm text-white 
                            placeholder:text-slate-500 transition-all duration-500
                            focus:outline-none focus:ring-2
                            ${locationAnalysisStatus === 'idle'
                            ? 'border border-white/10 bg-white/5 focus:border-cyan-400 focus:ring-cyan-400/40'
                            : ''
                          }
                            ${locationAnalysisStatus === 'filling'
                            ? 'border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                            : ''
                          }
                            ${locationAnalysisStatus === 'success'
                            ? 'border-2 border-emerald-400/70 bg-gradient-to-br from-emerald-500/15 to-green-500/10 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                            : ''
                          }
                            ${locationAnalysisLoading ? 'cursor-not-allowed opacity-70' : ''}
                          `}
                      />

                      {/* Shimmer Effect - Dolum Sırasında */}
                      {locationAnalysisStatus === 'filling' && (
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                            style={{
                              animation: 'shimmer 2s infinite linear'
                            }}
                          />
                        </div>
                      )}

                      {/* Success Glow Effect */}
                      {locationAnalysisStatus === 'success' && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-lg animate-pulse pointer-events-none" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mülk Fotoğrafları */}
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Mülk Fotoğrafları
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Fotoğraflar template'te başta gösterilecektir
                    </p>
                  </div>
                </div>

                <div
                  {...propertyPhotosDropzone.getRootProps()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${propertyPhotosDropzone.isDragActive
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/20 bg-white/5 hover:border-cyan-400/40'
                    }`}
                >
                  <input {...propertyPhotosDropzone.getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-300">
                    Fotoğrafları sürükle-bırak veya tıkla
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Birden fazla fotoğraf seçebilirsiniz
                  </p>
                </div>

                {mulk.fotograflar.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {mulk.fotograflar.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Fotoğraf ${index + 1}`}
                          className="h-32 w-full rounded-xl object-cover border border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setMulk((prev) => ({
                              ...prev,
                              fotograflar: prev.fotograflar.filter((_, i) => i !== index)
                            }))
                          }
                          className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 opacity-0 transition group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI İle Toplu Doldurma - Sadece konum seçildiğinde göster */}
              {selectedLocation && (
                <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-emerald-500/10 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-400" />
                        AI İle Otomatik Doldur
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        Seçtiğiniz konuma özel olarak tüm alanları AI ile doldurun
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        console.log('🚀 AI ile Doldurma Başlatıldı');

                        // PHASE 1: Konum bazlı alanları doldur
                        console.log('📝 PHASE 1: Konum bazlı alanlar dolduruluyor...');
                        const fields: FieldKey[] = ['konumAvantajlari', 'kullanimPotansiyeli', 'aciklama'];
                        for (const field of fields) {
                          await handleGenerateField(field);
                        }
                        console.log('✅ PHASE 1 Tamamlandı');

                        // PHASE 2: Kapsamlı analiz (Hedef Kitle + Konum Analizi & Değerleme)
                        console.log('🧠 PHASE 2: Kapsamlı analiz başlatılıyor...');
                        await handleGenerateComprehensiveAnalysis();
                        console.log('✅ PHASE 2 Tamamlandı');

                        console.log('🎉 Tüm işlemler tamamlandı!');
                      }}
                      disabled={Object.values(fieldLoading).some(loading => loading)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition hover:shadow-[0_12px_32px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {Object.values(fieldLoading).some(loading => loading) && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          style={{ animation: 'shimmer 2s infinite linear' }}
                        />
                      )}
                      {Object.values(fieldLoading).some(loading => loading) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                          <span className="relative z-10">
                            Alanlar Dolduruluyor {Object.values(fieldLoading).filter(Boolean).length}/3
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Tüm Alanları AI ile Doldur
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {(['konumAvantajlari', 'kullanimPotansiyeli', 'aciklama'] as FieldKey[]).map((field) => {
                  const status = fieldStatus[field];
                  const isLoading = fieldLoading[field];

                  return (
                    <div key={field} className="space-y-2 relative">
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        {field === 'konumAvantajlari' && 'Konum Avantajları'}
                        {field === 'kullanimPotansiyeli' && 'Kullanım Potansiyeli'}
                        {field === 'aciklama' && 'Açıklama'}

                        {/* Status Indicator */}
                        {status === 'filling' && (
                          <span className="inline-flex items-center gap-1.5 text-cyan-400 animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-[10px]">AI oluşturuyor...</span>
                          </span>
                        )}
                        {status === 'success' && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 animate-bounce">
                            <Check className="h-3 w-3" />
                            <span className="text-[10px]">Tamamlandı!</span>
                          </span>
                        )}
                      </label>

                      <div className="relative">
                        <textarea
                          value={mulk[field]}
                          onChange={(event) =>
                            setMulk((prev) => ({ ...prev, [field]: event.target.value }))
                          }
                          placeholder="Yukarıdaki 'AI ile Doldur' butonunu kullanarak bu alanı otomatik doldurabilir veya kendiniz yazabilirsiniz."
                          disabled={isLoading}
                          className={`
                              min-h-[140px] w-full rounded-2xl px-4 py-3 text-sm text-white 
                              placeholder:text-slate-500 transition-all duration-500
                              focus:outline-none focus:ring-2
                              ${status === 'idle'
                              ? 'border border-white/10 bg-white/5 focus:border-cyan-400 focus:ring-cyan-400/40'
                              : ''
                            }
                              ${status === 'filling'
                              ? 'border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                              : ''
                            }
                              ${status === 'success'
                              ? 'border-2 border-emerald-400/70 bg-gradient-to-br from-emerald-500/15 to-green-500/10 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                              : ''
                            }
                              ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
                            `}
                        />

                        {/* Shimmer Effect - Dolum Sırasında */}
                        {status === 'filling' && (
                          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                              style={{
                                animation: 'shimmer 2s infinite linear'
                              }}
                            />
                          </div>
                        )}

                        {/* Success Glow Effect */}
                        {status === 'success' && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-lg animate-pulse pointer-events-none" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_45px_rgba(56,189,248,0.35)] transition hover:shadow-[0_18px_55px_rgba(56,189,248,0.5)]"
                >
                  3. Adıma Geç
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                  Adım 3
                </p>
                <h2 className="text-2xl font-semibold text-white">Danışman Bilgileri</h2>
                <p className="text-sm text-slate-300">
                  Profil bilgilerinizi kaydederek tekrar kullanın. Görselleri sürükle-bırak ile ekleyebilirsiniz.
                </p>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Ad Soyad *
                  </label>
                  <input
                    value={danisman.adSoyad}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, adSoyad: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Ofis Adı
                  </label>
                  <input
                    value={danisman.ofisAdi || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, ofisAdi: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    placeholder="Ofis Adı (opsiyonel)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Telefon *
                  </label>
                  <input
                    value={danisman.telefon}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, telefon: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    placeholder="+90 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Email (opsiyonel)
                  </label>
                  <input
                    type="email"
                    value={danisman.email || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    placeholder="ornek@domain.com"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Deneyim (opsiyonel)
                  </label>
                  <textarea
                    value={danisman.deneyim || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, deneyim: event.target.value }))
                    }
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Ödüller / Referanslar (opsiyonel)
                  </label>
                  <textarea
                    value={danisman.oduller || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, oduller: event.target.value }))
                    }
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Profil Fotoğrafı
                  </label>
                  <div
                    {...profileDropzone.getRootProps()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-6 text-center text-sm text-slate-300 transition hover:border-cyan-400/60 hover:text-white"
                  >
                    <input {...profileDropzone.getInputProps()} />
                    <Upload className="mb-3 h-6 w-6 text-cyan-300" />
                    <p>Profil fotoğrafını sürükleyip bırak veya tıkla</p>
                    {danisman.profilFotografi && (
                      <img
                        src={danisman.profilFotografi}
                        alt="Profil"
                        className="mt-4 h-24 w-24 rounded-full border border-cyan-300/40 object-cover"
                      />
                    )}
                  </div>
                  <input
                    value={danisman.profilFotografi || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, profilFotografi: event.target.value }))
                    }
                    placeholder="URL girerek de ekleyebilirsiniz"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Ofis Logosu
                  </label>
                  <div
                    {...officeDropzone.getRootProps()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-6 text-center text-sm text-slate-300 transition hover:border-cyan-400/60 hover:text-white"
                  >
                    <input {...officeDropzone.getInputProps()} />
                    <Upload className="mb-3 h-6 w-6 text-cyan-300" />
                    <p>Ofis logosunu sürükleyip bırak veya tıkla</p>
                    {danisman.ofisLogosu && (
                      <img
                        src={danisman.ofisLogosu}
                        alt="Ofis Logosu"
                        className="mt-4 h-16 w-16 rounded-xl border border-cyan-300/40 object-cover"
                      />
                    )}
                  </div>
                  <input
                    value={danisman.ofisLogosu || ''}
                    onChange={(event) =>
                      setDanisman((prev) => ({ ...prev, ofisLogosu: event.target.value }))
                    }
                    placeholder="URL girerek de ekleyebilirsiniz"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Kaydedilmiş Profiller
                    </p>
                    <p className="text-sm text-slate-300">
                      Önceden kaydettiğiniz profilleri burada seçebilirsiniz.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-200 transition hover:border-cyan-300/80"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Profil Kaydet
                  </button>
                </div>
                {savedProfiles.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {savedProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-white">{profile.label}</p>
                          <p className="text-xs text-slate-400">{profile.telefon}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleProfileSelect(profile.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 px-3 py-1 text-xs text-cyan-200"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Kullan
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProfileDelete(profile.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 hover:border-red-400/40 hover:text-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">
                    Henüz kayıtlı profil yok. Bilgilerinizi doldurduktan sonra &quot;Profil Kaydet&quot; ile saklayabilirsiniz.
                  </p>
                )}
              </div>

              <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Detaylı Değerleme Raporu
                    </p>
                    <p className="text-sm text-slate-300">
                      Kurumsal ve detaylı analiz kombinasyonlarında otomatik sunuma eklenir.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={detayliDegerlemeAktif}
                      onChange={(event) => setDetayliDegerlemeAktif(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400/40"
                    />
                    Etkinleştir
                  </label>
                </div>

                {detayliDegerlemeAktif && (
                  <div className="space-y-6">
                    {/* İlan No */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Sahibinden İlan Numarası
                        </label>
                        {priceHistoryLoading && (
                          <span className="text-xs text-cyan-400 flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Fiyat geçmişi çekiliyor...
                          </span>
                        )}
                      </div>
                      <input
                        value={ilanNo}
                        onChange={(event) => setIlanNo(event.target.value)}
                        onBlur={() => {
                          if (ilanNo.trim().length >= 5) {
                            handleScrapePriceHistory(ilanNo);
                          }
                        }}
                        placeholder="Örneğin: 123456789 (Sahibinden ilan numarası)"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      />
                      <p className="text-xs text-slate-500">
                        İlan numarasını girdikten sonra alanı terk ettiğinizde otomatik olarak fiyat geçmişi çekilir ve form doldurulur.
                      </p>
                    </div>

                    {/* Fiyat Geçmişi Listesi */}
                    {priceHistoryData && priceHistoryData.price_history.length > 0 && (
                      <div className="space-y-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-cyan-200 uppercase tracking-[0.2em]">
                            Fiyat Geçmişi ({priceHistoryData.price_history.length} kayıt)
                          </h3>
                          {priceHistoryData.market_position && (
                            <span className={`text-xs px-3 py-1 rounded-full ${priceHistoryData.market_position === 'above'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : priceHistoryData.market_position === 'below'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                                : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                              }`}>
                              {priceHistoryData.market_position === 'above'
                                ? 'Piyasanın Üstünde'
                                : priceHistoryData.market_position === 'below'
                                  ? 'Piyasanın Altında'
                                  : 'Piyasa Ortalaması'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {priceHistoryData.price_history.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                <span className="text-sm text-slate-300">{entry.date || `Kayıt ${index + 1}`}</span>
                              </div>
                              <span className="text-sm font-semibold text-white">
                                {entry.formatted || `₺${Math.round(entry.price).toLocaleString('tr-TR')}`}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Özet Bilgiler */}
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                          {priceHistoryData.min_price && (
                            <div className="text-center">
                              <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-1">Minimum</p>
                              <p className="text-sm font-semibold text-red-300">
                                ₺{Math.round(priceHistoryData.min_price).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          )}
                          {priceHistoryData.current_price && (
                            <div className="text-center">
                              <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-1">Mevcut</p>
                              <p className="text-sm font-semibold text-cyan-300">
                                ₺{Math.round(priceHistoryData.current_price).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          )}
                          {priceHistoryData.max_price && (
                            <div className="text-center">
                              <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-1">Maksimum</p>
                              <p className="text-sm font-semibold text-green-300">
                                ₺{Math.round(priceHistoryData.max_price).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Piyasa Snapshotları
                        </p>
                        <button
                          type="button"
                          onClick={handleAddSnapshot}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-300/60 hover:text-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Snapshot Ekle
                        </button>
                      </div>
                      <div className="space-y-4">
                        {marketSnapshots.map((snapshot, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>#{index + 1}</span>
                              {marketSnapshots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSnapshot(index)}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400 hover:border-red-400/40 hover:text-red-200"
                                >
                                  <Minus className="h-3 w-3" />
                                  Sil
                                </button>
                              )}
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <input
                                value={snapshot.title}
                                onChange={(event) =>
                                  handleSnapshotChange(index, 'title', event.target.value)
                                }
                                placeholder="Başlık"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                              <input
                                value={snapshot.value}
                                onChange={(event) =>
                                  handleSnapshotChange(index, 'value', event.target.value)
                                }
                                placeholder="Değer"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                              <select
                                value={snapshot.trend ?? 'stable'}
                                onChange={(event) =>
                                  handleSnapshotChange(index, 'trend', event.target.value)
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                              >
                                <option value="up">Artış Eğilimi</option>
                                <option value="down">Düşüş Eğilimi</option>
                                <option value="stable">Stabil</option>
                              </select>
                              <input
                                value={snapshot.trendLabel || ''}
                                onChange={(event) =>
                                  handleSnapshotChange(index, 'trendLabel', event.target.value)
                                }
                                placeholder="Trend etiketi (ör. +12% yıllık)"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Karşılaştırmalı Portföyler
                        </p>
                        <button
                          type="button"
                          onClick={handleAddComparable}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-300/60 hover:text-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Karşılaştırma Ekle
                        </button>
                      </div>
                      <div className="space-y-4">
                        {comparables.map((comparable, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>#{index + 1}</span>
                              {comparables.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveComparable(index)}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400 hover:border-red-400/40 hover:text-red-200"
                                >
                                  <Minus className="h-3 w-3" />
                                  Sil
                                </button>
                              )}
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <input
                                value={comparable.address}
                                onChange={(event) =>
                                  handleComparableChange(index, 'address', event.target.value)
                                }
                                placeholder="Adres"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                              <input
                                value={comparable.price}
                                onChange={(event) =>
                                  handleComparableChange(index, 'price', event.target.value)
                                }
                                placeholder="Fiyat"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                              <select
                                value={comparable.status}
                                onChange={(event) =>
                                  handleComparableChange(index, 'status', event.target.value)
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                              >
                                <option value="Satışta">Satışta</option>
                                <option value="Satıldı">Satıldı</option>
                              </select>
                              <input
                                value={comparable.size || ''}
                                onChange={(event) =>
                                  handleComparableChange(index, 'size', event.target.value)
                                }
                                placeholder="Alan"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                              <input
                                value={comparable.pricePerSqm || ''}
                                onChange={(event) =>
                                  handleComparableChange(index, 'pricePerSqm', event.target.value)
                                }
                                placeholder="m² Fiyatı"
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Tahmini Değer Aralığı
                      </label>
                      <input
                        value={estimatedValueRange}
                        onChange={(event) => setEstimatedValueRange(event.target.value)}
                        placeholder="Örneğin 12.500.000 TL - 14.200.000 TL"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isGenerating}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(56,189,248,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(56,189,248,0.6)] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Oluşturuluyor
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Sunumu Oluştur
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelect={(selection) => {
          handleLocationSelect({
            province: selection.province?.name,
            district: selection.district?.name,
            neighborhood: selection.neighborhood?.name,
            fullAddress: selection.fullAddress
          });
        }}
        currentLocation={selectedLocation?.fullAddress}
      />
    </div>
  );
}
