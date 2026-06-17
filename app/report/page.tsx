'use client';

import Link from 'next/link';
import TopNav from '@/components/TopNav';
import ReportIssueForm from '@/components/ReportIssueForm';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f2]">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Link href="/demo" className="text-sm font-bold text-neutral-600 hover:text-neutral-950">
          Back to map
        </Link>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-neutral-500">Support</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">
              Report a water issue.
            </h1>
            <p className="mt-2 text-sm font-semibold text-neutral-500">
              Tell us what happened. Reports help protect residents and keep suppliers accountable.
            </p>

            <div className="mt-6">
              <ReportIssueForm
                onSubmit={(report) => {
                  console.log('Report submitted:', report);
                }}
              />
            </div>
          </section>

          <aside className="rounded-lg bg-neutral-950 p-5 text-white">
            <p className="text-xs font-bold uppercase text-white/45">What happens next</p>
            <h2 className="mt-2 text-2xl font-black">Reviewed within 24 hours.</h2>
            <div className="mt-5 space-y-4">
              {[
                'High-severity reports are prioritized first.',
                'Supplier patterns affect verification status.',
                'Your identity stays private unless you choose otherwise.',
              ].map((text, index) => (
                <div key={text} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-neutral-950">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
