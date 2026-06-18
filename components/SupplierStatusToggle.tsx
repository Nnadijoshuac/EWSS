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
  const statuses: Array<{ status: SourceStatus; label: string; icon: string; color: string }> = [
    { status: 'available', label: 'Available', icon: '', color: 'bg-green-500' },
    { status: 'busy', label: 'Busy', icon: '', color: 'bg-orange-500' },
    { status: 'offline', label: 'Offline', icon: '', color: 'bg-red-500' },
  ];

  return (
    <div className="card">
      <p className="text-xs font-bold text-[#404751] mb-4 uppercase">Status</p>

      <div className="grid grid-cols-3 gap-3">
        {statuses.map(({ status: s, label, icon, color }) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`py-4 px-3 rounded-lg font-bold transition-all ${
              status === s
                ? `${color} text-white ring-4 ring-opacity-50 scale-105`
                : 'bg-[#eceef0] text-[#404751] hover:bg-[#e0e3e5]'
            }`}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-bold">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
