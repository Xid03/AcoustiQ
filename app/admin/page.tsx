import { CalendarDays, DollarSign, FileText, Percent, Users } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { LeadSourceCard } from "@/components/admin/lead-source-card";
import { LeadsChartCard } from "@/components/admin/leads-chart-card";
import { MetricCard } from "@/components/admin/metric-card";
import { QuoteOverviewCard } from "@/components/admin/quote-overview-card";
import { RecentLeadsTable } from "@/components/admin/recent-leads-table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadRow, ProfileRow, QuoteRow } from "@/lib/supabase/types";

type DashboardLead = Pick<
  LeadRow,
  | "company_name"
  | "created_at"
  | "email"
  | "full_name"
  | "project_name"
  | "project_type"
  | "source"
  | "status"
>;

type DashboardQuote = Pick<QuoteRow, "created_at" | "status" | "total">;

const sourceColors = [
  { color: "bg-indigo-600", stroke: "#4f46e5" },
  { color: "bg-indigo-300", stroke: "#a5b4fc" },
  { color: "bg-sky-200", stroke: "#bae6fd" },
  { color: "bg-slate-300", stroke: "#cbd5e1" }
];

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDateRange(start: Date, end: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  });

  return `${formatter.format(start)} - ${formatter.format(end)}, ${end.getFullYear()}`;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));

  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function countBetween<T extends { created_at: string }>(
  rows: T[],
  start: Date,
  end: Date
) {
  return rows.filter((row) => {
    const createdAt = new Date(row.created_at);
    return createdAt >= start && createdAt < end;
  }).length;
}

function sumBetween<T extends { created_at: string; total: number }>(
  rows: T[],
  start: Date,
  end: Date
) {
  return rows
    .filter((row) => {
      const createdAt = new Date(row.created_at);
      return createdAt >= start && createdAt < end;
    })
    .reduce((sum, row) => sum + Number(row.total), 0);
}

function formatPercentChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "100%" : "0%";
  }

  return `${Math.abs(((current - previous) / previous) * 100).toFixed(1)}%`;
}

async function getDashboardData() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const [leadsResult, quotesResult, profileResult] = await Promise.all([
      supabase
        .from("leads")
        .select("company_name,created_at,email,full_name,project_name,project_type,source,status")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("quotes")
        .select("created_at,status,total")
        .order("created_at", { ascending: false })
        .limit(1000),
      user
        ? supabase
            .from("profiles")
            .select("full_name,role")
            .eq("id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null })
    ]);

    return {
      leads: (leadsResult.data || []) as DashboardLead[],
      profile: (profileResult.data || null) as Pick<ProfileRow, "full_name" | "role"> | null,
      quotes: (quotesResult.data || []) as DashboardQuote[]
    };
  } catch {
    return {
      leads: [] as DashboardLead[],
      profile: null,
      quotes: [] as DashboardQuote[]
    };
  }
}

export default async function AdminDashboardPage() {
  const { leads, profile, quotes } = await getDashboardData();
  const today = startOfDay(new Date());
  const rangeEnd = addDays(today, 1);
  const rangeStart = addDays(rangeEnd, -7);
  const previousRangeStart = addDays(rangeStart, -7);
  const totalRevenue = quotes.reduce((sum, quote) => sum + Number(quote.total), 0);
  const conversionRate =
    leads.length > 0 ? Math.round((quotes.length / leads.length) * 1000) / 10 : 0;
  const previousLeadCount = countBetween(leads, previousRangeStart, rangeStart);
  const currentLeadCount = countBetween(leads, rangeStart, rangeEnd);
  const previousQuoteCount = countBetween(quotes, previousRangeStart, rangeStart);
  const currentQuoteCount = countBetween(quotes, rangeStart, rangeEnd);
  const previousRevenue = sumBetween(quotes, previousRangeStart, rangeStart);
  const currentRevenue = sumBetween(quotes, rangeStart, rangeEnd);
  const previousConversion =
    previousLeadCount > 0 ? (previousQuoteCount / previousLeadCount) * 100 : 0;
  const currentConversion =
    currentLeadCount > 0 ? (currentQuoteCount / currentLeadCount) * 100 : 0;
  const displayName = profile?.full_name?.split(" ")[0] || "John";

  const metrics = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      change: formatPercentChange(currentLeadCount, previousLeadCount),
      icon: Users
    },
    {
      title: "Quotes Sent",
      value: quotes.length.toString(),
      change: formatPercentChange(currentQuoteCount, previousQuoteCount),
      icon: FileText
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      change: formatPercentChange(currentConversion, previousConversion),
      icon: Percent,
      tone: "emerald" as const
    },
    {
      title: "Revenue (Est.)",
      value: formatCurrency(totalRevenue),
      change: formatPercentChange(currentRevenue, previousRevenue),
      icon: DollarSign,
      tone: "emerald" as const
    }
  ];

  const leadChartPoints = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(rangeStart, index);
    const nextDate = addDays(date, 1);

    return {
      label: formatDayLabel(date),
      count: countBetween(leads, date, nextDate)
    };
  });

  const sourceCounts = leads.reduce<Record<string, number>>((counts, lead) => {
    const source = lead.source || "Other";
    counts[source] = (counts[source] || 0) + 1;
    return counts;
  }, {});
  const leadSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count], index) => ({
      label,
      count,
      percent: leads.length > 0 ? Math.round((count / leads.length) * 100) : 0,
      ...sourceColors[index]
    }));

  const quoteStatuses = ["Draft", "Sent", "Viewed", "Accepted"].map((status) => ({
    label: status,
    value: quotes.filter((quote) => quote.status === status).length
  }));

  const recentLeads = leads.slice(0, 5).map((lead) => ({
    company: lead.company_name || "Individual",
    contact: lead.full_name,
    email: lead.email,
    project: lead.project_name || lead.project_type,
    time: formatRelativeTime(lead.created_at),
    status: lead.status
  }));

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-white">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span className="font-mono text-xs tabular-nums">
              {formatDateRange(rangeStart, today)}
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <LeadsChartCard points={leadChartPoints} />
          <LeadSourceCard sources={leadSources} totalLeads={leads.length} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.85fr)]">
          <RecentLeadsTable leads={recentLeads} />
          <QuoteOverviewCard metrics={quoteStatuses} />
        </div>
      </div>
    </AdminShell>
  );
}
