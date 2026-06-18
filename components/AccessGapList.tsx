interface AccessGap {
  area: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  action?: string;
}

interface AccessGapListProps {
  gaps: AccessGap[];
}

export default function AccessGapList({ gaps }: AccessGapListProps) {
  const severityColors: Record<'high' | 'medium' | 'low', string> = {
    high: 'border-red-200 bg-red-50 text-red-800',
    medium: 'border-amber-200 bg-amber-50 text-amber-800',
    low: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  };

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-black">Access gaps</h3>
        <span className="rounded-lg bg-[#eceef0] px-3 py-2 text-xs font-black text-[#404751]">
          {gaps.length} active
        </span>
      </div>

      <div className="space-y-3">
        {gaps.map((gap, index) => (
          <div key={`${gap.area}-${index}`} className={`rounded-lg border p-4 ${severityColors[gap.severity]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-[#191c1e]">{gap.area}</p>
                <p className="mt-1 text-sm font-semibold">{gap.issue}</p>
                {gap.action && <p className="mt-2 text-xs font-black opacity-75">Action: {gap.action}</p>}
              </div>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-black capitalize">{gap.severity}</span>
            </div>
          </div>
        ))}
      </div>

      {gaps.length === 0 && (
        <p className="py-6 text-center font-semibold text-[#404751]">No access gaps detected.</p>
      )}
    </section>
  );
}
