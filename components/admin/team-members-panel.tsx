"use client";

import Image from "next/image";
import { useState } from "react";
import { ShieldCheck, UserCircle } from "lucide-react";

import { SuccessDialog } from "@/components/ui/success-dialog";
import { roleLabels, type UserRole } from "@/lib/auth/rbac";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/types";

type TeamMembersPanelProps = {
  currentUserId: string | null;
  members: ProfileRow[];
};

function getInitials(nameOrEmail: string) {
  const words = nameOrEmail
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);

  return (
    words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function TeamMembersPanel({
  currentUserId,
  members
}: TeamMembersPanelProps) {
  const [teamMembers, setTeamMembers] = useState(members);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  async function updateRole(memberId: string, nextRole: UserRole) {
    setSavingMemberId(memberId);
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setSavingMemberId(null);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", memberId);

    if (error) {
      setErrorMessage(error.message);
      setSavingMemberId(null);
      return;
    }

    setTeamMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId ? { ...member, role: nextRole } : member
      )
    );
    setSavingMemberId(null);
    setSuccessOpen(true);
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Admin Only
            </p>
            <h2 className="mt-1 text-xl font-medium tracking-tight text-slate-900">
              Team Members
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Assign access levels for people who can sign in to the admin dashboard.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
            <ShieldCheck className="h-4 w-4" />
            Role protected
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <div className="grid grid-cols-[minmax(0,1.4fr)_160px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Member</span>
            <span>Role</span>
          </div>

          {teamMembers.length > 0 ? (
            teamMembers.map((member) => {
              const displayName =
                member.full_name || member.email || `User ${member.id.slice(0, 8)}`;
              const isCurrentUser = member.id === currentUserId;

              return (
                <div
                  key={member.id}
                  className="grid grid-cols-[minmax(0,1.4fr)_160px] items-center gap-4 border-t border-slate-100 px-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={`${displayName} profile picture`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {displayName}
                        {isCurrentUser ? (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            You
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {member.email || getInitials(member.id)}
                      </p>
                    </div>
                  </div>

                  <select
                    value={member.role}
                    disabled={isCurrentUser || savingMemberId === member.id}
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    aria-label={`Change role for ${displayName}`}
                    onChange={(event) =>
                      void updateRole(member.id, event.target.value as UserRole)
                    }
                  >
                    {(["viewer", "manager", "admin"] as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })
          ) : (
            <div className="border-t border-slate-100 px-4 py-8 text-center text-sm text-slate-500">
              No team members found.
            </div>
          )}
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <SuccessDialog
        open={successOpen}
        title="Role Updated"
        message="The team member role was updated successfully."
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
