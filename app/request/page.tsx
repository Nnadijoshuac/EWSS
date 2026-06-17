'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import WaterSourceList from '@/components/WaterSourceList';
import OrderTracker from '@/components/OrderTracker';
import OpenStreetMap from '@/components/OpenStreetMap';
import { UserRole, WaterOrder } from '@/lib/types';
import { WATER_SOURCES, ENUGU_AREAS, DEMO_SUBSIDY_VOUCHER } from '@/lib/mock-data';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { getSortedSourcesByDistance } from '@/lib/utils';

const quantities = [1000, 2500, 5000, 10000];
const scheduleSlots = ['Today, 4-6 PM', 'Today, 6-8 PM', 'Tomorrow, 8-10 AM'];

export default function RequestPage() {
  const [role] = useState<UserRole>('resident');
  const [selectedArea, setSelectedArea] = useState('New Haven');
  const [selectedQuantity, setSelectedQuantity] = useState(2500);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>('src-005');
  const [useSubsidy, setUseSubsidy] = useState(true);
  const [deliveryMode, setDeliveryMode] = useState<'now' | 'schedule'>('now');
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleSlots[0]);
  const [createdOrder, setCreatedOrder] = useState<WaterOrder | null>(null);

  const selectedSource = WATER_SOURCES.find((source) => source.id === selectedSourceId);
  const filteredSources = selectedArea
    ? getSortedSourcesByDistance(WATER_SOURCES.filter((source) => source.area === selectedArea))
    : getSortedSourcesByDistance(WATER_SOURCES);

  const pricing = selectedSource
    ? calculatePrice(
        selectedQuantity,
        selectedSource.pricePerLitre,
        selectedSource.distanceKm,
        useSubsidy ? DEMO_SUBSIDY_VOUCHER.discountPercent : 0,
        useSubsidy ? DEMO_SUBSIDY_VOUCHER.maxLitres : Infinity
      )
    : null;

  const deliveryTime =
    deliveryMode === 'schedule'
      ? selectedSchedule
      : `${selectedSource?.etaMinutes || Math.ceil((selectedSource?.distanceKm || 1) * 8)} mins`;

  const handleCreateOrder = () => {
    if (!selectedSource || !pricing) return;

    setCreatedOrder({
      id: `order-${Date.now()}`,
      residentName: 'Joshua Nnadi',
      residentArea: selectedArea,
      quantityLitres: selectedQuantity,
      sourceId: selectedSource.id,
      sourceName: selectedSource.name,
      status: 'accepted',
      price: pricing.total,
      subsidyApplied: useSubsidy,
      subsidyAmount: pricing.subsidyDiscount,
      deliveryFee: pricing.deliveryFee,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: deliveryTime,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f2]">
      <TopNav currentRole={role} onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/demo" className="text-sm font-bold text-neutral-600 hover:text-neutral-950">
            Back to map
          </Link>
          <h1 className="mt-2 text-2xl font-black leading-tight text-neutral-950 sm:text-3xl">
            Confirm your water delivery.
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-neutral-500">
            Four decisions, then you are done: where, when, tank size, payment.
          </p>
        </div>

        {createdOrder ? (
          <div className="mx-auto max-w-3xl">
            <section className="mb-6 rounded-lg bg-neutral-950 p-5 text-white">
              <p className="text-xs font-bold uppercase text-white/45">Order confirmed</p>
              <h2 className="mt-2 text-2xl font-black">Your tanker is being prepared.</h2>
              <p className="mt-2 text-sm font-semibold text-white/65">
                Order #{createdOrder.id.split('-')[1]} - {createdOrder.estimatedDeliveryTime}
              </p>
            </section>
            <OrderTracker order={createdOrder} />
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-4 gap-1 text-center text-[11px] font-black text-neutral-500">
              {['Where', 'When', 'Tank', 'Pay'].map((step, index) => (
                <div key={step} className="rounded-md bg-white px-1 py-2">
                  {index + 1}. {step}
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[330px_1fr_300px]">
              <aside className="space-y-4">
                <section className="card">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase text-neutral-500">Delivery area</span>
                    <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} className="input-field">
                      {ENUGU_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase text-neutral-500">Delivery time</p>
                    <div className="grid grid-cols-2 rounded-lg bg-neutral-100 p-1">
                      {[
                        { id: 'now', label: 'Now' },
                        { id: 'schedule', label: 'Schedule' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDeliveryMode(mode.id as 'now' | 'schedule')}
                          className={`h-9 rounded-md text-sm font-black transition ${
                            deliveryMode === mode.id ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {deliveryMode === 'schedule' && (
                    <div className="mt-3 grid gap-2">
                      {scheduleSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSchedule(slot)}
                          className={`h-9 rounded-lg border px-3 text-left text-sm font-black transition ${
                            selectedSchedule === slot
                              ? 'border-neutral-950 bg-neutral-950 text-white'
                              : 'border-black/10 bg-white text-neutral-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase text-neutral-500">Tank size</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quantities.map((quantity) => (
                        <button
                          key={quantity}
                          type="button"
                          onClick={() => setSelectedQuantity(quantity)}
                          className={`rounded-lg border p-2.5 text-left transition ${
                            selectedQuantity === quantity
                              ? 'border-neutral-950 bg-neutral-950 text-white'
                              : 'border-black/10 bg-white text-neutral-950'
                          }`}
                        >
                          <span className="block text-sm font-black">{quantity.toLocaleString()}L</span>
                          <span className="text-xs font-semibold opacity-70">Tank delivery</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                    Apply subsidy
                    <input
                      type="checkbox"
                      checked={useSubsidy}
                      onChange={(event) => setUseSubsidy(event.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </section>

                <section className="card">
                  <h2 className="mb-3 text-lg font-black">Supplier</h2>
                  <WaterSourceList
                    sources={filteredSources}
                    selectedSourceId={selectedSourceId}
                    onSelectSource={setSelectedSourceId}
                  />
                </section>
              </aside>

              <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
                <OpenStreetMap
                  markers={filteredSources.map((source) => ({
                    id: source.id,
                    lat: source.coordinates.lat,
                    lng: source.coordinates.lng,
                    label: source.name,
                    selected: selectedSourceId === source.id,
                    value:
                      source.type === 'tanker' || source.type === 'subsidized_truck'
                        ? '\u{1F69A}'
                        : source.etaMinutes
                          ? String(source.etaMinutes)
                          : 'OK',
                    tone: source.status === 'offline' ? 'red' : 'dark',
                  }))}
                  heightClass="h-[340px] md:h-[560px]"
                  onMarkerClick={setSelectedSourceId}
                  caption="Delivery route preview"
                />
                <div className="border-t border-black/10 p-3">
                  <p className="text-xs font-bold uppercase text-neutral-500">Selected supplier</p>
                  <p className="mt-1 text-base font-black text-neutral-950">{selectedSource?.name || 'Choose a supplier'}</p>
                  <p className="text-sm font-semibold text-neutral-500">
                    {deliveryTime} - {selectedQuantity.toLocaleString()}L
                  </p>
                </div>
              </section>

              <aside className="self-start rounded-lg bg-neutral-950 p-4 text-white shadow-xl">
                <p className="text-xs font-bold uppercase text-white/45">Order summary</p>
                <h2 className="mt-2 text-xl font-black">{selectedSource?.name || 'Select a supplier'}</h2>
                <p className="mt-1 text-sm font-semibold text-white/60">
                  {selectedQuantity.toLocaleString()}L to {selectedArea}
                </p>
                <p className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-black">{deliveryTime}</p>

                {pricing && selectedSource && (
                  <>
                    <div className="my-4 space-y-3 border-y border-white/10 py-4 text-sm">
                      <Row label="Water" value={formatPrice(pricing.waterCost)} />
                      <Row label="Delivery" value={formatPrice(pricing.deliveryFee)} />
                      {pricing.subsidyDiscount > 0 && (
                        <Row label="Subsidy" value={`-${formatPrice(pricing.subsidyDiscount)}`} positive />
                      )}
                    </div>
                    <div className="mb-4 flex items-end justify-between">
                      <span>
                        <span className="block text-xs font-bold uppercase text-white/45">Total</span>
                        <span className="text-2xl font-black">{formatPrice(pricing.total)}</span>
                      </span>
                    </div>
                    <button onClick={handleCreateOrder} className="h-10 w-full rounded-lg bg-white text-sm font-black text-neutral-950">
                      Confirm order
                    </button>
                  </>
                )}
              </aside>
            </div>
          </>
        )}
      </main>

      {!createdOrder && pricing && selectedSource && (
        <div className="fixed bottom-20 left-3 right-3 z-40 rounded-lg bg-neutral-950 p-3 text-white shadow-2xl md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-white/45">Total</p>
              <p className="text-xl font-black">{formatPrice(pricing.total)}</p>
            </div>
            <button onClick={handleCreateOrder} className="h-12 rounded-lg bg-white px-5 text-sm font-black text-neutral-950">
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
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
