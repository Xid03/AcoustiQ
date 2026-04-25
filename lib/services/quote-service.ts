import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  CreateLeadQuoteInput,
  LeadWithQuote,
  ProductRow
} from "@/lib/supabase/types";

export const fallbackLeads: LeadWithQuote[] = [
  {
    id: "lead-acme",
    company_id: null,
    full_name: "Sarah Johnson",
    email: "sarah@acme.com",
    phone: null,
    company_name: "Acme Corporation",
    project_name: "Office Studio",
    project_type: "Office",
    source: "Website",
    status: "New",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-20T09:00:00.000Z",
    quote_value: 4030.4,
    quote_number: "AQ-2024-0567"
  },
  {
    id: "lead-soundwave",
    company_id: null,
    full_name: "Michael Brown",
    email: "michael@soundwave.com",
    phone: null,
    company_name: "SoundWave LLC",
    project_name: "Conference Room",
    project_type: "Conference Room",
    source: "Website",
    status: "Contacted",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-20T10:30:00.000Z",
    quote_value: 2156,
    quote_number: "AQ-2024-0568"
  },
  {
    id: "lead-horizon",
    company_id: null,
    full_name: "Emily Davis",
    email: "emily@horizondesign.com",
    phone: null,
    company_name: "Horizon Design",
    project_name: "Home Theater",
    project_type: "Home Theater",
    source: "Referral",
    status: "Quote Sent",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-19T14:20:00.000Z",
    quote_value: 5090,
    quote_number: "AQ-2024-0569"
  },
  {
    id: "lead-nextgen",
    company_id: null,
    full_name: "David Wilson",
    email: "david@nextgen.com",
    phone: null,
    company_name: "NextGen Offices",
    project_name: "Open Office",
    project_type: "Open Office",
    source: "Direct",
    status: "Viewed",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-19T16:45:00.000Z",
    quote_value: 3420,
    quote_number: "AQ-2024-0570"
  },
  {
    id: "lead-creative",
    company_id: null,
    full_name: "Jessica Taylor",
    email: "jessica@creativestudios.com",
    phone: null,
    company_name: "Creative Studios",
    project_name: "Recording Studio",
    project_type: "Recording Studio",
    source: "Website",
    status: "New",
    marketing_consent: false,
    notes: null,
    created_at: "2024-05-18T11:10:00.000Z",
    quote_value: null,
    quote_number: null
  },
  {
    id: "lead-bright",
    company_id: null,
    full_name: "Daniel Martinez",
    email: "daniel@brightspaces.com",
    phone: null,
    company_name: "Bright Spaces",
    project_name: "Office",
    project_type: "Office",
    source: "Referral",
    status: "Quote Sent",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-18T12:15:00.000Z",
    quote_value: 6250,
    quote_number: "AQ-2024-0571"
  },
  {
    id: "lead-elite",
    company_id: null,
    full_name: "Olivia Anderson",
    email: "olivia@eliteworkspace.com",
    phone: null,
    company_name: "Elite Workspace",
    project_name: "Conference Room",
    project_type: "Conference Room",
    source: "Direct",
    status: "Declined",
    marketing_consent: false,
    notes: null,
    created_at: "2024-05-17T09:30:00.000Z",
    quote_value: 1980,
    quote_number: "AQ-2024-0572"
  },
  {
    id: "lead-visionary",
    company_id: null,
    full_name: "James Lee",
    email: "james@visionarylab.com",
    phone: null,
    company_name: "Visionary Labs",
    project_name: "Home Studio",
    project_type: "Home Studio",
    source: "Website",
    status: "Contacted",
    marketing_consent: true,
    notes: null,
    created_at: "2024-05-17T13:00:00.000Z",
    quote_value: 2760,
    quote_number: "AQ-2024-0573"
  }
];

