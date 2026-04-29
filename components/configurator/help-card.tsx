"use client";

import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBrandSettings } from "@/lib/hooks/use-brand-settings";

export function HelpCard() {
  const brandSettings = useBrandSettings();

  return (
    <aside className="rounded-xl border border-slate-200 bg-slate-100 p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <UserRound className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-800">
            Need help?
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Our acoustic experts are here to assist you.
          </p>
        </div>
      </div>
      <Button asChild variant="outline" className="mt-4 w-full bg-white text-xs">
        <a href={`mailto:${brandSettings.support_email}`}>Contact Us</a>
      </Button>
    </aside>
  );
}
