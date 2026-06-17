import { BulkRequest } from '@/lib/types';
import StatusPill from './StatusPill';
import { formatPrice } from '@/lib/pricing';

interface CommunityBulkRequestProps {
  bulkRequests: BulkRequest[];
}

export default function CommunityBulkRequest({ bulkRequests }: CommunityBulkRequestProps) {
  return (
    <div className="card">
      <h3 className="heading-sm mb-4">Community Bulk Requests</h3>

      <div className="space-y-4">
        {bulkRequests.map((request) => {
          const progressPercent = (request.joinedHouseholds / Math.max(request.joinedHouseholds, 10)) * 100;

          return (
            <div key={request.id} className="border-l-4 border-water-500 bg-water-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-water-900">
                    {request.area}
                    {request.street && `  ${request.street}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.joinedHouseholds} households joined
                  </p>
                </div>
                <StatusPill status={request.status} />
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-gray-700">
                    {request.targetLitres.toLocaleString()} L needed
                  </p>
                  <p className="text-xs font-bold text-water-600">
                    {Math.round(progressPercent)}%
                  </p>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-water-600 h-full transition-all"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Cost per household */}
              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-600 mb-1">Estimated cost per household</p>
                <p className="text-xl font-bold text-water-600">
                  {formatPrice(request.estimatedCostPerHousehold)}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-small">Join Request</button>
                <button className="flex-1 btn-ghost text-sm">View Details</button>
              </div>
            </div>
          );
        })}
      </div>

      {bulkRequests.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-3">No bulk requests forming yet.</p>
          <button className="btn-primary">Start a Bulk Request</button>
        </div>
      )}
    </div>
  );
}
