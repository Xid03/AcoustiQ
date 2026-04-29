"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { cacheBrandSettings } from "@/lib/hooks/use-brand-settings";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { CompanyRow } from "@/lib/supabase/types";

export function SettingsForm({ company }: { company: CompanyRow }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsSaving(false);
      return;
    }

    const nextSettings = {
      name: String(formData.get("name") || ""),
      brand_name: String(formData.get("brand_name") || ""),
      primary_color: String(formData.get("primary_color") || "#4f46e5"),
      accent_color: String(formData.get("accent_color") || "#10b981"),
      quote_prefix: String(formData.get("quote_prefix") || "AQ").toUpperCase(),
      support_email: String(formData.get("support_email") || "")
    };

    const { error } = await supabase
      .from("companies")
      .update(nextSettings)
      .eq("id", company.id);

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    cacheBrandSettings(nextSettings);
    setSuccessOpen(true);
  }

  return (
    <>
      <form
        action={handleSubmit}
        className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["Company Name", "name", company.name],
            ["Brand Name", "brand_name", company.brand_name],
            ["Primary Color", "primary_color", company.primary_color],
            ["Accent Color", "accent_color", company.accent_color],
            ["Quote Prefix", "quote_prefix", company.quote_prefix],
            ["Support Email", "support_email", company.support_email || ""]
          ].map(([label, name, value]) => (
            <label key={name} className="block">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <Input name={name} defaultValue={value} className="mt-2 bg-white" />
            </label>
          ))}
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
      <SuccessDialog
        open={successOpen}
        title="Settings Updated"
        message="Branding and quote settings were saved successfully."
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
