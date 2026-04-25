import { AdminShell } from "@/components/admin/admin-shell";
import { LeadsTable } from "@/components/admin/leads-table";
import { LeadsToolbar } from "@/components/admin/leads-toolbar";
import { getLeadsWithQuotes } from "@/lib/services/quote-service";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getLeadsWithQuotes();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Leads & Quotes
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage and track all incoming leads and quotes.
          </p>
        </div>

        <LeadsToolbar />
        <LeadsTable leads={leads} />
      </div>
    </AdminShell>
  );
}
