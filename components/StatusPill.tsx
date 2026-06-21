interface StatusPillProps {
  status: string;
  variant?: 'order' | 'report' | 'source';
}

export default function StatusPill({ status, variant = 'order' }: StatusPillProps) {
  const getOrderStatusClass = () => {
    switch (status) {
      case 'requested':
        return 'bg-[#FF7B68] text-white';
      case 'accepted':
        return 'bg-[#FF9B8E] text-white';
      case 'on_the_way':
        return 'border border-[#FF7B68] bg-white text-[#FF7B68]';
      case 'delivered':
        return 'bg-[#f6f6f6] text-black';
      default:
        return 'bg-[#eceef0] text-[#191c1e]';
    }
  };

  const getReportStatusClass = () => {
    switch (status) {
      case 'open':
        return 'bg-black text-white';
      case 'reviewing':
        return 'border border-black bg-white text-black';
      case 'resolved':
        return 'bg-[#f6f6f6] text-black';
      default:
        return 'bg-[#eceef0] text-[#191c1e]';
    }
  };

  const getSourceStatusClass = () => {
    switch (status) {
      case 'available':
        return 'bg-black text-white';
      case 'busy':
        return 'border border-black bg-white text-black';
      case 'offline':
        return 'bg-[#f6f6f6] text-black';
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
