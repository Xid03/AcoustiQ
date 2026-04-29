"use client";

import { useState } from "react";
import { CalendarDays, Download, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import type { LeadRow } from "@/lib/supabase/types";

type LeadStatus = LeadRow["status"];

type LeadFormInput = {
  companyName: string;
  email: string;
  fullName: string;
  phone: string;
  projectName: string;
  projectType: string;
  source: string;
  status: LeadStatus;
};

type LeadsToolbarProps = {
  dateFrom: string;
  dateTo: string;
  query: string;
  source: string;
  sources: string[];
  status: string;
  statuses: string[];
  onAddLead: (input: LeadFormInput) => Promise<boolean>;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExport: () => void;
  onQueryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function LeadsToolbar({
  dateFrom,
  dateTo,
  query,
  source,
  sources,
  status,
  statuses,
  onAddLead,
  onDateFromChange,
  onDateToChange,
  onExport,
  onQueryChange,
  onSourceChange,
  onStatusChange
}: LeadsToolbarProps) {
  const [dateFiltersOpen, setDateFiltersOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleAddLead(formData: FormData) {
    setIsSaving(true);
    const saved = await onAddLead({
      companyName: String(formData.get("company_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      fullName: String(formData.get("full_name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      projectName: String(formData.get("project_name") || "").trim(),
      projectType: String(formData.get("project_type") || "Office"),
      source: String(formData.get("source") || "Website"),
      status: String(formData.get("status") || "New") as LeadStatus
    });
    setIsSaving(false);

    if (saved) {
      setAddLeadOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_180px]">
          <label className="relative block">
            <span className="sr-only">Search leads</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              placeholder="Search by name, email, company..."
              className="h-10 bg-white pl-9"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter by status"
            value={status}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option>All Status</option>
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by source"
            value={source}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            onChange={(event) => onSourceChange(event.target.value)}
          >
            <option>All Sources</option>
            {sources.map((sourceOption) => (
              <option key={sourceOption} value={sourceOption}>
                {sourceOption}
              </option>
            ))}
          </select>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-between gap-2 bg-white text-slate-600"
              onClick={() => setDateFiltersOpen((open) => !open)}
            >
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {dateFrom || dateTo ? "Date Applied" : "Date Range"}
              </span>
            </Button>

            {dateFiltersOpen ? (
              <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/80">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Date range</p>
                  <button
                    type="button"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close date range"
                    onClick={() => setDateFiltersOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 grid gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-500">From</span>
                    <Input
                      type="date"
                      value={dateFrom}
                      className="mt-1 bg-white"
                      onChange={(event) => onDateFromChange(event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-500">To</span>
                    <Input
                      type="date"
                      value={dateTo}
                      className="mt-1 bg-white"
                      onChange={(event) => onDateToChange(event.target.value)}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white"
                    onClick={() => {
                      onDateFromChange("");
                      onDateToChange("");
                    }}
                  >
                    Clear Dates
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Sheet open={addLeadOpen} onOpenChange={setAddLeadOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
              <SheetHeader className="pr-8">
                <SheetTitle>Add Lead</SheetTitle>
                <SheetDescription>
                  Create a qualified lead for follow-up and quote tracking.
                </SheetDescription>
              </SheetHeader>
              <form action={handleAddLead} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Full Name
                    </span>
                    <Input
                      required
                      name="full_name"
                      placeholder="Aina Sofea"
                      className="mt-2 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <Input
                      required
                      name="email"
                      type="email"
                      placeholder="aina.sofea@example.com"
                      className="mt-2 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Company
                    </span>
                    <Input
                      name="company_name"
                      placeholder="QFlow Sdn. Bhd."
                      className="mt-2 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Phone
                    </span>
                    <Input
                      name="phone"
                      placeholder="+6012 345 6789"
                      className="mt-2 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Project Type
                    </span>
                    <select
                      name="project_type"
                      defaultValue="Office"
                      className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {["Office", "Conference Room", "Home Theater", "Recording Studio", "Open Office"].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Source
                    </span>
                    <select
                      name="source"
                      defaultValue="Website"
                      className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {["Website", "Referral", "Direct", "Campaign", "Partner"].map((sourceOption) => (
                        <option key={sourceOption} value={sourceOption}>
                          {sourceOption}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Status
                    </span>
                    <select
                      name="status"
                      defaultValue="New"
                      className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {["New", "Contacted", "Quote Sent", "Viewed", "Declined"].map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Project Name
                    </span>
                    <Input
                      name="project_name"
                      placeholder="Office Acoustic Upgrade"
                      className="mt-2 bg-white"
                    />
                  </label>
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white"
                    onClick={() => setAddLeadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving Lead..." : "Save Lead"}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Button variant="outline" className="gap-2 bg-white" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
}
