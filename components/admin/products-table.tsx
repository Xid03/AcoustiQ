"use client";

import { Eye, MoreVertical, Pencil } from "lucide-react";
import Image from "next/image";

import { ProductEditorPanel } from "@/components/admin/product-editor-panel";
import { TablePagination } from "@/components/admin/table-pagination";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import type { ProductRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

function ProductThumbnail({
  imageUrl,
  name,
  type
}: {
  imageUrl: string | null;
  name: string;
  type: ProductRow["thumbnail_type"];
}) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} product image`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-cover"
        />
      ) : (
        <span
          className={cn(
            "h-10 w-10 rounded-md",
            type === "wood" &&
              "bg-[repeating-linear-gradient(90deg,#7c4f2c_0_3px,#c79b6d_3px_7px,#5b3d25_7px_9px)]",
            type === "oak" &&
              "bg-[repeating-linear-gradient(90deg,#b98c5b_0_5px,#dfc29d_5px_10px,#8a5f38_10px_12px)]",
            type === "cloud" &&
              "bg-[radial-gradient(circle_at_30%_35%,#fff_0_15%,transparent_16%),radial-gradient(circle_at_70%_35%,#e7e5e4_0_16%,transparent_17%),radial-gradient(circle_at_50%_70%,#d6d3d1_0_18%,transparent_19%)] bg-white",
            type === "baffle" &&
              "bg-gradient-to-br from-slate-900 via-slate-700 to-slate-950",
            type === "corner" &&
              "bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950",
            type === "bass" && "bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950"
          )}
        />
      )}
    </span>
  );
}

export function ProductsTable({
  products,
  totalProducts
}: {
  products: ProductRow[];
  totalProducts?: number;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              {["Product", "Category", "Price", "Unit", "Status", "Stock", "Actions"].map((header) => (
                <th
                  key={header}
                  className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
              <tr key={product.id} className="transition-colors duration-100 hover:bg-slate-50/50">
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <ProductThumbnail
                      imageUrl={product.image_url}
                      name={product.name}
                      type={product.thumbnail_type}
                    />
                    <span className="text-sm font-medium text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {product.category}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {product.unit_label}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <span
                    className={
                      product.status === "Active"
                        ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                        : "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                    }
                  >
                    {product.status}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {product.stock}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <ProductEditorPanel
                      product={product}
                      trigger={
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 min-h-8 w-8 border-slate-200 bg-white text-slate-500"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 min-h-8 w-8 border-slate-200 bg-white text-slate-500"
                      aria-label={`View ${product.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 min-h-8 w-8 border-slate-200 bg-white text-slate-500"
                      aria-label={`More actions for ${product.name}`}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-slate-100 px-4 py-12 text-center text-sm text-slate-500"
                >
                  No products match the current search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        label={`Showing ${products.length > 0 ? 1 : 0} to ${products.length} of ${
          totalProducts ?? products.length
        } products`}
        lastPage="1"
      />
    </section>
  );
}
