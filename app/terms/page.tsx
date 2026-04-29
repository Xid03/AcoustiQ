export default function TermsPage() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
            Terms
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Terms of Use
          </h1>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              AcoustiQ quote calculations are estimates based on submitted room
              details, selected products, and configured pricing. Final product
              suitability, installation scope, and commercial terms should be
              confirmed by the acoustic treatment provider.
            </p>
            <p>
              Admin users are responsible for keeping product prices, stock,
              branding, support details, and team roles accurate.
            </p>
            <p>
              Payment and fulfillment statuses should reflect confirmed business
              activity. Manual updates are the responsibility of authorized admin
              or manager users.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
