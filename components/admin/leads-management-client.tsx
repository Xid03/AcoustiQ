"use client";

import { useMemo, useState } from "react";

import { LeadsTable } from "@/components/admin/leads-table";
import { LeadsToolbar } from "@/components/admin/leads-toolbar";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { LeadRow, LeadWithQuote } from "@/lib/supabase/types";

const pageSize = 8;

type LeadStatus = LeadRow["status"];

type LeadFormInput = {
  companyName: string;
  email: string;
  fullName: string;
  phone: string;
  projectName: string;
  projectType: string;
  source: string;
  status: LeadStatus;
};

function createRecordId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) =>
    (
      Number(character) ^
      ((Math.random() * 16) >> (Number(character) / 4))
    ).toString(16)
  );
}

function toDateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function downloadCsv(filename: string, rows: LeadWithQuote[]) {
  const headers = [
    "Company",
    "Contact",
    "Email",
    "Project Type",
    "Source",
    "Status",
    "Quote Value",
    "Date"
  ];
  const csvRows = rows.map((lead) =>
    [
      lead.company_name || "",
      lead.full_name,
      lead.email,
      lead.project_type,
      lead.source,
      lead.status,
      lead.quote_value ?? "",
      lead.created_at
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function LeadsManagementClient({ leads }: { leads: LeadWithQuote[] }) {
  const [leadRows, setLeadRows] = useState(leads);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [source, setSource] = useState("All Sources");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const statuses = useMemo(
    () => Array.from(new Set(leadRows.map((lead) => lead.status))).sort(),
    [leadRows]
  );
  const sources = useMemo(
    () => Array.from(new Set(leadRows.map((lead) => lead.source))).sort(),
    [leadRows]
  );

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leadRows.filter((lead) => {
      const createdDate = toDateKey(lead.created_at);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        lead.full_name.toLowerCase().includes(normalizedQuery) ||
        lead.email.toLowerCase().includes(normalizedQuery) ||
        (lead.company_name || "").toLowerCase().includes(normalizedQuery) ||
        (lead.project_name || "").toLowerCase().includes(normalizedQuery) ||
        lead.project_type.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "All Status" || lead.status === status;
      const matchesSource = source === "All Sources" || lead.source === source;
      const matchesFrom = !dateFrom || createdDate >= dateFrom;
      const matchesTo = !dateTo || createdDate <= dateTo;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesSource &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [dateFrom, dateTo, leadRows, query, source, status]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const firstVisible = filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisible = Math.min(currentPage * pageSize, filteredLeads.length);

  function resetToFirstPage() {
    setPage(1);
  }

  async function handleAddLead(input: LeadFormInput) {
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      return false;
    }

    const createdAt = new Date().toISOString();
    const leadId = createRecordId();
    const nextLead: LeadWithQuote = {
      id: leadId,
      company_id: null,
      company_name: input.companyName || null,
      created_at: createdAt,
      email: input.email,
      full_name: input.fullName,
      marketing_consent: false,
      notes: null,
      phone: input.phone || null,
      project_name: input.projectName || null,
      project_type: input.projectType,
      quote_number: null,
      quote_value: null,
      source: input.source,
      status: input.status
    };

    const { error } = await supabase.from("leads").insert({
      id: leadId,
      company_id: null,
      company_name: nextLead.company_name,
      email: nextLead.email,
      full_name: nextLead.full_name,
      marketing_consent: false,
      notes: null,
      phone: nextLead.phone,
      project_name: nextLead.project_name,
      project_type: nextLead.project_type,
      source: nextLead.source,
      status: nextLead.status
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    setLeadRows((currentRows) => [nextLead, ...currentRows]);
    setSuccessMessage("Lead created successfully.");
    setSuccessOpen(true);
    resetToFirstPage();
    return true;
  }

  async function handleStatusChange(leadId: string, nextStatus: LeadStatus) {
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      return;
    }

    const { error } = await supabase
      .from("leads")
      .update({ status: nextStatus })
      .eq("id", leadId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setLeadRows((currentRows) =>
      currentRows.map((lead) =>
        lead.id === leadId ? { ...lead, status: nextStatus } : lead
      )
    );
    setSuccessMessage("Lead status updated successfully.");
    setSuccessOpen(true);
  }

  async function handleDeleteLead(leadId: string) {
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      return;
    }

    const { error } = await supabase.from("leads").delete().eq("id", leadId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setLeadRows((currentRows) => currentRows.filter((lead) => lead.id !== leadId));
    setSuccessMessage("Lead deleted successfully.");
    setSuccessOpen(true);
  }

  return (
    <>
      <div className="space-y-4">
        <LeadsToolbar
          dateFrom={dateFrom}
          dateTo={dateTo}
          query={query}
          source={source}
          sources={sources}
          status={status}
          statuses={statuses}
          onAddLead={handleAddLead}
          onDateFromChange={(value) => {
            setDateFrom(value);
            resetToFirstPage();
          }}
          onDateToChange={(value) => {
            setDateTo(value);
            resetToFirstPage();
          }}
          onExport={() => downloadCsv("acoustiq-leads.csv", filteredLeads)}
          onQueryChange={(value) => {
            setQuery(value);
            resetToFirstPage();
          }}
          onSourceChange={(value) => {
            setSource(value);
            resetToFirstPage();
          }}
          onStatusChange={(value) => {
            setStatus(value);
            resetToFirstPage();
          }}
        />

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <LeadsTable
          currentPage={currentPage}
          firstVisible={firstVisible}
          lastVisible={lastVisible}
          leads={paginatedLeads}
          totalFilteredLeads={filteredLeads.length}
          totalPages={totalPages}
          onDeleteLead={handleDeleteLead}
          onPageChange={setPage}
          onStatusChange={handleStatusChange}
        />
      </div>

      <SuccessDialog
        open={successOpen}
        title="Leads Updated"
        message={successMessage}
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
