import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductsToolbar } from "@/components/admin/products-toolbar";
import { getProducts } from "@/lib/services/quote-service";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

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
        <ProductsTable products={products} />
      </div>
    </AdminShell>
  );
}
