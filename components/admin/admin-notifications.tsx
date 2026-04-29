"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  MailWarning,
  RefreshCw,
  UserPlus,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type NotificationItem = {
  createdAt: string;
  description: string;
  href: string;
  id: string;
  kind: "lead" | "quote" | "email";
  tone: "info" | "success" | "warning" | "danger";
  title: string;
};

function formatRelativeTime(value: string) {
  const diffMs = new Date(value).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  return formatter.format(Math.round(diffHours / 24), "day");
}

function getIcon(item: NotificationItem) {
  if (item.kind === "lead") {
    return UserPlus;
  }

  if (item.kind === "quote") {
    return FileText;
  }

  if (item.tone === "danger") {
    return XCircle;
  }

  if (item.tone === "success") {
    return CheckCircle2;
  }

  return MailWarning;
}

export function AdminNotifications() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadNotifications() {
    const supabase = createSupabaseClient();

    if (!supabase) {
      setItems([]);
      setIsLoading(false);
      setMessage("Supabase is not configured.");
      return;
    }

    setIsLoading(true);

    const [leadsResult, quotesResult, emailEventsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("id,full_name,company_name,status,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("quotes")
        .select("id,quote_number,status,total,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("quote_email_events")
        .select("id,event_type,recipient_email,status,created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ]);

    if (leadsResult.error || quotesResult.error || emailEventsResult.error) {
      setItems([]);
      setMessage(
        leadsResult.error?.message ||
          quotesResult.error?.message ||
          emailEventsResult.error?.message ||
          "Unable to load notifications."
      );
      setIsLoading(false);
      return;
    }

    const leadItems: NotificationItem[] = (leadsResult.data || []).map((lead) => ({
      createdAt: lead.created_at,
      description: `${lead.company_name || "New company"} • ${lead.status}`,
      href: "/admin/leads",
      id: `lead-${lead.id}`,
      kind: "lead",
      tone: lead.status === "New" ? "info" : "success",
      title: `New lead from ${lead.full_name}`
    }));

    const quoteItems: NotificationItem[] = (quotesResult.data || []).map((quote) => ({
      createdAt: quote.created_at,
      description: `${quote.status} • RM ${Number(quote.total).toLocaleString("en-MY", {
        minimumFractionDigits: 2
      })}`,
      href: "/admin/leads",
      id: `quote-${quote.id}`,
      kind: "quote",
      tone: quote.status === "Accepted" ? "success" : "info",
      title: `Quote ${quote.quote_number}`
    }));

    const emailItems: NotificationItem[] = (emailEventsResult.data || []).map((event) => ({
      createdAt: event.created_at,
      description: `${event.recipient_email} • ${event.event_type.replaceAll("_", " ")}`,
      href: "/admin/leads",
      id: `email-${event.id}`,
      kind: "email",
      tone:
        event.status === "failed"
          ? "danger"
          : event.status === "sent"
            ? "success"
            : "warning",
      title:
        event.status === "pending"
          ? "Quote email pending"
          : event.status === "failed"
            ? "Quote email failed"
            : "Quote email sent"
    }));

    setItems(
      [...leadItems, ...quoteItems, ...emailItems]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
        )
        .slice(0, 8)
    );
    setMessage(null);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadNotifications();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const alertCount = useMemo(
    () => items.filter((item) => item.tone === "warning" || item.tone === "danger").length,
    [items]
  );

  async function handleSendPendingEmails() {
    setIsSendingEmails(true);
    setMessage(null);

    const response = await fetch("/api/email/send-pending", { method: "POST" });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      sent?: number;
    } | null;

    if (!response.ok) {
      setMessage(payload?.error || "Unable to send pending emails.");
      setIsSendingEmails(false);
      return;
    }

    setMessage(`${payload?.sent || 0} pending email(s) sent.`);
    setIsSendingEmails(false);
    await loadNotifications();
  }

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 min-h-10 w-10 text-slate-500"
        aria-expanded={open}
        aria-label="View notifications"
        onClick={() => setOpen((nextOpen) => !nextOpen)}
      >
        <Bell className="h-4 w-4" />
        {alertCount > 0 ? (
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-[min(calc(100vw-2rem),420px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Recent leads, quotes, and email events.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 min-h-8 w-8"
              aria-label="Refresh notifications"
              onClick={() => void loadNotifications()}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-16 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : items.length > 0 ? (
              items.map((item) => {
                const Icon = getIcon(item);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        item.tone === "danger" && "bg-red-100 text-red-600",
                        item.tone === "warning" && "bg-amber-100 text-amber-600",
                        item.tone === "success" && "bg-emerald-100 text-emerald-600",
                        item.tone === "info" && "bg-indigo-100 text-indigo-600"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {item.title}
                      </span>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {item.description}
                      </span>
                    </span>
                    <span className="shrink-0 pt-1 text-xs text-slate-400">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <Clock3 className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  New leads, quotes, and email events will appear here.
                </p>
              </div>
            )}
          </div>

          {message ? (
            <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-600">
              {message}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 min-h-9 bg-white text-xs"
              disabled={isSendingEmails}
              onClick={handleSendPendingEmails}
            >
              {isSendingEmails ? "Sending..." : "Send pending emails"}
            </Button>
            <Button asChild variant="ghost" className="h-9 min-h-9 text-xs">
              <Link href="/admin/leads" onClick={() => setOpen(false)}>
                View leads
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
