import { WaterReport } from '@/lib/types';
import StatusPill from './StatusPill';
import { getReportTypeLabel, getTimeAgo } from '@/lib/utils';

interface ComplaintListProps {
  complaints: WaterReport[];
  maxItems?: number;
}

export default function ComplaintList({ complaints, maxItems = 10 }: ComplaintListProps) {
  const displayed = complaints.slice(0, maxItems);

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-black">Recent complaints</h3>
        <span className="rounded-lg bg-red-100 px-3 py-2 text-xs font-black text-red-800">{complaints.length} total</span>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto">
        {displayed.map((complaint) => (
          <div key={complaint.id} className="rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-neutral-950">{getReportTypeLabel(complaint.type)}</p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {complaint.area} - {getTimeAgo(complaint.createdAt)}
                </p>
              </div>
              <StatusPill status={complaint.status} variant="report" />
            </div>

            <p className="text-sm font-semibold text-neutral-700">{complaint.description}</p>

            {complaint.status === 'open' && (
              <button className="mt-3 text-xs font-black text-red-700 hover:text-red-900">Review</button>
            )}
          </div>
        ))}
      </div>

      {complaints.length === 0 && (
        <p className="py-6 text-center font-semibold text-neutral-500">No complaints reported.</p>
      )}
    </section>
  );
}
