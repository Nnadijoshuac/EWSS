'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import WaterMap from '@/components/WaterMap';
import WaterSourceList from '@/components/WaterSourceList';
import WaterSourcePanel from '@/components/WaterSourcePanel';
import CommunityBulkRequest from '@/components/CommunityBulkRequest';
import { WATER_SOURCES, ENUGU_AREAS, AREA_DEMAND_MAP, SAMPLE_BULK_REQUESTS } from '@/lib/mock-data';
import { WaterSource, UserRole } from '@/lib/types';
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
  const [role, setRole] = useState<UserRole>('resident');
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

  if (role !== 'resident') {
    return (
      <div className="min-h-screen bg-[#f5f6f2]">
        <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />
        <div className="container-max section-padding text-center">
          <p className="text-lg font-semibold text-neutral-600">Switching to {role} view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f2] pb-12">
      <TopNav
        currentRole={role}
        onRoleChange={setRole}
        showRoleSwitcher
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
        areas={ENUGU_AREAS}
      />

      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500">Resident app</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">Find water near you.</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-neutral-500">
              Real OpenStreetMap coverage, verified suppliers, live demand, and clean pricing in one dispatch view.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
            <button
              type="button"
              onClick={handleUseLocation}
              className="h-11 rounded-lg border border-black/10 bg-white px-4 text-sm font-black text-neutral-950"
            >
              {locationStatus === 'loading' ? 'Locating...' : 'Use my location'}
            </button>
            <Link href="/request" className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-950 px-5 text-sm font-black text-white">
              Request water
            </Link>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-black/10 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-neutral-500">Smart match</p>
              <p className="text-sm font-black text-neutral-950">
                {closestTanker
                  ? `${closestTanker.name} is the closest available tanker`
                  : 'Tap Use my location to find your closest tanker'}
              </p>
              {closestTanker && (
                <p className="text-xs font-semibold text-neutral-500">
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

        <select
          value={selectedArea}
          onChange={(event) => setSelectedArea(event.target.value)}
          className="mb-4 h-12 w-full rounded-lg border border-black/10 bg-white px-4 text-sm font-black text-neutral-800 outline-none sm:hidden"
        >
          <option value="">All areas</option>
          {ENUGU_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="order-2 space-y-4 lg:order-1">
            <section className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black">Filters</h2>
                <span className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
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
                        active ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-black/10 bg-white text-neutral-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 text-sm font-bold">
                  Available now
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(event) => setOnlyAvailable(event.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 text-sm font-bold">
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
                  <p className="font-semibold text-neutral-500">Select a marker or supplier to see request details.</p>
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
