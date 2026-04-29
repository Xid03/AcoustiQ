"use client";

import Link from "next/link";

import { useBrandSettings } from "@/lib/hooks/use-brand-settings";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
};

export function BrandLogo({ className, markClassName }: BrandLogoProps) {
  const brandSettings = useBrandSettings();

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-[44px] items-center gap-3 rounded-lg text-slate-950 transition-colors duration-150 hover:text-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        className
      )}
      aria-label={`${brandSettings.brand_name} home`}
    >
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg",
          markClassName
        )}
        style={{
          backgroundColor: `color-mix(in srgb, ${brandSettings.primary_color} 12%, white)`,
          color: brandSettings.primary_color
        }}
        aria-hidden="true"
      >
        <span
          className="absolute left-2 h-3 w-0.5 rounded-full"
          style={{ backgroundColor: brandSettings.primary_color }}
        />
        <span
          className="absolute left-[13px] h-5 w-0.5 rounded-full"
          style={{ backgroundColor: brandSettings.primary_color }}
        />
        <span
          className="absolute left-[18px] h-7 w-0.5 rounded-full"
          style={{ backgroundColor: brandSettings.primary_color }}
        />
        <span
          className="absolute left-[23px] h-4 w-0.5 rounded-full"
          style={{ backgroundColor: brandSettings.primary_color }}
        />
      </span>
      <span className="text-base font-semibold tracking-tight">
        {brandSettings.brand_name}
      </span>
    </Link>
  );
}
