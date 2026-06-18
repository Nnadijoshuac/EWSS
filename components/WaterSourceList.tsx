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
            className={`w-full rounded-lg border p-4 text-left transition ${
              isSelected
                ? 'border-[#005e97] bg-[#f2f4f6] shadow-sm'
                : 'border-[#c0c7d2]/30 bg-white hover:border-[#0077be]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#005e97] text-xs font-black text-white">
                    {getSourceTypeLabel(source.type).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-black text-[#191c1e]">{source.name}</h3>
                      {isClosest && (
                        <span className="shrink-0 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-800">
                          Closest
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#404751]">
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

              <div className="shrink-0 text-right">
                <div className="text-lg font-black text-[#191c1e]">
                  {formatPrice(Math.round(source.pricePerLitre))}
                  <span className="text-xs font-bold text-[#404751]">/L</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#404751]">
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
