"use client";

import { useState } from "react";

import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { OrderRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PaymentStatus = OrderRow["payment_status"];
type FulfillmentStatus = OrderRow["fulfillment_status"];

const paymentClasses: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Paid: "bg-emerald-100 text-emerald-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-slate-100 text-slate-700"
};

const fulfillmentClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Processing: "bg-sky-100 text-sky-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800"
};

const paymentStatuses: PaymentStatus[] = ["Pending", "Paid", "Failed", "Refunded"];
const fulfillmentStatuses: FulfillmentStatus[] = [
  "New",
  "Processing",
  "Completed",
  "Cancelled"
];

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [orderRows, setOrderRows] = useState(orders);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  async function updateOrderStatus(
    orderId: string,
    field: "payment_status" | "fulfillment_status",
    value: PaymentStatus | FulfillmentStatus
  ) {
    const previousRows = orderRows;
    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      return;
    }

    setErrorMessage(null);
    setSavingOrderId(orderId);
    setOrderRows((currentRows) =>
      currentRows.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );

    const updatePayload =
      field === "payment_status"
        ? { payment_status: value as PaymentStatus }
        : { fulfillment_status: value as FulfillmentStatus };

    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId);

    setSavingOrderId(null);

    if (error) {
      setOrderRows(previousRows);
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(
      field === "payment_status"
        ? `Payment status updated to ${value}.`
        : `Fulfillment status updated to ${value}.`
    );
    setSuccessOpen(true);
  }

  return (
    <>
      <div className="space-y-4">
        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0">
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
                {orderRows.length > 0 ? (
                  orderRows.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors duration-100 hover:bg-slate-50/50"
                    >
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
                        <select
                          value={order.payment_status}
                          disabled={savingOrderId === order.id}
                          aria-label={`Payment status for ${order.customer_name}`}
                          className={cn(
                            "h-9 min-w-32 rounded-full border-0 px-3 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60",
                            paymentClasses[order.payment_status]
                          )}
                          onChange={(event) =>
                            void updateOrderStatus(
                              order.id,
                              "payment_status",
                              event.target.value as PaymentStatus
                            )
                          }
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5">
                        <select
                          value={order.fulfillment_status}
                          disabled={savingOrderId === order.id}
                          aria-label={`Fulfillment status for ${order.customer_name}`}
                          className={cn(
                            "h-9 min-w-36 rounded-full border-0 px-3 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60",
                            fulfillmentClasses[order.fulfillment_status]
                          )}
                          onChange={(event) =>
                            void updateOrderStatus(
                              order.id,
                              "fulfillment_status",
                              event.target.value as FulfillmentStatus
                            )
                          }
                        >
                          {fulfillmentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm tabular-nums text-slate-700">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }).format(new Date(order.created_at))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border-b border-slate-100 px-4 py-12 text-center text-sm text-slate-500"
                    >
                      No orders created yet. Create an order from a quoted lead first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <SuccessDialog
        open={successOpen}
        title="Order Updated"
        message={successMessage}
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
