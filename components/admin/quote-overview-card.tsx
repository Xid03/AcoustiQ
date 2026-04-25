import Link from "next/link";
import { ArrowRight } from "lucide-react";

const metrics = [
  ["Draft", "12"],
  ["Sent", "42"],
  ["Viewed", "18"],
  ["Accepted", "8"]
];

export function QuoteOverviewCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Quotes Overview
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-5">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900">
              {value}
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
