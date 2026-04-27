import { redirect } from "next/navigation";

import { AccountSettingsForm } from "@/components/admin/account-settings-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAccountDetails() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email || "",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    fullName: profile?.full_name || user.user_metadata?.full_name || "",
    role: profile?.role || "viewer",
    userId: user.id
  };
}

export default async function AdminAccountPage() {
  const account = await getAccountDetails();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage your admin profile, account identity, and access details.
          </p>
        </div>

        <AccountSettingsForm {...account} />
      </div>
    </AdminShell>
  );
}
