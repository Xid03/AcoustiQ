"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EmptyConfiguratorState } from "@/components/configurator/empty-configurator-state";
import { LeadCaptureForm } from "@/components/quote/lead-capture-form";
import { QuotePreview } from "@/components/quote/quote-preview";
import { StepProgress } from "@/components/configurator/step-progress";
import { Button } from "@/components/ui/button";
import { useConfiguratorStore } from "@/lib/stores/configurator-store";

export default function QuotePage() {
  const roomDetails = useConfiguratorStore((state) => state.roomDetails);

  if (!roomDetails) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyConfiguratorState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-10 min-h-10 w-10 shrink-0"
              >
                <Link href="/configure/results" aria-label="Back to products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <StepProgress currentStep={3} />
            </div>
            <Button asChild variant="outline" className="text-xs">
              <Link href="/configure/results">Back to Products</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-start">
          <div>
            <div className="mb-8">
              <Button
                asChild
                variant="link"
                className="mb-5 gap-2 text-sm font-medium text-slate-600 no-underline hover:text-slate-900 hover:no-underline"
              >
                <Link href="/configure/results">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Your Quote is Ready!
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Please provide your details to receive your professional quote.
              </p>
            </div>
            <LeadCaptureForm />
          </div>

          <div className="lg:sticky lg:top-5">
            <QuotePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
