const summary = [
  ["Room Type", "Office"],
  ["Dimensions (L x W x H)", "20 ft x 16 ft x 10 ft"],
  ["Floor Area", "320 sq ft"],
  ["Volume", "3,200 cu ft"],
  ["Ceiling Type", "Hard Ceiling"],
  ["Floor Type", "Hard Floor"],
  ["Windows", "Large"]
];

export function ConfigurationSummary() {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium tracking-tight text-slate-800">Summary</h2>
      <dl className="mt-6 space-y-5">
        {summary.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-mono font-medium tabular-nums text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
