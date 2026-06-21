'use client';

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
  caption?: string;
  showChrome?: boolean;
  showSelectedLabels?: boolean;
  mapStyle?: 'street' | 'satellite';
  route?: MapPoint[];
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
  route = [],
}: OpenStreetMapProps) {
  const centerPoint = latLngToTilePoint(center.lat, center.lng, zoom);
  const tileX = Math.floor(centerPoint.x / TILE_SIZE);
  const tileY = Math.floor(centerPoint.y / TILE_SIZE);
  const centerOffsetX = centerPoint.x - tileX * TILE_SIZE;
  const centerOffsetY = centerPoint.y - tileY * TILE_SIZE;

  // Cover large desktop viewports without constraining the map to a fixed canvas.
  // Tiles are anchored to the geographic center in viewport pixel space.
  const horizontalTileOffsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const verticalTileOffsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className={`relative overflow-hidden rounded-lg bg-neutral-200 ${heightClass}`}>
      <div className="absolute inset-0 overflow-hidden">
        {horizontalTileOffsets.flatMap((xOffset) =>
          verticalTileOffsets.map((yOffset) => {
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
        const start = latLngToTilePoint(point.lat, point.lng, zoom);
        const end = latLngToTilePoint(nextPoint.lat, nextPoint.lng, zoom);
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
        const point = latLngToTilePoint(marker.lat, marker.lng, zoom);
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
              <span className={`flex items-center justify-center rounded-full bg-white/95 p-1 transition hover:scale-105 ${marker.selected ? 'ring-4 ring-black' : 'ring-1 ring-black/20'}`}>
                <img
                  src={marker.imageSrc}
                  alt={marker.imageAlt || marker.label}
                  className={`${marker.imageSize === 'large' ? 'h-16 w-16' : 'h-12 w-12'} object-contain`}
                  draggable={false}
                />
              </span>
            ) : (
              <span
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition hover:scale-110 ${toneClass(
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
