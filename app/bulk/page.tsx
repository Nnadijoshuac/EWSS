'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import CommunityBulkRequest from '@/components/CommunityBulkRequest';
import { SAMPLE_BULK_REQUESTS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/pricing';

export default function BulkPage() {
  const [step, setStep] = useState<'browse' | 'create'>('browse');
  const [formData, setFormData] = useState({
    area: '',
    street: '',
    targetLitres: 5000,
  });

  const handleCreateBulkRequest = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Bulk request created. Neighbors in ${formData.area} can now join.`);
    setStep('browse');
    setFormData({ area: '', street: '', targetLitres: 5000 });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Link href="/demo" className="text-sm font-bold text-[#404751] hover:text-[#191c1e]">
          Back to map
        </Link>

        {step === 'browse' ? (
          <>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
              <section>
                <p className="text-xs font-bold uppercase text-[#404751]">Bulk orders</p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-[#191c1e] sm:text-4xl">
                  Share a tanker. Pay less.
                </h1>
                <p className="mt-2 text-sm font-semibold text-[#404751]">
                  Join neighbors nearby or start a request for your street. The app handles the coordination.
                </p>
              </section>

              <section className="rounded-lg bg-[#005e97] p-5 text-white">
                <p className="text-xs font-bold uppercase text-white/45">Smart saving</p>
                <p className="mt-2 text-3xl font-black">20-30%</p>
                <p className="mt-2 text-sm font-semibold text-white/65">
                  Typical savings when households share delivery and volume pricing.
                </p>
                <button
                  onClick={() => setStep('create')}
                  className="mt-5 h-12 w-full rounded-lg bg-white text-sm font-black text-[#191c1e]"
                >
                  Start bulk request
                </button>
              </section>
            </div>

            <div className="mt-5">
              <CommunityBulkRequest bulkRequests={SAMPLE_BULK_REQUESTS} />
            </div>
          </>
        ) : (
          <section className="mx-auto mt-5 max-w-2xl rounded-lg border border-[#c0c7d2]/30 bg-white p-5 shadow-sm">
            <button onClick={() => setStep('browse')} className="mb-4 text-sm font-bold text-[#404751]">
              Back
            </button>
            <h1 className="text-3xl font-black text-[#191c1e]">Start a bulk request.</h1>
            <p className="mt-2 text-sm font-semibold text-[#404751]">
              Set the area and target volume. Neighbors can join once it is live.
            </p>

            <form onSubmit={handleCreateBulkRequest} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-[#191c1e]">Area</span>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(event) => setFormData({ ...formData, area: event.target.value })}
                  placeholder="e.g. Thinkers Corner"
                  className="input-field"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-[#191c1e]">Street or estate</span>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(event) => setFormData({ ...formData, street: event.target.value })}
                  placeholder="e.g. Street 4, Unity Estate"
                  className="input-field"
                />
              </label>

              <div>
                <p className="mb-2 text-sm font-black text-[#191c1e]">Target volume</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[5000, 10000, 15000, 20000].map((quantity) => (
                    <button
                      key={quantity}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetLitres: quantity })}
                      className={`h-12 rounded-lg border text-sm font-black ${
                        formData.targetLitres === quantity
                          ? 'border-[#005e97] bg-[#005e97] text-white'
                          : 'border-[#c0c7d2]/30 bg-white text-[#191c1e]'
                      }`}
                    >
                      {quantity / 1000}K L
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase text-emerald-700">Estimated per household</p>
                <p className="mt-1 text-3xl font-black text-emerald-950">
                  {formatPrice(Math.round((formData.targetLitres * 35) / 5))}
                </p>
                <p className="mt-1 text-xs font-bold text-emerald-700">Assuming 5 households. Cost drops as more join.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setStep('browse')} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create request
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
