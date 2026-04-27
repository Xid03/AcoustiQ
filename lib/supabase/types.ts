import type {
  LeadDetails,
  QuoteItem,
  RoomDetails
} from "@/lib/stores/configurator-store";

export type QuoteTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export type LeadRow = {
  id: string;
  company_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  project_name: string | null;
  project_type: string;
  source: string;
  status: "New" | "Contacted" | "Quote Sent" | "Viewed" | "Declined";
  marketing_consent: boolean;
  notes: string | null;
  created_at: string;
};

export type ProductRow = {
  id: string;
  company_id: string | null;
  name: string;
  category: string;
  price: number;
  unit_label: string;
  status: "Active" | "Inactive";
  stock: number;
  thumbnail_type: "wood" | "oak" | "cloud" | "baffle" | "corner" | "bass";
  image_url: string | null;
  created_at: string;
};

export type CompanyRow = {
  id: string;
  name: string;
  brand_name: string;
  primary_color: string;
  accent_color: string;
  quote_prefix: string;
  support_email: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  quote_id: string | null;
  customer_name: string;
  customer_email: string;
  total: number;
  payment_status: "Pending" | "Paid" | "Failed" | "Refunded";
  fulfillment_status: "New" | "Processing" | "Completed" | "Cancelled";
  created_at: string;
};

export type QuoteEmailEventRow = {
  id: string;
  quote_id: string;
  event_type: string;
  recipient_email: string;
  status: "pending" | "sent" | "failed";
  created_at: string;
};

export type CheckoutSessionRow = {
  id: string;
  quote_id: string | null;
  provider: string;
  provider_session_id: string | null;
  status: "created" | "paid" | "expired" | "failed";
  amount: number;
  currency: string;
  checkout_url: string | null;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "admin" | "manager" | "viewer";
  created_at: string;
};

export type QuoteRow = {
  id: string;
  lead_id: string;
  quote_number: string;
  room_details: RoomDetails;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Draft" | "Sent" | "Viewed" | "Accepted";
  created_at: string;
};

export type QuoteItemRow = {
  id: string;
  quote_id: string;
  product_name: string;
  variant: string;
  placement: string;
  placement_note: string | null;
  quantity: number;
  unit_label: string;
  unit_price: number;
  line_total: number;
};

export type LeadWithQuote = LeadRow & {
  quote_value: number | null;
  quote_number: string | null;
};

export type CreateLeadQuoteInput = {
  leadDetails: LeadDetails;
  roomDetails: RoomDetails;
  quoteItems: QuoteItem[];
  totals: QuoteTotals;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      companies: {
        Row: CompanyRow;
        Insert: Omit<CompanyRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CompanyRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      quote_email_events: {
        Row: QuoteEmailEventRow;
        Insert: Omit<QuoteEmailEventRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<QuoteEmailEventRow>;
        Relationships: [];
      };
      checkout_sessions: {
        Row: CheckoutSessionRow;
        Insert: Omit<CheckoutSessionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CheckoutSessionRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at"> & {
          created_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      quotes: {
        Row: QuoteRow;
        Insert: Omit<QuoteRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<QuoteRow>;
        Relationships: [];
      };
      quote_items: {
        Row: QuoteItemRow;
        Insert: Omit<QuoteItemRow, "id"> & {
          id?: string;
        };
        Update: Partial<QuoteItemRow>;
        Relationships: [];
      };
    };
    Views: {
      lead_quote_overview: {
        Row: LeadWithQuote;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
