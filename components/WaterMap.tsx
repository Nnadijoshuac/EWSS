'use client';

import { WaterSource } from '@/lib/types';
import { getSourceTypeLabel } from '@/lib/utils';
import OpenStreetMap from './OpenStreetMap';

interface WaterMapProps {
  sources: WaterSource[];
  selectedSourceId?: string | null;
  onSelectSource?: (id: string) => void;
  demandMap?: Record<string, number>;
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

export default function WaterMap({
  sources,
  selectedSourceId,
  onSelectSource,
  demandMap,
}: WaterMapProps) {
  const sourceMarkers = sources.map((source) => ({
    id: source.id,
    lat: source.coordinates.lat,
    lng: source.coordinates.lng,
    label: `${source.name} - ${getSourceTypeLabel(source.type)}`,
    tone:
      source.status === 'offline'
        ? ('red' as const)
        : source.type === 'subsidized_truck'
          ? ('blue' as const)
          : source.type === 'borehole'
            ? ('green' as const)
            : ('dark' as const),
    selected: selectedSourceId === source.id,
    value:
      source.type === 'tanker' || source.type === 'subsidized_truck'
        ? '\u{1F69A}'
        : source.type === 'borehole'
          ? 'BH'
          : 'WP',
  }));

  const demandMarkers = demandMap
    ? Object.entries(demandMap).flatMap(([area, demand]) => {
        const coordinates = areaCoordinates[area];
        if (!coordinates) return [];

        return {
          id: `demand-${area}`,
          ...coordinates,
          label: `${area}: ${demand} requests`,
          tone: demand > 50 ? ('red' as const) : demand > 25 ? ('amber' as const) : ('blue' as const),
          value: String(demand),
        };
      })
    : [];

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <OpenStreetMap
        markers={[...demandMarkers, ...sourceMarkers]}
        heightClass="h-[460px]"
        onMarkerClick={(id) => {
          if (!id.startsWith('demand-')) onSelectSource?.(id);
        }}
        caption="OpenStreetMap service map"
      />
      <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-3 text-xs font-bold text-neutral-600 sm:grid-cols-4">
        <span>{'\u{1F69A}'} Tanker</span>
        <span>Green: borehole</span>
        <span>Blue: subsidy/public</span>
        <span>Red/Amber: demand risk</span>
      </div>
    </div>
  );
}
