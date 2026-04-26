"use client";

import { useMemo, useState } from "react";

import { ProductsTable } from "@/components/admin/products-table";
import { ProductsToolbar } from "@/components/admin/products-toolbar";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { ProductRow } from "@/lib/supabase/types";

type ImportedProduct = {
  name: string;
  category: string;
  price: number;
  unit_label: string;
  status: "Active" | "Inactive";
  stock: number;
  thumbnail_type: ProductRow["thumbnail_type"];
  image_url: string | null;
};

function normalizeStatus(value: string | undefined): "Active" | "Inactive" {
  return value?.toLowerCase() === "inactive" ? "Inactive" : "Active";
}

function normalizeThumbnail(value: string | undefined): ProductRow["thumbnail_type"] {
  const thumbnails = ["wood", "oak", "cloud", "baffle", "corner", "bass"] as const;
  return thumbnails.find((thumbnail) => thumbnail === value) || "wood";
}

function parsePrice(value: string | number | undefined) {
  const normalized = String(value || "0").replace(/[^\d.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsv(text: string): ImportedProduct[] {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());

  return rows
    .map((row) => {
      const values = row.split(",").map((value) => value.trim());
      const record = Object.fromEntries(
        headers.map((header, index) => [header, values[index] || ""])
      );

      return {
        name: record.name,
        category: record.category || "Wall Panels",
        price: parsePrice(record.price),
        unit_label: record.unit_label || "per panel",
        status: normalizeStatus(record.status),
        stock: Number(record.stock || 0),
        thumbnail_type: normalizeThumbnail(record.thumbnail_type),
        image_url: record.image_url || null
      };
    })
    .filter((product) => product.name);
}

function parseJson(text: string): ImportedProduct[] {
  const parsed = JSON.parse(text) as Array<Record<string, string | number | null>>;

  return parsed
    .map((record) => ({
      name: String(record.name || ""),
      category: String(record.category || "Wall Panels"),
      price: parsePrice(record.price || 0),
      unit_label: String(record.unit_label || "per panel"),
      status: normalizeStatus(String(record.status || "Active")),
      stock: Number(record.stock || 0),
      thumbnail_type: normalizeThumbnail(String(record.thumbnail_type || "wood")),
      image_url: record.image_url ? String(record.image_url) : null
    }))
    .filter((product) => product.name);
}

export function ProductCatalogClient({ products }: { products: ProductRow[] }) {
  const [catalogProducts, setCatalogProducts] = useState(products);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = useMemo(
    () =>
      Array.from(new Set(catalogProducts.map((product) => product.category))).sort(),
    [catalogProducts]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return catalogProducts.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.unit_label.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        category === "All Categories" || product.category === category;
      const matchesStatus = status === "All Status" || product.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [catalogProducts, category, query, status]);

  async function handleImport(file: File) {
    setIsImporting(true);
    setImportError(null);

    try {
      const supabase = createSupabaseClient();

      if (!supabase) {
        throw new Error("Supabase is not configured. Check .env.local.");
      }

      const text = await file.text();
      const importedProducts = file.name.toLowerCase().endsWith(".json")
        ? parseJson(text)
        : parseCsv(text);

      if (importedProducts.length === 0) {
        throw new Error("No valid products found in the selected file.");
      }

      const { error } = await supabase.from("products").upsert(
        importedProducts.map((product) => ({
          company_id: null,
          ...product
        })),
        { onConflict: "name" }
      );

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage(`${importedProducts.length} products imported successfully.`);
      setSuccessDialogOpen(true);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unable to import products."
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      <ProductsToolbar
        categories={categories}
        category={category}
        importError={importError}
        isImporting={isImporting}
        query={query}
        status={status}
        onCategoryChange={setCategory}
        onImport={handleImport}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />
      <ProductsTable
        products={filteredProducts}
        totalProducts={catalogProducts.length}
        onProductDeleted={(productId) =>
          setCatalogProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== productId)
          )
        }
      />
      <SuccessDialog
        open={successDialogOpen}
        title="Products Imported"
        message={successMessage}
        actionLabel="Refresh Catalog"
        onAction={() => window.location.reload()}
        onOpenChange={setSuccessDialogOpen}
      />
    </>
  );
}
