'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';

type TankerOption = {
  id: string;
  name: string;
  litres: string;
  eta: string;
  price: number;
  note: string;
};

const tankers: TankerOption[] = [
  { id: 'quick', name: 'Vale Quick', litres: '5,000L', eta: '12 min', price: 45000, note: 'Fastest nearby tanker' },
  { id: 'standard', name: 'Vale Standard', litres: '10,000L', eta: '18 min', price: 80000, note: 'Best for homes' },
  { id: 'bulk', name: 'Vale Bulk', litres: '20,000L', eta: '25 min', price: 150000, note: 'Estate and business use' },
];

const markers = [
  { id: 'you', lat: 6.42, lng: 7.55, label: 'Delivery point', value: 'You', tone: 'blue' as const, selected: true },
  { id: 'quick', lat: 6.45, lng: 7.52, label: 'Vale Quick', value: '5K', tone: 'dark' as const },
  { id: 'standard', lat: 6.48, lng: 7.59, label: 'Vale Standard', value: '10K', tone: 'green' as const },
  { id: 'bulk', lat: 6.39, lng: 7.61, label: 'Vale Bulk', value: '20K', tone: 'amber' as const },
];

export default function TankerBookingFlow() {
  const [selectedTanker, setSelectedTanker] = useState(tankers[0]);
  const [pickup, setPickup] = useState('Nearest verified depot');
  const [dropoff, setDropoff] = useState('12 Chime Avenue, New Haven');
  const [deliveryMode, setDeliveryMode] = useState<'now' | 'schedule'>('now');

  const fee = 650;
  const total = useMemo(() => selectedTanker.price + fee, [selectedTanker]);

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#f6f6f6] text-black">
      <OpenStreetMap
        markers={markers}
        center={{ lat: 6.4433, lng: 7.555 }}
        zoom={13}
        heightClass="h-full rounded-none"
        showChrome={false}
        showSelectedLabels={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-white/10" />

      <header className="absolute left-0 right-0 top-0 z-30 bg-black px-4 sm:px-6">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="text-xl font-bold tracking-[-0.04em]">Vale</span>
            <span>
              <span className="hidden text-xs text-[#afafaf] sm:block">Tanker dispatch</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/report" className="rounded-full px-4 py-2 text-sm text-white transition hover:bg-[#333333]">
              Help
            </Link>
            <Link href="/supplier" className="hidden rounded-full bg-white px-4 py-2 text-sm text-black sm:inline-flex">
              Drive
            </Link>
          </div>
        </div>
      </header>

      <section className="absolute left-3 right-3 top-20 z-20 mx-auto max-w-3xl rounded-lg border border-[#d8d8d8] bg-white p-3 md:left-6 md:right-auto md:top-20 md:w-[410px] lg:left-[max(24px,calc((100vw-1200px)/2))]">
        <div className="grid gap-2">
          <label className="flex items-center gap-3 rounded-lg bg-[#f6f6f6] px-3 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-black" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-[#5e5e5e]">Pickup</span>
              <input
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-medium text-black outline-none"
              />
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-lg bg-[#f6f6f6] px-3 py-3">
            <span className="h-2.5 w-2.5 bg-black" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-[#5e5e5e]">Drop-off</span>
              <input
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-medium text-black outline-none"
              />
            </span>
          </label>
        </div>
      </section>

      <section className="absolute bottom-0 left-0 right-0 z-30 max-h-[66dvh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-[max(env(safe-area-inset-bottom),1rem)] md:bottom-auto md:left-auto md:right-6 md:top-20 md:max-h-[calc(100dvh-96px)] md:w-[420px] md:rounded-lg md:border md:border-[#d8d8d8] md:p-5 lg:right-[max(24px,calc((100vw-1200px)/2))]">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#d8d8d8] md:hidden" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#5e5e5e]">Choose tanker</p>
            <h1 className="mt-1 text-2xl font-normal tracking-[-0.02em]">Water to your door</h1>
          </div>
          <div className="rounded-lg bg-[#f6f6f6] px-3 py-2 text-right">
            <p className="text-[11px] text-[#5e5e5e]">ETA</p>
            <p className="text-lg font-medium text-black">{selectedTanker.eta}</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-full bg-[#f6f6f6] p-1">
          {[
            { id: 'now', label: 'Now' },
            { id: 'schedule', label: 'Schedule' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setDeliveryMode(mode.id as 'now' | 'schedule')}
              className={`h-10 rounded-full text-sm font-medium transition ${
                deliveryMode === mode.id ? 'bg-black text-white' : 'text-[#5e5e5e]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {tankers.map((tanker) => {
            const active = selectedTanker.id === tanker.id;

            return (
              <button
                key={tanker.id}
                type="button"
                onClick={() => setSelectedTanker(tanker)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                  active ? 'border-black bg-[#f6f6f6]' : 'border-[#d8d8d8] bg-white hover:border-black'
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${active ? 'bg-black text-white' : 'bg-[#f6f6f6] text-black'}`}>
                  {tanker.litres.replace(',000L', 'K')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-base font-medium">{tanker.name}</span>
                    <span className="shrink-0 text-sm font-medium sm:text-base">NGN {tanker.price.toLocaleString()}</span>
                  </span>
                  <span className="mt-1 block text-xs text-[#5e5e5e]">
                    {tanker.litres} - {tanker.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg bg-[#f6f6f6] p-3">
          <div className="flex items-center justify-between text-sm text-[#5e5e5e]">
            <span>Service fee</span>
            <span>NGN {fee.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-black">Estimated total</span>
            <span className="text-2xl font-normal">NGN {total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          href="/request"
          className="mt-4 flex h-14 w-full items-center justify-center rounded-lg bg-black text-base font-medium text-white transition hover:bg-[#333333]"
        >
          Confirm tanker
        </Link>
      </section>
    </main>
  );
}
