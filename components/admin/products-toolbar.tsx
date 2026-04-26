"use client";

import { ChevronDown, Plus, Search, Upload } from "lucide-react";

import { ProductEditorPanel } from "@/components/admin/product-editor-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductsToolbarProps = {
  categories: string[];
  category: string;
  importError: string | null;
  isImporting: boolean;
  query: string;
  status: string;
  onCategoryChange: (category: string) => void;
  onImport: (file: File) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: string) => void;
};

export function ProductsToolbar({
  categories,
  category,
  importError,
  isImporting,
  query,
  status,
  onCategoryChange,
  onImport,
  onQueryChange,
  onStatusChange
}: ProductsToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_220px_220px]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              placeholder="Search products..."
              className="h-10 bg-white pl-9"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option>All Categories</option>
              {categories.map((categoryOption) => (
                <option key={categoryOption}>{categoryOption}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            variant="outline"
            className="gap-2 bg-white"
            disabled={isImporting}
          >
            <label>
              <Upload className="h-4 w-4" />
              {isImporting ? "Importing..." : "Import Products"}
              <input
                type="file"
                accept=".csv,.json,application/json,text/csv"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onImport(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </Button>
          <ProductEditorPanel
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            }
          />
        </div>
      </div>
      {importError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {importError}
        </p>
      ) : null}
    </div>
  );
}
