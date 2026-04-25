import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  { number: 1, label: "Room Details" },
  { number: 2, label: "Select Products" },
  { number: 3, label: "Results" }
];

type StepProgressProps = {
  currentStep?: number;
};

export function StepProgress({ currentStep = 1 }: StepProgressProps) {
  return (
    <div className="flex w-full items-center gap-3" aria-label="Quote progress">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isComplete = step.number < currentStep;

        return (
          <div key={step.number} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150",
                  isActive && "bg-indigo-600 text-white",
                  isComplete && "bg-emerald-100 text-emerald-700",
                  !isActive && !isComplete && "bg-slate-100 text-slate-500"
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : step.number}
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs font-medium sm:inline",
                  isActive ? "text-indigo-700" : "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className="mx-4 h-px flex-1 bg-slate-200" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
