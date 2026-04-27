import { BarChart3, DollarSign, FileText, TrendingUp, Users } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { MetricCard } from "@/components/admin/metric-card";
import { formatCurrency } from "@/lib/calculations/acoustic-calculations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadRow, QuoteRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AnalyticsLead = Pick<
  LeadRow,
  "created_at" | "project_type" | "source" | "status"
>;

type AnalyticsQuote = Pick<
  QuoteRow,
  "created_at" | "room_details" | "status" | "total"
>;

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

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
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

async function getAnalyticsData() {
  try {
    const supabase = createSupabaseServerClient();
    const [leadsResult, quotesResult] = await Promise.all([
      supabase
        .from("leads")
        .select("created_at,project_type,source,status")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("quotes")
        .select("created_at,room_details,status,total")
        .order("created_at", { ascending: false })
        .limit(1000)
    ]);

    return {
      leads: (leadsResult.data || []) as AnalyticsLead[],
      quotes: (quotesResult.data || []) as AnalyticsQuote[]
    };
  } catch {
    return {
      leads: [] as AnalyticsLead[],
      quotes: [] as AnalyticsQuote[]
    };
  }
}

function BreakdownBar({
  label,
  percent,
  value
}: {
  label: string;
  percent: number;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="font-mono text-sm tabular-nums text-slate-900">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const { leads, quotes } = await getAnalyticsData();
  const today = startOfDay(new Date());
  const rangeEnd = addDays(today, 1);
  const rangeStart = addDays(rangeEnd, -7);
  const previousRangeStart = addDays(rangeStart, -7);
  const currentLeadCount = countBetween(leads, rangeStart, rangeEnd);
  const previousLeadCount = countBetween(leads, previousRangeStart, rangeStart);
  const currentQuoteCount = countBetween(quotes, rangeStart, rangeEnd);
  const previousQuoteCount = countBetween(quotes, previousRangeStart, rangeStart);
  const currentRevenue = sumBetween(quotes, rangeStart, rangeEnd);
  const previousRevenue = sumBetween(quotes, previousRangeStart, rangeStart);
  const totalRevenue = quotes.reduce((sum, quote) => sum + Number(quote.total), 0);
  const averageQuoteValue =
    quotes.length > 0 ? totalRevenue / quotes.length : 0;
  const conversionRate =
    leads.length > 0 ? Math.round((quotes.length / leads.length) * 1000) / 10 : 0;

  const dailyRevenue = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(rangeStart, index);
    const nextDate = addDays(date, 1);
    return {
      label: formatDayLabel(date),
      value: sumBetween(quotes, date, nextDate)
    };
  });
  const maxRevenue = Math.max(1, ...dailyRevenue.map((day) => day.value));

  const roomCounts = [...leads, ...quotes.map((quote) => ({
    project_type: quote.room_details.roomType
  }))].reduce<Record<string, number>>((counts, item) => {
    const roomType = item.project_type || "Other";
    counts[roomType] = (counts[roomType] || 0) + 1;
    return counts;
  }, {});
  const topRoomTypes = Object.entries(roomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxRoomTypeCount = Math.max(1, ...topRoomTypes.map(([, count]) => count));

  const sourceCounts = leads.reduce<Record<string, number>>((counts, lead) => {
    const source = lead.source || "Other";
    counts[source] = (counts[source] || 0) + 1;
    return counts;
  }, {});
  const topSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxSourceCount = Math.max(1, ...topSources.map(([, count]) => count));

  const quoteStatusCounts = ["Draft", "Sent", "Viewed", "Accepted"].map((status) => ({
    label: status,
    count: quotes.filter((quote) => quote.status === status).length
  }));

  const metrics = [
    {
      title: "Lead Growth",
      value: currentLeadCount.toString(),
      change: formatPercentChange(currentLeadCount, previousLeadCount),
      icon: Users
    },
    {
      title: "Quote Growth",
      value: currentQuoteCount.toString(),
      change: formatPercentChange(currentQuoteCount, previousQuoteCount),
      icon: FileText
    },
    {
      title: "Revenue This Week",
      value: formatCurrency(currentRevenue),
      change: formatPercentChange(currentRevenue, previousRevenue),
      icon: DollarSign,
      tone: "emerald" as const
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      change: "live",
      icon: TrendingUp,
      tone: "emerald" as const
    }
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review lead flow, quote value, room demand, and customer source trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-800">
                  Revenue by Day
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Estimated quote value from the last 7 days.
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-8 flex h-72 items-end gap-3">
              {dailyRevenue.map((day) => (
                <div key={day.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-56 w-full items-end rounded-lg bg-slate-50 px-2">
                    <div
                      className="w-full rounded-t-lg bg-indigo-600 transition-all duration-200"
                      style={{ height: `${Math.max(4, (day.value / maxRevenue) * 100)}%` }}
                      title={`${day.label}: ${formatCurrency(day.value)}`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{day.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-slate-800">
              Quote Performance
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Average Quote</p>
                <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-slate-900">
                  {formatCurrency(averageQuoteValue)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Total Quotes</p>
                <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-slate-900">
                  {quotes.length}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {quoteStatusCounts.map((status) => (
                <BreakdownBar
                  key={status.label}
                  label={status.label}
                  percent={quotes.length > 0 ? (status.count / quotes.length) * 100 : 0}
                  value={status.count.toString()}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-slate-800">
              Top Room Types
            </h2>
            <div className="mt-6 space-y-5">
              {topRoomTypes.length > 0 ? (
                topRoomTypes.map(([roomType, count]) => (
                  <BreakdownBar
                    key={roomType}
                    label={roomType}
                    percent={(count / maxRoomTypeCount) * 100}
                    value={`${count} requests`}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No room data captured yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-slate-800">
              Lead Sources
            </h2>
            <div className="mt-6 space-y-5">
              {topSources.length > 0 ? (
                topSources.map(([source, count]) => (
                  <BreakdownBar
                    key={source}
                    label={source}
                    percent={(count / maxSourceCount) * 100}
                    value={`${count} leads`}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No lead source data yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
