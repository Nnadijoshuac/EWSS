'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {step === 'browse' ? (
          <>
            <div className="mt-8 grid gap-8 border-b border-[#d8d8d8] pb-12 lg:grid-cols-[1fr_360px] lg:items-end">
              <section>
                <p className="text-sm text-[#5e5e5e]">Bulk orders</p>
                <h1 className="mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
                  Share a tanker. Pay less.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
                  Join neighbors nearby or start a request for your street. The app handles the coordination.
                </p>
              </section>

              <section className="rounded-lg bg-[#10B981] p-6 text-white">
                <p className="text-xs text-[#f0f9ff]">Smart saving</p>
                <p className="mt-2 text-4xl font-normal">20–30%</p>
                <p className="mt-2 text-sm leading-6 text-[#f0f9ff]">
                  Typical savings when households share delivery and volume pricing.
                </p>
                <button
                  onClick={() => setStep('create')}
                  className="mt-5 h-12 w-full rounded-lg bg-white text-sm font-medium text-[#10B981]"
                >
                  Start bulk request
                </button>
              </section>
            </div>

            <div className="mt-12">
              <CommunityBulkRequest bulkRequests={SAMPLE_BULK_REQUESTS} />
            </div>
          </>
        ) : (
          <section className="mx-auto mt-8 max-w-2xl rounded-lg border border-[#d8d8d8] bg-white p-5 sm:p-8">
            <button onClick={() => setStep('browse')} className="mb-5 text-sm text-[#5e5e5e] underline underline-offset-4">
              Back
            </button>
            <h1 className="text-3xl font-normal tracking-[-0.03em] text-black sm:text-4xl">Start a bulk request.</h1>
            <p className="mt-3 text-sm leading-6 text-[#5e5e5e]">
              Set the area and target volume. Neighbors can join once it is live.
            </p>

            <form onSubmit={handleCreateBulkRequest} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-black">Area</span>
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
                <span className="mb-2 block text-sm font-medium text-black">Street or estate</span>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(event) => setFormData({ ...formData, street: event.target.value })}
                  placeholder="e.g. Street 4, Unity Estate"
                  className="input-field"
                />
              </label>

              <div>
                <p className="mb-2 text-sm font-medium text-black">Target volume</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[5000, 10000, 15000, 20000].map((quantity) => (
                    <button
                      key={quantity}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetLitres: quantity })}
                      className={`h-12 rounded-lg border text-sm font-medium ${
                        formData.targetLitres === quantity
                          ? 'border-[#10B981] bg-[#10B981] text-white'
                          : 'border-[#d8d8d8] bg-white text-black'
                      }`}
                    >
                      {quantity / 1000}K L
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-[#f6f6f6] p-4">
                <p className="text-xs text-[#5e5e5e]">Estimated per household</p>
                <p className="mt-1 text-3xl font-normal text-black">
                  {formatPrice(Math.round((formData.targetLitres * 35) / 5))}
                </p>
                <p className="mt-1 text-xs text-[#5e5e5e]">Assuming 5 households. Cost drops as more join.</p>
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
