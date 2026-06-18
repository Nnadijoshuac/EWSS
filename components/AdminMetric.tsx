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
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  const trendIcons: Record<string, string> = {
    up: '',
    down: '',
    neutral: '',
  };

  return (
    <div className={`card border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[#404751] mb-1 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#001d34] mb-2">{value}</p>
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
