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
  closestSourceId?: string | null;
}

export default function WaterSourceList({
  sources,
  selectedSourceId,
  onSelectSource,
  compact = false,
  closestSourceId,
}: WaterSourceListProps) {
  if (sources.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-black/15 bg-white p-8 text-center">
        <p className="font-semibold text-[#404751]">No water sources found in this area.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${!compact ? 'max-h-[520px] overflow-y-auto pr-1' : ''}`}>
      {sources.map((source) => {
        const isSelected = selectedSourceId === source.id;
        const isClosest = closestSourceId === source.id;

        return (
          <button
            key={source.id}
            type="button"
            onClick={() => onSelectSource?.(source.id)}
            className={`w-full min-w-0 rounded-lg border p-3 text-left transition sm:p-4 ${
              isSelected
                ? 'border-black bg-[#f6f6f6]'
                : 'border-[#d8d8d8] bg-white hover:border-black'
            }`}
          >
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-xs font-medium text-white">
                    {getSourceTypeLabel(source.type).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="truncate font-medium text-black">{source.name}</h3>
                      {isClosest && (
                        <span className="shrink-0 rounded-full border border-black bg-white px-2 py-1 text-[10px] font-medium text-black">
                          Closest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5e5e5e]">
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
                  <span className="rounded-md bg-[#eceef0] px-2 py-1 font-bold text-[#404751]">
                    {source.rating.toFixed(1)} rating
                  </span>
                  <StatusPill status={source.status} variant="source" />
                </div>
              </div>

              <div className="flex shrink-0 items-end justify-between gap-3 border-t border-[#d8d8d8] pt-3 text-left sm:block sm:border-0 sm:pt-0 sm:text-right">
                <div className="text-lg font-medium text-black">
                  {formatPrice(Math.round(source.pricePerLitre))}
                  <span className="text-xs font-bold text-[#404751]">/L</span>
                </div>
                <p className="text-xs font-medium text-[#5e5e5e] sm:mt-1">
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
