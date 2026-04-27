import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: "indigo" | "emerald";
};

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  tone = "indigo"
}: MetricCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-tight tabular-nums text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={
            tone === "emerald"
              ? "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
              : "flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
          }
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-emerald-600">
        + {change} from last 7 days
      </p>
    </section>
  );
}
