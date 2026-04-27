type RecentLead = {
  company: string;
  contact: string;
  email: string;
  project: string;
  time: string;
  status: string;
};

const statusClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Contacted: "bg-amber-100 text-amber-800",
  "Quote Sent": "bg-purple-100 text-purple-800",
  Viewed: "bg-emerald-100 text-emerald-800",
  Declined: "bg-red-100 text-red-800"
};

export function RecentLeadsTable({ leads }: { leads: RecentLead[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
        <h2 className="text-sm font-semibold tracking-tight text-slate-800">
          Recent Leads
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              {["Company", "Contact", "Email", "Project", "Time", "Status"].map((header) => (
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
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={`${lead.email}-${lead.time}`}
                  className="transition-colors duration-100 hover:bg-slate-50/50"
                >
                  <td className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                    {lead.company}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                    {lead.contact}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                    {lead.email}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
                    {lead.project}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
                    {lead.time}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusClasses[lead.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="border-b border-slate-100 px-4 py-12 text-center text-sm text-slate-500"
                >
                  No leads have been captured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
