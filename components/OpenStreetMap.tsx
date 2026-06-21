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
  showChrome?: boolean;
  showSelectedLabels?: boolean;
  mapStyle?: 'street' | 'satellite';
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
  if (selected) return 'bg-white text-black ring-4 ring-black';
  if (tone === 'red') return 'bg-black text-white ring-2 ring-white';
  if (tone === 'amber') return 'bg-[#333333] text-white ring-2 ring-white';
  return 'border border-black bg-white text-black';
}

export default function OpenStreetMap({
  markers = [],
  center = DEFAULT_CENTER,
  zoom = 12,
  heightClass = 'h-96',
  onMarkerClick,
  caption = 'OpenStreetMap view of Enugu service coverage',
  showChrome = true,
  showSelectedLabels = true,
  mapStyle = 'street',
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

            const tileUrl =
              mapStyle === 'satellite'
                ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`
                : `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

            return (
              <img
                key={`${x}-${y}`}
                src={tileUrl}
                alt=""
                className={`absolute h-64 w-64 select-none ${mapStyle === 'street' ? 'grayscale' : ''}`}
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

      <div className={`absolute inset-0 ${mapStyle === 'satellite' ? 'bg-black/10' : 'bg-white/10'}`} />

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
              className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition hover:scale-110 ${toneClass(
                marker.tone,
                marker.selected
              )}`}
            >
              {marker.value || marker.label.slice(0, 2)}
            </span>
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