export const fallbackProducts: ProductRow[] = [
  {
    id: "wave-wood",
    company_id: null,
    name: "Acoustic Wall Panel - Wave Wood",
    category: "Wall Panels",
    price: 89,
    unit_label: "per panel",
    status: "Active",
    stock: 152,
    thumbnail_type: "wood",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "linear-oak",
    company_id: null,
    name: "Acoustic Wall Panel - Linear Oak",
    category: "Wall Panels",
    price: 92,
    unit_label: "per panel",
    status: "Active",
    stock: 98,
    thumbnail_type: "oak",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "cloud-1200",
    company_id: null,
    name: "Acoustic Ceiling Panel - Cloud 1200",
    category: "Ceiling Panels",
    price: 119,
    unit_label: "per panel",
    status: "Active",
    stock: 76,
    thumbnail_type: "cloud",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "baffle",
    company_id: null,
    name: "Acoustic Ceiling Panel - Baffle",
    category: "Ceiling Panels",
    price: 109,
    unit_label: "per panel",
    status: "Active",
    stock: 64,
    thumbnail_type: "baffle",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "corner-pro",
    company_id: null,
    name: "Bass Trap Corner - Pro Series",
    category: "Bass Traps",
    price: 99,
    unit_label: "per unit",
    status: "Active",
    stock: 120,
    thumbnail_type: "corner",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "bass-panel",
    company_id: null,
    name: "Bass Trap Panel - Pro Series",
    category: "Bass Traps",
    price: 89,
    unit_label: "per unit",
    status: "Inactive",
    stock: 0,
    thumbnail_type: "bass",
    image_url: null,
    created_at: "2024-05-01T00:00:00.000Z"
  }
];

function createQuoteNumber() {
  return `AQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function createLeadAndQuote(input: CreateLeadQuoteInput) {
  const supabase = createSupabaseClient();

  if (!supabase || !isSupabaseConfigured()) {
    return {
      ok: true,
      fallback: true,
      message:
        "Quote request saved locally. Add Supabase credentials to persist leads and quotes."
    };
  }

  const { leadDetails, quoteItems, roomDetails, totals } = input;

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      company_id: null,
      full_name: leadDetails.fullName,
      email: leadDetails.email,
      phone: leadDetails.phone || null,
      company_name: leadDetails.companyName || null,
      project_name: leadDetails.projectName || null,
      project_type: roomDetails.roomType,
      source: "Website",
      status: "New",
      marketing_consent: leadDetails.marketingConsent,
      notes: leadDetails.additionalNotes || null
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    throw new Error(leadError?.message || "Unable to create lead.");
  }

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      lead_id: lead.id,
      quote_number: createQuoteNumber(),
      room_details: roomDetails,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      status: "Sent"
    })
    .select("id")
    .single();

  if (quoteError || !quote) {
    throw new Error(quoteError?.message || "Unable to create quote.");
  }

  const { error: itemsError } = await supabase.from("quote_items").insert(
    quoteItems.map((item) => ({
      quote_id: quote.id,
      product_name: item.productName,
      variant: item.variant,
      placement: item.placement,
      placement_note: item.placementNote || null,
      quantity: item.quantity,
      unit_label: item.unitLabel,
      unit_price: item.unitPrice,
      line_total: item.quantity * item.unitPrice
    }))
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    ok: true,
    fallback: false,
    message: "Quote sent successfully. Your lead and quote are now stored in Supabase."
  };
}

export async function getLeadsWithQuotes(): Promise<LeadWithQuote[]> {
  const supabase = createSupabaseClient();

  if (!supabase || !isSupabaseConfigured()) {
    return fallbackLeads;
  }

  const { data, error } = await supabase
    .from("lead_quote_overview")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return fallbackLeads;
  }

  return data as unknown as LeadWithQuote[];
}

export async function getProducts(): Promise<ProductRow[]> {
  const supabase = createSupabaseClient();

  if (!supabase || !isSupabaseConfigured()) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return fallbackProducts;
  }

  return data as unknown as ProductRow[];
}

export async function getProductsDataSource() {
  const products = await getProducts();
  const isFallback =
    products.length === fallbackProducts.length &&
    products.every((product, index) => product.id === fallbackProducts[index]?.id);

  return {
    products,
    source: isFallback ? "fallback" : "supabase"
  };
}
