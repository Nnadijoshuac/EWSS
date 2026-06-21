'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import WaterSourceList from '@/components/WaterSourceList';
import OrderTracker from '@/components/OrderTracker';
import OpenStreetMap from '@/components/OpenStreetMap';
import { UserRole, WaterOrder } from '@/lib/types';
import { WATER_SOURCES, ENUGU_AREAS, DEMO_SUBSIDY_VOUCHER } from '@/lib/mock-data';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { Coordinates, getClosestSource, getSortedSourcesByDistance, getSourcesWithLiveDistance } from '@/lib/utils';
import { saveResidentOrder } from '@/lib/order-storage';

const quantities = [1000, 2500, 5000, 10000];
const scheduleSlots = ['Today, 4-6 PM', 'Today, 6-8 PM', 'Tomorrow, 8-10 AM'];

export default function RequestPage() {
  const router = useRouter();
  const [role] = useState<UserRole>('resident');
  const [selectedArea, setSelectedArea] = useState('New Haven');
  const [selectedQuantity, setSelectedQuantity] = useState(2500);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>('src-005');
  const [useSubsidy, setUseSubsidy] = useState(true);
  const [deliveryMode, setDeliveryMode] = useState<'now' | 'schedule'>('now');
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleSlots[0]);
  const [createdOrder, setCreatedOrder] = useState<WaterOrder | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sourceId = params.get('source');
    const quantity = Number(params.get('quantity'));
    const mode = params.get('mode');
    const source = WATER_SOURCES.find((item) => item.id === sourceId);

    if (source) {
      setSelectedSourceId(source.id);
      setSelectedArea(source.area);
    }
    if ([1000, 2500, 5000, 10000].includes(quantity)) setSelectedQuantity(quantity);
    if (mode === 'now' || mode === 'schedule') setDeliveryMode(mode);
  }, []);

  const sourcesWithLiveDistance = useMemo(
    () => getSourcesWithLiveDistance(WATER_SOURCES, userLocation),
    [userLocation]
  );

  const selectedSource = sourcesWithLiveDistance.find((source) => source.id === selectedSourceId);
  const filteredSources = selectedArea
    ? getSortedSourcesByDistance(sourcesWithLiveDistance.filter((source) => source.area === selectedArea))
    : getSortedSourcesByDistance(sourcesWithLiveDistance);
  const closestTanker = userLocation
    ? getClosestSource(sourcesWithLiveDistance, ['tanker', 'subsidized_truck'])
    : undefined;

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

    const order: WaterOrder = {
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
    };

    saveResidentOrder(order);
    setCreatedOrder(order);
    router.push(`/orders?created=${order.id}`);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nextSources = getSourcesWithLiveDistance(WATER_SOURCES, nextLocation);
        const nearestTanker = getClosestSource(nextSources, ['tanker', 'subsidized_truck']);

        setUserLocation(nextLocation);
        setSelectedArea('');
        setSelectedSourceId(nearestTanker?.id || null);
        setLocationStatus('ready');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={role} onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-32 pt-24 sm:px-6 sm:pt-28 lg:px-8 xl:pb-28">
        <div className="mb-8 border-b border-[#d8d8d8] pb-8">
          <h1 className="text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
            Confirm your water delivery.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">
            Choose delivery details, select a verified supplier, and confirm with transparent pricing.
          </p>
          <button
            type="button"
            onClick={handleUseLocation}
            className="mt-5 h-11 w-full rounded-lg border border-[#767676] bg-white px-4 text-sm font-medium text-black transition hover:bg-[#f6f6f6] sm:w-auto"
          >
            {locationStatus === 'loading' ? 'Finding closest tanker...' : 'Use my location'}
          </button>
          {locationStatus === 'error' && (
            <p className="mt-2 text-xs font-medium text-black">
              Location was not available. You can still choose an area manually.
            </p>
          )}
        </div>

        {createdOrder ? (
          <div className="mx-auto max-w-3xl">
            <section className="mb-6 rounded-lg bg-[#FF7B68] p-6 text-white">
              <p className="text-xs text-[#f0f9ff]">Order confirmed</p>
              <h2 className="mt-2 text-2xl font-normal">Your tanker is being prepared.</h2>
              <p className="mt-2 text-sm text-[#f0f9ff]">
                Order #{createdOrder.id.split('-')[1]} - {createdOrder.estimatedDeliveryTime}
              </p>
            </section>
            <OrderTracker order={createdOrder} />
          </div>
        ) : (
          <>
            <div className="grid min-w-0 gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_280px]">
              <aside className="min-w-0 space-y-4">
                <section className="card">
                  <label className="block">
                    <span className="mb-2 block text-xs text-[#5e5e5e]">Delivery area</span>
                    <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} className="input-field">
                      {ENUGU_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-4">
                    <p className="mb-2 text-xs text-[#5e5e5e]">Delivery time</p>
                    <div className="grid grid-cols-2 rounded-full bg-[#f6f6f6] p-1">
                      {[
                        { id: 'now', label: 'Now' },
                        { id: 'schedule', label: 'Schedule' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDeliveryMode(mode.id as 'now' | 'schedule')}
                          className={`h-9 rounded-full text-sm font-medium transition ${
                            deliveryMode === mode.id ? 'bg-[#FF7B68] text-white' : 'text-[#5e5e5e]'
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
                          className={`h-10 rounded-lg border px-3 text-left text-sm font-medium transition ${
                            selectedSchedule === slot
                              ? 'border-[#FF7B68] bg-[#FF7B68] text-white'
                              : 'border-[#d8d8d8] bg-white text-[#5e5e5e]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="mb-2 text-xs text-[#5e5e5e]">Tank size</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quantities.map((quantity) => (
                        <button
                          key={quantity}
                          type="button"
                          onClick={() => setSelectedQuantity(quantity)}
                          className={`rounded-lg border p-2.5 text-left transition ${
                            selectedQuantity === quantity
                              ? 'border-[#FF7B68] bg-[#FF7B68] text-white'
                              : 'border-[#d8d8d8] bg-white text-black'
                          }`}
                        >
                          <span className="block text-sm font-medium">{quantity.toLocaleString()}L</span>
                          <span className="text-xs opacity-70">Tank delivery</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="mt-4 flex items-center justify-between rounded-lg bg-[#f6f6f6] p-3 text-sm font-medium text-black">
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
                  <h2 className="mb-3 text-xl font-normal">Supplier</h2>
                  <WaterSourceList
                    sources={filteredSources}
                    selectedSourceId={selectedSourceId}
                    onSelectSource={setSelectedSourceId}
                    closestSourceId={closestTanker?.id}
                  />
                </section>
              </aside>

              <section className="min-w-0 overflow-hidden rounded-lg border border-[#d8d8d8] bg-white lg:sticky lg:top-24 lg:self-start">
                <OpenStreetMap
                  markers={[
                    ...filteredSources.map((source) => ({
                      id: source.id,
                      lat: source.coordinates.lat,
                      lng: source.coordinates.lng,
                      label: source.name,
                      value:
                        source.type === 'tanker' || source.type === 'subsidized_truck'
                          ? '\u{1F69A}'
                          : source.etaMinutes
                            ? String(source.etaMinutes)
                            : 'OK',
                      tone:
                        closestTanker?.id === source.id
                          ? ('amber' as const)
                          : source.status === 'offline'
                            ? ('red' as const)
                            : ('dark' as const),
                      selected: selectedSourceId === source.id || closestTanker?.id === source.id,
                    })),
                    ...(userLocation
                      ? [
                          {
                            id: 'user-location',
                            lat: userLocation.lat,
                            lng: userLocation.lng,
                            label: 'Your location',
                            value: 'You',
                            tone: 'blue' as const,
                            selected: true,
                          },
                        ]
                      : []),
                  ]}
                  center={userLocation || undefined}
                  heightClass="h-[300px] sm:h-[420px] lg:h-[620px]"
                  onMarkerClick={setSelectedSourceId}
                  caption="Delivery route preview"
                />
                <div className="border-t border-[#d8d8d8] p-4">
                  <p className="text-xs text-[#5e5e5e]">Selected supplier</p>
                  <p className="mt-1 text-base font-medium text-black">{selectedSource?.name || 'Choose a supplier'}</p>
                  <p className="text-sm text-[#5e5e5e]">
                    {deliveryTime} - {selectedQuantity.toLocaleString()}L
                  </p>
                  {closestTanker && (
                    <p className="mt-1 text-xs font-medium text-black">
                      Closest tanker: {closestTanker.name} - {closestTanker.distanceKm} km away
                    </p>
                  )}
                </div>
              </section>

              <aside className="hidden min-w-0 self-start rounded-lg bg-[#FF7B68] p-5 text-white xl:sticky xl:top-24 xl:block">
                <p className="text-xs text-[#f0f9ff]">Order summary</p>
                <h2 className="mt-2 text-xl font-normal">{selectedSource?.name || 'Select a supplier'}</h2>
                <p className="mt-1 text-sm text-[#f0f9ff]">
                  {selectedQuantity.toLocaleString()}L to {selectedArea}
                </p>
                <p className="mt-3 rounded-lg bg-[#059669] px-3 py-2 text-sm font-medium">{deliveryTime}</p>

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
                        <span className="block text-xs text-[#afafaf]">Total</span>
                        <span className="text-2xl font-normal">{formatPrice(pricing.total)}</span>
                      </span>
                    </div>
                    <button onClick={handleCreateOrder} className="h-11 w-full rounded-lg bg-white text-sm font-medium text-black">
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
        <div className="fixed bottom-[5.5rem] left-3 right-3 z-40 rounded-lg bg-[#FF7B68] p-3 text-white md:bottom-5 md:left-auto md:right-5 md:w-[360px] xl:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-[#f0f9ff]">Total</p>
              <p className="truncate text-xl font-medium">{formatPrice(pricing.total)}</p>
            </div>
            <button onClick={handleCreateOrder} className="h-12 rounded-lg bg-white px-5 text-sm font-medium text-[#FF7B68]">
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
      <span className="text-[#afafaf]">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
