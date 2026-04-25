"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { EmptyConfiguratorState } from "@/components/configurator/empty-configurator-state";
import { PerformanceCard } from "@/components/configurator/performance-card";
import { QuoteBenefitsRow } from "@/components/configurator/quote-benefits-row";
import { QuoteSummaryCard } from "@/components/configurator/quote-summary-card";
import { RecommendedProductsTable } from "@/components/configurator/recommended-products-table";
import { RoomSummaryCard } from "@/components/configurator/room-summary-card";
import { StepProgress } from "@/components/configurator/step-progress";
import { TreatmentCoverage } from "@/components/configurator/treatment-coverage";
import { Button } from "@/components/ui/button";
import {
  calculatePerformanceImprovement,
  calculateProductQuantities,
  calculateQuoteTotals,
  calculateRecommendedCoverage,
  calculateFloorArea
} from "@/lib/calculations/acoustic-calculations";
import { useConfiguratorStore } from "@/lib/stores/configurator-store";

export default function ResultsPage() {
  const roomDetails = useConfiguratorStore((state) => state.roomDetails);
  const selectedProducts = useConfiguratorStore((state) => state.selectedProducts);
  const setSelectedProducts = useConfiguratorStore(
    (state) => state.setSelectedProducts
  );
  const updateProductQuantity = useConfiguratorStore(
    (state) => state.updateProductQuantity
  );

  const recommendedProducts = useMemo(
    () => (roomDetails ? calculateProductQuantities(roomDetails) : []),
    [roomDetails]
  );

  useEffect(() => {
    if (roomDetails && selectedProducts.length === 0) {
      setSelectedProducts(recommendedProducts);
    }
  }, [recommendedProducts, roomDetails, selectedProducts.length, setSelectedProducts]);

  if (!roomDetails) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyConfiguratorState />
        </div>
      </div>
    );
  }

  const products = selectedProducts.length > 0 ? selectedProducts : recommendedProducts;
  const totals = calculateQuoteTotals(products);
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const coverage = calculateRecommendedCoverage(
    roomDetails.roomType,
    floorArea,
    roomDetails.windows
  );
  const performance = calculatePerformanceImprovement(roomDetails, products);

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
                <Link href="/configure" aria-label="Back to room details">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <StepProgress currentStep={3} />
            </div>
            <Button asChild variant="outline" className="text-xs">
              <Link href="/configure">Edit Room Details</Link>
            </Button>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Recommended Acoustic Treatment Plan
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Based on your room analysis, here&apos;s the optimal solution
                for better acoustics.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_260px] xl:grid-cols-[230px_minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <RoomSummaryCard roomDetails={roomDetails} />
              <PerformanceCard value={performance} />
            </div>

            <div className="space-y-5">
              <RecommendedProductsTable
                products={products}
                onQuantityChange={updateProductQuantity}
              />
              <TreatmentCoverage {...coverage} />
            </div>

            <QuoteSummaryCard totals={totals} />
          </div>

          <div className="mt-8">
            <QuoteBenefitsRow />
          </div>
        </section>
      </div>
    </div>
  );
}
