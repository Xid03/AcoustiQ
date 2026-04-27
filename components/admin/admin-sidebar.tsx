"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  CircleHelp,
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  UserCircle,
  Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { isAdminRole, isStaffRole, roleLabels } from "@/lib/auth/rbac";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, access: "staff" },
  { label: "Leads & Quotes", href: "/admin/leads", icon: Users, access: "staff" },
  { label: "Products", href: "/admin/products", icon: Package, access: "staff" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, access: "staff" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, access: "staff" },
  { label: "Settings", href: "/admin/settings", icon: Settings, access: "admin" }
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

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

function formatRole(role: string) {
  return roleLabels[role as keyof typeof roleLabels] || role.charAt(0).toUpperCase() + role.slice(1);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    avatarUrl: null as string | null,
    email: "",
    fullName: "Admin User",
    role: "viewer"
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
        .select("avatar_url,full_name,role")
        .eq("id", user.id)
        .maybeSingle();

      if (mounted) {
        setProfile({
          avatarUrl: data?.avatar_url || user.user_metadata?.avatar_url || null,
          email: user.email || "",
          fullName: data?.full_name || user.user_metadata?.full_name || user.email || "Admin User",
          role: data?.role || "viewer"
        });
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  async function handleSignOut() {
    const supabase = createSupabaseClient();
    await supabase?.auth.signOut();
    window.location.href = "/login";
  }

  const displayName = profile.fullName || profile.email || "Admin User";
  const initials = getInitials(displayName);
  const visibleNavItems = navItems.filter((item) =>
    item.access === "admin" ? isAdminRole(profile.role) : isStaffRole(profile.role)
  );

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <BrandLogo className="min-h-0" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-lg border-l-2 border-transparent px-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                active && "border-indigo-600 bg-indigo-50 text-indigo-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-slate-100 p-4">
        <Link
          href="#"
          className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <CircleHelp className="h-4 w-4" />
          Help & Support
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-expanded={accountMenuOpen}
            aria-label="Open account menu"
            onClick={() => setAccountMenuOpen((open) => !open)}
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-200 to-indigo-100 text-sm font-semibold text-slate-700">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={`${displayName} profile picture`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">{formatRole(profile.role)}</p>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-150",
                accountMenuOpen && "rotate-90"
              )}
            />
          </button>

          {accountMenuOpen ? (
            <div className="absolute bottom-full left-0 z-40 mb-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/80">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-xs font-medium text-slate-900">
                  {displayName}
                </p>
                {profile.email ? (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {profile.email}
                  </p>
                ) : null}
              </div>
              <Link
                href="/admin/account"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900"
                onClick={() => setAccountMenuOpen(false)}
              >
                <UserCircle className="h-4 w-4 text-slate-400" />
                Account settings
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
