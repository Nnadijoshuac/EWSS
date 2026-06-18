'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';
import TopNav from '@/components/TopNav';

const tankSizes = [
  { label: '1,000L', price: 7200, eta: '18 min' },
  { label: '2,500L', price: 14500, eta: '24 min' },
  { label: '5,000L', price: 26800, eta: '32 min' },
];

const suppliers = [
  {
    name: 'Coal City Water',
    area: 'Independence Layout',
    rating: '4.9',
    eta: '18 min',
    status: 'Fastest',
  },
  {
    name: 'Nike Lake Tankers',
    area: 'Trans Ekulu',
    rating: '4.8',
    eta: '22 min',
    status: 'Best price',
  },
  {
    name: 'Uwani Bulk Supply',
    area: 'Uwani',
    rating: '4.7',
    eta: '27 min',
    status: 'Bulk ready',
  },
];

const scheduleSlots = ['Today, 4-6 PM', 'Today, 6-8 PM', 'Tomorrow, 8-10 AM'];

const homeMapMarkers = [
  { id: 'you', lat: 6.42, lng: 7.55, label: 'You', value: 'You', tone: 'blue' as const, selected: true },
  { id: 'coal-city', lat: 6.45, lng: 7.52, label: 'Coal City Water', value: '\u{1F69A}', tone: 'dark' as const },
  { id: 'nike-lake', lat: 6.53, lng: 7.62, label: 'Nike Lake Tankers', value: '\u{1F69A}', tone: 'dark' as const },
  { id: 'uwani', lat: 6.5, lng: 7.65, label: 'Uwani Bulk Supply', value: '\u{1F69A}', tone: 'dark' as const },
];

