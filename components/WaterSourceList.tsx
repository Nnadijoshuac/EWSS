'use client';

import { WaterSource } from '@/lib/types';
import { getSourceTypeLabel, getEstimatedDeliveryTime } from '@/lib/utils';
import VerificationBadge from './VerificationBadge';
import StatusPill from './StatusPill';
import { formatPrice } from '@/lib/pricing';

interface WaterSourceListProps {
  sources: WaterSource[];
  selectedSourceId?: string | null;
  onSelectSource?: (id: string) => void;
  compact?: boolean;
}

export default function WaterSourceList({
  sources,
  selectedSourceId,
  onSelectSource,
  compact = false,
}: WaterSourceListProps) {
  if (sources.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-black/15 bg-white p-8 text-center">
        <p className="font-semibold text-neutral-500">No water sources found in this area.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${!compact ? 'max-h-[520px] overflow-y-auto pr-1' : ''}`}>
      {sources.map((source) => {
        const isSelected = selectedSourceId === source.id;

        return (
          <button
            key={source.id}
            type="button"
            onClick={() => onSelectSource?.(source.id)}
            className={`w-full rounded-lg border p-4 text-left transition ${
              isSelected
                ? 'border-neutral-950 bg-neutral-50 shadow-sm'
                : 'border-black/10 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-xs font-black text-white">
                    {getSourceTypeLabel(source.type).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-black text-neutral-950">{source.name}</h3>
                    <p className="text-xs font-semibold text-neutral-500">
                      {source.area} - {source.distanceKm} km away
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <VerificationBadge
                    verified={source.verified}
                    verificationStatus={source.verificationStatus}
                    showLabel={false}
                  />
                  <span className="rounded-md bg-neutral-100 px-2 py-1 font-bold text-neutral-700">
                    {source.rating.toFixed(1)} rating
                  </span>
                  <StatusPill status={source.status} variant="source" />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-lg font-black text-neutral-950">
                  {formatPrice(Math.round(source.pricePerLitre))}
                  <span className="text-xs font-bold text-neutral-500">/L</span>
                </div>
                <p className="mt-1 text-xs font-bold text-neutral-500">
                  {source.etaMinutes
                    ? getEstimatedDeliveryTime(source.etaMinutes)
                    : `${(source.availableLitres / 1000).toFixed(1)}K L`}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
