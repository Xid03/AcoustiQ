import { ChevronDown, Plus, Search, Upload } from "lucide-react";

import { ProductEditorPanel } from "@/components/admin/product-editor-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductsToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_220px_220px]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search products..." className="h-10 bg-white pl-9" />
        </label>

        {["All Categories", "All Status"].map((label) => (
          <label key={label} className="relative block">
            <span className="sr-only">{label}</span>
            <select
              defaultValue={label}
              className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>{label}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="gap-2 bg-white">
          <Upload className="h-4 w-4" />
          Import Products
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
  );
}
