"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type LeadCaptureFormValues,
  leadCaptureSchema
} from "@/lib/schemas/configurator-schema";
import { useConfiguratorStore } from "@/lib/stores/configurator-store";

const contactFields = [
  {
    name: "fullName",
    label: "Full Name",
    required: true,
    placeholder: "Enter your full name",
    icon: User,
    type: "text"
  },
  {
    name: "email",
    label: "Email Address",
    required: true,
    placeholder: "Enter your email address",
    icon: Mail,
    type: "email"
  },
  {
    name: "phone",
    label: "Phone Number",
    required: false,
    placeholder: "Enter your phone number",
    icon: Phone,
    type: "tel"
  },
  {
    name: "companyName",
    label: "Company Name",
    required: false,
    placeholder: "Enter your company name",
    icon: Building2,
    type: "text"
  }
] as const;

export function LeadCaptureForm() {
  const setLeadDetails = useConfiguratorStore((state) => state.setLeadDetails);
  const localSubmissionMessage = useConfiguratorStore(
    (state) => state.localSubmissionMessage
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      projectName: "",
      additionalNotes: "",
      marketingConsent: true
    }
  });

  const onSubmit = (values: LeadCaptureFormValues) => {
    setLeadDetails(values);
  };

  return (
    <form className="bg-transparent" onSubmit={handleSubmit(onSubmit)}>
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
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={`${field.name}-error`}
                    {...register(field.name)}
                  />
                </span>
                {errors[field.name]?.message ? (
                  <span
                    id={`${field.name}-error`}
                    className="mt-1 block text-xs text-red-600"
                  >
                    {errors[field.name]?.message}
                  </span>
                ) : null}
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
                {...register("projectName")}
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
                aria-invalid={Boolean(errors.additionalNotes)}
                aria-describedby="additionalNotes-error"
                {...register("additionalNotes")}
              />
            </span>
            {errors.additionalNotes?.message ? (
              <span id="additionalNotes-error" className="mt-1 block text-xs text-red-600">
                {errors.additionalNotes.message}
              </span>
            ) : null}
          </label>
        </div>
      </section>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <Controller
            control={control}
            name="marketingConsent"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                className="mt-0.5"
                aria-label="Marketing consent"
              />
            )}
          />
          <span>
            I agree to receive emails about products, updates, and offers.
          </span>
        </label>
        <p className="text-sm text-slate-500">
          We respect your privacy. Your information will never be shared.
        </p>
      </div>

      <Button type="submit" className="mt-6 h-12 w-full gap-3 text-base">
        <Send className="h-4 w-4" />
        Send Me My Quote
      </Button>

      {isSubmitSuccessful && localSubmissionMessage ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {localSubmissionMessage}
        </p>
      ) : null}

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Lock className="h-4 w-4" />
        Your information is secure and encrypted
      </p>
    </form>
  );
}
