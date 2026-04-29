import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calculator,
  FileText,
  Layers3,
  MailCheck,
  PackageCheck,
  PlayCircle,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import landingImage from "@/images/landing.png";

const trustItems = [
  {
    icon: Calculator,
    title: "Accurate Calculations",
    description: "Industry-standard formulas"
  },
  {
    icon: BadgeCheck,
    title: "Premium Products",
    description: "High-performance panels"
  },
  {
    icon: FileText,
    title: "Instant Quote",
    description: "Professional PDF included"
  }
];

const partners = ["SONICLAB", "SOUNDSPACE", "Acoustic Design Co.", "Studio Works", "HARMONY SPACES"];

const solutions = [
  {
    icon: Calculator,
    title: "Room Calculation",
    description:
      "Capture room dimensions, surface conditions, and usage type to estimate acoustic treatment coverage."
  },
  {
    icon: PackageCheck,
    title: "Product Recommendation",
    description:
      "Recommend panels, ceiling products, and bass traps from the active product catalog."
  },
  {
    icon: FileText,
    title: "Quote Automation",
    description:
      "Generate branded quote previews and capture lead information before handoff."
  },
  {
    icon: BarChart3,
    title: "Admin Workflow",
    description:
      "Manage leads, products, orders, quote statuses, and team access from one dashboard."
  }
];

const productCategories = [
  {
    title: "Wall Panels",
    description: "Decorative acoustic panels for office, studio, and hospitality walls.",
    meta: "Side wall coverage"
  },
  {
    title: "Ceiling Panels",
    description: "Cloud and baffle systems for reflection control in larger rooms.",
    meta: "Ceiling coverage"
  },
  {
    title: "Bass Traps",
    description: "Corner and low-frequency treatment for studios and media rooms.",
    meta: "Corner placement"
  }
];

const processSteps = [
  {
    title: "Enter Room Details",
    description: "Room type, dimensions, floor, ceiling, and window conditions."
  },
  {
    title: "Review Recommendations",
    description: "Adjust quantities, add products, and inspect treatment coverage."
  },
  {
    title: "Send Quote",
    description: "Capture customer details and store the lead, quote, and quote items."
  }
];

const resources = [
  {
    icon: SlidersHorizontal,
    title: "Configurator Guide",
    description: "Use the guided flow to test calculation, quote, and lead capture workflows.",
    href: "/configure"
  },
  {
    icon: ShieldCheck,
    title: "Admin Access",
    description: "Sign in to manage products, leads, orders, account settings, and roles.",
    href: "/login"
  },
  {
    icon: MailCheck,
    title: "Quote Follow-Up",
    description: "Review generated quote email events and send pending customer emails.",
    href: "/admin/leads"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto min-h-[calc(100vh-76px)] max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="grid items-center gap-2 px-6 pb-7 pt-9 sm:px-9 lg:grid-cols-[minmax(360px,0.76fr)_minmax(0,1.24fr)] lg:px-12 lg:pb-0 lg:pt-10">
            <div className="z-10 max-w-[490px] animate-fade-up">
              <h1 className="text-[2.5rem] font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.1rem]">
              Design better sound experiences.
                <span className="block text-[var(--brand-primary)]">
                  Get your custom quote in minutes.
                </span>
              </h1>

              <p className="mt-6 max-w-[405px] text-sm leading-6 text-slate-600">
                Our acoustic panel configurator helps you calculate exact
                requirements, explore products, and get a professional quote
                instantly.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 min-h-11 px-7 text-xs font-semibold">
                  <Link href="/configure">Start Configuring</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 min-h-11 gap-2 px-5 text-xs font-semibold"
                >
                  <Link href="#how-it-works">
                    <PlayCircle className="h-4 w-4 text-[var(--brand-primary)]" />
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative -mr-6 h-[300px] animate-fade-up sm:h-[390px] lg:-mr-12 lg:h-[455px]">
              <Image
                src={landingImage}
                alt="Modern acoustic conference room with wall panels"
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="rounded-[18px] object-cover object-[54%_50%] lg:rounded-r-[22px]"
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-2/5 rounded-l-[18px] bg-gradient-to-r from-white via-white/85 to-transparent lg:w-1/2"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/70 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>

          <div
            className="grid gap-4 px-6 pb-9 sm:grid-cols-3 sm:px-9 lg:max-w-[640px] lg:px-12"
            aria-label="Configurator benefits"
          >
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-[11px] font-semibold tracking-tight text-slate-800">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div id="solutions" className="scroll-mt-28 pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
              Solutions
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Built for acoustic companies that need quotes faster.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              AcoustiQ connects customer room input, product recommendations,
              lead capture, and admin follow-up in one white-label workflow.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution) => {
              const Icon = solution.icon;

              return (
                <article
                  key={solution.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-slate-900">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {solution.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div id="products" className="scroll-mt-28 pt-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                Products
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Product categories ready for quotation.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                The configurator recommends active catalog products and lets admins
                manage pricing, stock, images, and availability.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-white">
              <Link href="/configure">
                Try Product Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {productCategories.map((category) => (
              <article
                key={category.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {category.meta}
                </span>
                <h3 className="mt-5 text-xl font-medium tracking-tight text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div id="how-it-works" className="scroll-mt-28 pt-16">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                  How It Works
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  From room details to qualified quote in minutes.
                </h2>
              </div>
              <Button asChild>
                <Link href="/configure">Start Configuring</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <article key={step.title} className="rounded-lg bg-slate-50 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] font-mono text-sm font-medium text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div id="resources" className="scroll-mt-28 pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
              Resources
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Quick links for testing the system.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-slate-900">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {resource.description}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-medium text-[var(--brand-primary)]">
                    Open
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div id="about" className="scroll-mt-28 pt-16">
          <div className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_0.8fr] md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                About Us
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                A white-label quotation engine for acoustic treatment teams.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                AcoustiQ is designed for B2B acoustic companies that want a
                polished customer-facing configurator and an operational admin
                dashboard behind it.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              {[
                ["Lead Capture", "Qualified enquiries stored in Supabase."],
                ["Catalog Control", "Products, prices, images, and status managed by admins."],
                ["Quote Follow-Up", "Email queue, orders, and payment status tracking."]
              ].map(([title, description]) => (
                <div key={title} className="rounded-lg bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="partners" className="scroll-mt-28 pt-14">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">
            Trusted by businesses and professionals worldwide
          </p>
          <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-5 text-center sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner}
                className="rounded-lg px-3 py-2 text-sm font-bold tracking-tight text-slate-800"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        <div id="case-studies" className="scroll-mt-28 pt-16">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Corporate Office", "320 sq ft meeting suite quoted with wall and ceiling treatment."],
              ["Recording Studio", "Low-frequency control package with bass traps and panel coverage."],
              ["Home Theater", "Balanced reflection control plan with premium wall panels."]
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-medium tracking-tight text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
