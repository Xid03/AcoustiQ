"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ImagePlus, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SuccessDialog } from "@/components/ui/success-dialog";
import type { ProductRow } from "@/lib/supabase/types";
import { createSupabaseClient } from "@/lib/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type ProductEditorPanelProps = {
  trigger: ReactNode;
  product?: ProductRow;
};

function parseMoneyInput(value: string | number) {
  const normalized = String(value).replace(/[^\d.]/g, "");
  const [whole = "0", ...decimalParts] = normalized.split(".");
  const parsed = Number(
    decimalParts.length > 0 ? `${whole}.${decimalParts.join("")}` : whole
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoneyInput(value: string | number) {
  const parsed = parseMoneyInput(value);

  return parsed > 0 ? `RM${parsed.toFixed(2)}` : "";
}

export function ProductEditorPanel({ trigger, product }: ProductEditorPanelProps) {
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(
    product ? formatMoneyInput(product.price) : ""
  );
  const [basePrice, setBasePrice] = useState(
    product ? formatMoneyInput(product.price) : ""
  );
  const [stockQuantity, setStockQuantity] = useState(product?.stock || 0);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditing = Boolean(product);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setUnitPrice(product ? formatMoneyInput(product.price) : "");
      setBasePrice(product ? formatMoneyInput(product.price) : "");
      setStockQuantity(product?.stock || 0);
      setStatusMessage(null);
      setErrorMessage(null);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseClient();

      if (!supabase) {
        throw new Error("Supabase is not configured. Check .env.local and restart the dev server.");
      }

      const imageFile = formData.get("image") as File | null;
      let imageUrl: string | null = null;

      if (imageFile && imageFile.size > 0) {
        const extension = imageFile.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const productPayload = {
        company_id: null,
        name: String(formData.get("name") || "Untitled Product"),
        category: String(formData.get("category") || "Wall Panels"),
        price: parseMoneyInput(String(formData.get("price") || "0")),
        unit_label: String(formData.get("unit_label") || "per panel"),
        status: String(formData.get("status") || "Active") as "Active" | "Inactive",
        stock: Number(formData.get("stock") || 0),
        thumbnail_type: String(
          formData.get("thumbnail_type") || product?.thumbnail_type || "wood"
        ) as ProductRow["thumbnail_type"],
        image_url: imageUrl || product?.image_url || null
      };

      const { error } = product
        ? await supabase.from("products").update(productPayload).eq("id", product.id)
        : await supabase.from("products").insert(productPayload);

      if (error) {
        throw new Error(error.message);
      }

      setStatusMessage(
        isEditing
          ? "Product updated successfully. Refreshing catalog..."
          : "Product created successfully. Refreshing catalog..."
      );
      setSuccessDialogOpen(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save product."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pr-8">
          <SheetTitle>{isEditing ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update product catalog details, pricing, and image assets."
              : "Create product catalog details for configurator quotes."}
          </SheetDescription>
        </SheetHeader>

        <form action={handleSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Product Name</span>
              <Input
                name="name"
                defaultValue={product?.name || ""}
                placeholder="Acoustic Wall Panel - Wave Wood"
                className="mt-2 bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <Input
                name="category"
                defaultValue={product?.category || ""}
                placeholder="Wall Panels"
                className="mt-2 bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Unit Price</span>
              <Input
                name="price"
                value={unitPrice}
                inputMode="decimal"
                placeholder="RM89.00"
                className="mt-2 bg-white font-mono tabular-nums"
                onChange={(event) => setUnitPrice(event.target.value)}
                onBlur={() => setUnitPrice((value) => formatMoneyInput(value))}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Unit Label</span>
              <Input
                name="unit_label"
                defaultValue={product?.unit_label || ""}
                placeholder="per panel"
                className="mt-2 bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Stock Quantity</span>
              <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 min-h-10 rounded-none border-r border-slate-200"
                  aria-label="Decrease stock quantity"
                  onClick={() =>
                    setStockQuantity((quantity) => Math.max(0, quantity - 1))
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  name="stock"
                  value={stockQuantity}
                  inputMode="numeric"
                  aria-label="Stock Quantity"
                  className="h-10 rounded-none border-0 bg-white text-center font-mono tabular-nums shadow-none focus-visible:ring-0"
                  onChange={(event) =>
                    setStockQuantity(
                      Math.max(0, Number(event.target.value.replace(/\D/g, "")) || 0)
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 min-h-10 rounded-none border-l border-slate-200"
                  aria-label="Increase stock quantity"
                  onClick={() => setStockQuantity((quantity) => quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <Input
                name="status"
                defaultValue={product?.status || ""}
                placeholder="Active"
                className="mt-2 bg-white"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Short Description
            </span>
            <Textarea
              defaultValue={
                product
                  ? "Premium acoustic treatment panel with refined wood slat finish."
                  : ""
              }
              placeholder="Premium acoustic treatment panel with refined wood slat finish."
              className="mt-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Thumbnail Fallback
            </span>
            <select
              name="thumbnail_type"
              defaultValue={product?.thumbnail_type || ""}
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="" disabled>
                Select fallback style
              </option>
              {["wood", "oak", "cloud", "baffle", "corner", "bass"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-medium text-slate-700">Image Upload</span>
            <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Drop product image here or browse
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG, or WebP up to 5MB. Leave empty to keep the current image.
              </p>
              {product?.image_url ? (
                <p className="mt-2 truncate text-xs font-medium text-slate-500">
                  Current image saved
                </p>
              ) : null}
              <Input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-4 cursor-pointer bg-white"
              />
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold tracking-tight text-slate-800">
              Pricing Editor
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                ["Base Price", product ? String(product.price) : "", "RM89.00"],
                ["Bulk Threshold", "", "24"],
                ["Bulk Discount %", "", "8"]
              ].map(([label, value, placeholder]) => (
                <label key={label} className="block">
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                  {label === "Base Price" ? (
                    <Input
                      value={basePrice}
                      inputMode="decimal"
                      placeholder={placeholder}
                      className="mt-2 bg-white font-mono tabular-nums"
                      onChange={(event) => setBasePrice(event.target.value)}
                      onBlur={() =>
                        setBasePrice((value) => formatMoneyInput(value))
                      }
                    />
                  ) : (
                    <Input
                      defaultValue={value}
                      placeholder={placeholder}
                      className="mt-2 bg-white font-mono tabular-nums"
                    />
                  )}
                </label>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-700">
              <Checkbox defaultChecked aria-label="Installation eligible" />
              Installation Eligible
            </label>
          </section>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="bg-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? isEditing
                  ? "Updating Product..."
                  : "Saving Product..."
                : isEditing
                  ? "Update Product"
                  : "Save Product"}
            </Button>
          </div>
        </form>
        <SuccessDialog
          open={successDialogOpen}
          title={isEditing ? "Product Updated" : "Product Created"}
          message={
            statusMessage ||
            (isEditing
              ? "Product updated successfully."
              : "Product created successfully.")
          }
          actionLabel="View Catalog"
          onAction={() => window.location.reload()}
          onOpenChange={setSuccessDialogOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
