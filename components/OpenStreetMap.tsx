'use client';

type Marker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  tone?: 'dark' | 'blue' | 'green' | 'red' | 'amber';
  selected?: boolean;
  value?: string;
};

interface OpenStreetMapProps {
  markers?: Marker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  heightClass?: string;
  onMarkerClick?: (id: string) => void;
  caption?: string;
}

const TILE_SIZE = 256;
const DEFAULT_CENTER = { lat: 6.4433, lng: 7.4988 };

function latLngToTilePoint(lat: number, lng: number, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function toneClass(tone: Marker['tone'], selected?: boolean) {
  if (selected) return 'bg-neutral-950 text-white ring-4 ring-white';

  const tones = {
    dark: 'bg-neutral-950 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-emerald-600 text-white',
    red: 'bg-red-600 text-white',
    amber: 'bg-amber-500 text-neutral-950',
  };

  return tones[tone || 'dark'];
}

export default function OpenStreetMap({
  markers = [],
  center = DEFAULT_CENTER,
  zoom = 12,
  heightClass = 'h-96',
  onMarkerClick,
  caption = 'OpenStreetMap view of Enugu service coverage',
}: OpenStreetMapProps) {
  const centerPoint = latLngToTilePoint(center.lat, center.lng, zoom);
  const tileX = Math.floor(centerPoint.x / TILE_SIZE);
  const tileY = Math.floor(centerPoint.y / TILE_SIZE);
  const centerOffsetX = centerPoint.x - tileX * TILE_SIZE;
  const centerOffsetY = centerPoint.y - tileY * TILE_SIZE;

  const tileOffsets = [-1, 0, 1];

  return (
    <div className={`relative overflow-hidden rounded-lg bg-neutral-200 ${heightClass}`}>
      <div className="absolute left-1/2 top-1/2 h-[768px] w-[768px] -translate-x-1/2 -translate-y-1/2">
        {tileOffsets.flatMap((xOffset) =>
          tileOffsets.map((yOffset) => {
            const x = tileX + xOffset;
            const y = tileY + yOffset;

            return (
              <img
                key={`${x}-${y}`}
                src={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`}
                alt=""
                className="absolute h-64 w-64 select-none"
                draggable={false}
                style={{
                  left: 256 + xOffset * TILE_SIZE - centerOffsetX,
                  top: 256 + yOffset * TILE_SIZE - centerOffsetY,
                }}
              />
            );
          })
        )}
      </div>

      <div className="absolute inset-0 bg-neutral-950/5" />

      {markers.map((marker) => {
        const point = latLngToTilePoint(marker.lat, marker.lng, zoom);
        const x = 50 + ((point.x - centerPoint.x) / 768) * 100;
        const y = 50 + ((point.y - centerPoint.y) / 768) * 100;

        return (
          <button
            key={marker.id}
            type="button"
            onClick={() => onMarkerClick?.(marker.id)}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={marker.label}
          >
            <span
              className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-lg font-black shadow-xl transition hover:scale-110 ${toneClass(
                marker.tone,
                marker.selected
              )}`}
            >
              {marker.value || marker.label.slice(0, 2)}
            </span>
            {(marker.selected || marker.value) && (
              <span className="max-w-36 rounded-md bg-white px-2 py-1 text-xs font-black text-neutral-950 shadow-xl">
                {marker.label}
              </span>
            )}
          </button>
        );
      })}

      <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 shadow-lg">
        <p className="text-xs font-bold uppercase text-neutral-500">{caption}</p>
      </div>

      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-neutral-600"
      >
        (c) OpenStreetMap contributors
      </a>
    </div>
  );
}
