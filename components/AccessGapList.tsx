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
  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-sm text-[#5e5e5e]">Network watch</p><h3 className="mt-1 text-2xl font-normal">Access gaps</h3></div>
        <span className="rounded-full bg-[#f6f6f6] px-3 py-2 text-xs text-black">
          {gaps.length} active
        </span>
      </div>

      <div className="space-y-3">
        {gaps.map((gap, index) => (
          <div key={`${gap.area}-${index}`} className="rounded-lg bg-[#f6f6f6] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-black">{gap.area}</p>
                <p className="mt-1 text-sm leading-6 text-[#5e5e5e]">{gap.issue}</p>
                {gap.action && <p className="mt-3 text-xs text-black">Action: {gap.action}</p>}
              </div>
              <span className="rounded-full bg-black px-2 py-1 text-xs font-medium capitalize text-white">{gap.severity}</span>
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
