import Link from "next/link";
import { ArrowRight } from "lucide-react";

type QuoteOverviewCardProps = {
  metrics: Array<{
    label: string;
    value: number;
  }>;
};

export function QuoteOverviewCard({ metrics }: QuoteOverviewCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Quotes Overview
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-5">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-xs text-slate-500">{metric.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/admin/leads"
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg text-sm font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        View all quotes
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
