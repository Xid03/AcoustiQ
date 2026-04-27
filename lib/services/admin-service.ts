import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CompanyRow,
  LeadWithQuote,
  OrderRow,
  ProductRow,
  ProfileRow
} from "@/lib/supabase/types";

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

export async function getCompanySettings() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return fallbackCompany;
    }

    throw new Error(error.message);
  }

  if (!data) {
    return fallbackCompany;
  }

  return data as CompanyRow;
}

export async function getTeamMembers() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_url,created_at,email,full_name,id,role")
    .order("created_at", { ascending: true });

  if (error) {
    return {
      currentUserId: user?.id || null,
      members: [] as ProfileRow[]
    };
  }

  return {
    currentUserId: user?.id || null,
    members: (data || []) as ProfileRow[]
  };
}

export async function getAdminProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [] as ProductRow[];
  }

  return data as ProductRow[];
}

export async function getAdminLeadsWithQuotes() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_quote_overview")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as LeadWithQuote[];
  }

  return data as unknown as LeadWithQuote[];
}

export async function getOrders() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [] as OrderRow[];
    }

    return data as OrderRow[];
  } catch {
    return [] as OrderRow[];
  }
}
