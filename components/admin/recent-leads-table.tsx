const leads = [
  ["Acme Corporation", "Sarah Johnson", "sarah@acme.com", "Office Studio", "2h ago", "New"],
  ["SoundWave LLC", "Michael Brown", "michael@soundwave.com", "Conference Room", "5h ago", "Contacted"],
  ["Horizon Design", "Emily Davis", "emily@horizondesign.com", "Home Theater", "1d ago", "Quote Sent"],
  ["NextGen Offices", "David Wilson", "david@nextgen.com", "Open Office", "1d ago", "New"]
];

const statusClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Contacted: "bg-amber-100 text-amber-800",
  "Quote Sent": "bg-purple-100 text-purple-800"
};

export function RecentLeadsTable() {
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
              {["Product", "Contact", "Email", "Project", "Time", "Status"].map((header) => (
                <th key={header} className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(([company, contact, email, project, time, status]) => (
              <tr key={company} className="transition-colors duration-100 hover:bg-slate-50/50">
                <td className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">{company}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{contact}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">{email}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">{project}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-500">{time}</td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status]}`}>
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
