import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
};

export function BrandLogo({ className, markClassName }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-[44px] items-center gap-3 rounded-lg text-slate-950 transition-colors duration-150 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        className
      )}
      aria-label="AcoustiQ home"
    >
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600",
          markClassName
        )}
        aria-hidden="true"
      >
        <span className="absolute left-2 h-3 w-0.5 rounded-full bg-indigo-500" />
        <span className="absolute left-[13px] h-5 w-0.5 rounded-full bg-indigo-600" />
        <span className="absolute left-[18px] h-7 w-0.5 rounded-full bg-indigo-500" />
        <span className="absolute left-[23px] h-4 w-0.5 rounded-full bg-indigo-600" />
      </span>
      <span className="text-base font-semibold tracking-tight">AcoustiQ</span>
    </Link>
  );
}
