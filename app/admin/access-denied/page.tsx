import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export default function AdminAccessDeniedPage() {
  return (
    <AdminShell>
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl items-center">
        <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
            Access denied
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your current role does not include permission to view this admin area.
            You can still manage your own account settings.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/admin/account">Open Account Settings</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white">
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
