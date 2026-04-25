const sources = [
  ["Website", "58%", "bg-indigo-600"],
  ["Direct", "22%", "bg-indigo-300"],
  ["Referral", "12%", "bg-sky-200"],
  ["Other", "8%", "bg-slate-300"]
];

export function LeadSourceCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Lead Source Breakdown
      </h2>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="42" fill="none" stroke="#e2e8f0" strokeWidth="16" />
            <circle cx="60" cy="60" r="42" fill="none" stroke="#4f46e5" strokeDasharray="153 264" strokeWidth="16" />
            <circle cx="60" cy="60" r="42" fill="none" stroke="#a5b4fc" strokeDasharray="58 264" strokeDashoffset="-153" strokeWidth="16" />
            <circle cx="60" cy="60" r="42" fill="none" stroke="#bae6fd" strokeDasharray="32 264" strokeDashoffset="-211" strokeWidth="16" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900">128</span>
            <span className="text-xs text-slate-500">Total Leads</span>
          </div>
        </div>
        <div className="w-full space-y-3">
          {sources.map(([label, value, color]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {label}
              </span>
              <span className="font-mono font-medium tabular-nums text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
