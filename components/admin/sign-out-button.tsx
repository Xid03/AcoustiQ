"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";

export function SignOutButton() {
  async function handleSignOut() {
    const supabase = createSupabaseClient();
    await supabase?.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 min-h-10 w-10 text-slate-500"
      aria-label="Sign out"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
