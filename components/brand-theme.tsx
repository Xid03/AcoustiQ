"use client";

import { useEffect } from "react";

import { useBrandSettings } from "@/lib/hooks/use-brand-settings";

export function BrandTheme() {
  const brandSettings = useBrandSettings();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--brand-primary", brandSettings.primary_color);
    root.style.setProperty("--brand-accent", brandSettings.accent_color);
  }, [brandSettings.accent_color, brandSettings.primary_color]);

  return null;
}
