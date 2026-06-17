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
      ? 'bg-red-100 text-red-800'
      : verified
        ? 'bg-emerald-100 text-emerald-800'
        : verificationStatus === 'pending'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-neutral-100 text-neutral-700';

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-black ${classes}`}>
      {showLabel ? label : label.slice(0, 1)}
    </span>
  );
}
