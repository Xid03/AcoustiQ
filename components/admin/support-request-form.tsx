"use client";

import { Mail, MessageSquareText, Phone, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useBrandSettings } from "@/lib/hooks/use-brand-settings";

export function SupportRequestForm() {
  const brandSettings = useBrandSettings();
  const [successOpen, setSuccessOpen] = useState(false);

  function handleSubmit(formData: FormData) {
    const subject = String(formData.get("subject") || "AcoustiQ support request");
    const priority = String(formData.get("priority") || "Normal");
    const message = String(formData.get("message") || "");
    const body = [
      `Priority: ${priority}`,
      "",
      "Message:",
      message,
      "",
      "Sent from AcoustiQ admin support."
    ].join("\n");

    window.location.href = `mailto:${brandSettings.support_email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSuccessOpen(true);
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          action={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-xl font-medium tracking-tight text-slate-900">
              Contact Support
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Send a support request with the details needed to investigate your issue.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Subject</span>
              <Input
                name="subject"
                placeholder="Example: Product image upload issue"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Priority</span>
              <select
                name="priority"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                defaultValue="Normal"
              >
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <Textarea
              name="message"
              placeholder="Describe what happened, which page you were on, and what you expected."
              required
            />
          </label>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Send Support Request
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-medium tracking-tight text-slate-900">
              Support Email
            </h2>
            <p className="mt-2 break-all text-sm text-slate-600">
              {brandSettings.support_email}
            </p>
            <Button asChild variant="outline" className="mt-5 w-full bg-white">
              <a href={`mailto:${brandSettings.support_email}`}>Email Support</a>
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <MessageSquareText className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-medium tracking-tight text-slate-900">
              What to Include
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Page URL and account email</li>
              <li>Steps that caused the issue</li>
              <li>Screenshot or exact error text</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Phone className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-medium tracking-tight text-slate-900">
              Response Time
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Normal requests are reviewed within one business day. Urgent quote or
              lead issues should be marked as urgent.
            </p>
          </div>
        </aside>
      </div>

      <SuccessDialog
        open={successOpen}
        title="Support request opened"
        message="Your email app has been opened with the support request details."
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
