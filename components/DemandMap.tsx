import OpenStreetMap from './OpenStreetMap';

interface DemandMapProps {
  demandData: Record<string, number>;
  supplyData: Record<string, number>;
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
    };
  });

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500">Live demand</p>
          <h3 className="mt-1 text-2xl font-black text-neutral-950">Supply gaps by area</h3>
        </div>
        <p className="text-sm font-semibold text-neutral-500">OpenStreetMap coverage layer</p>
      </div>

      <OpenStreetMap markers={markers} heightClass="h-[360px]" caption="OpenStreetMap demand map" />

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {sortedAreas.map(([area, demand]) => {
          const supply = supplyData[area] || 0;
          const gap = Math.max(0, demand - supply);
          const covered = Math.min(100, Math.round((supply / Math.max(demand, 1)) * 100));

          return (
            <div key={area} className="rounded-lg bg-neutral-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-neutral-950">{area}</p>
                  <p className="text-xs font-semibold text-neutral-500">
                    {demand} requests - {supply} suppliers
                  </p>
                </div>
                <span className={`text-sm font-black ${gap > 15 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {gap > 0 ? `${gap} gap` : 'Covered'}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full rounded-full bg-neutral-950" style={{ width: `${covered}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
