'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import WaterMap from '@/components/WaterMap';
import WaterSourceList from '@/components/WaterSourceList';
import WaterSourcePanel from '@/components/WaterSourcePanel';
import CommunityBulkRequest from '@/components/CommunityBulkRequest';
import { WATER_SOURCES, ENUGU_AREAS, AREA_DEMAND_MAP, SAMPLE_BULK_REQUESTS } from '@/lib/mock-data';
import { WaterSource } from '@/lib/types';
import {
  filterSourcesByType,
  filterSourcesByAvailability,
  filterSourcesByVerification,
  filterByArea,
  Coordinates,
  getClosestSource,
  getSortedSourcesByDistance,
  getSourcesWithLiveDistance,
} from '@/lib/utils';

const sourceTypes = [
  { type: 'tanker', label: 'Tanker' },
  { type: 'borehole', label: 'Borehole' },
  { type: 'public_point', label: 'Public point' },
  { type: 'subsidized_truck', label: 'Subsidy truck' },
];

export default function DemoPage() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>('src-005');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const sourcesWithLiveDistance = useMemo(
    () => getSourcesWithLiveDistance(WATER_SOURCES, userLocation),
    [userLocation]
  );

  let filtered = sourcesWithLiveDistance as WaterSource[];
  filtered = filterByArea(filtered, selectedArea);
  filtered = filterSourcesByType(filtered, filterType);
  filtered = filterSourcesByAvailability(filtered, onlyAvailable);
  filtered = filterSourcesByVerification(filtered, verifiedOnly);
  filtered = getSortedSourcesByDistance(filtered);

  const closestTanker = userLocation
    ? getClosestSource(sourcesWithLiveDistance, ['tanker', 'subsidized_truck'])
    : undefined;
  const selectedSource = sourcesWithLiveDistance.find((source) => source.id === selectedSourceId);

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
        setOnlyAvailable(true);
        setVerifiedOnly(true);
        setSelectedSourceId(nearestTanker?.id || null);
        setLocationStatus('ready');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-12">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-lg border border-[#c0c7d2]/30 bg-white p-4 shadow-[0_4px_12px_rgba(0,94,151,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-[#005e97]">
              <span aria-hidden="true">←</span>
              Back to Vale
            </Link>
            <Link
              href="/request"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#005e97] px-4 text-sm font-black text-white"
            >
              Continue to order
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#404751]">Step 2 of delivery</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-[#191c1e] sm:text-4xl">Choose nearby supply.</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold text-[#404751]">
                Pick a verified tanker or water point from the map, then continue to confirm delivery details.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(180px,240px)_auto]">
              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="h-11 rounded-lg border border-[#c0c7d2]/30 bg-white px-3 text-sm font-black text-[#191c1e] outline-none focus:border-[#005e97]"
              >
                <option value="">All areas</option>
                {ENUGU_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

            <button
              type="button"
              onClick={handleUseLocation}
              className="h-11 rounded-lg border border-[#c0c7d2]/30 bg-white px-4 text-sm font-black text-[#191c1e]"
            >
              {locationStatus === 'loading' ? 'Locating...' : 'Use my location'}
            </button>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-[#c0c7d2]/30 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[#404751]">Smart match</p>
              <p className="text-sm font-black text-[#191c1e]">
                {closestTanker
                  ? `${closestTanker.name} is the closest available tanker`
                  : 'Tap Use my location to find your closest tanker'}
              </p>
              {closestTanker && (
                <p className="text-xs font-semibold text-[#404751]">
                  {closestTanker.distanceKm} km away - {closestTanker.area}
                </p>
              )}
            </div>
            <span className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-800">
              Amber marker = closest
            </span>
          </div>
          {locationStatus === 'error' && (
            <p className="mt-2 text-xs font-bold text-red-600">
              Location was not available. You can still select an area manually.
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="order-2 space-y-4 lg:order-1">
            <section className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black">Filters</h2>
                <span className="rounded-lg bg-[#eceef0] px-3 py-1 text-xs font-black text-[#404751]">
                  {filtered.length} found
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {sourceTypes.map(({ type, label }) => {
                  const active = filterType.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFilterType(active ? filterType.filter((item) => item !== type) : [...filterType, type])
                      }
                      className={`rounded-lg border px-3 py-3 text-sm font-black transition ${
                        active ? 'border-[#005e97] bg-[#005e97] text-white' : 'border-[#c0c7d2]/30 bg-white text-[#404751]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center justify-between rounded-lg bg-[#f2f4f6] p-3 text-sm font-bold">
                  Available now
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(event) => setOnlyAvailable(event.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg bg-[#f2f4f6] p-3 text-sm font-bold">
                  Verified only
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(event) => setVerifiedOnly(event.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            </section>

            <section className="card">
              <h2 className="mb-3 text-xl font-black">Nearby supply</h2>
              <WaterSourceList
                sources={filtered}
                selectedSourceId={selectedSourceId}
                onSelectSource={setSelectedSourceId}
                closestSourceId={closestTanker?.id}
              />
            </section>
          </aside>

          <section className="order-1 space-y-4 lg:order-2">
            <WaterMap
              sources={filtered}
              selectedSourceId={selectedSourceId}
              onSelectSource={setSelectedSourceId}
              demandMap={selectedArea ? {} : AREA_DEMAND_MAP}
              userLocation={userLocation}
              closestSourceId={closestTanker?.id}
            />

            <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
              {selectedSource ? (
                <WaterSourcePanel source={selectedSource} onClose={() => setSelectedSourceId(null)} showRequestButton />
              ) : (
                <div className="card py-10 text-center">
                  <p className="font-semibold text-[#404751]">Select a marker or supplier to see request details.</p>
                </div>
              )}
              <CommunityBulkRequest bulkRequests={SAMPLE_BULK_REQUESTS.slice(0, 2)} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
