"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Mail, MoreVertical, ShoppingCart, Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TablePagination } from "@/components/admin/table-pagination";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import type { LeadRow, LeadWithQuote } from "@/lib/supabase/types";

const statusClasses: Record<string, string> = {
  New: "bg-indigo-100 text-indigo-800",
  Contacted: "bg-amber-100 text-amber-800",
  "Quote Sent": "bg-purple-100 text-purple-800",
  Viewed: "bg-emerald-100 text-emerald-800",
  Declined: "bg-red-100 text-red-800"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

type LeadsTableProps = {
  currentPage: number;
  firstVisible: number;
  lastVisible: number;
  leads: LeadWithQuote[];
  totalFilteredLeads: number;
  totalPages: number;
  onCreateOrder: (lead: LeadWithQuote) => Promise<void>;
  onDeleteLead: (leadId: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onStatusChange: (leadId: string, status: LeadRow["status"]) => Promise<void>;
};

function LeadActions({
  lead,
  onCreateOrder,
  onDeleteLead,
  onStatusChange
}: {
  lead: LeadWithQuote;
  onCreateOrder: (lead: LeadWithQuote) => Promise<void>;
  onDeleteLead: (leadId: string) => Promise<void>;
  onStatusChange: (leadId: string, status: LeadRow["status"]) => Promise<void>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <div ref={menuRef} className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 min-h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label={`Open actions for ${lead.company_name || lead.full_name}`}
          onClick={() => setOpen((currentOpen) => !currentOpen)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {open ? (
          <div className="absolute right-0 top-9 z-30 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/80">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              onClick={() => {
                void navigator.clipboard.writeText(lead.id);
                setOpen(false);
              }}
            >
              <Copy className="h-4 w-4 text-slate-400" />
              Copy Lead ID
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              onClick={() => {
                void navigator.clipboard.writeText(lead.email);
                setOpen(false);
              }}
            >
              <Mail className="h-4 w-4 text-slate-400" />
              Copy Email
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!lead.quote_id || !lead.quote_value}
              onClick={() => {
                void onCreateOrder(lead);
                setOpen(false);
              }}
            >
              <ShoppingCart className="h-4 w-4 text-slate-400" />
              Create Order
            </button>
            <label className="block px-3 py-2">
              <span className="text-xs font-medium text-slate-500">Update Status</span>
              <select
                value={lead.status}
                className="mt-2 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onChange={(event) => {
                  void onStatusChange(lead.id, event.target.value as LeadRow["status"]);
                  setOpen(false);
                }}
              >
                {["New", "Contacted", "Quote Sent", "Viewed", "Declined"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Lead
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Lead"
        description={`This will permanently delete ${lead.full_name}'s lead record${
          lead.quote_number ? ` and linked quote ${lead.quote_number}` : ""
        }. This action cannot be undone.`}
        actionLabel="Delete Lead"
        isLoading={isDeleting}
        onOpenChange={setConfirmOpen}
        onConfirm={async () => {
          setIsDeleting(true);
          await onDeleteLead(lead.id);
          setIsDeleting(false);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}

export function LeadsTable({
  currentPage,
  firstVisible,
  lastVisible,
  leads,
  totalFilteredLeads,
  totalPages,
  onCreateOrder,
  onDeleteLead,
  onPageChange,
  onStatusChange
}: LeadsTableProps) {
  const paginationLabel =
    totalFilteredLeads === 0
      ? "Showing 0 results"
      : `Showing ${firstVisible} to ${lastVisible} of ${totalFilteredLeads} results`;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="border-b border-slate-200 px-4 py-3 text-left">
                <Checkbox aria-label="Select all leads" />
              </th>
              {[
                "Company",
                "Contact",
                "Email",
                "Project Type",
                "Source",
                "Status",
                "Quote Value",
                "Date",
                "Actions"
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
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors duration-100 hover:bg-slate-50/50"
                >
                  <td className="border-b border-slate-100 px-4 py-3.5">
                    <Checkbox aria-label={`Select ${lead.company_name || lead.full_name}`} />
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm font-medium text-slate-900">
                    {lead.company_name || "-"}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                    {lead.full_name}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                    {lead.email}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                    {lead.project_type}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700">
                    {lead.source}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm font-medium tabular-nums text-slate-900">
                    {lead.quote_value ? formatCurrency(lead.quote_value) : "-"}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-sm tabular-nums text-slate-700">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5">
                    <LeadActions
                      lead={lead}
                      onCreateOrder={onCreateOrder}
                      onDeleteLead={onDeleteLead}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="border-b border-slate-100 px-4 py-12 text-center text-sm text-slate-500"
                >
                  No leads match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={currentPage}
        label={paginationLabel}
        lastPage={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
