"use client";

import { Bell, Menu } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

export function AdminHeader() {
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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-indigo-100 text-sm font-semibold text-slate-700 ring-2 ring-white">
            JD
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
