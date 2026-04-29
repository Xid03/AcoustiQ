"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Users,
  User,
  Volume2
} from "lucide-react";
import { useState } from "react";

import registerBackground from "@/images/backgroundregister.png";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBrandSettings } from "@/lib/hooks/use-brand-settings";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const brandSettings = useBrandSettings();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = createSupabaseClient();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email") || ""),
      password,
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
    <div className="relative min-h-screen overflow-hidden bg-white">
      <Image
        src={registerBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/94 via-white/84 to-white/72" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-indigo-100/70 to-transparent" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[0.55fr_0.45fr]">
        <section className="hidden px-16 py-10 lg:flex lg:flex-col">
          <div className="relative z-10">
            <BrandLogo className="min-h-0" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-center pb-24 pl-8 xl:pl-14">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="mt-8 text-xl leading-8 text-slate-600">
                Join thousands of acoustic professionals who trust{" "}
                {brandSettings.brand_name}.
              </p>
            </div>

            <div className="mt-16 space-y-10">
              {[
                {
                  icon: Volume2,
                  title: "Powerful Configurator",
                  description: "Create accurate acoustic solutions in minutes."
                },
                {
                  icon: FileText,
                  title: "Professional Quotes",
                  description: "Generate branded PDF quotes instantly."
                },
                {
                  icon: Users,
                  title: "Lead Management",
                  description: "Track, manage, and convert more qualified leads."
                }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-6">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Icon className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-xl font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 max-w-xl text-lg leading-7 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center p-8 lg:-translate-x-12 xl:-translate-x-16">
          <form
            action={handleSubmit}
            className="w-full max-w-[620px] rounded-xl bg-white p-10 shadow-xl shadow-slate-200/70"
          >
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-5 text-xl text-slate-500">
                Fill in your details to get started.
              </p>
            </div>

            <div className="mt-12 space-y-8">
            <label className="block">
              <span className="text-xl font-medium text-slate-700">Full name</span>
              <span className="relative mt-4 block">
                <User className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <Input name="fullName" required placeholder="Yazid Zaqwan" className="h-16 pl-16 text-xl" />
              </span>
            </label>
            <label className="block">
              <span className="text-xl font-medium text-slate-700">Email address</span>
              <span className="relative mt-4 block">
                <Mail className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-16 pl-16 text-xl"
                />
              </span>
            </label>
            <label className="block">
              <span className="text-xl font-medium text-slate-700">Password</span>
              <span className="relative mt-4 block">
                <Lock className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  className="h-16 px-16 text-xl"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </span>
            </label>
            <label className="block">
              <span className="text-xl font-medium text-slate-700">Confirm password</span>
              <span className="relative mt-4 block">
                <Lock className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Confirm your password"
                  className="h-16 px-16 text-xl"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </span>
            </label>
          </div>

          <label className="mt-10 flex items-center gap-5 text-lg font-medium text-slate-600">
            <input
              type="checkbox"
              required
              className="h-6 w-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-indigo-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-indigo-600">
                Privacy Policy
              </Link>
            </span>
          </label>

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

          <Button type="submit" className="mt-7 h-16 w-full text-xl" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <p className="mt-9 text-center text-xl text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600">
              Sign in
            </Link>
          </p>
          </form>
        </section>
      </div>
    </div>
  );
}
