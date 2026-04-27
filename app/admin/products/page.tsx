import { unstable_noStore as noStore } from "next/cache";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProductCatalogClient } from "@/components/admin/product-catalog-client";
import { getAdminProducts } from "@/lib/services/admin-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  noStore();

  const products = await getAdminProducts();

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

        <ProductCatalogClient products={products} />
      </div>
    </AdminShell>
  );
}
