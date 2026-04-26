import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyRow, OrderRow } from "@/lib/supabase/types";

export const fallbackCompany: CompanyRow = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Demo Acoustic Company",
  brand_name: "AcoustiQ",
  primary_color: "#4f46e5",
  accent_color: "#10b981",
  quote_prefix: "AQ",
  support_email: "support@acoustiq.com",
  created_at: "2024-05-01T00:00:00.000Z"
};

export const fallbackOrders: OrderRow[] = [
  {
    id: "ord-001",
    quote_id: null,
    customer_name: "Sarah Johnson",
    customer_email: "sarah@acme.com",
    total: 4030.4,
    payment_status: "Pending",
    fulfillment_status: "New",
    created_at: "2024-05-20T09:00:00.000Z"
  },
  {
    id: "ord-002",
    quote_id: null,
    customer_name: "Michael Brown",
    customer_email: "michael@soundwave.com",
    total: 2156,
    payment_status: "Paid",
    fulfillment_status: "Processing",
    created_at: "2024-05-20T10:30:00.000Z"
  }
];

export async function getCompanySettings() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return fallbackCompany;
    }

    return data as CompanyRow;
  } catch {
    return fallbackCompany;
  }
}

export async function getOrders() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return fallbackOrders;
    }

    return data as OrderRow[];
  } catch {
    return fallbackOrders;
  }
}
