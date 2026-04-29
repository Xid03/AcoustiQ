export default function PrivacyPage() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
            Privacy
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              AcoustiQ stores quote requests, room details, selected products,
              and customer contact information so acoustic treatment teams can
              prepare and follow up on professional quotations.
            </p>
            <p>
              Admin account information is used for authentication, access
              control, support, and operational workflows. Product and quote data
              may be used to improve recommendations and reporting.
            </p>
            <p>
              Customer data should only be accessed by authorized users. Exported
              lead or quote data must be handled according to your company policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
