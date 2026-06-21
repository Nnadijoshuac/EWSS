import { SupplierVerificationStatus } from '@/lib/types';

interface VerificationBadgeProps {
  verified: boolean;
  verificationStatus: SupplierVerificationStatus;
  showLabel?: boolean;
}

export default function VerificationBadge({
  verified,
  verificationStatus,
  showLabel = true,
}: VerificationBadgeProps) {
  const label =
    verificationStatus === 'suspended'
      ? 'Suspended'
      : verified
        ? 'Verified'
        : verificationStatus === 'pending'
          ? 'Pending'
          : 'Unverified';

  const classes =
    verificationStatus === 'suspended'
      ? 'bg-black text-white'
      : verified
        ? 'bg-black text-white'
        : verificationStatus === 'pending'
          ? 'border border-black bg-white text-black'
          : 'bg-[#f6f6f6] text-[#5e5e5e]';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {showLabel ? label : label.slice(0, 1)}
    </span>
  );
}
