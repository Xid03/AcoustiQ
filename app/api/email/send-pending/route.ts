import { NextResponse } from "next/server";

import { normalizeBrandSettings } from "@/lib/branding/brand-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const { data: companySettings } = await supabase
    .from("companies")
    .select("brand_name,support_email")
    .limit(1)
    .maybeSingle();
  const brandSettings = normalizeBrandSettings(companySettings);
  const emailFrom =
    process.env.EMAIL_FROM ||
    `${brandSettings.brand_name} <${brandSettings.support_email}>`;

  if (!resendApiKey) {
    return NextResponse.json(
      {
        error:
          "RESEND_API_KEY is not configured. Pending email events are queued but not sent."
      },
      { status: 501 }
    );
  }

  const { data: events, error } = await supabase
    .from("quote_email_events")
    .select("id, recipient_email, quote_id")
    .eq("status", "pending")
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;

  for (const event of events || []) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: emailFrom,
        to: event.recipient_email,
        subject: `Your ${brandSettings.brand_name} quote request was received`,
        html: `<p>Thank you for choosing ${brandSettings.brand_name}.</p><p>We received your quote request and will get back to you shortly.</p><p>You can contact us at ${brandSettings.support_email}.</p>`
      })
    });

    await supabase
      .from("quote_email_events")
      .update({ status: response.ok ? "sent" : "failed" })
      .eq("id", event.id);

    if (response.ok) {
      sent += 1;
    }
  }

  return NextResponse.json({ sent });
}
