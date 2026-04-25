export function LeadsChartCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Leads Over Time
      </h2>
      <div className="mt-5 h-[260px] w-full">
        <svg viewBox="0 0 720 260" className="h-full w-full" role="img" aria-label="Leads over time line chart">
          <defs>
            <linearGradient id="leadArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 90, 140, 190].map((y) => (
            <line key={y} x1="54" x2="690" y1={y} y2={y} stroke="#e2e8f0" />
          ))}
          {["40", "30", "20", "10", "0"].map((label, index) => (
            <text key={label} x="18" y={34 + index * 50} fill="#64748b" fontSize="12">
              {label}
            </text>
          ))}
          <path
            d="M62 188 L150 168 L238 132 L326 136 L414 155 L502 110 L590 132 L678 110 L678 210 L62 210 Z"
            fill="url(#leadArea)"
          />
          <path
            d="M62 188 L150 168 L238 132 L326 136 L414 155 L502 110 L590 132 L678 110"
            fill="none"
            stroke="#4f46e5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          {[62, 150, 238, 326, 414, 502, 590, 678].map((x, index) => {
            const y = [188, 168, 132, 136, 155, 110, 132, 110][index];
            return <circle key={x} cx={x} cy={y} r="5" fill="#4f46e5" stroke="#fff" strokeWidth="3" />;
          })}
          <g>
            <rect x="508" y="52" width="104" height="56" rx="10" fill="#fff" stroke="#e2e8f0" />
            <text x="530" y="75" fill="#0f172a" fontSize="12" fontWeight="600">
              May 17
            </text>
            <circle cx="532" cy="93" r="4" fill="#4f46e5" />
            <text x="542" y="97" fill="#475569" fontSize="12">
              Leads: 28
            </text>
          </g>
          {["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"].map((label, index) => (
            <text key={label} x={72 + index * 96} y="246" fill="#64748b" fontSize="12">
              {label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
