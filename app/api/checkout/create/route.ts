import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    quoteId?: string;
    amount?: number;
    currency?: string;
  };

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "A positive checkout amount is required." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("checkout_sessions")
    .insert({
      quote_id: body.quoteId || null,
      provider: "manual",
      provider_session_id: null,
      status: "created",
      amount: body.amount,
      currency: body.currency || "MYR",
      checkout_url: null
    })
    .select("id, status, amount, currency")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    checkoutSession: data,
    message:
      "Manual checkout session created. Connect Stripe or another payment provider to generate hosted payment URLs."
  });
}
