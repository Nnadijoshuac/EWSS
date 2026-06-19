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
    <main className="relative h-[100dvh] overflow-hidden bg-[#eef3f6] text-[#191c1e]">
      <OpenStreetMap
        markers={markers}
        center={{ lat: 6.4433, lng: 7.555 }}
        zoom={13}
        heightClass="h-full rounded-none"
        showChrome={false}
        showSelectedLabels={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/80" />

      <header className="absolute left-0 right-0 top-0 z-30 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#005e97] text-sm font-black text-white">
              VA
            </span>
            <span>
              <span className="block text-sm font-black leading-none">Vale</span>
              <span className="block text-xs font-semibold text-[#404751]">Tanker dispatch</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/report" className="rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#191c1e] shadow-lg backdrop-blur">
              Help
            </Link>
            <Link href="/supplier" className="hidden rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#191c1e] shadow-lg backdrop-blur sm:inline-flex">
              Drive
            </Link>
          </div>
        </div>
      </header>

      <section className="absolute left-3 right-3 top-20 z-20 mx-auto max-w-3xl rounded-2xl bg-white p-3 shadow-xl md:left-6 md:right-auto md:top-24 md:w-[410px]">
        <div className="grid gap-2">
          <label className="flex items-center gap-3 rounded-xl bg-[#f2f4f6] px-3 py-3">
            <span className="h-3 w-3 rounded-full bg-[#005e97]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-black uppercase tracking-wide text-[#404751]">Pickup</span>
              <input
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-black text-[#191c1e] outline-none"
              />
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-xl bg-[#f2f4f6] px-3 py-3">
            <span className="h-3 w-3 rounded-full bg-[#191c1e]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-black uppercase tracking-wide text-[#404751]">Drop-off</span>
              <input
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-black text-[#191c1e] outline-none"
              />
            </span>
          </label>
        </div>
      </section>

      <section className="absolute bottom-0 left-0 right-0 z-30 rounded-t-[28px] bg-white p-4 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-20px_60px_rgba(0,0,0,0.18)] md:left-auto md:right-6 md:top-24 md:bottom-auto md:w-[420px] md:rounded-2xl md:p-5">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#c0c7d2] md:hidden" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#404751]">Choose tanker</p>
            <h1 className="mt-1 text-2xl font-black">Water to your door</h1>
          </div>
          <div className="rounded-xl bg-[#cfe5ff] px-3 py-2 text-right">
            <p className="text-[11px] font-black uppercase text-[#004a79]">ETA</p>
            <p className="text-lg font-black text-[#005e97]">{selectedTanker.eta}</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-xl bg-[#eceef0] p-1">
          {[
            { id: 'now', label: 'Now' },
            { id: 'schedule', label: 'Schedule' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setDeliveryMode(mode.id as 'now' | 'schedule')}
              className={`h-10 rounded-lg text-sm font-black transition ${
                deliveryMode === mode.id ? 'bg-white text-[#005e97] shadow-sm' : 'text-[#404751]'
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
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  active ? 'border-[#005e97] bg-[#f0f8ff]' : 'border-[#c0c7d2]/50 bg-white hover:border-[#0077be]'
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black ${active ? 'bg-[#005e97] text-white' : 'bg-[#eceef0] text-[#191c1e]'}`}>
                  {tanker.litres.replace(',000L', 'K')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-base font-black">{tanker.name}</span>
                    <span className="shrink-0 text-base font-black">NGN {tanker.price.toLocaleString()}</span>
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-[#404751]">
                    {tanker.litres} - {tanker.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-[#f2f4f6] p-3">
          <div className="flex items-center justify-between text-sm font-bold text-[#404751]">
            <span>Service fee</span>
            <span>NGN {fee.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-wide text-[#404751]">Estimated total</span>
            <span className="text-2xl font-black">NGN {total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          href="/request"
          className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-[#005e97] text-base font-black text-white shadow-lg transition hover:bg-[#004a79]"
        >
          Confirm tanker
        </Link>
      </section>
    </main>
  );
}
