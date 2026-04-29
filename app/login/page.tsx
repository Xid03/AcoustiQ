"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, FileText, Lock, Mail, Users, Volume2 } from "lucide-react";
import { Suspense, useState } from "react";

import registerBackground from "@/images/backgroundregister.png";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

    setShowSuccess(true);
    window.setTimeout(() => {
      window.location.href = redirectedFrom;
    }, 1200);
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);

    const supabase = createSupabaseClient();

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectedFrom}`
      }
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {isSubmitting ? (
        <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-indigo-100">
          <div className="login-progress-bar h-full w-1/2 rounded-r-full bg-indigo-600" />
        </div>
      ) : null}

      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-2xl shadow-slate-900/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
              Login successful
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Welcome back. Redirecting you to your dashboard now.
            </p>
          </div>
        </div>
      ) : null}

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
            <BrandLogo />
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-center pb-24 pl-8 xl:pl-14">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-8 text-slate-600">
                Sign in to access your dashboard and manage your projects, products, and leads.
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
            <BrandLogo className="mb-10 lg:hidden" />
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-5 text-xl text-slate-500">
                Enter your email and password to continue.
              </p>
            </div>

            <div className="mt-12 space-y-8">
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
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="h-16 px-16 text-xl"
                  />
                  <Eye className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <label className="flex items-center gap-4 text-lg font-medium text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-6 w-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-lg font-medium text-indigo-600">
                Forgot password?
              </Link>
            </div>

            {errorMessage ? (
              <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" className="mt-8 h-16 w-full text-xl" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="my-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-base font-medium text-slate-500">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-16 w-full border-slate-300 bg-white text-xl font-medium text-slate-700 hover:bg-slate-50"
              onClick={handleGoogleSignIn}
            >
              <span className="mr-3 text-2xl font-semibold text-blue-600">G</span>
              Continue with Google
            </Button>

            <p className="mt-9 text-center text-xl text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-indigo-600">
                Sign up
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
