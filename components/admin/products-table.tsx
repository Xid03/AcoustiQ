"use client";

import { Copy, ExternalLink, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ProductEditorPanel } from "@/components/admin/product-editor-panel";
import { TablePagination } from "@/components/admin/table-pagination";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import { createSupabaseClient } from "@/lib/supabase/client";
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

function ProductDetailsPanel({ product }: { product: ProductRow }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 min-h-8 w-8 border-slate-200 bg-white text-slate-500"
          aria-label={`View ${product.name}`}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pr-8">
          <SheetTitle>Product Details</SheetTitle>
          <SheetDescription>
            Review catalog information and image status for this product.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <ProductThumbnail
              imageUrl={product.image_url}
              name={product.name}
              type={product.thumbnail_type}
            />
            <div className="min-w-0">
              <h3 className="truncate text-lg font-medium tracking-tight text-slate-900">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Price", formatCurrency(product.price)],
              ["Unit", product.unit_label],
              ["Status", product.status],
              ["Stock", product.stock.toLocaleString()],
              ["Fallback", product.thumbnail_type],
              ["Product ID", product.id]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </dt>
                <dd className="mt-2 break-words text-sm font-medium text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Image URL
            </p>
            <p className="mt-2 break-all text-sm text-slate-700">
              {product.image_url || "No image URL saved. Showing fallback thumbnail."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProductMoreActions({
  product,
  onDeleted
}: {
  product: ProductRow;
  onDeleted?: (productId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function copyToClipboard(value: string, message: string) {
    await navigator.clipboard.writeText(value);
    setSuccessMessage(message);
    setSuccessDialogOpen(true);
    setOpen(false);
  }

  async function deleteProduct() {
    setIsDeleting(true);
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsDeleting(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .select("id");

    if (error) {
      setErrorMessage(error.message);
      setIsDeleting(false);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMessage(
        "Product was not deleted in Supabase. Run the delete policy SQL and try again."
      );
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    onDeleted?.(product.id);
    setSuccessMessage("Product deleted successfully. Refreshing catalog...");
    setSuccessDialogOpen(true);
  }

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="outline"
        size="icon"
        className="h-8 min-h-8 w-8 border-slate-200 bg-white text-slate-500"
        aria-expanded={open}
        aria-label={`More actions for ${product.name}`}
        onClick={() => setOpen((current) => !current)}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/70">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900"
            onClick={() => copyToClipboard(product.id, "Product ID copied.")}
          >
            <Copy className="h-4 w-4 text-slate-400" />
            Copy Product ID
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!product.image_url}
            onClick={() =>
              product.image_url
                ? copyToClipboard(product.image_url, "Image URL copied.")
                : undefined
            }
          >
            <ExternalLink className="h-4 w-4 text-slate-400" />
            Copy Image URL
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Product
          </button>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="absolute right-0 top-10 z-30 w-64 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 shadow-lg">
          {errorMessage}
        </p>
      ) : null}

      <SuccessDialog
        open={successDialogOpen}
        title="Action Complete"
        message={successMessage}
        actionLabel="Done"
        onOpenChange={setSuccessDialogOpen}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        actionLabel="Delete Product"
        isLoading={isDeleting}
        onConfirm={deleteProduct}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}

export function ProductsTable({
  onProductDeleted,
  products,
  totalProducts
}: {
  onProductDeleted?: (productId: string) => void;
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
                    <ProductDetailsPanel product={product} />
                    <ProductMoreActions
                      product={product}
                      onDeleted={onProductDeleted}
                    />
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
