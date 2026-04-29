"use client";

import { FileDown } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { useBrandSettings } from "@/lib/hooks/use-brand-settings";
import {
  calculateFloorArea,
  calculateProductQuantities,
  calculateQuoteTotals,
  calculateVolume,
  formatCurrency
} from "@/lib/calculations/acoustic-calculations";
import {
  defaultRoomDetails,
  useConfiguratorStore
} from "@/lib/stores/configurator-store";
import { generateQuotePdf } from "@/lib/pdf/generate-quote-pdf";

export function QuotePreview() {
  const brandSettings = useBrandSettings();
  const roomDetails =
    useConfiguratorStore((state) => state.roomDetails) ?? defaultRoomDetails;
  const storedProducts = useConfiguratorStore((state) => state.selectedProducts);
  const hasProductSelection = useConfiguratorStore((state) => state.hasProductSelection);
  const leadDetails = useConfiguratorStore((state) => state.leadDetails);
  const quoteItems =
    hasProductSelection
      ? storedProducts
      : calculateProductQuantities(roomDetails);
  const totals = calculateQuoteTotals(quoteItems);
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const volume = calculateVolume(
    roomDetails.length,
    roomDetails.width,
    roomDetails.height
  );
  const previewQuoteNumber = `${brandSettings.quote_prefix}-${new Date().getFullYear()}-0567`;

  return (
    <aside className="rounded-xl border border-slate-300 bg-slate-100 p-5 shadow-sm shadow-slate-200/70 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium tracking-tight text-slate-900">
          Your Quote Preview
        </h2>
        <Button
          variant="outline"
          className="h-10 min-h-10 gap-2 bg-white text-xs"
          onClick={() => {
            void generateQuotePdf({
              leadDetails,
              quoteItems,
              roomDetails,
              totals,
              brandSettings,
              quoteNumber: previewQuoteNumber
            });
          }}
        >
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
            <p>Quote #{previewQuoteNumber}</p>
            <p>{new Date().toLocaleDateString("en-US")}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Prepared For:</p>
              <p
                className="mt-2 text-sm font-semibold"
                style={{ color: brandSettings.primary_color }}
              >
                {leadDetails?.fullName || "Yazid Zaqwan"}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {leadDetails?.companyName || "QFlow Sdn. Bhd."}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {leadDetails?.email || "yazid.zaqwan@example.com"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Project Summary:</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {roomDetails.roomType}
              </p>
              <p className="mt-1 text-sm font-mono tabular-nums text-slate-700">
                {roomDetails.length} ft x {roomDetails.width} ft x{" "}
                {roomDetails.height} ft
              </p>
              <p className="mt-1 text-sm font-mono tabular-nums text-slate-700">
                {floorArea.toLocaleString()} sq ft - {volume.toLocaleString()} cu ft
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
                  <tr key={item.id}>
                    <td className="border-b border-slate-100 px-3 py-4 text-xs font-medium text-slate-700">
                      {item.productName} - {item.variant}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-xs text-slate-700">
                      {item.placement}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs tabular-nums text-slate-700">
                      {item.quantity} {item.unitLabel}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs tabular-nums text-slate-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-4 text-right font-mono text-xs font-semibold tabular-nums text-slate-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dl className="ml-auto mt-5 max-w-[260px] space-y-3">
          {[
            ["Subtotal", formatCurrency(totals.subtotal)],
            ["Shipping", formatCurrency(totals.shipping)],
            ["Tax (10%)", formatCurrency(totals.tax)]
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
              {formatCurrency(totals.total)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm font-semibold tracking-tight text-slate-900">
            Thank you for choosing {brandSettings.brand_name}.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            We&apos;ll get back to you shortly!
          </p>
        </div>
      </div>
    </aside>
  );
}
