'use client';

import TopNav from '@/components/TopNav';
import ReportIssueForm from '@/components/ReportIssueForm';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="rounded-lg border border-[#d8d8d8] bg-white p-5 sm:p-8">
            <p className="text-sm text-[#5e5e5e]">Support</p>
            <h1 className="mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
              Report a water issue.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
              Tell us what happened. Reports help protect residents and keep suppliers accountable.
            </p>

            <div className="mt-6">
              <ReportIssueForm
                onSubmit={(report) => {
                  const key = 'vale:resident-reports';
                  const stored = window.localStorage.getItem(key);
                  const reports = stored ? JSON.parse(stored) : [];
                  window.localStorage.setItem(
                    key,
                    JSON.stringify([report, ...reports])
                  );
                }}
              />
            </div>
          </section>

          <aside className="rounded-lg bg-[#FF7B68] p-6 text-white lg:sticky lg:top-24">
            <p className="text-xs text-[#f0f9ff]">What happens next</p>
            <h2 className="mt-2 text-2xl font-normal">Reviewed within 24 hours.</h2>
            <div className="mt-5 space-y-4">
              {[
                'High-severity reports are prioritized first.',
                'Supplier patterns affect verification status.',
                'Your identity stays private unless you choose otherwise.',
              ].map((text, index) => (
                <div key={text} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium text-[#FF7B68]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[#f0f9ff]">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
