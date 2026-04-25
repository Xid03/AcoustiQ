"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Products", href: "/#products" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Resources", href: "/#resources" },
  { label: "About Us", href: "/#about" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href.replace("/#", "/"));
}

export function SiteHeader() {
  const pathname = usePathname();
  const isWorkspaceRoute =
    pathname.startsWith("/configure") ||
    pathname.startsWith("/quote") ||
    pathname.startsWith("/admin");

  if (isWorkspaceRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Primary navigation"
      >
        <BrandLogo />

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex min-h-[44px] items-center rounded-lg text-xs font-semibold text-slate-700 transition-colors duration-150 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  active && "text-indigo-700"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Button
            asChild
            variant="link"
            className="text-xs font-semibold text-indigo-600 no-underline hover:no-underline"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="h-11 min-h-11 px-6 text-xs font-semibold">
            <Link href="/configure">Get a Quote</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[86vw] max-w-sm">
            <SheetHeader className="pr-8">
              <SheetTitle>
                <BrandLogo className="min-h-0" />
              </SheetTitle>
              <SheetDescription>
                Configure acoustic treatment and request a professional quote.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 grid gap-2">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "min-h-[44px] rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                      active && "bg-indigo-50 text-indigo-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 grid gap-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/configure">Get a Quote</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
