import { MulkBilgileri } from "@/types";

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return value.toLocaleString("tr-TR");
};

export const formatPriceRange = (
  mulk: Pick<MulkBilgileri, "fiyat" | "fiyatMin" | "fiyatMax">
): string | undefined => {
  const min = formatCurrency(mulk.fiyatMin);
  const max = formatCurrency(mulk.fiyatMax);

  if (min && max) return `${min} TL - ${max} TL`;
  if (min) return `${min} TL`;
  if (max) return `${max} TL`;

  const single = formatCurrency(mulk.fiyat);
  return single ? `${single} TL` : undefined;
};

export const parseCurrencyToNumber = (value: string | undefined) => {
  if (!value) return undefined;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const numeric = Number(digits);
  return Number.isFinite(numeric) ? numeric : undefined;
};

export const formatCurrencyInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  const numeric = Number(digits);
  if (!Number.isFinite(numeric)) return "";
  return numeric.toLocaleString("tr-TR");
};

