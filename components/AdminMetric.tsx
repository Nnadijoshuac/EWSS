interface AdminMetricProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export default function AdminMetric({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
}: AdminMetricProps) {
  const trendIcons: Record<string, string> = {
    up: '',
    down: '',
    neutral: '',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[#404751] mb-1 uppercase tracking-wide">
            {label}
          </p>
          <p className="mb-2 text-3xl font-normal text-black">{value}</p>
          {trendValue && (
            <div className="flex items-center gap-1 text-xs font-medium">
              <span>{trend && trendIcons[trend]}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