export default function Home() {
  const [selectedTank, setSelectedTank] = useState(tankSizes[1]);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);
  const [serviceMode, setServiceMode] = useState<'Now' | 'Schedule'>('Now');
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleSlots[0]);
  const [address, setAddress] = useState('12 Chime Avenue, New Haven');

  const subsidy = useMemo(() => Math.round(selectedTank.price * 0.12), [selectedTank]);
  const total = selectedTank.price - subsidy + 650;
  const deliveryTime = serviceMode === 'Schedule' ? selectedSchedule : selectedSupplier.eta;

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <section id="book" className="pt-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8 lg:py-5">
          <aside className="rounded-lg border border-[#c0c7d2]/30 bg-white p-4 shadow-[0_4px_12px_rgba(0,94,151,0.08)]">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase text-[#404751]">Book a tanker</p>
              <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">Water delivery, made obvious.</h1>
              <p className="mt-2 text-sm font-semibold text-[#404751]">
                Choose where, when, tank size, then confirm. No calls. No guessing.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-[#404751]">Delivery address</span>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#c0c7d2] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#005e97]"
                />
              </label>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase text-[#404751]">Delivery time</span>
                <div className="grid grid-cols-2 rounded-lg bg-[#eceef0] p-1">
                  {(['Now', 'Schedule'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setServiceMode(mode)}
                      className={`h-9 rounded-md text-sm font-black transition ${
                        serviceMode === mode ? 'bg-white text-[#005e97] shadow-sm' : 'text-[#404751]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {serviceMode === 'Schedule' && (
                <div className="grid gap-2">
                  {scheduleSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSchedule(slot)}
                      className={`h-9 rounded-lg border px-3 text-left text-sm font-black transition ${
                        selectedSchedule === slot
                          ? 'border-[#005e97] bg-[#005e97] text-white'
                          : 'border-[#c0c7d2] bg-white text-[#191c1e]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <span className="mb-2 block text-xs font-bold uppercase text-[#404751]">Tank volume</span>
                <div className="grid grid-cols-3 gap-2">
                  {tankSizes.map((tank) => (
                    <button
                      key={tank.label}
                      type="button"
                      onClick={() => setSelectedTank(tank)}
                      className={`rounded-lg border p-2.5 text-left transition ${
                        selectedTank.label === tank.label
                          ? 'border-[#0077be] bg-[#0077be] text-white'
                          : 'border-[#c0c7d2] bg-white hover:border-[#0077be]'
                      }`}
                    >
                      <span className="block text-xs font-black sm:text-sm">{tank.label}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-65">{tank.eta}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase text-[#404751]">Supplier</span>
                <div className="space-y-2">
                  {suppliers.map((supplier) => (
                    <button
                      key={supplier.name}
                      type="button"
                      onClick={() => setSelectedSupplier(supplier)}
                      className={`w-full rounded-lg border p-2.5 text-left transition ${
                        selectedSupplier.name === supplier.name
                          ? 'border-[#0077be] bg-[#cfe5ff]'
                          : 'border-[#c0c7d2] bg-white hover:border-[#0077be]'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black">{supplier.name}</span>
                          <span className="mt-1 block truncate text-xs font-semibold text-[#404751]">
                            {supplier.area} - {supplier.rating} rating
                          </span>
                        </span>
                        <span className="shrink-0 rounded-md bg-[#005e97] px-2 py-1 text-xs font-black text-white">
                          {supplier.eta}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[#005e97] p-3 text-white">
              <div className="space-y-2 border-b border-white/10 pb-3 text-sm">
                <Row label="Water" value={`NGN ${selectedTank.price.toLocaleString()}`} />
                <Row label="Subsidy" value={`-NGN ${subsidy.toLocaleString()}`} positive />
                <Row label="Service fee" value="NGN 650" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span>
                  <span className="block text-xs font-bold uppercase text-white/45">Total</span>
                  <span className="text-2xl font-black">NGN {total.toLocaleString()}</span>
                </span>
                <Link
                  href="/request"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-black text-[#005e97] transition hover:bg-[#eceef0]"
                >
                  Confirm
                </Link>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-lg border border-[#c0c7d2]/30 bg-white shadow-[0_4px_12px_rgba(0,94,151,0.08)]">
            <div className="h-[360px] sm:h-[440px] lg:h-[560px]">
              <OpenStreetMap markers={homeMapMarkers} heightClass="h-full rounded-none" caption="Nearby tankers" />
            </div>

            <div className="grid gap-3 border-t border-[#c0c7d2]/30 p-3 sm:grid-cols-[1fr_150px] sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase text-[#404751]">Selected delivery</p>
                <h2 className="mt-1 text-lg font-black">{selectedSupplier.name}</h2>
                <p className="text-sm font-semibold text-[#404751]">
                  {selectedTank.label} to {address || 'your selected address'}
                </p>
                <p className="text-xs font-black text-[#404751]">
                  {serviceMode === 'Schedule' ? selectedSchedule : 'Arriving now'}
                </p>
              </div>
              <div className="rounded-lg bg-[#cfe5ff] p-3">
                <p className="text-xs font-bold uppercase text-[#004a79]">
                  {serviceMode === 'Schedule' ? 'Window' : 'ETA'}
                </p>
                <p className="mt-1 text-2xl font-black text-[#005e97]">
                  {serviceMode === 'Schedule' ? selectedSchedule.split(', ')[1] : deliveryTime}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="suppliers" className="border-y border-[#c0c7d2]/20 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-[#404751]">Marketplace</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Verified suppliers without the phone-call chaos.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {suppliers.map((supplier) => (
              <article key={supplier.name} className="rounded-lg border border-[#c0c7d2]/30 bg-[#f2f4f6] p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-[#404751]">{supplier.status}</span>
                  <span className="text-sm font-black">{supplier.rating}</span>
                </div>
                <h3 className="text-base font-black">{supplier.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#404751]">{supplier.area}</p>
                <p className="mt-4 text-sm font-bold text-[#404751]">{supplier.eta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="bg-[#f7f9fb] py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-lg bg-[#005e97] p-5 text-white lg:col-span-1">
            <p className="text-xs font-bold uppercase text-white/45">For city teams</p>
            <h2 className="mt-2 text-2xl font-black">Demand visibility, not guesswork.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/65">
              Track requests, subsidy use, complaints, and supply gaps in one operations view.
            </p>
            <Link href="/admin" className="mt-5 inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-black text-[#005e97]">
              View dashboard
            </Link>
          </div>

          <div className="grid gap-3 lg:col-span-2">
            {[
              { label: 'New Haven', value: 'High demand', tone: 'bg-red-500' },
              { label: 'GRA', value: '5 trucks nearby', tone: 'bg-emerald-500' },
              { label: 'Achara Layout', value: 'Subsidy active', tone: 'bg-[#0077be]' },
            ].map((zone) => (
              <article key={zone.label} className="rounded-lg border border-[#c0c7d2]/20 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-9 w-2 rounded-full ${zone.tone}`} />
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black">{zone.label}</h3>
                      <p className="text-sm font-semibold text-[#404751]">{zone.value}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-[#eceef0] px-3 py-2 text-xs font-black">Live</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-white/60">{label}</span>
      <span className={`font-black ${positive ? 'text-emerald-300' : 'text-white'}`}>{value}</span>
    </div>
  );
}
