import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClientKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseClientKey &&
      supabaseUrl.startsWith("https://") &&
      !supabaseUrl.includes("your-project")
  );
}

export function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseClientKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseClientKey);
}
