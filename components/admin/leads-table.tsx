import { MoreVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/admin/table-pagination";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import type { LeadWithQuote } from "@/lib/supabase/types";

const statusClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Contacted: "bg-amber-100 text-amber-800",
  "Quote Sent": "bg-purple-100 text-purple-800",
  Viewed: "bg-emerald-100 text-emerald-800",
  Declined: "bg-red-100 text-red-800"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function LeadsTable({ leads }: { leads: LeadWithQuote[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="border-b border-slate-200 px-4 py-3 text-left">
                <Checkbox aria-label="Select all leads" />
              </th>
              {[
                "Company",
                "Contact",
                "Email",
                "Project Type",
                "Source",
                "Status",
                "Quote Value",
                "Date",
                "Actions"
              ].map((header) => (
                <th
                  key={header}
                  className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="transition-colors duration-100 hover:bg-slate-50/50"
              >
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <Checkbox aria-label={`Select ${lead.company_name || lead.full_name}`} />
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm font-medium text-slate-900">
                  {lead.company_name || "-"}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {lead.full_name}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {lead.email}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {lead.project_type}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {lead.source}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {lead.quote_value ? formatCurrency(lead.quote_value) : "-"}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm tabular-nums text-slate-700">
                  {formatDate(lead.created_at)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 min-h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    aria-label={`Open actions for ${lead.company_name || lead.full_name}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination />
    </section>
  );
}
