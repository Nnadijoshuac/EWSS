'use client';

import { useState, useRef, useEffect } from 'react';

type Marker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  tone?: 'dark' | 'blue' | 'green' | 'red' | 'amber';
  selected?: boolean;
  value?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSize?: 'small' | 'large';
};

type MapPoint = { lat: number; lng: number };

interface OpenStreetMapProps {
  markers?: Marker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  heightClass?: string;
  onMarkerClick?: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  caption?: string;
  showChrome?: boolean;
  showSelectedLabels?: boolean;
  mapStyle?: 'street' | 'satellite';
  route?: MapPoint[];
  onMapStyleChange?: (style: 'street' | 'satellite') => void;
}

const TILE_SIZE = 256;
const DEFAULT_CENTER = { lat: 6.4433, lng: 7.4988 };
const MIN_ZOOM = 10;
const MAX_ZOOM = 18;

function latLngToTilePoint(lat: number, lng: number, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function tilePointToLatLng(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return { lat, lng };
}

function toneClass(tone: Marker['tone'], selected?: boolean) {
  if (selected) return 'bg-white text-black ring-4 ring-[#FF7B68]';
  if (tone === 'red') return 'bg-black text-white ring-2 ring-white';
  if (tone === 'amber') return 'bg-[#333333] text-white ring-2 ring-white';
  return 'border border-black bg-white text-black';
}

export default function OpenStreetMap({
  markers = [],
  center = DEFAULT_CENTER,
  zoom: initialZoom = 12,
  heightClass = 'h-96',
  onMarkerClick,
  onMapClick,
  caption = 'OpenStreetMap view of Enugu service coverage',
  showChrome = true,
  showSelectedLabels = true,
  mapStyle: initialMapStyle = 'street',
  route = [],
  onMapStyleChange,
}: OpenStreetMapProps) {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>(initialMapStyle);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleRecenter = () => {
    setMapCenter(center);
    setMapZoom(initialZoom);
  };

  const handleMapStyleToggle = () => {
    const newStyle = mapStyle === 'street' ? 'satellite' : 'street';
    setMapStyle(newStyle);
    onMapStyleChange?.(newStyle);
  };

  const centerPoint = latLngToTilePoint(mapCenter.lat, mapCenter.lng, mapZoom);
  const tileX = Math.floor(centerPoint.x / TILE_SIZE);
  const tileY = Math.floor(centerPoint.y / TILE_SIZE);
  const centerOffsetX = centerPoint.x - tileX * TILE_SIZE;
  const centerOffsetY = centerPoint.y - tileY * TILE_SIZE;

  const horizontalTileOffsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const verticalTileOffsets = [-3, -2, -1, 0, 1, 2, 3];

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const scale = TILE_SIZE * 2 ** mapZoom;
    const newX = centerPoint.x - dx;
    const newY = centerPoint.y - dy;

    const newLatLng = tilePointToLatLng(newX, newY, mapZoom);
    setMapCenter(newLatLng);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const worldX = centerPoint.x + (mouseX - centerX);
    const worldY = centerPoint.y + (mouseY - centerY);

    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, mapZoom + (e.deltaY < 0 ? 1 : -1)));
    const zoomDiff = newZoom - mapZoom;

    const scale1 = TILE_SIZE * 2 ** mapZoom;
    const scale2 = TILE_SIZE * 2 ** newZoom;
    const scaleFactor = scale2 / scale1;

    const newCenterX = worldX * scaleFactor - (mouseX - centerX) * (scaleFactor - 1);
    const newCenterY = worldY * scaleFactor - (mouseY - centerY) * (scaleFactor - 1);

    const newLatLng = tilePointToLatLng(newCenterX, newCenterY, newZoom);
    setMapZoom(newZoom);
    setMapCenter(newLatLng);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a') || isDragging) return;

    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const worldX = centerPoint.x + (mouseX - centerX);
    const worldY = centerPoint.y + (mouseY - centerY);

    const { lat, lng } = tilePointToLatLng(worldX, worldY, mapZoom);
    onMapClick?.(lat, lng);
  };

  return (
    <div
      ref={mapRef}
      className={`relative overflow-hidden rounded-lg bg-neutral-200 ${heightClass} cursor-grab active:cursor-grabbing`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleMapClick}
    >
      <div className="absolute inset-0 overflow-hidden">
        {horizontalTileOffsets.flatMap((xOffset) =>
          verticalTileOffsets.map((yOffset) => {
            const x = tileX + xOffset;
            const y = tileY + yOffset;

            const tileUrl =
              mapStyle === 'satellite'
                ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${mapZoom}/${y}/${x}`
                : `https://tile.openstreetmap.org/${mapZoom}/${x}/${y}.png`;

            return (
              <img
                key={`${x}-${y}`}
                src={tileUrl}
                alt=""
                className={`absolute h-64 w-64 select-none ${mapStyle === 'street' ? 'grayscale' : ''}`}
                draggable={false}
                decoding="async"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: xOffset * TILE_SIZE - centerOffsetX,
                  marginTop: yOffset * TILE_SIZE - centerOffsetY,
                }}
              />
            );
          })
        )}
      </div>

      <div className={`absolute inset-0 ${mapStyle === 'satellite' ? 'bg-black/10' : 'bg-white/10'}`} />

      {route.slice(0, -1).map((point, index) => {
        const nextPoint = route[index + 1];
        const start = latLngToTilePoint(point.lat, point.lng, mapZoom);
        const end = latLngToTilePoint(nextPoint.lat, nextPoint.lng, mapZoom);
        const startX = start.x - centerPoint.x;
        const startY = start.y - centerPoint.y;
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const length = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        return (
          <div
            key={`${point.lat}-${point.lng}-${index}`}
            className="pointer-events-none absolute z-[5] h-1 origin-left rounded-full bg-black"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: startX,
              marginTop: startY,
              width: length,
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}

      {markers.map((marker) => {
        const point = latLngToTilePoint(marker.lat, marker.lng, mapZoom);
        const x = point.x - centerPoint.x;
        const y = point.y - centerPoint.y;

        return (
          <button
            key={marker.id}
            type="button"
            onClick={() => onMarkerClick?.(marker.id)}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: '50%', top: '50%', marginLeft: x, marginTop: y }}
            title={marker.label}
          >
            {marker.imageSrc ? (
              <span className={`flex items-center justify-center rounded-full bg-white/95 p-1 transition ${marker.selected ? 'ring-4 ring-[#FF7B68]' : 'ring-1 ring-black/20'}`}>
                <img
                  src={marker.imageSrc}
                  alt={marker.imageAlt || marker.label}
                  className={`${marker.imageSize === 'large' ? 'h-16 w-16' : 'h-12 w-12'} object-contain`}
                  draggable={false}
                />
              </span>
            ) : (
              <span
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition ${toneClass(
                  marker.tone,
                  marker.selected
                )}`}
              >
                {marker.value || marker.label.slice(0, 2)}
              </span>
            )}
            {showSelectedLabels && marker.selected && (
              <span className="max-w-36 rounded-md bg-white px-2 py-1 text-xs font-medium text-black">
                {marker.label}
              </span>
            )}
          </button>
        );
      })}

      {showChrome && (
        <div className="absolute left-3 top-3 rounded-lg border border-[#d8d8d8] bg-white/95 px-3 py-2">
          <p className="text-xs text-[#5e5e5e]">{caption}</p>
          <p className="mt-1 text-xs font-medium text-[#5e5e5e]">Zoom: {mapZoom} | Drag to pan, scroll to zoom</p>
        </div>
      )}

      {showChrome && (
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            className="rounded-lg bg-white/95 border border-[#d8d8d8] px-3 py-2 text-sm font-medium text-black transition hover:bg-white hover:border-[#FF7B68]"
            title="Recenter map to default location"
          >
            📍 Recenter
          </button>
          <button
            type="button"
            onClick={handleMapStyleToggle}
            className="rounded-lg bg-white/95 border border-[#d8d8d8] px-3 py-2 text-sm font-medium text-black transition hover:bg-white hover:border-[#FF7B68]"
            title={`Switch to ${mapStyle === 'street' ? 'satellite' : 'street'} view`}
          >
            {mapStyle === 'street' ? '🛰️ Satellite' : '🗺️ Street'}
          </button>
        </div>
      )}

      {showChrome && (
        <a
          href={mapStyle === 'satellite' ? 'https://www.esri.com/en-us/legal/terms/full-master-agreement' : 'https://www.openstreetmap.org/copyright'}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-[#404751]"
        >
          {mapStyle === 'satellite' ? 'Source: Esri, Vantor, Earthstar Geographics' : '(c) OpenStreetMap contributors'}
        </a>
      )}
    </div>
  );
}
