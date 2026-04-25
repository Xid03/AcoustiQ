"use client";

import type { ReactNode } from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
};

export function ProductEditorPanel({ trigger }: ProductEditorPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pr-8">
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>
            Create or edit product catalog details for configurator quotes.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Product Name", "Acoustic Wall Panel - Wave Wood"],
              ["Category", "Wall Panels"],
              ["Unit Price", "$89.00"],
              ["Unit Label", "per panel"],
              ["Stock Quantity", "152"],
              ["Status", "Active"]
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <Input defaultValue={value} className="mt-2 bg-white" />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Short Description
            </span>
            <Textarea
              defaultValue="Premium acoustic treatment panel with refined wood slat finish."
              className="mt-2"
            />
          </label>

          <div>
            <span className="text-sm font-medium text-slate-700">Image Upload</span>
            <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Drop product image here or browse
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG, or WebP up to 5MB
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold tracking-tight text-slate-800">
              Pricing Editor
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                ["Base Price", "$89.00"],
                ["Bulk Threshold", "24"],
                ["Bulk Discount %", "8"]
              ].map(([label, value]) => (
                <label key={label} className="block">
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                  <Input
                    defaultValue={value}
                    className="mt-2 bg-white font-mono tabular-nums"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-700">
              <Checkbox defaultChecked aria-label="Installation eligible" />
              Installation Eligible
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button variant="outline" className="bg-white">
              Cancel
            </Button>
            <Button>Save Product</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
