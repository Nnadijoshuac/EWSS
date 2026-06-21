'use client';

import { useEffect, useMemo, useState } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';
import { WATER_SOURCES } from '@/lib/mock-data';
import { WaterOrder } from '@/lib/types';

const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  'Independence Layout': { lat: 6.45, lng: 7.52 },
  'New Haven': { lat: 6.42, lng: 7.55 },
  Abakpa: { lat: 6.48, lng: 7.58 },
  Emene: { lat: 6.38, lng: 7.62 },
  GRA: { lat: 6.51, lng: 7.48 },
  'Thinkers Corner': { lat: 6.44, lng: 7.5 },
  Ogui: { lat: 6.46, lng: 7.6 },
};

function interpolate(start: { lat: number; lng: number }, end: { lat: number; lng: number }, amount: number) {
  return {
    lat: start.lat + (end.lat - start.lat) * amount,
    lng: start.lng + (end.lng - start.lng) * amount,
  };
}

export default function LiveTankerMap({ order }: { order: WaterOrder }) {
  const [progress, setProgress] = useState(0.18);
  const source = WATER_SOURCES.find((item) => item.id === order.sourceId);
  const destination = areaCoordinates[order.residentArea] || areaCoordinates['New Haven'];
  const origin = source?.coordinates || { lat: destination.lat + 0.025, lng: destination.lng - 0.025 };
  const route = useMemo(() => {
    const midpoint = {
      lat: (origin.lat + destination.lat) / 2 + 0.004,
      lng: (origin.lng + destination.lng) / 2 - 0.003,
    };
    return [origin, midpoint, destination];
  }, [destination.lat, destination.lng, origin.lat, origin.lng]);

  useEffect(() => {
    if (order.status !== 'on_the_way') return;
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(0.94, value + 0.012));
    }, 900);
    return () => window.clearInterval(timer);
  }, [order.status]);

  const tankerPosition =
    progress < 0.5
      ? interpolate(route[0], route[1], progress * 2)
      : interpolate(route[1], route[2], (progress - 0.5) * 2);
  const center = {
    lat: (origin.lat + destination.lat) / 2,
    lng: (origin.lng + destination.lng) / 2,
  };
  const minutesRemaining = Math.max(2, Math.ceil((1 - progress) * 22));

  return (
    <section className="relative overflow-hidden rounded-lg border border-[#d8d8d8] bg-white">
      <OpenStreetMap
        center={center}
        zoom={13}
        heightClass="h-[300px] sm:h-[360px]"
        mapStyle="street"
        showChrome={false}
        showSelectedLabels={false}
        route={route}
        markers={[
          {
            id: 'live-tanker',
            ...tankerPosition,
            label: `${order.sourceName} is approaching`,
            imageSrc: '/map-assets/water-tanker.png',
            imageAlt: 'Water tanker approaching the delivery location',
            imageSize: 'large',
            selected: true,
          },
          {
            id: 'delivery-location',
            ...destination,
            label: `Delivery in ${order.residentArea}`,
            value: 'You',
            tone: 'dark',
          },
        ]}
      />
      <div className="absolute left-3 top-3 z-20 rounded-lg bg-white p-3 sm:left-4 sm:top-4">
        <p className="text-xs text-[#5e5e5e]">Tanker approaching</p>
        <p className="mt-1 font-medium">About {minutesRemaining} min away</p>
      </div>
      <div className="absolute bottom-3 left-3 right-3 z-20 h-1 overflow-hidden rounded-full bg-white/70 sm:left-4 sm:right-4">
        <div className="h-full rounded-full bg-black transition-[width] duration-700" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    </section>
  );
}

