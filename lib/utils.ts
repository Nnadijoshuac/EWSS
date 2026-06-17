import { WaterSource } from './types';

export interface Coordinates {
  lat: number;
  lng: number;
}

export function getDistanceFromUser(source: WaterSource): number {
  return source.distanceKm;
}

export function getDistanceKm(a: Coordinates, b: Coordinates): number {
  const radiusKm = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return radiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function getSourcesWithLiveDistance(
  sources: WaterSource[],
  userLocation?: Coordinates | null
): WaterSource[] {
  if (!userLocation) return sources;

  return sources.map((source) => ({
    ...source,
    distanceKm: Number(getDistanceKm(userLocation, source.coordinates).toFixed(1)),
  }));
}

export function getSortedSourcesByDistance(sources: WaterSource[]): WaterSource[] {
  return [...sources].sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getClosestSource(
  sources: WaterSource[],
  types?: WaterSource['type'][]
): WaterSource | undefined {
  return getSortedSourcesByDistance(
    types && types.length ? sources.filter((source) => types.includes(source.type)) : sources
  ).find((source) => source.status === 'available');
}

export function getSortedSourcesByRating(sources: WaterSource[]): WaterSource[] {
  return [...sources].sort((a, b) => b.rating - a.rating);
}

export function filterSourcesByType(
  sources: WaterSource[],
  type: string[]
): WaterSource[] {
  if (type.length === 0) return sources;
  return sources.filter((source) => type.includes(source.type));
}

export function filterSourcesByAvailability(
  sources: WaterSource[],
  onlyAvailable: boolean
): WaterSource[] {
  if (!onlyAvailable) return sources;
  return sources.filter((source) => source.status === 'available');
}

export function filterSourcesByVerification(
  sources: WaterSource[],
  verifiedOnly: boolean
): WaterSource[] {
  if (!verifiedOnly) return sources;
  return sources.filter((source) => source.verified);
}

export function filterByArea(sources: WaterSource[], area: string): WaterSource[] {
  if (!area) return sources;
  return sources.filter((source) => source.area === area);
}

export function getEstimatedDeliveryTime(
  etaMinutes?: number,
  distanceKm?: number
): string {
  if (etaMinutes) return `${etaMinutes} mins`;
  if (distanceKm) return `${Math.ceil(distanceKm * 8)} mins`;
  return 'Est. time TBD';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function getSourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    tanker: 'Tanker Delivery',
    borehole: 'Borehole',
    public_point: 'Public Water Point',
    subsidized_truck: 'Gov. Subsidized',
  };
  return labels[type] || type;
}

export function getSourceTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    tanker: '\u{1F69A}',
    borehole: 'BH',
    public_point: 'WP',
    subsidized_truck: '\u{1F69A}',
  };
  return icons[type] || 'WP';
}

export function getReportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    no_access: 'No Water Access',
    dirty_water: 'Dirty Water',
    broken_pipe: 'Broken Pipe',
    dry_tap: 'Dry Tap',
    failed_delivery: 'Failed Delivery',
    overpricing: 'Overpricing',
    fake_tanker: 'Fake Tanker',
    unsafe_borehole: 'Unsafe Borehole',
  };
  return labels[type] || type;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    requested: 'Requested',
    accepted: 'Accepted',
    on_the_way: 'On the Way',
    delivered: 'Delivered',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    requested: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    on_the_way: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getReportSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'bg-yellow-100 text-yellow-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
}
