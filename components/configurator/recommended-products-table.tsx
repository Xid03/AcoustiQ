import { cn } from "@/lib/utils";

const products = [
  {
    name: "Acoustic Wall Panel",
    variant: "Wave Wood",
    placement: "Side Walls",
    placementNote: "(Left & Right)",
    quantity: "24 panels",
    note: "(12 each wall)",
    unitPrice: "$89.00",
    total: "$2,136.00",
    thumbnail: "wood"
  },
  {
    name: "Acoustic Ceiling Panel",
    variant: "Cloud 1200",
    placement: "Ceiling",
    placementNote: "",
    quantity: "8 panels",
    note: "",
    unitPrice: "$119.00",
    total: "$952.00",
    thumbnail: "cloud"
  },
  {
    name: "Bass Trap Corner",
    variant: "Pro Series",
    placement: "Corners",
    placementNote: "(4 corners)",
    quantity: "4 units",
    note: "",
    unitPrice: "$99.00",
    total: "$396.00",
    thumbnail: "bass"
  }
];

function ProductThumbnail({ type }: { type: string }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
      <span
        className={cn(
          "h-11 w-11 rounded-md",
          type === "wood" &&
            "bg-[repeating-linear-gradient(90deg,#9a6a3d_0_4px,#c79b6d_4px_8px,#5b3d25_8px_10px)]",
          type === "cloud" &&
            "bg-[radial-gradient(circle_at_30%_35%,#f8fafc_0_16%,transparent_17%),radial-gradient(circle_at_70%_35%,#e2e8f0_0_16%,transparent_17%),radial-gradient(circle_at_45%_70%,#d6d3d1_0_18%,transparent_19%)] bg-white",
          type === "bass" && "bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950"
        )}
      />
    </span>
  );
}

export function RecommendedProductsTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              {["Product", "Placement", "Quantity", "Unit Price", "Total"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.name}
                className="border-b border-slate-100 transition-colors duration-100 hover:bg-slate-50/50"
              >
                <td className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <ProductThumbnail type={product.thumbnail} />
                    <div>
                      <p className="text-sm font-semibold tracking-tight text-slate-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.variant}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                  {product.placement}
                  {product.placementNote ? (
                    <span className="block text-xs text-slate-500">
                      {product.placementNote}
                    </span>
                  ) : null}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                  <span className="font-mono tabular-nums">{product.quantity}</span>
                  {product.note ? (
                    <span className="block text-xs text-slate-500">{product.note}</span>
                  ) : null}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {product.unitPrice}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 font-mono text-sm font-semibold tabular-nums text-slate-900">
                  {product.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
