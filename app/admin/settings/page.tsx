import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { TeamMembersPanel } from "@/components/admin/team-members-panel";
import { getCompanySettings, getTeamMembers } from "@/lib/services/admin-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [company, team] = await Promise.all([
    getCompanySettings(),
    getTeamMembers()
  ]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage brand identity, quote numbering, and customer support details.
          </p>
        </div>
        <SettingsForm company={company} />
        <TeamMembersPanel
          currentUserId={team.currentUserId}
          members={team.members}
        />
      </div>
    </AdminShell>
  );
}
