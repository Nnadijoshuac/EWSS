'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopNav from '@/components/TopNav';
import VerificationBadge from '@/components/VerificationBadge';
import { WATER_SOURCES } from '@/lib/mock-data';
import { getSourceTypeLabel } from '@/lib/utils';
import { formatPrice } from '@/lib/pricing';

export default function VerifyPage() {
  const params = useParams();
  const source = WATER_SOURCES.find((item) => item.id === (params?.id as string));

  if (!source) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />
        <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-normal tracking-[-0.03em]">Water source not found.</h1>
          <Link href="/" className="btn-primary mt-6 inline-flex">Return home</Link>
        </main>
      </div>
    );
  }

  const facts = [
    { label: 'Location', value: source.area, note: `${source.distanceKm} km away` },
    { label: 'Status', value: 'Available', note: 'Active now' },
    { label: 'Price', value: `${formatPrice(Math.round(source.pricePerLitre))}/L` },
    { label: 'Capacity', value: `${(source.availableLitres / 1000).toFixed(1)}K L`, note: 'Available' },
    { label: 'Rating', value: `${source.rating.toFixed(1)}/5.0`, note: `${source.reviewCount} reviews` },
    { label: 'Last quality check', value: source.lastQualityCheck },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section>
            <div className="rounded-lg bg-[#10B981] p-6 text-white sm:p-8">
              <p className="text-sm text-[#f0f9ff]">Verification complete</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-normal leading-[1.1] tracking-[-0.035em] sm:text-[52px]">This source is registered with Vale.</h1>
            </div>

            <div className="mt-6 rounded-lg border border-[#d8d8d8] p-5 sm:p-8">
              <div className="flex flex-col gap-5 border-b border-[#d8d8d8] pb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-[#5e5e5e]">{getSourceTypeLabel(source.type)}</p>
                  <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] text-black sm:text-4xl">{source.name}</h2>
                  <p className="mt-3 text-sm text-[#5e5e5e]">Operated by {source.operatorName}</p>
                </div>
                <VerificationBadge verified={source.verified} verificationStatus={source.verificationStatus} />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#d8d8d8] bg-[#d8d8d8] sm:grid-cols-2 md:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="min-w-0 bg-white p-4 sm:p-5">
                    <p className="text-xs text-[#5e5e5e]">{fact.label}</p>
                    <p className="mt-2 break-words font-medium text-black">{fact.value}</p>
                    {fact.note && <p className="mt-1 text-xs text-[#767676]">{fact.note}</p>}
                  </div>
                ))}
              </div>

              {source.operatorPhone && (
                <a href={`tel:${source.operatorPhone}`} className="btn-secondary mt-6 block w-full text-center">Call {source.operatorPhone}</a>
              )}
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-lg bg-[#f6f6f6] p-6">
              <p className="text-sm text-[#5e5e5e]">Verification details</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-black">
                <li>Registered with Vale since January 2024</li>
                <li>Regular quality inspections conducted</li>
                <li>Legal documentation verified</li>
                <li>{source.complaintCount} complaint{source.complaintCount !== 1 ? 's' : ''} on record</li>
              </ul>
            </section>

            <section className="rounded-lg border border-[#d8d8d8] p-6">
              <h3 className="text-2xl font-normal tracking-[-0.02em]">Why trust this source?</h3>
              <p className="mt-3 text-sm leading-6 text-[#5e5e5e]">Credentials are verified, quality is checked regularly, and community reports remain attached to the operator record.</p>
            </section>

            <div className="grid gap-3">
              <Link href="/request" className="btn-primary text-center">Request water</Link>
              <Link href="/report" className="btn-secondary text-center">Report an issue</Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
