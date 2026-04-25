import { FileDown } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

const quoteItems = [
  {
    item: "Acoustic Wall Panel - Wave Wood",
    placement: "Side Walls",
    qty: "24 panels",
    unit: "$89.00",
    total: "$2,136.00"
  },
  {
    item: "Acoustic Ceiling Panel - Cloud 1200",
    placement: "Ceiling",
    qty: "8 panels",
    unit: "$119.00",
    total: "$952.00"
  },
  {
    item: "Bass Trap Corner - Pro Series",
    placement: "Corners",
    qty: "4 units",
    unit: "$99.00",
    total: "$396.00"
  }
];

export function QuotePreview() {
  return (
    <aside className="rounded-xl border border-slate-300 bg-slate-100 p-5 shadow-sm shadow-slate-200/70 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium tracking-tight text-slate-900">
          Your Quote Preview
        </h2>
        <Button variant="outline" className="h-10 min-h-10 gap-2 bg-white text-xs">
          <FileDown className="h-4 w-4 text-indigo-600" />
          PDF
        </Button>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <BrandLogo className="min-h-0" />
            <p className="mt-4 text-sm font-semibold tracking-tight text-slate-900">
              Acoustic Treatment Quote
            </p>
          </div>
          <div className="shrink-0 text-right text-xs leading-5 text-slate-500">
            <p>Quote #AQ-2024-0567</p>
            <p>May 20, 2024</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Prepared For:</p>
              <p className="mt-2 text-sm font-semibold text-indigo-700">John Doe</p>
              <p className="mt-1 text-sm text-slate-700">Acme Corporation</p>
              <p className="mt-1 text-sm text-slate-700">john.doe@acme.com</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Project Summary:</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Office</p>
              <p className="mt-1 text-sm font-mono tabular-nums text-slate-700">
                20 ft x 16 ft x 10 ft
              </p>
              <p className="mt-1 text-sm font-mono tabular-nums text-slate-700">
                320 sq ft • 3,200 cu ft
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Product
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Placement
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold text-slate-500">
                    Qty
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold text-slate-500">
                    Unit Price
                  </th>
                  <th className="border-b border-slate-200 px-3 py-3 text-right text-xs font-semibold text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {quoteItems.map((item) => (
                  <tr key={item.item}>
                    <td className="border-b border-slate-100 px-3 py-4 text-xs font-medium text-slate-700">
                      {item.item}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-700">
                      {item.placement}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs tabular-nums text-slate-700">
                      {item.qty}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs tabular-nums text-slate-900">
                      {item.unit}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs font-semibold tabular-nums text-slate-900">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dl className="ml-auto mt-5 max-w-[260px] space-y-3">
          {[
            ["Subtotal", "$3,484.00"],
            ["Shipping", "$100.00"],
            ["Tax (10%)", "$346.40"]
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-sm text-slate-600">{label}</dt>
              <dd className="font-mono text-sm tabular-nums text-slate-900">
                {value}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-4">
            <dt className="text-base font-semibold tracking-tight text-slate-900">
              Total
            </dt>
            <dd className="font-mono text-xl font-semibold tabular-nums text-slate-900">
              $4,030.40
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm font-semibold tracking-tight text-slate-900">
            Thank you for choosing AcoustiQ.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            We&apos;ll get back to you shortly!
          </p>
        </div>
      </div>
    </aside>
  );
}
