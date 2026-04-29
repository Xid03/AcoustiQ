import type { CompanyRow } from "@/lib/supabase/types";

export type BrandSettings = Pick<
  CompanyRow,
  "accent_color" | "brand_name" | "primary_color" | "quote_prefix" | "support_email"
>;

export const fallbackBrandSettings: BrandSettings = {
  accent_color: "#10b981",
  brand_name: "AcoustiQ",
  primary_color: "#4f46e5",
  quote_prefix: "AQ",
  support_email: "support@acoustiq.com"
};

export const brandSettingsStorageKey = "acoustiq-brand-settings";

export function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const nextValue = String(value || "").trim();

  return /^#[0-9a-f]{6}$/i.test(nextValue) ? nextValue : fallback;
}

export function normalizeBrandSettings(settings?: Partial<BrandSettings> | null): BrandSettings {
  return {
    accent_color: normalizeHexColor(
      settings?.accent_color,
      fallbackBrandSettings.accent_color
    ),
    brand_name: settings?.brand_name?.trim() || fallbackBrandSettings.brand_name,
    primary_color: normalizeHexColor(
      settings?.primary_color,
      fallbackBrandSettings.primary_color
    ),
    quote_prefix:
      settings?.quote_prefix?.trim().toUpperCase() || fallbackBrandSettings.quote_prefix,
    support_email:
      settings?.support_email?.trim() || fallbackBrandSettings.support_email
  };
}
