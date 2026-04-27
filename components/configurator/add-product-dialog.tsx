"use client";

import Image from "next/image";
import { Check, PackagePlus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import type { QuoteItem } from "@/lib/stores/configurator-store";
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
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} product image`}
          width={48}
          height={48}
          className="h-full w-full object-cover"
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

function quantityLabelFromUnit(unitLabel: string) {
  const normalized = unitLabel.toLowerCase();

  if (normalized.includes("panel")) {
    return "panels";
  }

  if (normalized.includes("unit")) {
    return "units";
  }

  return unitLabel.replace(/^per\s+/i, "") || unitLabel;
}

function splitProductName(name: string, category: string) {
  const [productName, ...variantParts] = name.split(" - ");

  return {
    productName: productName.trim(),
    variant: variantParts.join(" - ").trim() || category
  };
}

function createQuoteItemFromProduct(product: ProductRow): QuoteItem {
  const { productName, variant } = splitProductName(product.name, product.category);

  return {
    id: product.id,
    productName,
    variant,
    placement: product.category,
    placementNote: "Added by customer",
    quantity: 1,
    unitLabel: quantityLabelFromUnit(product.unit_label),
    unitPrice: Number(product.price),
    thumbnail: product.thumbnail_type,
    imageUrl: product.image_url
  };
}

type AddProductDialogProps = {
  onAddProduct: (product: QuoteItem) => void;
  products: ProductRow[];
  selectedProductIds: string[];
};

export function AddProductDialog({
  onAddProduct,
  products,
  selectedProductIds
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "Active"),
    [products]
  );

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(new Set(activeProducts.map((product) => product.category)))
    ],
    [activeProducts]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activeProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.category, product.unit_label]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeProducts, query, selectedCategory]);

  function addProduct(product: ProductRow) {
    onAddProduct(createQuoteItemFromProduct(product));
    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId(null), 1600);
  }

  return (
    <>
      <Button type="button" variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <PackagePlus className="h-4 w-4 text-indigo-600" />
        Add Product
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-md">
          <div className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Add Product
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Choose extra active catalog products to include in this quote.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close add product dialog"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-3 border-b border-slate-100 px-6 py-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  placeholder="Search products..."
                  className="pl-10"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <select
                value={selectedCategory}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                aria-label="Filter products by category"
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              {filteredProducts.length > 0 ? (
                <div className="grid gap-3">
                  {filteredProducts.map((product) => {
                    const alreadySelected = selectedProductIds.includes(product.id);
                    const justAdded = addedProductId === product.id;

                    return (
                      <div
                        key={product.id}
                        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-150 hover:border-indigo-200 hover:bg-slate-50 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <ProductThumbnail
                            imageUrl={product.image_url}
                            name={product.name}
                            type={product.thumbnail_type}
                          />
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                              {product.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                              <span>{product.category}</span>
                              <span className="font-mono tabular-nums text-slate-700">
                                {formatCurrency(product.price)}
                              </span>
                              <span>{product.unit_label}</span>
                              <span>{product.stock.toLocaleString()} in stock</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant={justAdded ? "secondary" : alreadySelected ? "outline" : "default"}
                          className="gap-2"
                          onClick={() => addProduct(product)}
                        >
                          {justAdded ? (
                            <>
                              <Check className="h-4 w-4 text-emerald-600" />
                              Added
                            </>
                          ) : alreadySelected ? (
                            "Add One More"
                          ) : (
                            "Add to Quote"
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <PackagePlus className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 text-sm font-medium text-slate-700">
                    No active products found.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search or activate products in the admin catalog.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
