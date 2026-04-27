type LeadChartPoint = {
  label: string;
  count: number;
};

export function LeadsChartCard({ points }: { points: LeadChartPoint[] }) {
  const maxCount = Math.max(4, ...points.map((point) => point.count));
  const chartWidth = 720;
  const chartHeight = 260;
  const left = 62;
  const right = 678;
  const top = 40;
  const bottom = 210;
  const step = points.length > 1 ? (right - left) / (points.length - 1) : 0;
  const coordinates = points.map((point, index) => {
    const x = left + step * index;
    const y = bottom - (point.count / maxCount) * (bottom - top);

    return { ...point, x, y };
  });
  const linePath =
    coordinates.length > 0
      ? coordinates
          .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
          .join(" ")
      : "";
  const areaPath =
    coordinates.length > 0
      ? `${linePath} L${coordinates[coordinates.length - 1].x} ${bottom} L${coordinates[0].x} ${bottom} Z`
      : "";
  const yLabels = [maxCount, Math.round(maxCount * 0.75), Math.round(maxCount * 0.5), Math.round(maxCount * 0.25), 0];
  const peakPoint = coordinates.reduce(
    (peak, point) => (point.count >= peak.count ? point : peak),
    coordinates[0] || { x: 520, y: 90, count: 0, label: "Today" }
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Leads Over Time
      </h2>
      <div className="mt-5 h-[260px] w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-full w-full"
          role="img"
          aria-label="Leads over time line chart"
        >
          <defs>
            <linearGradient id="leadArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 90, 140, 190].map((y) => (
            <line key={y} x1="54" x2="690" y1={y} y2={y} stroke="#e2e8f0" />
          ))}
          {yLabels.map((label, index) => (
            <text key={`${label}-${index}`} x="18" y={34 + index * 50} fill="#64748b" fontSize="12">
              {label}
            </text>
          ))}
          {areaPath ? <path d={areaPath} fill="url(#leadArea)" /> : null}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke="#4f46e5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          ) : null}
          {coordinates.map((point) => (
            <circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#4f46e5"
              stroke="#fff"
              strokeWidth="3"
            />
          ))}
          {coordinates.length > 0 ? (
            <g>
              <rect
                x={Math.min(590, Math.max(70, peakPoint.x - 52))}
                y={Math.max(24, peakPoint.y - 70)}
                width="112"
                height="56"
                rx="10"
                fill="#fff"
                stroke="#e2e8f0"
              />
              <text
                x={Math.min(612, Math.max(92, peakPoint.x - 30))}
                y={Math.max(47, peakPoint.y - 47)}
                fill="#0f172a"
                fontSize="12"
                fontWeight="600"
              >
                {peakPoint.label}
              </text>
              <circle
                cx={Math.min(614, Math.max(94, peakPoint.x - 28))}
                cy={Math.max(65, peakPoint.y - 29)}
                r="4"
                fill="#4f46e5"
              />
              <text
                x={Math.min(624, Math.max(104, peakPoint.x - 18))}
                y={Math.max(69, peakPoint.y - 25)}
                fill="#475569"
                fontSize="12"
              >
                Leads: {peakPoint.count}
              </text>
            </g>
          ) : null}
          {coordinates.map((point) => (
            <text key={`${point.label}-axis`} x={point.x - 20} y="246" fill="#64748b" fontSize="12">
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
