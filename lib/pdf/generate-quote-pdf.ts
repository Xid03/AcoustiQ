import {
  calculateFloorArea,
  calculateVolume,
  formatCurrency
} from "@/lib/calculations/acoustic-calculations";
import type {
  LeadDetails,
  QuoteItem,
  RoomDetails
} from "@/lib/stores/configurator-store";
import {
  type BrandSettings,
  normalizeBrandSettings
} from "@/lib/branding/brand-settings";
import type { QuoteTotals } from "@/lib/supabase/types";

type GenerateQuotePdfInput = {
  brandSettings?: BrandSettings;
  leadDetails: LeadDetails | null;
  quoteItems: QuoteItem[];
  quoteNumber?: string;
  roomDetails: RoomDetails;
  totals: QuoteTotals;
};

function textOrFallback(value: string | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

export async function generateQuotePdf({
  brandSettings,
  leadDetails,
  quoteItems,
  quoteNumber,
  roomDetails,
  totals
}: GenerateQuotePdfInput) {
  const normalizedBrandSettings = normalizeBrandSettings(brandSettings);
  const normalizedQuoteNumber =
    quoteNumber ||
    `${normalizedBrandSettings.quote_prefix}-${new Date().getFullYear()}-0567`;
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 48;
  const right = pageWidth - margin;
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const volume = calculateVolume(
    roomDetails.length,
    roomDetails.width,
    roomDetails.height
  );

  pdf.setTextColor("#0f172a");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(normalizedBrandSettings.brand_name, margin, 64);

  pdf.setFontSize(12);
  pdf.text("Acoustic Treatment Quote", margin, 90);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor("#475569");
  pdf.text(`Quote #${normalizedQuoteNumber}`, right, 64, { align: "right" });
  pdf.text(new Date().toLocaleDateString("en-US"), right, 80, { align: "right" });

  pdf.setDrawColor("#e2e8f0");
  pdf.line(margin, 116, right, 116);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor("#64748b");
  pdf.text("Prepared For", margin, 146);
  pdf.text("Project Summary", 320, 146);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(normalizedBrandSettings.primary_color);
  pdf.text(textOrFallback(leadDetails?.fullName, "John Doe"), margin, 168);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#334155");
  pdf.text(textOrFallback(leadDetails?.companyName, "Acme Corporation"), margin, 186);
  pdf.text(textOrFallback(leadDetails?.email, "john.doe@acme.com"), margin, 204);

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor("#0f172a");
  pdf.text(roomDetails.roomType, 320, 168);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#334155");
  pdf.text(
    `${roomDetails.length} ft x ${roomDetails.width} ft x ${roomDetails.height} ft`,
    320,
    186
  );
  pdf.text(`${floorArea.toLocaleString()} sq ft - ${volume.toLocaleString()} cu ft`, 320, 204);

  let y = 248;
  const columns = [
    { label: "Product", x: margin },
    { label: "Placement", x: 250 },
    { label: "Qty", x: 360 },
    { label: "Unit", x: 430 },
    { label: "Total", x: right }
  ];

  pdf.setFillColor("#f8fafc");
  pdf.rect(margin, y - 18, right - margin, 30, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor("#64748b");
  columns.forEach((column) => {
    pdf.text(column.label, column.x, y, {
      align: column.label === "Total" ? "right" : "left"
    });
  });

  y += 30;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#334155");

  quoteItems.forEach((item) => {
    if (y > 690) {
      pdf.addPage();
      y = 64;
    }

    pdf.text(`${item.productName} - ${item.variant}`, margin, y);
    pdf.text(item.placement, 250, y);
    pdf.text(`${item.quantity} ${item.unitLabel}`, 360, y);
    pdf.text(formatCurrency(item.unitPrice), 430, y);
    pdf.setFont("helvetica", "bold");
    pdf.text(formatCurrency(item.quantity * item.unitPrice), right, y, {
      align: "right"
    });
    pdf.setFont("helvetica", "normal");
    pdf.setDrawColor("#f1f5f9");
    pdf.line(margin, y + 14, right, y + 14);
    y += 34;
  });

  y += 24;
  const totalsX = 360;
  const valueX = right;
  pdf.setFontSize(10);
  [
    ["Subtotal", totals.subtotal],
    ["Shipping", totals.shipping],
    ["Tax (10%)", totals.tax]
  ].forEach(([label, value]) => {
    pdf.setFont("helvetica", "normal");
    pdf.text(String(label), totalsX, y);
    pdf.text(formatCurrency(Number(value)), valueX, y, { align: "right" });
    y += 22;
  });

  pdf.setDrawColor("#e2e8f0");
  pdf.line(totalsX, y - 8, valueX, y - 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor("#0f172a");
  pdf.text("Total", totalsX, y + 12);
  pdf.text(formatCurrency(totals.total), valueX, y + 12, { align: "right" });

  pdf.setFontSize(10);
  pdf.text(`Thank you for choosing ${normalizedBrandSettings.brand_name}.`, pageWidth / 2, 760, {
    align: "center"
  });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor("#64748b");
  pdf.text("We'll get back to you shortly!", pageWidth / 2, 778, {
    align: "center"
  });

  pdf.save(`${normalizedBrandSettings.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-quote.pdf`);
}
