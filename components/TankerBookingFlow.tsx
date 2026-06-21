'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gridDistance, latLngToCell } from 'h3-js';
import OpenStreetMap from '@/components/OpenStreetMap';
import { WATER_SOURCES } from '@/lib/mock-data';

const H3_RESOLUTION = 7;
const quantities = [2500, 5000, 10000];
const DEFAULT_DELIVERY_POINT = { lat: 6.42, lng: 7.55 };
const deliveryAreas = [
  { name: 'New Haven', coordinates: DEFAULT_DELIVERY_POINT },
  { name: 'Independence Layout', coordinates: { lat: 6.45, lng: 7.52 } },
  { name: 'Thinkers Corner', coordinates: { lat: 6.44, lng: 7.5 } },
  { name: 'GRA', coordinates: { lat: 6.51, lng: 7.48 } },
  { name: 'Abakpa', coordinates: { lat: 6.48, lng: 7.58 } },
  { name: 'Emene', coordinates: { lat: 6.38, lng: 7.62 } },
];

function getGridDistance(origin: string, destination: string) {
  try {
    return gridDistance(origin, destination);
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

export default function TankerBookingFlow() {
  const [selectedArea, setSelectedArea] = useState('New Haven');
  const [address, setAddress] = useState('12 Chime Avenue');
  const [deliveryPoint, setDeliveryPoint] = useState(DEFAULT_DELIVERY_POINT);
  const [quantity, setQuantity] = useState(5000);
  const [deliveryMode, setDeliveryMode] = useState<'now' | 'schedule'>('now');
  const [selectedSourceId, setSelectedSourceId] = useState('src-005');
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const dragStartY = useRef<number | null>(null);

  const deliveryCell = useMemo(
    () => latLngToCell(deliveryPoint.lat, deliveryPoint.lng, H3_RESOLUTION),
    [deliveryPoint]
  );

  const matchedTankers = useMemo(() => {
    return WATER_SOURCES.filter(
      (source) =>
        (source.type === 'tanker' || source.type === 'subsidized_truck') &&
        source.status === 'available' &&
        source.availableLitres >= quantity
    )
      .map((source) => {
        const sourceCell = latLngToCell(source.coordinates.lat, source.coordinates.lng, H3_RESOLUTION);
        const zonesAway = getGridDistance(deliveryCell, sourceCell);
        const deliveryFee = 1500 + Math.min(zonesAway, 12) * 350;
        const etaMinutes = (source.etaMinutes || 15) + Math.min(zonesAway, 12) * 2;

        return {
          ...source,
          sourceCell,
          zonesAway,
          deliveryFee,
          etaMinutes,
          total: quantity * source.pricePerLitre + deliveryFee,
        };
      })
      .sort((a, b) => a.zonesAway - b.zonesAway || a.total - b.total);
  }, [deliveryCell, quantity]);

  useEffect(() => {
    if (matchedTankers.length > 0 && !matchedTankers.some((source) => source.id === selectedSourceId)) {
      setSelectedSourceId(matchedTankers[0].id);
    }
  }, [matchedTankers, selectedSourceId]);

  const selectedSource = matchedTankers.find((source) => source.id === selectedSourceId) || matchedTankers[0];

  const markers = [
    {
      id: 'delivery-point',
      lat: deliveryPoint.lat,
      lng: deliveryPoint.lng,
      label: 'Delivery point',
      value: 'You',
      tone: 'blue' as const,
      selected: true,
    },
    ...matchedTankers.map((source) => ({
      id: source.id,
      lat: source.coordinates.lat,
      lng: source.coordinates.lng,
      label: `${source.name} · ${source.etaMinutes} min`,
      value: `${Math.round(source.availableLitres / 1000)}K`,
      tone: source.id === selectedSource?.id ? ('dark' as const) : ('green' as const),
      selected: source.id === selectedSource?.id,
    })),
  ];

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryPoint({ lat: position.coords.latitude, lng: position.coords.longitude });
        setSelectedArea('');
        setAddress('Current location');
        setLocationStatus('idle');
        setSheetExpanded(true);
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  };

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragStartY.current === null) return;
    const movement = event.clientY - dragStartY.current;

    if (Math.abs(movement) < 12) setSheetExpanded((value) => !value);
    else setSheetExpanded(movement < 0);

    dragStartY.current = null;
  };

  const deliveryAddress = selectedArea ? `${address}, ${selectedArea}` : address;
  const reviewUrl = selectedSource
    ? `/request?source=${selectedSource.id}&quantity=${quantity}&mode=${deliveryMode}&address=${encodeURIComponent(deliveryAddress)}`
    : '/request';

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-black text-black">
      <OpenStreetMap
        markers={markers}
        center={deliveryPoint}
        zoom={13}
        heightClass="h-full rounded-none"
        showChrome={false}
        showSelectedLabels={false}
        mapStyle="satellite"
        onMarkerClick={(id) => {
          if (id !== 'delivery-point') {
            setSelectedSourceId(id);
            setSheetExpanded(true);
          }
        }}
      />

      <header className="absolute left-0 right-0 top-0 z-30 bg-black px-4 text-white sm:px-6">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3">
          <Link href="/" className="text-xl font-bold tracking-[-0.04em]">Vale</Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden rounded-full bg-[#333333] px-3 py-2 text-xs text-[#afafaf] sm:inline-flex">Satellite · H3 matching</span>
            <Link href="/report" className="rounded-full px-3 py-2 text-sm transition hover:bg-[#333333] sm:px-4">Help</Link>
            <Link href="/supplier" className="hidden rounded-full bg-white px-4 py-2 text-sm text-black sm:inline-flex">Supply water</Link>
          </div>
        </div>
      </header>

      <section className="absolute left-3 right-3 top-20 z-20 rounded-lg bg-white p-3 md:left-6 md:right-auto md:w-[390px] lg:left-[max(24px,calc((100vw-1200px)/2))]">
        <div className="grid gap-2">
          <label className="block">
            <span className="mb-1 block text-xs text-[#5e5e5e]">Delivery area</span>
            <select
              value={selectedArea}
              onChange={(event) => {
                const area = deliveryAreas.find((item) => item.name === event.target.value);
                if (!area) return;
                setSelectedArea(area.name);
                setDeliveryPoint(area.coordinates);
              }}
              className="h-11 w-full rounded-lg border border-[#d8d8d8] bg-white px-3 text-sm font-medium outline-none focus:border-black"
            >
              {!selectedArea && <option value="">Using precise location</option>}
              {deliveryAreas.map((area) => <option key={area.name} value={area.name}>{area.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#5e5e5e]">Street, estate, or landmark</span>
          <div className="flex min-w-0 items-center gap-3 rounded-lg bg-[#f6f6f6] px-3 py-3">
            <span className="h-2.5 w-2.5 shrink-0 bg-black" aria-hidden="true" />
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm font-medium text-black outline-none"
              aria-label="Street, estate, or landmark"
            />
            <button type="button" onClick={useCurrentLocation} className="shrink-0 text-xs font-medium underline underline-offset-4">
              {locationStatus === 'loading' ? 'Locating…' : 'Use location'}
            </button>
          </div>
          </label>
        </div>
        {locationStatus === 'error' && <p className="mt-2 text-xs text-black">Location is unavailable. Enter your address instead.</p>}
      </section>

      <section
        className={`absolute bottom-0 left-0 right-0 z-30 flex overflow-hidden rounded-t-2xl bg-white transition-[height] duration-300 ease-out md:bottom-auto md:left-auto md:right-6 md:top-20 md:h-auto md:max-h-[calc(100dvh-96px)] md:w-[420px] md:rounded-lg lg:right-[max(24px,calc((100vw-1200px)/2))] ${
          sheetExpanded ? 'h-[72dvh]' : 'h-[236px]'
        }`}
      >
        <div className="flex min-h-0 w-full flex-col p-4 pb-[max(env(safe-area-inset-bottom),1rem)] md:p-5">
          <button
            type="button"
            aria-expanded={sheetExpanded}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            className="touch-none pb-3 md:pointer-events-none md:pb-0"
          >
            <span className="mx-auto mb-3 block h-1 w-12 rounded-full bg-[#767676] md:hidden" />
            <span className="flex items-start justify-between gap-4 text-left">
              <span>
                <span className="block text-xs text-[#5e5e5e]">Choose water tanker</span>
                <span className="mt-1 block text-2xl font-normal tracking-[-0.02em]">Water to your door</span>
              </span>
              <span className="rounded-full bg-[#f6f6f6] px-3 py-2 text-xs font-medium md:hidden">
                {sheetExpanded ? 'Pull down' : 'Pull up'}
              </span>
            </span>
          </button>

          {!sheetExpanded && selectedSource && (
            <div className="mt-2 flex items-center justify-between gap-3 md:hidden">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{selectedSource.name}</p>
                <p className="text-xs text-[#5e5e5e]">{selectedSource.etaMinutes} min · {quantity.toLocaleString()}L</p>
              </div>
              <p className="shrink-0 text-lg font-medium">NGN {selectedSource.total.toLocaleString()}</p>
            </div>
          )}

          <div className={`${sheetExpanded ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col md:flex`}>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-2">
                {quantities.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setQuantity(option)}
                    className={`rounded-lg border px-2 py-3 text-sm font-medium ${
                      quantity === option ? 'border-black bg-black text-white' : 'border-[#d8d8d8] bg-white text-black'
                    }`}
                  >
                    {option.toLocaleString()}L
                  </button>
                ))}
              </div>

              <div className="my-4 grid grid-cols-2 rounded-full bg-[#f6f6f6] p-1">
                {[
                  { id: 'now', label: 'Deliver now' },
                  { id: 'schedule', label: 'Schedule' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDeliveryMode(mode.id as 'now' | 'schedule')}
                    className={`h-10 rounded-full text-sm font-medium ${deliveryMode === mode.id ? 'bg-black text-white' : 'text-[#5e5e5e]'}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Nearby verified tankers</p>
                <span className="text-xs text-[#5e5e5e]">{deliveryCell.slice(0, 8)}…</span>
              </div>

              <div className="space-y-2">
                {matchedTankers.slice(0, 4).map((source) => {
                  const active = selectedSource?.id === source.id;

                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setSelectedSourceId(source.id)}
                      className={`w-full rounded-lg border p-3 text-left ${active ? 'border-black bg-[#f6f6f6]' : 'border-[#d8d8d8] bg-white'}`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{source.name}</span>
                          <span className="mt-1 block text-xs text-[#5e5e5e]">
                            {source.etaMinutes} min · {source.zonesAway <= 6 ? `${source.zonesAway} H3 zones away` : 'Extended service area'}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-medium">NGN {source.total.toLocaleString()}</span>
                          <span className="text-xs text-[#5e5e5e]">fee included</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {matchedTankers.length === 0 && (
                <div className="rounded-lg bg-[#f6f6f6] p-4 text-sm text-[#5e5e5e]">No available tanker currently has enough capacity. Try a smaller quantity.</div>
              )}
            </div>
          </div>

          <Link
            href={reviewUrl}
            aria-disabled={!selectedSource}
            className={`mt-4 flex h-14 w-full shrink-0 items-center justify-center rounded-lg text-base font-medium ${
              selectedSource ? 'bg-black text-white hover:bg-[#333333]' : 'pointer-events-none bg-[#d8d8d8] text-[#767676]'
            }`}
          >
            {selectedSource ? `Review order · NGN ${selectedSource.total.toLocaleString()}` : 'No tanker available'}
          </Link>
        </div>
      </section>
    </main>
  );
}
