"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle, RadioTower, Send, Share2 } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerColumns = [
  {
    title: "Product",
    links: ["Configurator", "Quote Preview", "Product Catalog", "Admin Dashboard"]
  },
  {
    title: "Company",
    links: ["About Us", "Partners", "Careers", "Contact"]
  },
  {
    title: "Resources",
    links: ["Acoustic Guide", "Case Studies", "Support", "Documentation"]
  },
  {
    title: "Contact",
    links: ["sales@acoustiq.com", "(888) 555-0199", "Book a Demo"]
  }
];

export function SiteFooter() {
  const pathname = usePathname();
  const isWorkspaceRoute =
    pathname.startsWith("/configure") ||
    pathname.startsWith("/quote") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isWorkspaceRoute) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white" id="resources">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
          <div className="max-w-md space-y-5">
            <BrandLogo />
            <p className="text-sm leading-6 text-slate-600">
              White-label acoustic panel configuration, quote automation, and
              lead capture for commercial acoustic treatment companies.
            </p>
            <div className="flex items-center gap-2">
              {[
                { label: "LinkedIn", icon: Share2 },
                { label: "Twitter", icon: RadioTower },
                { label: "Community", icon: MessageCircle }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href="#"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:items-center">
            <div>
              <h2 className="text-lg font-medium tracking-tight text-slate-800">
                Stay current with acoustic quoting workflows
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Product updates, playbooks, and commercial acoustic sales tips.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="pl-9"
                  aria-label="Email address"
                />
              </div>
              <Button type="button" className="gap-2">
                <Send className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 AcoustiQ. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-950">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-950">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
