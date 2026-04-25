import {
  Building2,
  Folder,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactFields = [
  {
    label: "Full Name",
    required: true,
    placeholder: "Enter your full name",
    icon: User,
    type: "text"
  },
  {
    label: "Email Address",
    required: true,
    placeholder: "Enter your email address",
    icon: Mail,
    type: "email"
  },
  {
    label: "Phone Number",
    required: false,
    placeholder: "Enter your phone number",
    icon: Phone,
    type: "tel"
  },
  {
    label: "Company Name",
    required: false,
    placeholder: "Enter your company name",
    icon: Building2,
    type: "text"
  }
];

export function LeadCaptureForm() {
  return (
    <form className="bg-transparent">
      <section aria-labelledby="contact-info-title">
        <h2
          id="contact-info-title"
          className="text-xl font-medium tracking-tight text-slate-800"
        >
          Contact Information
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {contactFields.map((field) => {
            const Icon = field.icon;

            return (
              <label key={field.label} className="block">
                <span className="text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-600" aria-hidden="true">
                      {" "}
                      *
                    </span>
                  ) : null}
                </span>
                <span className="relative mt-2 block">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="h-11 border-slate-300 bg-white pl-10 shadow-sm"
                    required={field.required}
                    aria-label={field.label}
                  />
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="project-info-title">
        <h2
          id="project-info-title"
          className="text-xl font-medium tracking-tight text-slate-800"
        >
          Project Information
        </h2>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Project Name</span>
            <span className="relative mt-2 block">
              <Folder className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Enter a name for your project"
                className="h-11 border-slate-300 bg-white pl-10 shadow-sm"
                aria-label="Project Name"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Additional Notes (Optional)
            </span>
            <span className="relative mt-2 block">
              <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Textarea
                placeholder="Tell us more about your project, timeline, or any specific requirements..."
                className="border-slate-300 bg-white pl-10 shadow-sm"
                aria-label="Additional Notes"
              />
            </span>
          </label>
        </div>
      </section>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <Checkbox defaultChecked className="mt-0.5" aria-label="Marketing consent" />
          <span>
            I agree to receive emails about products, updates, and offers.
          </span>
        </label>
        <p className="text-sm text-slate-500">
          We respect your privacy. Your information will never be shared.
        </p>
      </div>

      <Button type="button" className="mt-6 h-12 w-full gap-3 text-base">
        <Send className="h-4 w-4" />
        Send Me My Quote
      </Button>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Lock className="h-4 w-4" />
        Your information is secure and encrypted
      </p>
    </form>
  );
}
