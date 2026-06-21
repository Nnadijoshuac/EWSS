'use client';

import { SourceStatus } from '@/lib/types';

interface SupplierStatusToggleProps {
  status: SourceStatus;
  onStatusChange: (status: SourceStatus) => void;
}

export default function SupplierStatusToggle({
  status,
  onStatusChange,
}: SupplierStatusToggleProps) {
  const statuses: Array<{ status: SourceStatus; label: string }> = [
    { status: 'available', label: 'Available' },
    { status: 'busy', label: 'Busy' },
    { status: 'offline', label: 'Offline' },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-[#f6f6f6] p-1">
        {statuses.map(({ status: s, label }) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`rounded-full px-2 py-3 text-xs font-medium transition sm:px-3 ${
              status === s
                ? 'bg-black text-white'
                : 'text-[#5e5e5e] hover:bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
