'use client';

import Link from 'next/link';
import { WaterSource } from '@/lib/types';
import { getSourceTypeLabel, getEstimatedDeliveryTime } from '@/lib/utils';
import VerificationBadge from './VerificationBadge';
import StatusPill from './StatusPill';
import { formatPrice } from '@/lib/pricing';

interface WaterSourcePanelProps {
  source: WaterSource;
  onClose?: () => void;
  showRequestButton?: boolean;
}

export default function WaterSourcePanel({
  source,
  onClose,
  showRequestButton = true,
}: WaterSourcePanelProps) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-sm font-black text-white">
            {getSourceTypeLabel(source.type).slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black text-neutral-950">{source.name}</h2>
            <p className="text-sm font-semibold text-neutral-500">{getSourceTypeLabel(source.type)}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-black text-neutral-500 hover:bg-black/5">
            Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Location" value={source.area} sub={`${source.distanceKm} km away`} />
        <div className="rounded-lg bg-neutral-50 p-4">
          <p className="text-xs font-bold uppercase text-neutral-500">Status</p>
          <div className="mt-2">
            <StatusPill status={source.status} variant="source" />
          </div>
        </div>
        <Metric label="Price" value={`${formatPrice(Math.round(source.pricePerLitre))}/L`} />
        <Metric label="Available" value={`${(source.availableLitres / 1000).toFixed(1)}K L`} />
      </div>

      <div className="mt-4 rounded-lg bg-neutral-950 p-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-white/45">Estimated arrival</p>
            <p className="mt-1 text-3xl font-black">
              {source.etaMinutes ? getEstimatedDeliveryTime(source.etaMinutes) : 'On request'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-white/45">Rating</p>
            <p className="mt-1 text-xl font-black">{source.rating.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-xs font-bold uppercase text-neutral-500">Operator</p>
          <p className="mt-1 font-black text-neutral-950">{source.operatorName}</p>
          {source.operatorPhone && <p className="mt-1 text-sm font-semibold text-neutral-500">{source.operatorPhone}</p>}
        </div>
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-xs font-bold uppercase text-neutral-500">Trust</p>
          <div className="mt-2">
            <VerificationBadge verified={source.verified} verificationStatus={source.verificationStatus} />
          </div>
          <p className="mt-2 text-xs font-semibold text-neutral-500">{source.reviewCount} reviews</p>
        </div>
      </div>

      {source.complaintCount > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
          {source.complaintCount} complaint{source.complaintCount !== 1 ? 's' : ''} reported
        </div>
      )}

      {showRequestButton && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/request" className="btn-primary text-center">
            Request water
          </Link>
          <Link href={`/verify/${source.id}`} className="btn-secondary text-center">
            Verify source
          </Link>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-4">
      <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 font-black text-neutral-950">{value}</p>
      {sub && <p className="mt-1 text-xs font-semibold text-neutral-500">{sub}</p>}
    </div>
  );
}
