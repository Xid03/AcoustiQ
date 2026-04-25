import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Calculator, FileText, PlayCircle } from "lucide-react";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto min-h-[calc(100vh-76px)] max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="grid items-center gap-2 px-6 pb-7 pt-9 sm:px-9 lg:grid-cols-[minmax(360px,0.76fr)_minmax(0,1.24fr)] lg:px-12 lg:pb-0 lg:pt-10">
            <div className="z-10 max-w-[490px] animate-fade-up">
              <h1 className="text-[2.5rem] font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.1rem]">
              Design better sound experiences.
                <span className="block text-indigo-600">
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
                    <PlayCircle className="h-4 w-4 text-indigo-600" />
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
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

        <div id="how-it-works" className="pt-10">
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
      </section>
    </div>
  );
}
