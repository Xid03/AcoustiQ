export function PerformanceCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Performance Improvement
      </h2>
      <div className="mt-5 flex flex-col items-center text-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#10b981"
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray="205 302"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-semibold tabular-nums text-slate-900">
              68%
            </span>
            <span className="mt-1 text-xs font-medium text-slate-500">
              Reduction
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-800">
          Reverberation Reduction
        </p>
        <p className="mt-1 text-xs font-medium text-emerald-700">Good</p>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Expected improvement with recommended treatment.
        </p>
      </div>
    </section>
  );
}
