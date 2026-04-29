"use client";

import { useEffect, useState } from "react";

import {
  type BrandSettings,
  brandSettingsStorageKey,
  fallbackBrandSettings,
  normalizeBrandSettings
} from "@/lib/branding/brand-settings";
import { createSupabaseClient } from "@/lib/supabase/client";

function readCachedBrandSettings() {
  if (typeof window === "undefined") {
    return fallbackBrandSettings;
  }

  try {
    const cached = window.localStorage.getItem(brandSettingsStorageKey);
    return cached
      ? normalizeBrandSettings(JSON.parse(cached) as Partial<BrandSettings>)
      : fallbackBrandSettings;
  } catch {
    return fallbackBrandSettings;
  }
}

export function cacheBrandSettings(settings: BrandSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    brandSettingsStorageKey,
    JSON.stringify(normalizeBrandSettings(settings))
  );
  window.dispatchEvent(new CustomEvent("acoustiq-brand-settings-updated"));
}

export function useBrandSettings() {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(
    readCachedBrandSettings
  );

  useEffect(() => {
    let mounted = true;

    async function loadBrandSettings() {
      const supabase = createSupabaseClient();

      if (!supabase) {
        return;
      }

      const { data } = await supabase
        .from("companies")
        .select("accent_color,brand_name,primary_color,quote_prefix,support_email")
        .limit(1)
        .maybeSingle();

      if (!mounted || !data) {
        return;
      }

      const normalized = normalizeBrandSettings(data);
      setBrandSettings(normalized);
      cacheBrandSettings(normalized);
    }

    function handleBrandSettingsUpdate() {
      setBrandSettings(readCachedBrandSettings());
    }

    void loadBrandSettings();
    window.addEventListener(
      "acoustiq-brand-settings-updated",
      handleBrandSettingsUpdate
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "acoustiq-brand-settings-updated",
        handleBrandSettingsUpdate
      );
    };
  }, []);

  return brandSettings;
}
