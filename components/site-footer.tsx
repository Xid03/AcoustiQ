"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle, RadioTower, Send, Share2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { useBrandSettings } from "@/lib/hooks/use-brand-settings";

const baseFooterColumns = [
  {
    title: "Product",
    links: [
      { label: "Configurator", href: "/configure" },
      { label: "Quote Preview", href: "/quote" },
      { label: "Product Catalog", href: "/admin/products" },
      { label: "Admin Dashboard", href: "/admin" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Partners", href: "/#partners" },
      { label: "Careers", href: "mailto:support@acoustiq.com?subject=Careers at AcoustiQ" },
      { label: "Contact", href: "mailto:support@acoustiq.com?subject=AcoustiQ enquiry" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Acoustic Guide", href: "/#resources" },
      { label: "Case Studies", href: "/#case-studies" },
      { label: "Support", href: "/admin/support" },
      { label: "Documentation", href: "/#how-it-works" }
    ]
  },
  { title: "Contact", links: [] }
];

export function SiteFooter() {
  const pathname = usePathname();
  const brandSettings = useBrandSettings();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const footerColumns = baseFooterColumns.map((column) =>
    column.title === "Contact"
      ? {
          ...column,
          links: [
            {
              label: brandSettings.support_email || "support@acoustiq.com",
              href: `mailto:${brandSettings.support_email || "support@acoustiq.com"}`
            },
            {
              label: "Book a Demo",
              href: `mailto:${brandSettings.support_email || "support@acoustiq.com"}?subject=${encodeURIComponent(
                `Book a ${brandSettings.brand_name} demo`
              )}`
            }
          ]
        }
      : column
  );
  const isWorkspaceRoute =
    pathname.startsWith("/configure") ||
    pathname.startsWith("/quote") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isWorkspaceRoute) {
    return null;
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = newsletterEmail.trim();

    if (!email) {
      return;
    }

    const subscribers = JSON.parse(
      window.localStorage.getItem("acoustiq-newsletter-subscribers") || "[]"
    ) as string[];
    const nextSubscribers = Array.from(new Set([email, ...subscribers]));

    window.localStorage.setItem(
      "acoustiq-newsletter-subscribers",
      JSON.stringify(nextSubscribers)
    );
    setNewsletterEmail("");
    setSuccessMessage(`${email} has been added to the newsletter list.`);
    setSuccessOpen(true);
  }

  async function handleShare() {
    const shareData = {
      title: `${brandSettings.brand_name} Acoustic Configurator`,
      text: "Try this acoustic panel configurator and quotation system.",
      url: window.location.origin
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.origin);
    setSuccessMessage("Website link copied to clipboard.");
    setSuccessOpen(true);
  }

  return (
    <>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
            <div className="max-w-md space-y-5">
              <BrandLogo />
              <p className="text-sm leading-6 text-slate-600">
                White-label acoustic panel configuration, quote automation, and
                lead capture for commercial acoustic treatment companies.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Share AcoustiQ"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  onClick={() => void handleShare()}
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <Link
                  href="/#resources"
                  aria-label="View resources"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <RadioTower className="h-4 w-4" />
                </Link>
                <Link
                  href={`mailto:${brandSettings.support_email}?subject=${encodeURIComponent(
                    `${brandSettings.brand_name} community enquiry`
                  )}`}
                  aria-label="Contact community support"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-4 w-4" />
                </Link>
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
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-600 transition-colors duration-150 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          {link.label}
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
              <form
                className="flex flex-col gap-3 sm:flex-row"
                aria-label="Newsletter signup"
                onSubmit={handleNewsletterSubmit}
              >
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    className="pl-9"
                    aria-label="Email address"
                    required
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 {brandSettings.brand_name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-950">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-950">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <SuccessDialog
        open={successOpen}
        title="Done"
        message={successMessage}
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
