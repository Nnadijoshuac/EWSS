'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';

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
    price: 7200,
    status: 'Fastest',
  },
  {
    name: 'Nike Lake Tankers',
    area: 'Trans-Ekulu',
    rating: '4.8',
    eta: '22 min',
    price: 6900,
    status: 'Best price',
  },
  {
    name: 'Uwani Bulk Supply',
    area: 'Uwani',
    rating: '4.7',
    eta: '27 min',
    price: 7600,
    status: 'Bulk ready',
  },
];

const demandZones = [
  { label: 'New Haven', value: 'High demand', tone: 'bg-red-500' },
  { label: 'GRA', value: '5 trucks nearby', tone: 'bg-emerald-500' },
  { label: 'Achara Layout', value: 'Subsidy active', tone: 'bg-blue-500' },
];

const homeMapMarkers = [
  { id: 'you', lat: 6.42, lng: 7.55, label: 'You', value: 'You', tone: 'blue' as const, selected: true },
  { id: 'coal-city', lat: 6.45, lng: 7.52, label: 'Coal City Water', value: '18', tone: 'dark' as const },
  { id: 'nike-lake', lat: 6.53, lng: 7.62, label: 'Nike Lake Tankers', value: '22', tone: 'dark' as const },
  { id: 'uwani', lat: 6.5, lng: 7.65, label: 'Uwani Bulk Supply', value: '27', tone: 'dark' as const },
  { id: 'demand', lat: 6.44, lng: 7.5, label: 'High demand zone', value: '54', tone: 'red' as const },
];

