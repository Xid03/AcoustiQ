"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AddProductDialog } from "@/components/configurator/add-product-dialog";
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
import { getProducts } from "@/lib/services/quote-service";
import { useConfiguratorStore, type RoomDetails } from "@/lib/stores/configurator-store";
import type { ProductRow } from "@/lib/supabase/types";

const PRODUCT_CATEGORY_PRIORITY = {
  wall: "Wall Panels",
  ceiling: "Ceiling Panels",
  bass: "Bass Traps"
} as const;

function quantityLabelFromUnit(unitLabel: string) {
  const normalized = unitLabel.toLowerCase();

  if (normalized.includes("panel")) {
    return "panels";
  }

  if (normalized.includes("unit")) {
    return "units";
  }

  return unitLabel.replace(/^per\s+/i, "") || unitLabel;
}

function splitProductName(name: string, category: string) {
  const [productName, ...variantParts] = name.split(" - ");

  return {
    productName: productName.trim(),
    variant: variantParts.join(" - ").trim() || category
  };
}

function scoreProductForRoom(product: ProductRow, roomDetails: RoomDetails) {
  const name = product.name.toLowerCase();
  let score = 0;

  if (roomDetails.roomType === "Conference Room") {
    if (name.includes("linear") || name.includes("oak")) score += 8;
    if (name.includes("wave")) score += 4;
  }

  if (roomDetails.roomType === "Home Studio") {
    if (name.includes("pro")) score += 8;
    if (name.includes("baffle") || name.includes("bass") || name.includes("corner")) score += 5;
  }

  if (roomDetails.roomType === "Office") {
    if (name.includes("wave") || name.includes("cloud")) score += 8;
    if (name.includes("linear")) score += 4;
  }

  if (roomDetails.ceilingType === "Hard Ceiling") {
    if (name.includes("cloud")) score += 8;
    if (name.includes("baffle")) score += 4;
  }

  if (roomDetails.ceilingType === "Open Ceiling") {
    if (name.includes("baffle")) score += 10;
  }

  if (roomDetails.floorType === "Hard Floor") {
    if (name.includes("cloud") || name.includes("baffle")) score += 3;
  }

  if (roomDetails.windows === "Large") {
    if (name.includes("wave") || name.includes("linear")) score += 4;
  }

  return score;
}

function pickBestProduct(
  products: ProductRow[],
  category: ProductRow["category"],
  roomDetails: RoomDetails,
  preferredWords: string[]
) {
  const candidates = products.filter(
    (product) => product.status === "Active" && product.category === category
  );

  return candidates
    .map((product) => {
      const name = product.name.toLowerCase();
      const keywordScore = preferredWords.reduce(
        (score, word) => score + (name.includes(word) ? 12 : 0),
        0
      );

      return {
        product,
        score: keywordScore + scoreProductForRoom(product, roomDetails)
      };
    })
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)[0]
    ?.product;
}

function findCatalogProduct(
  fallbackProduct: ReturnType<typeof calculateProductQuantities>[number],
  products: ProductRow[],
  roomDetails: RoomDetails
) {
  if (fallbackProduct.thumbnail === "wood") {
    const preferredWords =
      roomDetails.roomType === "Conference Room"
        ? ["linear", "oak"]
        : roomDetails.roomType === "Home Studio"
          ? ["wave", "pro"]
          : ["wave", "wood"];

    return pickBestProduct(
      products,
      PRODUCT_CATEGORY_PRIORITY.wall,
      roomDetails,
      preferredWords
    );
  }

  if (fallbackProduct.thumbnail === "cloud") {
    const preferredWords =
      roomDetails.ceilingType === "Open Ceiling" ? ["baffle"] : ["cloud"];

    return pickBestProduct(
      products,
      PRODUCT_CATEGORY_PRIORITY.ceiling,
      roomDetails,
      preferredWords
    );
  }

  const preferredWords =
    roomDetails.roomType === "Home Studio" || roomDetails.floorType === "Hard Floor"
      ? ["corner", "pro"]
      : ["panel", "pro"];

  return pickBestProduct(
    products,
    PRODUCT_CATEGORY_PRIORITY.bass,
    roomDetails,
    preferredWords
  );
}

export default function ResultsPage() {
  const roomDetails = useConfiguratorStore((state) => state.roomDetails);
  const selectedProducts = useConfiguratorStore((state) => state.selectedProducts);
  const hasProductSelection = useConfiguratorStore((state) => state.hasProductSelection);
  const addSelectedProduct = useConfiguratorStore((state) => state.addSelectedProduct);
  const setSelectedProducts = useConfiguratorStore(
    (state) => state.setSelectedProducts
  );
  const updateProductQuantity = useConfiguratorStore(
    (state) => state.updateProductQuantity
  );
  const [catalogProducts, setCatalogProducts] = useState<ProductRow[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const initializedRecommendationKey = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCatalogProducts() {
      const products = await getProducts();

      if (mounted) {
        setCatalogProducts(products);
        setCatalogLoaded(true);
      }
    }

    void loadCatalogProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const recommendedProducts = useMemo(() => {
    if (!roomDetails) {
      return [];
    }

    const calculatedProducts = calculateProductQuantities(roomDetails);

    return calculatedProducts.map((fallbackProduct) => {
      const catalogProduct = findCatalogProduct(
        fallbackProduct,
        catalogProducts,
        roomDetails
      );

      if (!catalogProduct) {
        return fallbackProduct;
      }

      const { productName, variant } = splitProductName(
        catalogProduct.name,
        catalogProduct.category
      );

      return {
        ...fallbackProduct,
        id: catalogProduct.id,
        productName,
        variant,
        unitLabel: quantityLabelFromUnit(catalogProduct.unit_label),
        unitPrice: Number(catalogProduct.price),
        thumbnail: catalogProduct.thumbnail_type,
        imageUrl: catalogProduct.image_url
      };
    });
  }, [catalogProducts, roomDetails]);

  const recommendationKey = useMemo(
    () =>
      recommendedProducts
        .map((product) =>
          [
            product.id,
            product.productName,
            product.variant,
            product.unitPrice,
            product.thumbnail,
            product.imageUrl
          ].join(":")
        )
        .join("|"),
    [recommendedProducts]
  );

  useEffect(() => {
    if (
      roomDetails &&
      recommendationKey &&
      catalogLoaded &&
      !hasProductSelection &&
      initializedRecommendationKey.current !== recommendationKey
    ) {
      initializedRecommendationKey.current = recommendationKey;
      setSelectedProducts(recommendedProducts);
    }
  }, [
    catalogLoaded,
    hasProductSelection,
    recommendationKey,
    recommendedProducts,
    roomDetails,
    setSelectedProducts
  ]);

  if (!roomDetails) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyConfiguratorState />
        </div>
      </div>
    );
  }

  const products = hasProductSelection ? selectedProducts : recommendedProducts;
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
              <StepProgress currentStep={2} />
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
            <AddProductDialog
              products={catalogProducts}
              selectedProductIds={products.map((product) => product.id)}
              onAddProduct={addSelectedProduct}
            />
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
