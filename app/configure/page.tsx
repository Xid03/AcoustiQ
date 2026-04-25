import Link from "next/link";
import { ArrowLeft, ChevronDown, Save } from "lucide-react";

import { ConfigurationSummary } from "@/components/configurator/configuration-summary";
import { HelpCard } from "@/components/configurator/help-card";
import { RoomDiagram } from "@/components/configurator/room-diagram";
import { RoomDimensionsForm } from "@/components/configurator/room-dimensions-form";
import { RoomTypeSelector } from "@/components/configurator/room-type-selector";
import { StepProgress } from "@/components/configurator/step-progress";
import { Button } from "@/components/ui/button";

const detailSelects = [
  {
    label: "Ceiling Type",
    value: "Hard Ceiling (Concrete, Drywall)",
    options: ["Hard Ceiling (Concrete, Drywall)", "Acoustic Tile", "Open Ceiling"]
  },
  {
    label: "Floor Type",
    value: "Hard Floor (Wood, Tile, Concrete)",
    options: ["Hard Floor (Wood, Tile, Concrete)", "Carpet", "Mixed"]
  }
];

const windows = ["None", "Small", "Large"];

export default function ConfigurePage() {
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
                <Link href="/" aria-label="Back to landing page">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <StepProgress currentStep={1} />
            </div>
            <Button asChild variant="outline" className="gap-2 text-xs">
              <Link href="/">
                <Save className="h-4 w-4 text-indigo-600" />
                Save & Exit
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Let&apos;s start with your room details
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Accurate measurements help us calculate the right acoustic
                treatment for your space.
              </p>
            </div>

            <div className="mt-7 space-y-7">
              <section aria-labelledby="room-type-title">
                <h2
                  id="room-type-title"
                  className="text-sm font-medium tracking-tight text-slate-800"
                >
                  Room Type
                </h2>
                <div className="mt-3">
                  <RoomTypeSelector />
                </div>
              </section>

              <section aria-labelledby="dimensions-title">
                <h2
                  id="dimensions-title"
                  className="text-sm font-medium tracking-tight text-slate-800"
                >
                  Room Dimensions
                </h2>
                <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(260px,0.9fr)] lg:items-stretch">
                  <RoomDimensionsForm />
                  <RoomDiagram />
                </div>
              </section>

              <section aria-labelledby="details-title">
                <h2
                  id="details-title"
                  className="text-sm font-medium tracking-tight text-slate-800"
                >
                  Room Details
                </h2>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {detailSelects.map((field) => (
                    <label key={field.label} className="block">
                      <span className="text-xs font-medium text-slate-600">
                        {field.label}
                      </span>
                      <span className="relative mt-2 block">
                        <select
                          defaultValue={field.value}
                          className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          aria-label={field.label}
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-xs font-medium text-slate-600">Windows</span>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    {windows.map((window) => {
                      const selected = window === "Large";

                      return (
                        <button
                          key={window}
                          type="button"
                          aria-pressed={selected}
                          className={
                            selected
                              ? "min-h-[44px] rounded-lg border border-indigo-500 bg-indigo-50 px-4 text-sm font-medium text-indigo-700 ring-2 ring-indigo-500/20 transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                              : "min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                          }
                        >
                          {window}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button asChild className="px-6">
                <Link href="/configure/results">Next: Select Products</Link>
              </Button>
            </div>
          </section>

          <div className="space-y-4">
            <ConfigurationSummary />
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}