export default function Home() {
  const [selectedTank, setSelectedTank] = useState(tankSizes[1]);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);
  const [serviceMode, setServiceMode] = useState('Now');
  const [address, setAddress] = useState('12 Chime Avenue, New Haven');

  const subsidy = useMemo(() => Math.round(selectedTank.price * 0.12), [selectedTank]);
  const total = selectedTank.price - subsidy + 650;

  return (
    <main className="min-h-screen bg-[#f5f6f2] text-neutral-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-[#f5f6f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="AquaTrust home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-sm font-black text-white">
              AT
            </span>
            <span>
              <span className="block text-sm font-black leading-none">AquaTrust</span>
              <span className="block text-xs font-semibold text-neutral-500">WaterLink</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-neutral-600 md:flex">
            <a href="#book">Book</a>
            <a href="#suppliers">Suppliers</a>
            <a href="#insights">Insights</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden rounded-lg px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-black/5 sm:inline-flex"
            >
              Admin
            </Link>
            <Link
              href="/request"
              className="inline-flex h-10 items-center rounded-lg bg-neutral-950 px-5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Order water
            </Link>
          </div>
        </div>
      </header>

      <section id="book" className="pt-20 lg:min-h-screen lg:pt-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8 lg:py-8">
          <aside className="order-1 rounded-lg border border-black/10 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:self-start">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-neutral-500">Water request</p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
                  Order water like a ride.
                </h1>
              </div>
              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                Live
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-lg bg-neutral-100 p-1">
              {['Now', 'Schedule'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setServiceMode(mode)}
                  className={`h-11 rounded-md text-sm font-black transition ${
                    serviceMode === mode ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-neutral-500">
                  Delivery address
                </span>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-neutral-950"
                />
              </label>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase text-neutral-500">
                  Tank volume
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {tankSizes.map((tank) => (
                    <button
                      key={tank.label}
                      type="button"
                      onClick={() => setSelectedTank(tank)}
                      className={`rounded-lg border p-3 text-left transition ${
                        selectedTank.label === tank.label
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <span className="block text-sm font-black">{tank.label}</span>
                      <span
                        className={`mt-1 block text-xs font-semibold ${
                          selectedTank.label === tank.label ? 'text-white/65' : 'text-neutral-500'
                        }`}
                      >
                        {tank.eta}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase text-neutral-500">
                  Nearby suppliers
                </span>
                <div className="space-y-2">
                  {suppliers.map((supplier) => (
                    <button
                      key={supplier.name}
                      type="button"
                      onClick={() => setSelectedSupplier(supplier)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedSupplier.name === supplier.name
                          ? 'border-neutral-950 bg-neutral-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span>
                          <span className="block text-sm font-black">{supplier.name}</span>
                          <span className="mt-1 block text-xs font-semibold text-neutral-500">
                            {supplier.area} - {supplier.rating} rating
                          </span>
                        </span>
                        <span className="rounded-md bg-neutral-950 px-2 py-1 text-xs font-black text-white">
                          {supplier.eta}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-neutral-950 p-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                <span className="font-semibold text-white/65">Water</span>
                <span className="font-black">NGN {selectedTank.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm">
                <span className="font-semibold text-white/65">Subsidy applied</span>
                <span className="font-black text-emerald-300">-NGN {subsidy.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="font-semibold text-white/65">Service fee</span>
                <span className="font-black">NGN 650</span>
              </div>
              <div className="flex items-end justify-between pt-2">
                <span>
                  <span className="block text-xs font-bold uppercase text-white/45">Total</span>
                  <span className="text-3xl font-black">NGN {total.toLocaleString()}</span>
                </span>
                <Link
                  href="/request"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-5 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
                >
                  Request tank
                </Link>
              </div>
            </div>
          </aside>

          <div className="order-2 overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="relative min-h-[430px] p-4 sm:min-h-[560px] sm:p-6 lg:min-h-[calc(100vh-8rem)]">
              <div className="absolute inset-0">
                <OpenStreetMap markers={homeMapMarkers} heightClass="h-full rounded-none" caption="OpenStreetMap dispatch layer" />
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-lg bg-white px-4 py-3 shadow-xl">
                  <p className="text-xs font-bold uppercase text-neutral-500">Enugu coverage</p>
                  <p className="mt-1 text-sm font-black">24 verified tankers online</p>
                </div>
                <div className="flex rounded-lg bg-neutral-950/70 p-1 text-xs font-black text-white backdrop-blur">
                  <span className="rounded-md bg-white px-3 py-2 text-neutral-950">Tanks</span>
                  <span className="px-3 py-2 text-white/70">Boreholes</span>
                  <span className="px-3 py-2 text-white/70">Demand</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg bg-white p-3 shadow-2xl sm:bottom-6 sm:left-6 sm:right-6 sm:p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-xs font-bold uppercase text-neutral-500">
                        Driver assigned
                      </p>
                    </div>
                    <h2 className="text-xl font-black sm:text-2xl">{selectedSupplier.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-neutral-500">
                      {selectedTank.label} clean water to {address || 'your selected address'}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {['Accepted', 'Filling', 'On route'].map((step, index) => (
                        <div key={step} className="min-w-0">
                          <div className={`h-1.5 rounded-full ${index < 2 ? 'bg-neutral-950' : 'bg-neutral-200'}`} />
                          <p className="mt-2 truncate text-xs font-bold text-neutral-500">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#ecfdf3] p-3 sm:p-4">
                    <p className="text-xs font-bold uppercase text-emerald-700">ETA</p>
                    <p className="mt-1 text-3xl font-black text-emerald-950 sm:text-4xl">{selectedSupplier.eta}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-800">{selectedSupplier.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="suppliers" className="border-y border-black/10 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500">Marketplace</p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Verified supply without the phone-call chaos.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {suppliers.map((supplier) => (
              <article key={supplier.name} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-neutral-700">
                    {supplier.status}
                  </span>
                  <span className="text-sm font-black">{supplier.rating}</span>
                </div>
                <h3 className="text-lg font-black">{supplier.name}</h3>
                <p className="mt-1 text-sm font-semibold text-neutral-500">{supplier.area}</p>
                <div className="mt-5 flex items-end justify-between">
                  <span className="text-sm font-bold text-neutral-500">{supplier.eta}</span>
                  <span className="text-xl font-black">NGN {supplier.price.toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="bg-[#f5f6f2] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-lg bg-neutral-950 p-6 text-white lg:col-span-1">
            <p className="text-xs font-bold uppercase text-white/45">For city teams</p>
            <h2 className="mt-3 text-3xl font-black">Demand visibility, not guesswork.</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-white/65">
              See where households are requesting tanks, where subsidies are flowing, and where supply gaps are forming.
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-white px-5 text-sm font-black text-neutral-950"
            >
              View dashboard
            </Link>
          </div>

          <div className="grid gap-3 lg:col-span-2">
            {demandZones.map((zone) => (
              <article key={zone.label} className="rounded-lg border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className={`h-10 w-2 rounded-full ${zone.tone}`} />
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-black">{zone.label}</h3>
                      <p className="mt-1 text-sm font-semibold text-neutral-500">{zone.value}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-black">Live feed</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
