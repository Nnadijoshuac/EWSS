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
        <div><p className="text-sm text-[#5e5e5e]">Resident reports</p><h3 className="mt-1 text-2xl font-normal">Recent complaints</h3></div>
        <span className="rounded-full bg-[#f6f6f6] px-3 py-2 text-xs text-black">{complaints.length} total</span>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto">
        {displayed.map((complaint) => (
          <div key={complaint.id} className="rounded-lg bg-[#f6f6f6] p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-black">{getReportTypeLabel(complaint.type)}</p>
                <p className="mt-1 text-xs text-[#5e5e5e]">
                  {complaint.area} - {getTimeAgo(complaint.createdAt)}
                </p>
              </div>
              <StatusPill status={complaint.status} variant="report" />
            </div>

            <p className="text-sm leading-6 text-[#5e5e5e]">{complaint.description}</p>

            {complaint.status === 'open' && (
              <button className="mt-3 text-xs font-medium text-black underline underline-offset-4">Review</button>
            )}
          </div>
        ))}
      </div>

      {complaints.length === 0 && (
        <p className="py-6 text-center font-semibold text-[#404751]">No complaints reported.</p>
      )}
    </section>
  );
}
