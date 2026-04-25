import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyConfiguratorState() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
        No room configuration found.
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start with your room details to generate a quote.
      </p>
      <Button asChild className="mt-6">
        <Link href="/configure">Start Configuring</Link>
      </Button>
    </section>
  );
}
