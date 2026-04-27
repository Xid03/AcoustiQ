"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

function getInitials(nameOrEmail: string) {
  const words = nameOrEmail
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "A";
}

export function AdminHeader() {
  const [profile, setProfile] = useState({
    avatarUrl: null as string | null,
    initials: "A",
    name: "Admin"
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const supabase = createSupabaseClient();

      if (!supabase) {
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user || !mounted) {
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url,full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (mounted) {
        const displayName = data?.full_name || user.user_metadata?.full_name || user.email || "Admin";

        setProfile({
          avatarUrl: data?.avatar_url || user.user_metadata?.avatar_url || null,
          initials: getInitials(displayName),
          name: displayName
        });
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Navigation</SheetTitle>
                <SheetDescription>Navigate between admin sections.</SheetDescription>
              </SheetHeader>
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block" />

        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 min-h-10 w-10 text-slate-500"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-200 to-indigo-100 text-sm font-semibold text-slate-700 ring-2 ring-white">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={`${profile.name} profile picture`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              profile.initials
            )}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
