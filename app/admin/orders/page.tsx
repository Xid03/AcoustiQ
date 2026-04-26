import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTable } from "@/components/admin/orders-table";
import { getOrders } from "@/lib/services/admin-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Track checkout status, payments, and fulfillment progress.
          </p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </AdminShell>
  );
}
