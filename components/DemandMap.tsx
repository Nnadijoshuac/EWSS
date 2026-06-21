'use client';

import { useState } from 'react';
import OpenStreetMap from './OpenStreetMap';

interface DemandMapProps {
  demandData: Record<string, number>;
  supplyData: Record<string, number>;
}

interface AreaDetails {
  area: string;
  lat: number;
  lng: number;
}

const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  'Independence Layout': { lat: 6.45, lng: 7.52 },
  'New Haven': { lat: 6.42, lng: 7.55 },
  Abakpa: { lat: 6.48, lng: 7.58 },
  Emene: { lat: 6.38, lng: 7.62 },
  GRA: { lat: 6.51, lng: 7.48 },
  'Thinkers Corner': { lat: 6.44, lng: 7.5 },
  Ogui: { lat: 6.46, lng: 7.6 },
  Uwani: { lat: 6.5, lng: 7.65 },
  'Trans Ekulu': { lat: 6.53, lng: 7.62 },
  Nsukka: { lat: 6.86, lng: 7.39 },
  '9th Mile': { lat: 6.48, lng: 7.32 },
  Gariki: { lat: 6.39, lng: 7.46 },
  'Achara Layout': { lat: 6.43, lng: 7.49 },
};

export default function DemandMap({ demandData, supplyData }: DemandMapProps) {
  const [selectedArea, setSelectedArea] = useState<AreaDetails | null>(null);

  const sortedAreas = Object.entries(demandData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const markers = sortedAreas.flatMap(([area, demand]) => {
    const coordinates = areaCoordinates[area];
    if (!coordinates) return [];

    const supply = supplyData[area] || 0;
    const gap = Math.max(0, demand - supply);

    return {
      id: area,
      ...coordinates,
      label: `${area}: ${gap} supply gap`,
      tone: gap > 25 ? ('red' as const) : gap > 10 ? ('amber' as const) : ('green' as const),
      value: String(gap || supply),
      selected: selectedArea?.area === area,
    };
  });

  const handleMapClick = (lat: number, lng: number) => {
    const closest = sortedAreas.reduce((prev, [area]) => {
      const coords = areaCoordinates[area];
      if (!coords) return prev;
      const distance = Math.hypot(coords.lat - lat, coords.lng - lng);
      return distance < prev.distance ? { area, distance } : prev;
    }, { area: '', distance: Infinity });

    if (closest.distance < 0.1) {
      setSelectedArea({ area: closest.area, lat, lng });
    }
  };

  const handleMarkerClick = (id: string) => {
    const coords = areaCoordinates[id];
    if (coords) {
      setSelectedArea({ area: id, lat: coords.lat, lng: coords.lng });
    }
  }

  return (
    <section className="rounded-lg border border-[#d8d8d8] bg-white p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5e5e5e]">Live demand</p>
          <h3 className="mt-1 text-2xl font-normal tracking-[-0.02em] text-black">Supply gaps by area</h3>
        </div>
        <p className="text-xs text-[#767676]">Click on markers or map to select area</p>
      </div>

      {selectedArea && (
        <div className="mb-4 rounded-lg bg-[#FF7B68]/10 border border-[#FF7B68] p-4">
          <p className="text-sm font-medium text-[#FF7B68]">Selected Area</p>
          <p className="mt-2 text-lg font-semibold text-black">{selectedArea.area}</p>
          <p className="mt-1 text-sm text-[#5e5e5e]">
            Demand: {demandData[selectedArea.area] || 0} requests | Supply: {supplyData[selectedArea.area] || 0} suppliers
          </p>
          <button
            onClick={() => setSelectedArea(null)}
            className="mt-3 text-sm font-medium text-[#FF7B68] hover:underline"
          >
            Clear selection
          </button>
        </div>
      )}

      <OpenStreetMap
        markers={markers}
        heightClass="h-[600px]"
        caption="OpenStreetMap demand map"
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {sortedAreas.map(([area, demand]) => {
          const supply = supplyData[area] || 0;
          const gap = Math.max(0, demand - supply);
          const covered = Math.min(100, Math.round((supply / Math.max(demand, 1)) * 100));

          return (
            <div key={area} className="rounded-lg bg-[#f6f6f6] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-black">{area}</p>
                  <p className="mt-1 text-xs text-[#5e5e5e]">
                    {demand} requests - {supply} suppliers
                  </p>
                </div>
                <span className="rounded-full border border-[#d8d8d8] bg-white px-2 py-1 text-xs font-medium text-black">
                  {gap > 0 ? `${gap} gap` : 'Covered'}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#d8d8d8]">
                <div className="h-full rounded-full bg-black" style={{ width: `${covered}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
