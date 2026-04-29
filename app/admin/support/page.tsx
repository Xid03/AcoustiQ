import { AdminShell } from "@/components/admin/admin-shell";
import { SupportRequestForm } from "@/components/admin/support-request-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminSupportPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Help & Support
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Get help with quotes, products, leads, account access, and email delivery.
          </p>
        </div>

        <SupportRequestForm />
      </div>
    </AdminShell>
  );
}
