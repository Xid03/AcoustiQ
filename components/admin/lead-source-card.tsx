type LeadSource = {
  label: string;
  count: number;
  percent: number;
  color: string;
  stroke: string;
};

export function LeadSourceCard({
  sources,
  totalLeads
}: {
  sources: LeadSource[];
  totalLeads: number;
}) {
  let strokeOffset = 0;
  const circumference = 264;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Lead Source Breakdown
      </h2>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="42" fill="none" stroke="#e2e8f0" strokeWidth="16" />
            {sources.map((source) => {
              const dashLength = (source.percent / 100) * circumference;
              const circle = (
                <circle
                  key={source.label}
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke={source.stroke}
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={-strokeOffset}
                  strokeWidth="16"
                />
              );
              strokeOffset += dashLength;
              return circle;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
              {totalLeads}
            </span>
            <span className="text-xs text-slate-500">Total Leads</span>
          </div>
        </div>
        <div className="w-full space-y-3">
          {sources.length > 0 ? (
            sources.map((source) => (
              <div key={source.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={`h-2.5 w-2.5 rounded-full ${source.color}`} />
                  {source.label}
                </span>
                <span className="font-mono font-medium tabular-nums text-slate-900">
                  {source.percent}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No source data yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
