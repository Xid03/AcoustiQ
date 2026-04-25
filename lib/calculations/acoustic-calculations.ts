import type { QuoteItem, RoomDetails } from "@/lib/stores/configurator-store";

export function calculateFloorArea(length: number, width: number) {
  return length * width;
}

export function calculateVolume(length: number, width: number, height: number) {
  return length * width * height;
}

export function calculateRecommendedCoverage(
  roomType: RoomDetails["roomType"],
  floorArea: number,
  windows: RoomDetails["windows"]
) {
  const roomMultiplier =
    roomType === "Home Studio" ? 0.62 : roomType === "Conference Room" ? 0.52 : 0.42;
  const windowPenalty = windows === "Large" ? 0.06 : windows === "Small" ? 0.03 : 0;

  return {
    wallCoverage: Math.round((roomMultiplier + windowPenalty) * 100),
    ceilingCoverage: Math.round(Math.min(0.4, floorArea > 250 ? 0.28 : 0.22) * 100)
  };
}

export function calculateProductQuantities(roomDetails: RoomDetails): QuoteItem[] {
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const roomMultiplier =
    roomDetails.roomType === "Home Studio"
      ? 0.8
      : roomDetails.roomType === "Conference Room"
        ? 0.68
        : 0.62;

  const wallPanels = Math.max(4, Math.ceil((floorArea * roomMultiplier) / 12));
  const ceilingPanels = Math.max(2, Math.ceil((floorArea * 0.38) / 16));

  return [
    {
      id: "wave-wood",
      productName: "Acoustic Wall Panel",
      variant: "Wave Wood",
      placement: "Side Walls",
      placementNote: "(Left & Right)",
      quantity: wallPanels,
      unitLabel: "panels",
      unitPrice: 89,
      thumbnail: "wood"
    },
    {
      id: "cloud-1200",
      productName: "Acoustic Ceiling Panel",
      variant: "Cloud 1200",
      placement: "Ceiling",
      quantity: ceilingPanels,
      unitLabel: "panels",
      unitPrice: 119,
      thumbnail: "cloud"
    },
    {
      id: "bass-pro",
      productName: "Bass Trap Corner",
      variant: "Pro Series",
      placement: "Corners",
      placementNote: "(4 corners)",
      quantity: 4,
      unitLabel: "units",
      unitPrice: 99,
      thumbnail: "bass"
    }
  ];
}

export function calculateQuoteTotals(items: QuoteItem[]) {
  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 100;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

export function calculatePerformanceImprovement(
  roomDetails: RoomDetails,
  products: QuoteItem[]
) {
  const panelCount = products.reduce((total, item) => total + item.quantity, 0);
  const baseline = roomDetails.roomType === "Home Studio" ? 72 : 58;
  return Math.min(86, baseline + Math.round(panelCount * 0.4));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}
