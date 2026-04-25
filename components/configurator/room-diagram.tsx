export function RoomDiagram() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <svg
        viewBox="0 0 420 220"
        role="img"
        aria-label="Perspective room dimension diagram"
        className="h-full min-h-[180px] w-full"
      >
        <defs>
          <linearGradient id="roomSurface" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <rect width="420" height="220" rx="18" fill="#f8fafc" />
        <path
          d="M70 45h280v130H70z"
          fill="url(#roomSurface)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        <path d="M70 45l70 45h140l70-45" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M70 175l70-45h140l70 45" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M140 90v40M280 90v40" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M52 45v130" stroke="#6366f1" strokeWidth="2" />
        <path d="M45 45h14M45 175h14" stroke="#6366f1" strokeWidth="2" />
        <text x="24" y="115" fill="#4f46e5" fontSize="16" fontWeight="600">
          W
        </text>
        <path d="M70 194h280" stroke="#6366f1" strokeWidth="2" />
        <path d="M70 187v14M350 187v14" stroke="#6366f1" strokeWidth="2" />
        <text x="206" y="216" fill="#4f46e5" fontSize="16" fontWeight="600">
          L
        </text>
        <path d="M370 45v130" stroke="#a5b4fc" strokeDasharray="5 5" strokeWidth="2" />
        <text x="384" y="115" fill="#4f46e5" fontSize="16" fontWeight="600">
          H
        </text>
      </svg>
    </div>
  );
}
