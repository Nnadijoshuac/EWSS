interface StatusPillProps {
  status: string;
  variant?: 'order' | 'report' | 'source';
}

export default function StatusPill({ status, variant = 'order' }: StatusPillProps) {
  const getOrderStatusClass = () => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'on_the_way':
        return 'bg-cyan-100 text-cyan-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-[#eceef0] text-[#191c1e]';
    }
  };

  const getReportStatusClass = () => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-[#eceef0] text-[#191c1e]';
    }
  };

  const getSourceStatusClass = () => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#eceef0] text-[#191c1e]';
    }
  };

  const getStatusClass = () => {
    if (variant === 'report') return getReportStatusClass();
    if (variant === 'source') return getSourceStatusClass();
    return getOrderStatusClass();
  };

  const formatLabel = (s: string) => {
    return s
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {formatLabel(status)}
    </span>
  );
}
