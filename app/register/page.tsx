"use client";

import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      options: {
        data: {
          full_name: String(formData.get("fullName") || "")
        }
      }
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Account created. Check your email if confirmation is enabled, then sign in.");
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <form
          action={handleSubmit}
          className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-10"
        >
          <BrandLogo />
          <h1 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create an admin account for your AcoustiQ workspace.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <span className="relative mt-2 block">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input name="fullName" required placeholder="John Doe" className="pl-10" />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email address</span>
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10"
                />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <span className="relative mt-2 block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  className="pl-10"
                />
              </span>
            </label>
          </div>

          {errorMessage ? (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {successMessage ? (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
