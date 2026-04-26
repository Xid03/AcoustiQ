import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import type { OrderRow } from "@/lib/supabase/types";

const paymentClasses: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Paid: "bg-emerald-100 text-emerald-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-slate-100 text-slate-700"
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              {[
                "Customer",
                "Email",
                "Total",
                "Payment",
                "Fulfillment",
                "Date"
              ].map((header) => (
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
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors duration-100 hover:bg-slate-50/50">
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm font-medium text-slate-900">
                  {order.customer_name}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {order.customer_email}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentClasses[order.payment_status]}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                  {order.fulfillment_status}
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm tabular-nums text-slate-700">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(order.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
