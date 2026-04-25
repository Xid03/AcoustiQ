import Link from "next/link";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const totals = [
  ["Subtotal", "$3,484.00"],
  ["Shipping", "$100.00"],
  ["Tax (10%)", "$346.40"]
];

export function QuoteSummaryCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Quote Summary
      </h2>
      <dl className="mt-5 space-y-4">
        {totals.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-sm text-slate-600">{label}</dt>
            <dd className="font-mono text-sm font-medium tabular-nums text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm font-semibold text-slate-800">Total</span>
          <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
            $4,030.40
          </span>
        </div>
        <p className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-center text-xs font-medium text-emerald-700">
          This is an estimated quote.
        </p>
      </div>
      <div className="mt-5 grid gap-3">
        <Button asChild>
          <Link href="/quote">Save & Get Quote</Link>
        </Button>
        <Button variant="outline" className="gap-2 bg-white">
          <FileDown className="h-4 w-4 text-indigo-600" />
          Download PDF (Preview)
        </Button>
      </div>
    </section>
  );
}
