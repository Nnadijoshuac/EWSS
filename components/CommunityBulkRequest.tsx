import { BulkRequest } from '@/lib/types';
import StatusPill from './StatusPill';
import { formatPrice } from '@/lib/pricing';

interface CommunityBulkRequestProps {
  bulkRequests: BulkRequest[];
}

export default function CommunityBulkRequest({ bulkRequests }: CommunityBulkRequestProps) {
  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-normal tracking-[-0.02em]">Bulk requests</h3>
        <span className="rounded-full bg-[#f6f6f6] px-3 py-2 text-xs text-black">
          {bulkRequests.length} live
        </span>
      </div>

      <div className="space-y-3">
        {bulkRequests.map((request) => {
          const progressPercent = (request.joinedHouseholds / Math.max(request.joinedHouseholds, 10)) * 100;

          return (
            <article key={request.id} className="rounded-lg bg-[#f6f6f6] p-4 sm:p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-black">
                    {request.area}
                    {request.street && ` - ${request.street}`}
                  </p>
                  <p className="mt-1 text-sm text-[#5e5e5e]">
                    {request.joinedHouseholds} households joined
                  </p>
                </div>
                <StatusPill status={request.status} />
              </div>

              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-[#5e5e5e]">{request.targetLitres.toLocaleString()} L target</p>
                  <p className="text-xs font-medium text-black">{Math.round(progressPercent)}%</p>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#d8d8d8]">
                  <div className="h-full rounded-full bg-black" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                </div>
              </div>

              <div className="mb-3 rounded-lg bg-white p-3">
                <p className="text-xs text-[#5e5e5e]">Per household</p>
                <p className="mt-1 text-2xl font-normal text-black">
                  {formatPrice(request.estimatedCostPerHousehold)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="btn-small h-11">Join</button>
                <button className="btn-secondary h-11 px-3 text-sm">Details</button>
              </div>
            </article>
          );
        })}
      </div>

      {bulkRequests.length === 0 && (
        <div className="py-6 text-center">
          <p className="mb-3 font-semibold text-[#404751]">No bulk requests forming yet.</p>
          <button className="btn-primary">Start request</button>
        </div>
      )}
    </section>
  );
}
