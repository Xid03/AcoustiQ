import { CalendarDays, DollarSign, FileText, Percent, Users } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { LeadSourceCard } from "@/components/admin/lead-source-card";
import { LeadsChartCard } from "@/components/admin/leads-chart-card";
import { MetricCard } from "@/components/admin/metric-card";
import { QuoteOverviewCard } from "@/components/admin/quote-overview-card";
import { RecentLeadsTable } from "@/components/admin/recent-leads-table";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    title: "Total Leads",
    value: "128",
    change: "18.2%",
    icon: Users
  },
  {
    title: "Quotes Sent",
    value: "42",
    change: "12.4%",
    icon: FileText
  },
  {
    title: "Conversion Rate",
    value: "32.8%",
    change: "6.7%",
    icon: Percent,
    tone: "emerald" as const
  },
  {
    title: "Revenue (Est.)",
    value: "$18,540",
    change: "15.3%",
    icon: DollarSign,
    tone: "emerald" as const
  }
];

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back, John!
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-white">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span className="font-mono text-xs tabular-nums">
              May 20 - May 26, 2024
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <LeadsChartCard />
          <LeadSourceCard />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.85fr)]">
          <RecentLeadsTable />
          <QuoteOverviewCard />
        </div>
      </div>
    </AdminShell>
  );
}
