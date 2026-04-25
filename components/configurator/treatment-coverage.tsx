type TreatmentCoverageProps = {
  wallCoverage: number;
  ceilingCoverage: number;
};

export function TreatmentCoverage({
  wallCoverage,
  ceilingCoverage
}: TreatmentCoverageProps) {
  const coverage = [
    {
      label: "Wall Coverage",
      value: `${wallCoverage}%`,
      recommended: "Recommended: 30% - 60%",
      width: `${wallCoverage}%`,
      fill: "bg-indigo-600"
    },
    {
      label: "Ceiling Coverage",
      value: `${ceilingCoverage}%`,
      recommended: "Recommended: 20% - 40%",
      width: `${ceilingCoverage}%`,
      fill: "bg-emerald-500"
    }
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Treatment Coverage
      </h2>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {coverage.map((item) => (
          <div key={item.label}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900">
                  {item.value}
                </p>
              </div>
              <p className="text-xs text-slate-500">{item.recommended}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`${item.fill} h-full rounded-full`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
