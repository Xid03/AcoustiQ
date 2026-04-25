import Link from "next/link";

import { Button } from "@/components/ui/button";

const roomSummary = [
  "Office",
  "20 ft x 16 ft x 10 ft",
  "320 sq ft",
  "3,200 cu ft"
];

export function RoomSummaryCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Room Summary
      </h2>
      <div className="mt-5 space-y-2">
        {roomSummary.map((item) => (
          <p
            key={item}
            className="text-sm font-mono font-medium tabular-nums text-slate-900"
          >
            {item}
          </p>
        ))}
      </div>
      <Button asChild variant="outline" className="mt-5 w-full text-xs">
        <Link href="/configure">View Room Details</Link>
      </Button>
    </section>
  );
}
