import { MoreVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/admin/table-pagination";

const leads = [
  ["Acme Corporation", "Sarah Johnson", "sarah@acme.com", "Office", "Website", "New", "$4,030.40", "May 20, 2024"],
  ["SoundWave LLC", "Michael Brown", "michael@soundwave.com", "Conference Room", "Website", "Contacted", "$2,156.00", "May 20, 2024"],
  ["Horizon Design", "Emily Davis", "emily@horizondesign.com", "Home Theater", "Referral", "Quote Sent", "$5,090.00", "May 19, 2024"],
  ["NextGen Offices", "David Wilson", "david@nextgen.com", "Open Office", "Direct", "Viewed", "$3,420.00", "May 19, 2024"],
  ["Creative Studios", "Jessica Taylor", "jessica@creativestudios.com", "Recording Studio", "Website", "New", "-", "May 18, 2024"],
  ["Bright Spaces", "Daniel Martinez", "daniel@brightspaces.com", "Office", "Referral", "Quote Sent", "$6,250.00", "May 18, 2024"],
  ["Elite Workspace", "Olivia Anderson", "olivia@eliteworkspace.com", "Conference Room", "Direct", "Declined", "$1,980.00", "May 17, 2024"],
  ["Visionary Labs", "James Lee", "james@visionarylabs.com", "Home Studio", "Website", "Contacted", "$2,760.00", "May 17, 2024"]
];

const statusClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Contacted: "bg-amber-100 text-amber-800",
  "Quote Sent": "bg-purple-100 text-purple-800",
  Viewed: "bg-emerald-100 text-emerald-800",
  Declined: "bg-red-100 text-red-800"
};

export function LeadsTable() {
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
            {leads.map(([company, contact, email, projectType, source, status, quoteValue, date]) => (
              <tr
                key={`${company}-${contact}`}
                className="transition-colors duration-100 hover:bg-slate-50/50"
              >
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <Checkbox aria-label={`Select ${company}`} />
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm font-medium text-slate-900">
                  {company}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {contact}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {email}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {projectType}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {source}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status]}`}>
                    {status}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {quoteValue}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm tabular-nums text-slate-700">
                  {date}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 min-h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    aria-label={`Open actions for ${company}`}
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
