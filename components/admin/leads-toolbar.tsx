import { CalendarDays, Download, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeadsToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_180px]">
        <label className="relative block">
          <span className="sr-only">Search leads</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, company..."
            className="h-10 bg-white pl-9"
          />
        </label>

        {["All Status", "All Sources"].map((label) => (
          <select
            key={label}
            aria-label={label}
            defaultValue={label}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option>{label}</option>
          </select>
        ))}

        <Button variant="outline" className="justify-between gap-2 bg-white text-slate-600">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Date Range
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
        <Button variant="outline" className="gap-2 bg-white">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
