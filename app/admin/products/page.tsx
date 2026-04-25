import { unstable_noStore as noStore } from "next/cache";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductsToolbar } from "@/components/admin/products-toolbar";
import { getProductsDataSource } from "@/lib/services/quote-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  noStore();

  const { products, source } = await getProductsDataSource();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Product Catalog
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage your acoustic products, pricing, and inventory.
          </p>
        </div>

        <ProductsToolbar />
        <div
          className={
            source === "supabase"
              ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              : "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700"
          }
        >
          Data source: {source === "supabase" ? "Supabase" : "Fallback demo data"}
        </div>
        <ProductsTable products={products} />
      </div>
    </AdminShell>
  );
}
