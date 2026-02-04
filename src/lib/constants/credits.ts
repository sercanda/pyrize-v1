/**
 * Kredi maliyetleri
 */
export const CREDIT_COSTS = {
  /** Sunum oluşturma maliyeti */
  SUNUM_OLUSTURMA: 25,
  /** Fotoğraf düzenleme maliyeti (her istek) */
  FOTO_DUZENLEME: 3,
} as const;

/**
 * Kredi paketleri
 */
export const CREDIT_PACKAGES = [
  { credits: 50, priceUSD: 5 },
  { credits: 100, priceUSD: 10 },
  { credits: 200, priceUSD: 20 },
  { credits: 500, priceUSD: 50, bonusCredits: 50, flashSale: true },
  { credits: 1000, priceUSD: 100, bonusCredits: 200, flashSale: true },
  { credits: 2000, priceUSD: 200, bonusCredits: 400, flashSale: true },
  { credits: 5000, priceUSD: 600, bonusCredits: 1000, flashSale: true },
  { credits: 10000, priceUSD: 1200, bonusCredits: 2000, flashSale: true },
] as const;

