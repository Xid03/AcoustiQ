import { Headphones, Lock, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over RM1,500"
  },
  {
    icon: ShieldCheck,
    title: "2 Year Warranty",
    description: "On all products"
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "We're here to help"
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Your data is safe"
  }
];

export function QuoteBenefitsRow() {
  return (
    <section className="border-t border-slate-200 pt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div key={benefit.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-medium tracking-tight text-slate-800">
                  {benefit.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
