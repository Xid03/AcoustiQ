import type { ProfileRow } from "@/lib/supabase/types";

export type UserRole = ProfileRow["role"];

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  viewer: "Viewer"
};

export function isAdminRole(role: string | null | undefined) {
  return role === "admin";
}

export function isManagerRole(role: string | null | undefined) {
  return role === "manager";
}

export function isStaffRole(role: string | null | undefined) {
  return role === "admin" || role === "manager";
}

export function canAccessAdminPath(role: string | null | undefined, pathname: string) {
  if (pathname === "/admin/account" || pathname.startsWith("/admin/account/")) {
    return Boolean(role);
  }

  if (pathname === "/admin/access-denied") {
    return Boolean(role);
  }

  if (pathname === "/admin/support" || pathname.startsWith("/admin/support/")) {
    return Boolean(role);
  }

  if (pathname === "/admin/settings" || pathname.startsWith("/admin/settings/")) {
    return isAdminRole(role);
  }

  if (pathname.startsWith("/admin")) {
    return isStaffRole(role);
  }

  return true;
}
