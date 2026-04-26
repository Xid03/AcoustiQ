"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || "")
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    window.location.href = redirectedFrom;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 lg:grid-cols-[0.9fr_1fr]">
          <section className="hidden bg-slate-50 p-10 lg:block">
            <BrandLogo />
            <div className="mt-20">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                Sign in to manage leads, products, quotes, settings, and operations.
              </p>
            </div>
          </section>

          <form action={handleSubmit} className="p-6 sm:p-10">
            <BrandLogo className="mb-8 lg:hidden" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your admin credentials to continue.
            </p>

            <div className="mt-8 space-y-5">
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
                    placeholder="Enter your password"
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

            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-indigo-600">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
